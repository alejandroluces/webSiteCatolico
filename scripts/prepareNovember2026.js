#!/usr/bin/env node
// Apply the reviewed November calendar and normalize local text before audio generation.
import fs from 'node:fs/promises';
import { createSupabaseAdmin } from './lib/contentPipeline/supabaseSync.js';
if (!process.argv.includes('--execute')) throw new Error('Requiere --execute');
const calendar = JSON.parse(await fs.readFile('data/liturgy-2026-11.json', 'utf8'));
const supabase = createSupabaseAdmin();
const events = [];
for (let day = 1; day <= 30; day++) {
  const dd = String(day).padStart(2, '0');
  const date = `2026-11-${dd}`;
  const season = day >= 29 ? 'Adviento' : 'Tiempo Ordinario';
  const celebrations = calendar.celebrations.filter(row => row[0] === day);
  // Optional memorials remain alternatives to the weekday, not obligatory replacements.
  const main = celebrations.find(row => row[2] !== 'optional_memorial');
  const color = main?.[3] || (day >= 29 ? 'Morado' : 'Verde');
  if (!main) {
    const weekday = new Intl.DateTimeFormat('es-CL', { weekday: 'long', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
    const week = day < 8 ? 'XXXI' : day < 15 ? 'XXXII' : day < 22 ? 'XXXIII' : 'XXXIV';
    celebrations.unshift([day, `${weekday[0].toUpperCase()}${weekday.slice(1)} de la semana ${week} del Tiempo Ordinario`, 'special', color, 4]);
  }
  for (const [, title, celebration_type, liturgical_color, rank] of celebrations) {
    events.push({ date, title, celebration_type, liturgical_season: season, liturgical_color, rank,
      is_local_celebration: false, description: `Calendario litúrgico de Chile. Fuente: ${calendar.sources[0]}` });
  }
  for (const folder of ['gospels', 'santo-del-dia']) {
    const file = `public/images/${folder}/${dd}112026.json`;
    const json = JSON.parse(await fs.readFile(file, 'utf8'));
    json.liturgical_season = season;
    json.liturgical_color = color;
    if (json.prayer) json.prayer = json.prayer.replace(/^\s*\*{0,2}Oración de la [Mm]añana\*{0,2}\s*\n+/u, '').replace(/\*\*/g, '').trim();
    await fs.writeFile(file, JSON.stringify(json, null, 2) + '\n');
  }
}
const { error } = await supabase.from('liturgical_calendar').upsert(events, { onConflict: 'date,title' });
if (error) throw new Error(error.message);
console.log(`Prepared 30 dates and ${events.length} calendar entries.`);
