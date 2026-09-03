import fs from 'fs/promises';
import path from 'path';
import xlsx from 'xlsx';
import { ddmmyyyyToIso } from './dates.js';

const REQUIRED_EXCEL_HEADERS = [
  'NOMBRES',
  'APELLIDO_PATERNO',
  'APELLIDO_MATERNO',
  'CELULAR',
  'MAIL',
  'CORREO',
  'SMS',
  'WHATSAPP',
  'TEXTO_MENSAJE',
];

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

function requireText(errors, data, keyPath, label) {
  const value = keyPath.split('.').reduce((current, key) => current?.[key], data);
  if (typeof value !== 'string' || value.trim() === '') {
    errors.push(`${label} requerido o vacio`);
  }
}

function expectedIsoDateFromPath(filePath) {
  const base = path.basename(filePath, '.json');
  return ddmmyyyyToIso(base);
}

export async function validateGospelJson(filePath) {
  const errors = [];
  try {
    const data = await readJson(filePath);
    const expectedDate = expectedIsoDateFromPath(filePath);

    if (data.date !== expectedDate) {
      errors.push(`date=${data.date || 'N/A'} no coincide con archivo ${path.basename(filePath)} (${expectedDate})`);
    }

    requireText(errors, data, 'date', 'date');
    requireText(errors, data, 'gospel.title', 'gospel.title');
    requireText(errors, data, 'gospel.reference', 'gospel.reference');
    requireText(errors, data, 'gospel.text', 'gospel.text');
    requireText(errors, data, 'prayer', 'prayer');

    if (data.gospel?.reading) {
      requireText(errors, data, 'gospel.reading.title', 'gospel.reading.title');
      requireText(errors, data, 'gospel.reading.reference', 'gospel.reading.reference');
      requireText(errors, data, 'gospel.reading.text', 'gospel.reading.text');
    }
  } catch (error) {
    errors.push(error instanceof SyntaxError ? 'JSON invalido' : error.message);
  }

  return { file: filePath, type: 'gospel', valid: errors.length === 0, errors };
}

export async function validateSaintJson(filePath) {
  const errors = [];
  try {
    const data = await readJson(filePath);
    const expectedDate = expectedIsoDateFromPath(filePath);

    if (data.date !== expectedDate) {
      errors.push(`date=${data.date || 'N/A'} no coincide con archivo ${path.basename(filePath)} (${expectedDate})`);
    }

    requireText(errors, data, 'date', 'date');
    requireText(errors, data, 'saint.title', 'saint.title');
    requireText(errors, data, 'saint.text', 'saint.text');
  } catch (error) {
    errors.push(error instanceof SyntaxError ? 'JSON invalido' : error.message);
  }

  return { file: filePath, type: 'saint', valid: errors.length === 0, errors };
}

export async function validateExcel(filePath) {
  const errors = [];
  try {
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    const headers = (rows[0] || []).map((value) => String(value).trim().toUpperCase());
    const missing = REQUIRED_EXCEL_HEADERS.filter((header) => !headers.includes(header));

    if (missing.length > 0) {
      errors.push(`Faltan columnas: ${missing.join(', ')}`);
    }
  } catch (error) {
    errors.push(error.message);
  }

  return { file: filePath, type: 'excel', valid: errors.length === 0, errors };
}

export async function optionalFileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function validateDateFiles(paths, options = {}) {
  const validations = [];

  if (await optionalFileExists(paths.dest.gospelJson)) {
    validations.push(await validateGospelJson(paths.dest.gospelJson));
  } else {
    validations.push({
      file: paths.dest.gospelJson,
      type: 'gospel',
      valid: false,
      errors: ['Archivo de evangelio requerido no existe'],
    });
  }

  if (await optionalFileExists(paths.dest.saintJson)) {
    validations.push(await validateSaintJson(paths.dest.saintJson));
  } else if (options.requireSaint) {
    validations.push({
      file: paths.dest.saintJson,
      type: 'saint',
      valid: false,
      errors: ['Archivo de santo requerido no existe'],
    });
  }

  if (await optionalFileExists(paths.dest.gospelXlsx)) {
    validations.push(await validateExcel(paths.dest.gospelXlsx));
  }

  return {
    date: paths.date,
    fileDate: paths.fileDate,
    validations,
    valid: validations.every((item) => item.valid),
  };
}
