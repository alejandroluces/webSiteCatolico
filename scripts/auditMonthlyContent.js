#!/usr/bin/env node
// Read-only verification of daily content, public audio and Telegram PDF preparation.
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { createSupabaseAdmin } from './lib/contentPipeline/supabaseSync.js';
import { parseArgs } from './lib/contentPipeline/args.js';
import { resolveDateRange } from './lib/contentPipeline/dates.js';

const require = createRequire(import.meta.url);
const { buildMessages } = require('../telegram/scripts/telegramSender.js');
const { preparePdfMessage } = require('../telegram/scripts/dominicosPdf.js');
const args = parseArgs();
const dates = resolveDateRange(args);
const supabase = createSupabaseAdmin();
const { data, error } = await supabase.from('daily_content').select('*')
  .gte('date', dates[0]).lte('date', dates.at(-1));
if (error) throw new Error(error.message);
const report = { checkedAt: new Date().toISOString(), from: dates[0], to: dates.at(-1), days: [] };
for (const date of dates) {
  const day = { date, errors: [], audio: [], telegramMessages: 0, pdf: false };
  for (const type of ['gospel', 'reading', 'saint']) {
    const rows = data.filter(row => row.date === date && row.type === type);
    if (rows.length !== 1 || !rows[0]?.content?.trim() || rows[0]?.status !== 'published' || !rows[0]?.is_active) {
      day.errors.push(`Missing, duplicate or unpublished ${type}`);
    }
  }
  const gospel = data.find(row => row.date === date && row.type === 'gospel');
  if (gospel) {
    for (const field of ['prayer', 'reflection']) {
      if (!gospel[field]?.trim()) day.errors.push(`Missing ${field}`);
    }
    for (const field of ['gospel_audio_url', 'reflection_audio_url', 'prayer_audio_url']) {
      try {
        if (!gospel[field]?.startsWith('https://')) throw new Error('Missing public HTTPS audio');
        const response = await fetch(gospel[field], { method: 'HEAD', signal: AbortSignal.timeout(30000) });
        if (!response.ok || !response.headers.get('content-type')?.startsWith('audio/') || Number(response.headers.get('content-length')) <= 0) {
          throw new Error(`Invalid audio response: ${response.status}`);
        }
        day.audio.push(field);
      } catch (error) { day.errors.push(`${field}: ${error.message}`); }
    }
    try {
      day.telegramMessages = buildMessages(gospel, date, { siteUrl: 'https://caminodefe.cl' }).length;
      const pdf = await preparePdfMessage(date);
      day.pdf = true;
      day.readings = pdf.payload.readings.sections.map(section => ({ kind: section.kind, reference: section.reference }));
      day.telegramMessages++;
    } catch (error) { day.errors.push(`Telegram: ${error.message}`); }
  }
  report.days.push(day);
  console.log(`${date}: ${day.errors.length ? day.errors.join('; ') : 'ready'} (${day.audio.length} audios, ${day.telegramMessages} Telegram parts)`);
}
report.ready = report.days.filter(day => day.errors.length === 0).length;
report.total = dates.length;
await fs.mkdir('data', { recursive: true });
const output = `data/content-audit-${dates[0]}-${dates.at(-1)}.json`;
await fs.writeFile(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ ready: report.ready, total: report.total, output }));
if (report.ready !== report.total) process.exitCode = 1;
