import path from 'path';
import { config } from 'dotenv';
import { isoToDdmmyyyy } from './dates.js';

config();

export function resolveEvangelioProjectPath(args = {}, env = process.env) {
  return path.resolve(
    args.source ||
      env.EVANGELIO_PROJECT_PATH ||
      path.join(process.cwd(), '..', 'Evangelio'),
  );
}

export function resolvePipelinePaths(date, args = {}, env = process.env) {
  const fileDate = isoToDdmmyyyy(date);
  const sourceRoot = resolveEvangelioProjectPath(args, env);
  const outputRoot = path.join(sourceRoot, 'output');
  const root = process.cwd();

  return {
    date,
    fileDate,
    sourceRoot,
    source: {
      gospelJson: path.join(outputRoot, `${fileDate}.json`),
      gospelXlsx: path.join(outputRoot, `${fileDate}.xlsx`),
      gospelPng: path.join(outputRoot, `${fileDate}.png`),
      gospelJpg: path.join(outputRoot, `${fileDate}.jpg`),
      gospelJpeg: path.join(outputRoot, `${fileDate}.jpeg`),
      saintJson: path.join(outputRoot, 'santo del dia', `${fileDate}.json`),
      saintPng: path.join(outputRoot, 'santo del dia', `${fileDate}.png`),
      saintJpg: path.join(outputRoot, 'santo del dia', `${fileDate}.jpg`),
      saintJpeg: path.join(outputRoot, 'santo del dia', `${fileDate}.jpeg`),
    },
    dest: {
      gospelJson: path.join(root, 'public', 'images', 'gospels', `${fileDate}.json`),
      gospelXlsx: path.join(root, 'WhatsAppExcelMonitorElevenLabsV2', 'scripts', 'excel', `${fileDate}.xlsx`),
      gospelPng: path.join(root, 'public', 'images', 'gospels', `${fileDate}.png`),
      gospelJpg: path.join(root, 'public', 'images', 'gospels', `${fileDate}.jpg`),
      gospelJpeg: path.join(root, 'public', 'images', 'gospels', `${fileDate}.jpeg`),
      whatsappPng: path.join(root, 'WhatsAppExcelMonitorElevenLabsV2', 'scripts', 'excel', `${fileDate}.png`),
      whatsappJpg: path.join(root, 'WhatsAppExcelMonitorElevenLabsV2', 'scripts', 'excel', `${fileDate}.jpg`),
      whatsappJpeg: path.join(root, 'WhatsAppExcelMonitorElevenLabsV2', 'scripts', 'excel', `${fileDate}.jpeg`),
      saintJson: path.join(root, 'public', 'images', 'santo-del-dia', `${fileDate}.json`),
      saintPng: path.join(root, 'public', 'images', 'santo-del-dia', `${fileDate}.png`),
      saintJpg: path.join(root, 'public', 'images', 'santo-del-dia', `${fileDate}.jpg`),
      saintJpeg: path.join(root, 'public', 'images', 'santo-del-dia', `${fileDate}.jpeg`),
    },
  };
}
