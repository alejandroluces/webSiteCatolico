import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const rosaryDataPath = path.join(rootDir, 'interactive-rosary', 'constants', 'rosaryData.ts');

const MYSTERY_SLUGS = {
  Gozosos: 'gozosos',
  Luminosos: 'luminosos',
  Dolorosos: 'dolorosos',
  Gloriosos: 'gloriosos',
};

const argv = process.argv.slice(2);

const readFlag = (name, fallback = undefined) => {
  const prefix = `--${name}=`;
  const exactIndex = argv.indexOf(`--${name}`);
  const valueArg = argv.find((arg) => arg.startsWith(prefix));

  if (valueArg) return valueArg.slice(prefix.length);
  if (exactIndex >= 0) return true;

  return fallback;
};

const force = Boolean(readFlag('force', false));
const selectedMystery = String(readFlag('mystery', 'all')).toLowerCase();
const outputDir = path.resolve(rootDir, String(readFlag('out', 'public/audio/rosary')));
const model = String(readFlag('model', process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts'));
const voice = String(readFlag('voice', process.env.OPENAI_TTS_VOICE || 'alloy'));
const speed = Number(readFlag('speed', process.env.OPENAI_TTS_SPEED || '0.92'));

if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is required to generate rosary audio.');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function loadRosaryData() {
  const result = await build({
    entryPoints: [rosaryDataPath],
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
    logLevel: 'silent',
  });

  const code = result.outputFiles[0].text;
  const encoded = Buffer.from(code).toString('base64');
  return import(`data:text/javascript;base64,${encoded}`);
}

function normalizeText(value) {
  return String(value)
    .replace(/\s+/g, ' ')
    .replace(/«/g, '')
    .replace(/»/g, '')
    .trim();
}

function resolveSegment({ bead, index, mysteryType, prayers, mysteries }) {
  if (bead.prayerKey === 'mystery_announcement') {
    const mystery = mysteries[mysteryType][bead.mysteryIndex ?? 0];
    return {
      index,
      title: mystery.name,
      text: normalizeText(`${mystery.name}. ${mystery.announcement}`),
    };
  }

  const prayer = prayers[bead.prayerKey];
  return {
    index,
    title: prayer.name,
    text: normalizeText(prayer.text),
  };
}

function getSpeechPayload(input) {
  const payload = {
    model,
    voice,
    input,
    response_format: 'mp3',
    speed,
  };

  if (!['tts-1', 'tts-1-hd'].includes(model)) {
    payload.instructions = 'Lee en espanol con ritmo sereno de guia de oracion catolica, pausas suaves y tono reverente.';
  }

  return payload;
}

async function generateFile({ filePath, text }) {
  const speech = await openai.audio.speech.create(getSpeechPayload(text));
  const buffer = Buffer.from(await speech.arrayBuffer());
  await writeFile(filePath, buffer);
}

async function main() {
  const { PRAYERS, MYSTERIES, ROSARY_SEQUENCE } = await loadRosaryData();
  const mysteryTypes = Object.keys(MYSTERY_SLUGS);
  const targets = selectedMystery === 'all'
    ? mysteryTypes
    : mysteryTypes.filter((type) => MYSTERY_SLUGS[type] === selectedMystery);

  if (targets.length === 0) {
    console.error(`Invalid mystery "${selectedMystery}". Use all, gozosos, luminosos, dolorosos, or gloriosos.`);
    process.exit(1);
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    model,
    voice,
    speed,
    totalSegments: ROSARY_SEQUENCE.length,
    mysteries: {},
  };

  for (const mysteryType of targets) {
    const slug = MYSTERY_SLUGS[mysteryType];
    const mysteryDir = path.join(outputDir, slug);
    await mkdir(mysteryDir, { recursive: true });

    manifest.mysteries[slug] = [];

    for (const [index, bead] of ROSARY_SEQUENCE.entries()) {
      const segment = resolveSegment({
        bead,
        index,
        mysteryType,
        prayers: PRAYERS,
        mysteries: MYSTERIES,
      });
      const fileName = `${String(index + 1).padStart(2, '0')}.mp3`;
      const filePath = path.join(mysteryDir, fileName);
      const relativeFile = path.relative(outputDir, filePath).replace(/\\/g, '/');

      manifest.mysteries[slug].push({
        index: index + 1,
        title: segment.title,
        file: relativeFile,
      });

      if (!force && existsSync(filePath)) {
        console.log(`[skip] ${relativeFile}`);
        continue;
      }

      if (segment.text.length > 4096) {
        throw new Error(`Segment ${index + 1} for ${slug} exceeds the 4096 character TTS input limit.`);
      }

      console.log(`[audio] ${relativeFile} - ${segment.title}`);
      await generateFile({ filePath, text: segment.text });
    }
  }

  await mkdir(outputDir, { recursive: true });
  await writeFile(
    path.join(outputDir, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  console.log(`Rosary audio manifest written to ${pathToFileURL(path.join(outputDir, 'manifest.json')).href}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
