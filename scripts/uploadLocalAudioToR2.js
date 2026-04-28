#!/usr/bin/env node

import { config } from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import {
  assertR2Configured,
  buildR2ObjectKey,
  buildR2PublicUrl,
  uploadAudioBuffer,
} from './lib/audioStorage.js';

config();

const args = process.argv.slice(2);
const hasFlag = (flag) => args.includes(flag);
const getArgValue = (name) => {
  const arg = args.find((value) => value.startsWith(`${name}=`));
  return arg ? arg.slice(name.length + 1) : undefined;
};

function printHelp() {
  console.log(`
Uso: node scripts/uploadLocalAudioToR2.js [opciones]

Opciones:
  --dry-run                   Simula la subida sin enviar archivos a R2
  --limit=25                  Limita la cantidad de mp3 procesados
  --sql-file=data/r2_audio_updates.sql  Ruta del archivo SQL de salida
  --help                      Muestra esta ayuda

Este script NO consulta Supabase.
Sirve para subir los mp3 locales de public/audio a R2 y generar un SQL
con los UPDATE necesarios para daily_content.
`);
}

if (hasFlag('--help')) {
  printHelp();
  process.exit(0);
}

const dryRun = hasFlag('--dry-run');
const limitArg = getArgValue('--limit');
const sqlFile = getArgValue('--sql-file') || path.join('data', 'r2_audio_updates.sql');
const limit = limitArg ? Number.parseInt(limitArg, 10) : undefined;

if (limitArg && (!Number.isInteger(limit) || limit <= 0)) {
  console.error('❌ --limit debe ser un entero positivo.');
  process.exit(1);
}

try {
  assertR2Configured(process.env);
} catch (error) {
  console.error(`❌ ${error.message}`);
  process.exit(1);
}

const AUDIO_DIR = path.join(process.cwd(), 'public', 'audio');
const AUDIO_REGEX = /^(\d{4}-\d{2}-\d{2})_(gospel|reflection|prayer)\.mp3$/i;
const FIELD_BY_SUFFIX = {
  gospel: 'gospel_audio_url',
  reflection: 'reflection_audio_url',
  prayer: 'prayer_audio_url',
};

function escapeSqlString(value) {
  return String(value).replace(/'/g, "''");
}

async function getAudioFiles() {
  const entries = await fs.readdir(AUDIO_DIR, { withFileTypes: true });
  const matched = [];
  let ignored = 0;

  for (const entry of entries) {
    if (!entry.isFile()) {
      ignored += 1;
      continue;
    }

    const match = entry.name.match(AUDIO_REGEX);
    if (!match) {
      ignored += 1;
      continue;
    }

    matched.push({
      fileName: entry.name,
      date: match[1],
      suffix: match[2].toLowerCase(),
      filePath: path.join(AUDIO_DIR, entry.name),
    });
  }

  matched.sort((a, b) => a.fileName.localeCompare(b.fileName));

  return {
    files: typeof limit === 'number' ? matched.slice(0, limit) : matched,
    totalMatched: matched.length,
    ignored,
  };
}

function buildSql(recordsByDate) {
  const lines = [
    '-- Archivo generado automáticamente por scripts/uploadLocalAudioToR2.js',
    '-- Ejecuta este SQL en Supabase SQL Editor cuando el proyecto vuelva a estar activo.',
    '',
  ];

  for (const [date, fields] of recordsByDate.entries()) {
    const assignments = Object.entries(fields)
      .map(([field, url]) => `  ${field} = '${escapeSqlString(url)}'`)
      .join(',\n');

    lines.push('UPDATE daily_content');
    lines.push('SET');
    lines.push(assignments);
    lines.push(`WHERE date = '${date}' AND type = 'gospel';`);
    lines.push('');
  }

  return lines.join('\n');
}

async function ensureSqlDirExists(sqlPath) {
  const dir = path.dirname(sqlPath);
  await fs.mkdir(dir, { recursive: true });
}

async function main() {
  console.log('☁️ Subida local de audios a Cloudflare R2');
  console.log('==================================================');
  console.log(`Modo: ${dryRun ? 'dry-run' : 'ejecución real'}`);
  console.log(`Directorio origen: ${AUDIO_DIR}`);
  console.log(`Archivo SQL: ${sqlFile}`);

  const { files, totalMatched, ignored } = await getAudioFiles();

  console.log(`MP3 detectados con patrón válido: ${totalMatched}`);
  console.log(`Archivos ignorados: ${ignored}`);
  console.log(`MP3 a procesar: ${files.length}`);

  if (files.length === 0) {
    console.log('ℹ️ No hay archivos MP3 válidos para subir.');
    return;
  }

  const recordsByDate = new Map();
  let uploaded = 0;

  for (const file of files) {
    const objectKey = buildR2ObjectKey(file.fileName, process.env);
    const publicUrl = buildR2PublicUrl(objectKey, process.env);
    console.log(`${dryRun ? '🧪 [dry-run]' : '⬆️'} ${file.fileName} -> ${publicUrl}`);

    if (!dryRun) {
      const buffer = await fs.readFile(file.filePath);
      await uploadAudioBuffer({
        buffer,
        fileName: file.fileName,
        contentType: 'audio/mpeg',
      });
    }

    const field = FIELD_BY_SUFFIX[file.suffix];
    const current = recordsByDate.get(file.date) || {};
    current[field] = publicUrl;
    recordsByDate.set(file.date, current);
    uploaded += 1;
  }

  const sql = buildSql(recordsByDate);
  await ensureSqlDirExists(sqlFile);
  await fs.writeFile(sqlFile, sql, 'utf8');

  console.log('');
  console.log(`✅ ${dryRun ? 'Simulación completada' : 'Subida completada'}`);
  console.log(`- MP3 procesados: ${uploaded}`);
  console.log(`- Fechas con UPDATE generado: ${recordsByDate.size}`);
  console.log(`- SQL guardado en: ${sqlFile}`);
}

main().catch((error) => {
  console.error('💥 Error fatal durante la subida local a R2:', error);
  process.exit(1);
});
