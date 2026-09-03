#!/usr/bin/env node

import { parseArgs, getBooleanArg, requireExecuteOrDryRun } from './lib/contentPipeline/args.js';
import { resolveDateRange } from './lib/contentPipeline/dates.js';
import { resolvePipelinePaths } from './lib/contentPipeline/paths.js';
import { importEvangelioOutputForDate } from './lib/contentPipeline/copyAssets.js';

async function main() {
  const args = parseArgs();
  const { dryRun } = requireExecuteOrDryRun(args);
  const dates = resolveDateRange(args);
  const force = getBooleanArg(args, 'force');
  const copyExcel = getBooleanArg(args, 'copy-excel', true);
  const copyImages = getBooleanArg(args, 'copy-images', true);

  const results = [];
  for (const date of dates) {
    const paths = resolvePipelinePaths(date, args);
    results.push(await importEvangelioOutputForDate(paths, {
      dryRun,
      force,
      copyExcel,
      copyImages,
    }));
  }

  const output = {
    dryRun,
    source: args.source || process.env.EVANGELIO_PROJECT_PATH || '../Evangelio',
    dates,
    results,
    hasErrors: results.some((item) => item.hasErrors),
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
