#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { parseArgs, getBooleanArg, requireExecuteOrDryRun } from './lib/contentPipeline/args.js';
import { isoToDdmmyyyy, resolveDateRange } from './lib/contentPipeline/dates.js';
import { resolveEvangelioProjectPath, resolvePipelinePaths } from './lib/contentPipeline/paths.js';
import { importEvangelioOutputForDate } from './lib/contentPipeline/copyAssets.js';
import { validateDateFiles } from './lib/contentPipeline/validators.js';
import { createSupabaseAdmin, syncDailyContentForDate } from './lib/contentPipeline/supabaseSync.js';

const VALID_WHATSAPP_MODES = new Set(['none', 'prepare-excel', 'send-excel', 'send-netlify']);
const VALID_GOSPEL_SYNC_MODES = new Set(['full', 'basic']);

function runCommand(command, commandArgs, options = {}) {
  return new Promise((resolve) => {
    const usePipes = options.silent || options.input;
    const child = spawn(command, commandArgs, {
      cwd: options.cwd || process.cwd(),
      env: { ...process.env, ...(options.env || {}) },
      stdio: usePipes ? ['pipe', 'pipe', 'pipe'] : 'inherit',
      shell: process.platform === 'win32',
    });

    let stdout = '';
    let stderr = '';
    if (usePipes) {
      child.stdout?.on('data', (chunk) => {
        const text = chunk.toString();
        stdout += text;
        if (!options.silent) {
          process.stdout.write(text);
        }
      });
      child.stderr?.on('data', (chunk) => {
        const text = chunk.toString();
        stderr += text;
        if (!options.silent) {
          process.stderr.write(text);
        }
      });
    }

    if (options.input) {
      child.stdin?.write(options.input);
      child.stdin?.end();
    }

    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

async function runScraperForDates(dates, args, dryRun) {
  if (!getBooleanArg(args, 'scrape')) {
    return { status: 'skipped' };
  }

  const sourceRoot = resolveEvangelioProjectPath(args);
  const from = dates[0];
  const to = dates[dates.length - 1];
  const imageArg = getBooleanArg(args, 'images') ? '--images' : '--no-images';

  const commands = [
    { type: 'gospel', args: ['index.js', '--start', from, '--end', to, imageArg], input: 'n\n' },
    { type: 'saint', args: ['index.js', '--saint', '--start', from, '--end', to, '--verbose'] },
  ];

  if (dryRun) {
    return {
      status: 'dry_run',
      sourceRoot,
      commands: commands.map((item) => `node ${item.args.join(' ')}`),
    };
  }

  const results = [];
  for (const item of commands) {
    const result = await runCommand('node', item.args, { cwd: sourceRoot, input: item.input });
    results.push({ type: item.type, code: result.code });
    if (result.code !== 0) {
      return { status: 'failed', sourceRoot, results };
    }
  }

  return { status: 'completed', sourceRoot, results };
}

async function prepareExcelForDate(date, dryRun) {
  const fileDate = isoToDdmmyyyy(date);
  const script = path.join('scripts', 'syncWhatsappSubscribersToExcel.py');
  const args = [script, '--date', fileDate];
  if (dryRun) {
    return {
      date,
      mode: 'prepare-excel',
      status: 'dry_run',
      command: `${process.env.PYTHON || 'python'} ${[...args, '--dry-run'].join(' ')}`,
    };
  }

  const python = process.env.PYTHON || 'python';
  const result = await runCommand(python, args, { silent: true });
  return {
    date,
    mode: 'prepare-excel',
    code: result.code,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  };
}

async function sendExcel(dryRun) {
  if (dryRun) {
    return { mode: 'send-excel', status: 'dry_run' };
  }

  const result = await runCommand('node', ['autoSender.js'], {
    cwd: path.join(process.cwd(), 'WhatsAppExcelMonitorElevenLabsV2', 'scripts'),
  });
  return { mode: 'send-excel', code: result.code };
}

async function sendNetlifyForDate(date, args, dryRun) {
  if (dryRun) {
    return { date, mode: 'send-netlify', status: 'dry_run' };
  }

  const baseUrl = args.baseUrl || args['base-url'] || process.env.CONTENT_PIPELINE_NETLIFY_BASE_URL || 'http://localhost:8888';
  const url = new URL('/.netlify/functions/whatsapp-send-daily-gospel', baseUrl);
  url.searchParams.set('force', '1');
  url.searchParams.set('date', date);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const body = await response.text();

  return {
    date,
    mode: 'send-netlify',
    status: response.ok ? 'sent' : 'failed',
    httpStatus: response.status,
    body,
  };
}

async function runWhatsappMode(mode, dates, args, dryRun) {
  if (mode === 'none') {
    return { mode, status: 'skipped' };
  }

  if (mode === 'prepare-excel') {
    const results = [];
    for (const date of dates) {
      results.push(await prepareExcelForDate(date, dryRun));
    }
    return {
      mode,
      status: results.every((item) => item.status === 'dry_run' || item.code === 0) ? 'completed' : 'failed',
      results,
    };
  }

  if (mode === 'send-excel') {
    if (dates.length !== 1) {
      return {
        mode,
        status: 'failed',
        error: 'send-excel usa la fecha actual del sistema; ejecutalo con --date para evitar ambiguedad.',
      };
    }
    return sendExcel(dryRun);
  }

  if (mode === 'send-netlify') {
    const results = [];
    for (const date of dates) {
      results.push(await sendNetlifyForDate(date, args, dryRun));
    }
    return {
      mode,
      status: results.every((item) => item.status === 'sent' || item.status === 'dry_run') ? 'completed' : 'failed',
      results,
    };
  }

  return { mode, status: 'failed', error: `Modo WhatsApp no soportado: ${mode}` };
}

async function writeReport(report, dryRun) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+$/, '').replace('T', '-');
  const reportPath = path.join(process.cwd(), 'data', `content-pipeline-report-${stamp}.json`);

  if (!dryRun) {
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  }

  return reportPath;
}

async function main() {
  const args = parseArgs();
  const { dryRun, execute } = requireExecuteOrDryRun(args);
  const dates = resolveDateRange(args);
  const force = getBooleanArg(args, 'force');
  const copyExcel = getBooleanArg(args, 'copy-excel', process.env.CONTENT_PIPELINE_COPY_EXCEL !== 'false');
  const copyImages = getBooleanArg(args, 'copy-images', process.env.CONTENT_PIPELINE_COPY_IMAGES !== 'false');
  const requireSaint = getBooleanArg(args, 'require-saint');
  const whatsappMode = String(args.whatsapp || process.env.CONTENT_PIPELINE_DEFAULT_WHATSAPP_MODE || 'none');
  const gospelSyncMode = String(args['gospel-sync'] || process.env.CONTENT_PIPELINE_GOSPEL_SYNC_MODE || 'full');

  if (!VALID_WHATSAPP_MODES.has(whatsappMode)) {
    throw new Error(`--whatsapp debe ser uno de: ${Array.from(VALID_WHATSAPP_MODES).join(', ')}`);
  }
  if (!VALID_GOSPEL_SYNC_MODES.has(gospelSyncMode)) {
    throw new Error(`--gospel-sync debe ser uno de: ${Array.from(VALID_GOSPEL_SYNC_MODES).join(', ')}`);
  }

  const report = {
    dryRun,
    execute,
    dates,
    startedAt: new Date().toISOString(),
    gospelSyncMode,
    scraper: await runScraperForDates(dates, args, dryRun),
    datesResult: [],
    whatsapp: null,
    reportPath: null,
  };

  const supabase = execute ? createSupabaseAdmin() : null;

  for (const date of dates) {
    const paths = resolvePipelinePaths(date, args);
    const imported = await importEvangelioOutputForDate(paths, {
      dryRun,
      force,
      copyExcel,
      copyImages,
    });
    const validation = await validateDateFiles(paths, { requireSaint });

    let sync = { status: 'skipped' };
    if (validation.valid) {
      try {
        if (gospelSyncMode === 'full') {
          let gospelSync = { status: 'dry_run' };
          if (!dryRun) {
            const { updateDailyGospel } = await import('./updateDailyGospel.js');
            gospelSync = { status: await updateDailyGospel(date) ? 'synced' : 'failed' };
          }
          const saintSync = await syncDailyContentForDate(paths, {
            dryRun,
            supabase,
            includeGospel: false,
            includeReading: false,
            includeSaint: true,
          });

          sync = {
            status: gospelSync.status === 'failed' || saintSync.status === 'sync_failed' ? 'sync_failed' : 'synced',
            gospel: gospelSync,
            saint: saintSync,
          };
        } else {
          sync = await syncDailyContentForDate(paths, { dryRun, supabase });
        }
      } catch (error) {
        sync = { status: 'sync_failed', error: error.message };
      }
    }

    const hasErrors =
      imported.hasErrors ||
      !validation.valid ||
      sync.status === 'sync_failed';

    report.datesResult.push({
      date,
      fileDate: paths.fileDate,
      status: hasErrors ? 'failed' : dryRun ? 'dry_run' : 'ready',
      imported,
      validation,
      sync,
    });
  }

  report.whatsapp = await runWhatsappMode(whatsappMode, dates, args, dryRun);
  report.finishedAt = new Date().toISOString();
  report.hasErrors =
    report.scraper.status === 'failed' ||
    report.datesResult.some((item) => item.status === 'failed') ||
    report.whatsapp.status === 'failed';
  report.reportPath = await writeReport(report, dryRun);

  console.log(JSON.stringify(report, null, 2));
  if (report.hasErrors) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
