import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function sha1(filePath) {
  const buffer = await fs.readFile(filePath);
  return crypto.createHash('sha1').update(buffer).digest('hex');
}

export async function copyFileSafely({ from, to, dryRun, force = false, required = false, label }) {
  const sourceExists = await fileExists(from);
  if (!sourceExists) {
    return {
      label,
      from,
      to,
      status: required ? 'missing_required' : 'missing_optional',
    };
  }

  const destExists = await fileExists(to);
  if (destExists) {
    const [sourceHash, destHash] = await Promise.all([sha1(from), sha1(to)]);
    if (sourceHash === destHash) {
      return { label, from, to, status: 'unchanged' };
    }

    if (!force) {
      return { label, from, to, status: 'conflict' };
    }
  }

  if (!dryRun) {
    await fs.mkdir(path.dirname(to), { recursive: true });
    await fs.copyFile(from, to);
  }

  return {
    label,
    from,
    to,
    status: dryRun ? (destExists ? 'would_overwrite' : 'would_copy') : (destExists ? 'overwritten' : 'copied'),
  };
}

export async function importEvangelioOutputForDate(paths, options = {}) {
  const dryRun = Boolean(options.dryRun);
  const force = Boolean(options.force);
  const copyExcel = options.copyExcel !== false;
  const copyImages = options.copyImages !== false;

  const tasks = [
    { label: 'gospel-json', from: paths.source.gospelJson, to: paths.dest.gospelJson, required: true },
    { label: 'saint-json', from: paths.source.saintJson, to: paths.dest.saintJson, required: false },
  ];

  if (copyExcel) {
    tasks.push({ label: 'whatsapp-excel', from: paths.source.gospelXlsx, to: paths.dest.gospelXlsx, required: false });
  }

  if (copyImages) {
    tasks.push(
      { label: 'gospel-png', from: paths.source.gospelPng, to: paths.dest.gospelPng, required: false },
      { label: 'gospel-jpg', from: paths.source.gospelJpg, to: paths.dest.gospelJpg, required: false },
      { label: 'gospel-jpeg', from: paths.source.gospelJpeg, to: paths.dest.gospelJpeg, required: false },
      { label: 'whatsapp-png', from: paths.source.gospelPng, to: paths.dest.whatsappPng, required: false },
      { label: 'whatsapp-jpg', from: paths.source.gospelJpg, to: paths.dest.whatsappJpg, required: false },
      { label: 'whatsapp-jpeg', from: paths.source.gospelJpeg, to: paths.dest.whatsappJpeg, required: false },
      { label: 'saint-png', from: paths.source.saintPng, to: paths.dest.saintPng, required: false },
      { label: 'saint-jpg', from: paths.source.saintJpg, to: paths.dest.saintJpg, required: false },
      { label: 'saint-jpeg', from: paths.source.saintJpeg, to: paths.dest.saintJpeg, required: false },
    );
  }

  const results = [];
  for (const task of tasks) {
    results.push(await copyFileSafely({ ...task, dryRun, force }));
  }

  return {
    date: paths.date,
    fileDate: paths.fileDate,
    sourceRoot: paths.sourceRoot,
    results,
    hasErrors: results.some((r) => r.status === 'missing_required'),
    hasConflicts: results.some((r) => r.status === 'conflict'),
  };
}
