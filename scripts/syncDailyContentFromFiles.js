#!/usr/bin/env node

import { parseArgs, requireExecuteOrDryRun } from './lib/contentPipeline/args.js';
import { resolveDateRange } from './lib/contentPipeline/dates.js';
import { resolvePipelinePaths } from './lib/contentPipeline/paths.js';
import { validateDateFiles } from './lib/contentPipeline/validators.js';
import { createSupabaseAdmin, syncDailyContentForDate } from './lib/contentPipeline/supabaseSync.js';

async function main() {
  const args = parseArgs();
  const { dryRun, execute } = requireExecuteOrDryRun(args);
  const dates = resolveDateRange(args);
  const results = [];
  const supabase = execute ? createSupabaseAdmin() : null;

  for (const date of dates) {
    const paths = resolvePipelinePaths(date, args);
    const validation = await validateDateFiles(paths, {
      requireSaint: Boolean(args['require-saint']),
    });

    if (!validation.valid) {
      results.push({
        date,
        status: 'validation_failed',
        validation,
      });
      continue;
    }

    try {
      const sync = await syncDailyContentForDate(paths, { dryRun, supabase });
      results.push({
        date,
        status: sync.status,
        validation,
        sync,
      });
    } catch (error) {
      results.push({
        date,
        status: 'sync_failed',
        validation,
        error: error.message,
      });
    }
  }

  const output = {
    dryRun,
    dates,
    results,
    hasErrors: results.some((item) => item.status === 'validation_failed' || item.status === 'sync_failed'),
  };

  console.log(JSON.stringify(output, null, 2));
  if (output.hasErrors) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
