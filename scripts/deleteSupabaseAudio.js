#!/usr/bin/env node

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config();

const args = process.argv.slice(2);
const hasFlag = (flag) => args.includes(flag);
const getArgValue = (name) => {
  const arg = args.find((value) => value.startsWith(`${name}=`));
  return arg ? arg.slice(name.length + 1) : undefined;
};

function printHelp() {
  console.log(`
Uso: node scripts/deleteSupabaseAudio.js [opciones]

Opciones:
  --dry-run                    Simula el borrado (por defecto)
  --execute                    Ejecuta el borrado real
  --bucket=audio_content       Bucket de Supabase Storage
  --prefix=audio_content       Carpeta/prefijo dentro del bucket
  --limit=1000                 Cantidad a leer por página
  --batch-size=100             Cantidad a borrar por llamada a remove()
  --help                       Muestra esta ayuda

Ejemplos:
  node scripts/deleteSupabaseAudio.js --dry-run
  node scripts/deleteSupabaseAudio.js --execute
`);
}

if (hasFlag('--help')) {
  printHelp();
  process.exit(0);
}

const executeDelete = hasFlag('--execute');
const dryRun = !executeDelete || hasFlag('--dry-run');
const bucket = getArgValue('--bucket') || 'audio_content';
const prefix = (getArgValue('--prefix') || 'audio_content').replace(/^\/+|\/+$/g, '');
const limitArg = getArgValue('--limit') || '1000';
const batchSizeArg = getArgValue('--batch-size') || '100';
const pageLimit = Number.parseInt(limitArg, 10);
const batchSize = Number.parseInt(batchSizeArg, 10);

if (!Number.isInteger(pageLimit) || pageLimit <= 0) {
  console.error('❌ --limit debe ser un entero positivo.');
  process.exit(1);
}

if (!Number.isInteger(batchSize) || batchSize <= 0) {
  console.error('❌ --batch-size debe ser un entero positivo.');
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan SUPABASE_URL/VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listAllObjects() {
  const files = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(prefix, {
        limit: pageLimit,
        offset,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) {
      throw new Error(`Error listando ${bucket}/${prefix}: ${error.message}`);
    }

    const items = data || [];
    for (const item of items) {
      if (!item.name) continue;
      files.push(`${prefix}/${item.name}`);
    }

    if (items.length < pageLimit) {
      break;
    }

    offset += pageLimit;
  }

  return files;
}

function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function main() {
  console.log('🧹 Limpieza de audios en Supabase Storage');
  console.log('==================================================');
  console.log(`Modo: ${dryRun ? 'dry-run' : 'ejecución real'}`);
  console.log(`Bucket: ${bucket}`);
  console.log(`Prefijo: ${prefix}`);

  const files = await listAllObjects();

  console.log(`Objetos encontrados: ${files.length}`);
  if (files.length === 0) {
    console.log('ℹ️ No hay archivos para borrar.');
    return;
  }

  const preview = files.slice(0, 10);
  console.log('Primeros archivos detectados:');
  for (const file of preview) {
    console.log(`- ${file}`);
  }
  if (files.length > preview.length) {
    console.log(`... y ${files.length - preview.length} más`);
  }

  if (dryRun) {
    console.log('');
    console.log('✅ Dry-run completado. No se borró nada.');
    console.log('Para borrar realmente, ejecuta:');
    console.log('npm run audio:supabase:cleanup');
    return;
  }

  const batches = chunk(files, batchSize);
  let deleted = 0;

  for (const batch of batches) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove(batch);

    if (error) {
      throw new Error(`Error borrando archivos del bucket ${bucket}: ${error.message}`);
    }

    deleted += batch.length;
    console.log(`🗑️ Borrados ${deleted}/${files.length}`);
  }

  console.log('');
  console.log(`✅ Limpieza completada. Archivos borrados: ${deleted}`);
}

main().catch((error) => {
  console.error('💥 Error fatal durante la limpieza de Supabase Storage:', error);
  process.exit(1);
});
