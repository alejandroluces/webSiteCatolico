#!/usr/bin/env node

import { parseArgs } from './lib/contentPipeline/args.js';
import { resolveDateRange } from './lib/contentPipeline/dates.js';
import { resolvePipelinePaths } from './lib/contentPipeline/paths.js';
import { validateDateFiles } from './lib/contentPipeline/validators.js';

async function main() {
  const args = parseArgs();
  const dates = resolveDateRange(args);
  const requireSaint = Boolean(args['require-saint']);
  const results = [];

  for (const date of dates) {
    results.push(await validateDateFiles(resolvePipelinePaths(date, args), { requireSaint }));
  }

  const output = {
    dates,
    valid: results.every((item) => item.valid),
    results,
  };

  console.log(JSON.stringify(output, null, 2));
  if (!output.valid) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
