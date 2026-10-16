const cheerio = require('cheerio');
const { renderReadingsPdf } = require('./readingsPdf');
const ORIGIN = 'https://www.dominicos.org';
const MAX_PDF_BYTES = 10 * 1024 * 1024;

function datedPath(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) ||
      new Date(date).toISOString().slice(0, 10) !== date) throw new Error('Fecha inválida para el PDF.');
  return date.split('-').reverse().join('-');
}

function extractPdfUrl(html, date) {
  const day = datedPath(date);
  const allowed = [`/predicacion/pdf-evangelio-del-dia/${day}.pdf`, `/predicacion/pdf-homilia/${day}/lecturas.pdf`];
  const links = [...html.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi)];
  for (const [, href] of links) {
    let url;
    try { url = new URL(href.replace(/&amp;/g, '&'), ORIGIN); } catch { continue; }
    if (url.origin === ORIGIN && !url.username && !url.password && allowed.includes(url.pathname) && !url.search) return url.href;
  }
  throw new Error(`Dominicos no ofrece un PDF de lecturas para ${date}.`);
}

async function request(url, fetchImpl) {
  let response;
  try { response = await fetchImpl(url, { signal: AbortSignal.timeout(30000), redirect: 'follow' }); }
  catch { throw new Error('No se pudo conectar con Dominicos para obtener el PDF.'); }
  if (!response.ok) throw new Error(`Dominicos: HTTP ${response.status}.`);
  if (response.url && new URL(response.url).origin !== ORIGIN) throw new Error('Dominicos redirigió fuera del sitio oficial.');
  return response;
}

async function downloadPdf(url, fetchImpl = fetch) {
  const parsed = new URL(url);
  if (parsed.origin !== ORIGIN || parsed.username || parsed.password ||
      !/^\/predicacion\/pdf-(?:evangelio-del-dia\/\d{2}-\d{2}-\d{4}\.pdf|homilia\/\d{2}-\d{2}-\d{4}\/lecturas\.pdf)$/.test(parsed.pathname)) {
    throw new Error('URL de PDF de Dominicos inválida.');
  }
  const response = await request(url, fetchImpl);
  const chunks = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > MAX_PDF_BYTES) throw new Error('El PDF de Dominicos supera 10 MB.');
    chunks.push(Buffer.from(chunk));
  }
  const bytes = Buffer.concat(chunks);
  if (bytes.subarray(0, 5).toString() !== '%PDF-' || !bytes.subarray(-1024).includes(Buffer.from('%%EOF'))) {
    throw new Error('Dominicos no devolvió un PDF válido y completo.');
  }
  return bytes;
}

async function preparePdfMessage(date, fetchImpl = fetch) {
  const day = datedPath(date);
  // The dated weekday endpoint redirects to the homily on Sundays and feasts.
  const response = await request(`${ORIGIN}/predicacion/evangelio-del-dia/${day}/`, fetchImpl);
  let html = await response.text();
  let sourceUrl = `${ORIGIN}/predicacion/evangelio-del-dia/${day}/`;
  // Homily landing pages may only expose the complete homily: visit readings.
  if (response.url?.includes(`/predicacion/homilia/${day}/`)) {
    sourceUrl = `${ORIGIN}/predicacion/homilia/${day}/lecturas/`;
    html = await (await request(sourceUrl, fetchImpl)).text();
  }
  const readings = extractReadings(html, date, sourceUrl);
  await renderReadingsPdf(readings); // Check generation before any daily message is sent.
  return { method: 'sendDocument', payload: {
    document: 'attach://lecturas', readings,
    caption: `Evangelio y lecturas del día · ${date}\nCamino de Fe · Fuente: Dominicos.org`,
  } };
}

function extractReadings(html, date, sourceUrl) {
  extractPdfUrl(html, date); // A dated publisher link guards against wrong-day fallback pages.
  const $ = cheerio.load(html);
  const kinds = { 'Primera lectura': 'first', 'Salmo de hoy': 'psalm', 'Salmo': 'psalm', 'Segunda lectura': 'second', 'Evangelio del día': 'gospel' };
  const sections = [];
  $('.contenido-dia > h2, .contenido-homilia > h2').each((_, element) => {
    const title = $(element).text().trim();
    const kind = kinds[title];
    if (!kind) return;
    const nodes = $(element).nextUntil('h2');
    const reference = nodes.filter('h3').first().text().trim();
    const paragraphs = nodes.filter('p').map((_, p) => {
      const copy = $(p).clone();
      copy.find('br').replaceWith('\n');
      return copy.text().replace(/\u00a0/g, ' ').split('\n').map(line => line.trim()).join('\n').trim();
    }).get().filter(Boolean);
    if (!reference || !paragraphs.length) throw new Error(`Lectura incompleta: ${title}.`);
    sections.push({ kind, title, reference, paragraphs });
  });
  const sequence = sections.map(section => section.kind).join(',');
  if (!['first,psalm,gospel', 'first,psalm,second,gospel'].includes(sequence)) {
    throw new Error('Dominicos no contiene todas las lecturas esperadas; no se genera un PDF incompleto.');
  }
  return { date, sourceUrl, sections };
}

module.exports = { extractPdfUrl, downloadPdf, preparePdfMessage, extractReadings };
