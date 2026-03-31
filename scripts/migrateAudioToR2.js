#!/usr/bin/env node

import { config } from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
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
Uso: node scripts/migrateAudioToR2.js [opciones]

Opciones:
  --dry-run                 Simula la migración sin subir archivos ni actualizar Supabase
  --limit=25                Limita la cantidad de registros procesados
  --from-date=YYYY-MM-DD    Filtra desde una fecha inclusive
  --to-date=YYYY-MM-DD      Filtra hasta una fecha inclusive
  --help                    Muestra esta ayuda

Requisitos de entorno:
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
  R2_ACCOUNT_ID
  R2_ACCESS_KEY_ID
  R2_SECRET_ACCESS_KEY
  R2_BUCKET_NAME
  R2_PUBLIC_BASE_URL
  R2_AUDIO_PREFIX (opcional)
`);
}

if (hasFlag('--help')) {
  printHelp();
  process.exit(0);
}

const dryRun = hasFlag('--dry-run');
const fromDate = getArgValue('--from-date');
const toDate = getArgValue('--to-date');
const limitArg = getArgValue('--limit');
const limit = limitArg ? Number.parseInt(limitArg, 10) : undefined;

if (limitArg && (!Number.isInteger(limit) || limit <= 0)) {
  console.error('❌ --limit debe ser un entero positivo.');
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno de Supabase para la migración.');
  process.exit(1);
}

try {
  assertR2Configured(process.env);
} catch (error) {
  console.error(`❌ ${error.message}`);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const AUDIO_FIELDS = [
  { field: 'gospel_audio_url', suffix: 'gospel' },
  { field: 'reflection_audio_url', suffix: 'reflection' },
  { field: 'prayer_audio_url', suffix: 'prayer' },
];
const r2PublicBaseUrl = String(process.env.R2_PUBLIC_BASE_URL || '').replace(/\/+$/g, '');

function isAlreadyInR2(url) {
  return Boolean(url && r2PublicBaseUrl && String(url).startsWith(`${r2PublicBaseUrl}/`));
}

async function readFirstExistingFile(filePaths) {
  for (const filePath of filePaths) {
    try {
      const buffer = await fs.readFile(filePath);
      return { buffer, source: filePath };
    } catch {
      // seguimos probando otras rutas
    }
  }

  return null;
}

async function resolveAudioBuffer(currentUrl, fileName) {
  const localCandidates = [
    path.join(process.cwd(), 'public', 'audio', fileName),
  ];

  if (currentUrl && currentUrl.startsWith('/')) {
    localCandidates.push(path.join(process.cwd(), 'public', currentUrl.replace(/^\/+/, '')));
  }

  const localFile = await readFirstExistingFile(localCandidates);
  if (localFile) {
    return localFile;
  }

  if (currentUrl && /^https?:\/\//i.test(currentUrl)) {
    const response = await fetch(currentUrl);
    if (!response.ok) {
      throw new Error(`No se pudo descargar el audio remoto (${response.status}) ${currentUrl}`);
    }

    return {
      buffer: Buffer.from(await response.arrayBuffer()),
      source: currentUrl,
    };
  }

  return null;
}

async function fetchDailyContentRows() {
  let query = supabase
    .from('daily_content')
    .select('id, date, type, gospel_audio_url, reflection_audio_url, prayer_audio_url')
    .eq('type', 'gospel')
    .order('date', { ascending: true });

  if (fromDate) {
    query = query.gte('date', fromDate);
  }

  if (toDate) {
    query = query.lte('date', toDate);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error consultando daily_content: ${error.message}`);
  }

  const rowsWithAudio = (data || []).filter((row) => AUDIO_FIELDS.some(({ field }) => Boolean(row[field])));

  return typeof limit === 'number'
    ? rowsWithAudio.slice(0, limit)
    : rowsWithAudio;
}

async function updateRowAudioUrls(rowId, payload) {
  const { error } = await supabase
    .from('daily_content')
    .update(payload)
    .eq('id', rowId);

  if (error) {
    throw new Error(`Error actualizando daily_content (${rowId}): ${error.message}`);
  }
}

async function migrateRecord(record) {
  const updatePayload = {};
  let uploadedFiles = 0;
  let skippedFiles = 0;
  let missingFiles = 0;

  for (const { field, suffix } of AUDIO_FIELDS) {
    const currentUrl = record[field];
    if (!currentUrl) {
      continue;
    }

    const fileName = `${record.date}_${suffix}.mp3`;
    const objectKey = buildR2ObjectKey(fileName, process.env);
    const targetUrl = buildR2PublicUrl(objectKey, process.env);

    if (currentUrl === targetUrl || isAlreadyInR2(currentUrl)) {
      skippedFiles += 1;
      continue;
    }

    const audioSource = await resolveAudioBuffer(currentUrl, fileName);
    if (!audioSource) {
      console.warn(`⚠️ No encontré fuente para ${field} (${record.date})`);
      missingFiles += 1;
      continue;
    }

    console.log(`${dryRun ? '🧪 [dry-run]' : '⬆️'} ${record.date} ${field} -> ${targetUrl}`);
    console.log(`   fuente: ${audioSource.source}`);

    if (!dryRun) {
      await uploadAudioBuffer({
        buffer: audioSource.buffer,
        fileName,
        contentType: 'audio/mpeg',
      });
    }

    updatePayload[field] = targetUrl;
    uploadedFiles += 1;
  }

  const shouldUpdateRow = Object.keys(updatePayload).length > 0;

  if (shouldUpdateRow && !dryRun) {
    await updateRowAudioUrls(record.id, updatePayload);
  }

  return {
    updatedRow: shouldUpdateRow,
    uploadedFiles,
    skippedFiles,
    missingFiles,
  };
}

async function main() {
  console.log('☁️ Migración de audios a Cloudflare R2');
  console.log('='.repeat(50));
  console.log(`Modo: ${dryRun ? 'dry-run' : 'ejecución real'}`);
  if (fromDate || toDate) {
    console.log(`Rango: ${fromDate || 'inicio'} -> ${toDate || 'fin'}`);
  }
  if (limit) {
    console.log(`Límite: ${limit} registros`);
  }

  const rows = await fetchDailyContentRows();
  console.log(`📦 Registros encontrados con audio: ${rows.length}`);

  let updatedRows = 0;
  let uploadedFiles = 0;
  let skippedFiles = 0;
  let missingFiles = 0;

  for (const row of rows) {
    const result = await migrateRecord(row);

    if (result.updatedRow) {
      updatedRows += 1;
    }

    uploadedFiles += result.uploadedFiles;
    skippedFiles += result.skippedFiles;
    missingFiles += result.missingFiles;
  }

  console.log('\n✅ Resumen de migración');
  console.log(`- Registros actualizados: ${updatedRows}`);
  console.log(`- Audios subidos a R2: ${uploadedFiles}`);
  console.log(`- Audios ya migrados/omitidos: ${skippedFiles}`);
  console.log(`- Audios no encontrados: ${missingFiles}`);

  if (dryRun) {
    console.log('\nℹ️ Dry-run finalizado. No se modificó Supabase ni se subieron archivos a R2.');
  }
}

main().catch((error) => {
  console.error('💥 Error fatal durante la migración a R2:', error);
  process.exit(1);
});
