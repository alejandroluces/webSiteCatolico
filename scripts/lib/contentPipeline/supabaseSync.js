import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

async function readJsonIfExists(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf-8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolvePublicImageUrl({ imagePath, publicFolder, candidates }) {
  if (imagePath) {
    return `/images/${publicFolder}/${path.basename(imagePath)}`;
  }

  for (const candidate of candidates) {
    if (await fileExists(candidate.path)) {
      return `/images/${publicFolder}/${candidate.fileName}`;
    }
  }

  return null;
}

async function upsertDailyContent(supabase, payload) {
  const { data, error } = await supabase
    .from('daily_content')
    .upsert(payload, { onConflict: 'date,type' })
    .select('id,date,type,title')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function upsertSchedule(supabase, content) {
  const { error } = await supabase
    .from('content_schedule')
    .upsert({
      content_type: content.type,
      scheduled_date: content.date,
      content_id: content.id,
      is_published: true,
      published_at: new Date().toISOString(),
    }, { onConflict: 'scheduled_date,content_type' });

  if (error) {
    throw error;
  }
}

export function createSupabaseAdmin(env = process.env) {
  const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Faltan SUPABASE_URL/VITE_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY.');
  }

  return createClient(url, serviceRoleKey);
}

export async function syncDailyContentForDate(paths, options = {}) {
  if (options.dryRun) {
    return {
      date: paths.date,
      status: 'dry_run',
      rows: [],
    };
  }

  const supabase = options.supabase || createSupabaseAdmin();
  const rows = [];
  const includeGospel = options.includeGospel !== false;
  const includeReading = options.includeReading !== false;
  const includeSaint = options.includeSaint !== false;

  const gospelJson = await readJsonIfExists(paths.dest.gospelJson);
  if (gospelJson && includeGospel) {
    const gospelImageUrl = await resolvePublicImageUrl({
      imagePath: gospelJson.imagePath,
      publicFolder: 'gospels',
      candidates: [
        { path: paths.dest.gospelPng, fileName: `${paths.fileDate}.png` },
        { path: paths.dest.gospelJpg, fileName: `${paths.fileDate}.jpg` },
        { path: paths.dest.gospelJpeg, fileName: `${paths.fileDate}.jpeg` },
      ],
    });

    const gospel = await upsertDailyContent(supabase, {
      date: gospelJson.date,
      type: 'gospel',
      title: gospelJson.gospel.title,
      content: gospelJson.gospel.text,
      reference: gospelJson.gospel.reference,
      prayer: gospelJson.prayer,
      image_url: gospelImageUrl,
      source_attribution: gospelJson.gospel.url || null,
      liturgical_season: 'Tiempo Ordinario',
      liturgical_color: 'Verde',
      status: 'published',
      is_active: true,
      updated_at: new Date().toISOString(),
    });
    await upsertSchedule(supabase, gospel);
    rows.push(gospel);

    if (gospelJson.gospel.reading && includeReading) {
      const reading = await upsertDailyContent(supabase, {
        date: gospelJson.date,
        type: 'reading',
        title: gospelJson.gospel.reading.title,
        content: gospelJson.gospel.reading.text,
        reference: gospelJson.gospel.reading.reference,
        source_attribution: gospelJson.gospel.url || null,
        liturgical_season: 'Tiempo Ordinario',
        liturgical_color: 'Verde',
        status: 'published',
        is_active: true,
        updated_at: new Date().toISOString(),
      });
      await upsertSchedule(supabase, reading);
      rows.push(reading);
    }
  }

  const saintJson = await readJsonIfExists(paths.dest.saintJson);
  if (saintJson && includeSaint) {
    const content = saintJson.saint.biography || saintJson.saint.text;
    const saintImageUrl = await resolvePublicImageUrl({
      imagePath: saintJson.saint.imagePath,
      publicFolder: 'santo-del-dia',
      candidates: [
        { path: paths.dest.saintPng, fileName: `${paths.fileDate}.png` },
        { path: paths.dest.saintJpg, fileName: `${paths.fileDate}.jpg` },
        { path: paths.dest.saintJpeg, fileName: `${paths.fileDate}.jpeg` },
      ],
    });

    const saint = await upsertDailyContent(supabase, {
      date: saintJson.date,
      type: 'saint',
      title: saintJson.saint.title,
      content,
      feast_day: saintJson.formattedDate || null,
      image_url: saintImageUrl,
      source_attribution: saintJson.saint.url || null,
      liturgical_season: 'Tiempo Ordinario',
      liturgical_color: 'Verde',
      status: 'published',
      is_active: true,
      updated_at: new Date().toISOString(),
    });
    await upsertSchedule(supabase, saint);
    rows.push(saint);
  }

  return {
    date: paths.date,
    status: rows.length > 0 ? 'synced' : 'no_files',
    rows,
  };
}
