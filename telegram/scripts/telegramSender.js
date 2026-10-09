// Node >= 20. No npm dependencies; suitable for the existing Render Cron Job.
const fs = require('node:fs/promises');
const path = require('node:path');
const DAILY_PHOTO = 'attach://santisimo';
const DAILY_PHOTO_PATH = path.join(__dirname, '..', 'assets', 'Santisimo.png');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function dateInZone(now = new Date(), timeZone = 'America/Santiago') {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  return ['year', 'month', 'day'].map((key) => parts.find((p) => p.type === key).value).join('-');
}

function validateDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) ||
      new Date(date).toISOString().slice(0, 10) !== date) throw new Error('Fecha inválida: usa YYYY-MM-DD.');
  return date;
}

function splitText(text, limit = 4000) {
  // Count UTF-16 units conservatively; never cut a surrogate pair.
  const chunks = [];
  let remaining = text.trim();
  while (remaining.length > limit) {
    let cut = remaining.lastIndexOf('\n', limit);
    if (cut < limit / 2) cut = remaining.lastIndexOf(' ', limit);
    if (cut < limit / 2) cut = limit;
    if (/[\uD800-\uDBFF]/.test(remaining[cut - 1])) cut--;
    chunks.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

function publicUrl(value, siteUrl) {
  if (!value) return null;
  const url = new URL(value, siteUrl || undefined);
  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error('Las imágenes, audios y enlaces deben usar HTTPS público.');
  }
  return url.href;
}

function buildMessages(content, date, { audio = true, image = true, siteUrl } = {}) {
  if (content.date !== date) throw new Error('La fecha del contenido no coincide con el envío.');
  const gospel = content.gospel?.text || content.content;
  const prayer = content.prayer;
  if (typeof gospel !== 'string' || !gospel.trim() || typeof prayer !== 'string' || !prayer.trim()) {
    throw new Error('Falta el evangelio o la oración; no se publica contenido incompleto.');
  }
  const reference = content.gospel?.reference || content.reference || '';
  const messages = [];
  if (image) messages.push({
    method: 'sendPhoto', payload: { photo: DAILY_PHOTO, caption: `Evangelio del día · ${date}` },
  });
  for (const text of [`Evangelio del día · ${date}\n${reference}\n\n${gospel}`, `Oración de la mañana · ${date}\n\n${prayer}`]) {
    for (const chunk of splitText(text)) messages.push({ method: 'sendMessage', payload: { text: chunk } });
  }
  if (audio) {
    for (const [field, title] of [['gospel_audio_url', 'Evangelio del día'], ['prayer_audio_url', 'Oración de la mañana']]) {
      if (content[field]) messages.push({ method: 'sendAudio', payload: { audio: publicUrl(content[field], siteUrl), title: `${title} · ${date}` } });
    }
  }
  return messages;
}

function createStore(env, fetchImpl = fetch) {
  const base = env.SUPABASE_URL?.trim();
  const key = env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!base || !key) throw new Error('Configura SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en Render.');
  const baseUrl = new URL(base);
  if (baseUrl.protocol !== 'https:') throw new Error('SUPABASE_URL debe usar HTTPS.');
  async function request(table, params = {}, method = 'GET', body) {
    const url = new URL(`/rest/v1/${table}`, baseUrl);
    url.search = new URLSearchParams(params).toString();
    let response;
    try {
      response = await fetchImpl(url, {
        method, headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }), signal: AbortSignal.timeout(20000),
      });
    } catch { throw new Error('No se pudo conectar con Supabase.'); }
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const error = new Error(`Supabase: HTTP ${response.status}. Comprueba la configuración y la migración telegram_publications.`);
      error.code = data?.code;
      throw error;
    }
    if (!Array.isArray(data)) throw new Error('Respuesta inesperada de Supabase.');
    return data;
  }
  const filters = (chatId, date) => ({ chat_id: `eq.${chatId}`, date: `eq.${date}` });
  return {
    async content(date) {
      const rows = await request('daily_content', { date: `eq.${date}`, type: 'eq.gospel', is_active: 'eq.true', status: 'eq.published', select: 'date,content,reference,prayer,image_url,gospel_audio_url,prayer_audio_url' });
      if (rows.length !== 1) throw new Error(`Se necesita un evangelio publicado con oración para ${date}.`);
      return rows[0];
    },
    async check() { await request('telegram_publications', { select: 'chat_id', limit: '1' }); },
    async claim(chatId, date, messages) {
      try {
        const rows = await request('telegram_publications', {}, 'POST', { chat_id: chatId, date, messages, status: 'sending' });
        return rows[0];
      } catch (error) { if (error.code !== '23505') throw error; }
      const [row] = await request('telegram_publications', { ...filters(chatId, date), select: '*' });
      if (row?.status === 'sent') return null;
      if (row?.status !== 'failed') throw new Error('Envío en curso o resultado incierto. Revisa el canal y el registro antes de reintentar.');
      // Compare-and-set: only one process may resume a definitively rejected send.
      const resumed = await request('telegram_publications', { ...filters(chatId, date), status: 'eq.failed' }, 'PATCH', { status: 'sending', updated_at: new Date().toISOString() });
      if (resumed.length !== 1) throw new Error('Otro proceso está retomando el envío.');
      return resumed[0];
    },
    async update(chatId, date, changes) {
      const rows = await request('telegram_publications', { ...filters(chatId, date), status: 'eq.sending' }, 'PATCH', { ...changes, updated_at: new Date().toISOString() });
      if (rows.length !== 1) throw new Error('No se pudo guardar el estado del envío.');
    },
  };
}

function createTelegram(token, fetchImpl = fetch, wait = sleep) {
  if (!token || !/^\d+:[\w-]+$/.test(token)) throw new Error('Configura TELEGRAM_BOT_TOKEN en Render.');
  return async (method, payload) => {
    let body = JSON.stringify({ ...payload, allow_paid_broadcast: false });
    let headers = { 'Content-Type': 'application/json' };
    if (method === 'sendPhoto' && payload.photo === DAILY_PHOTO) {
      let photo;
      try { photo = await fs.readFile(DAILY_PHOTO_PATH); }
      catch { throw Object.assign(new Error('Falta telegram/assets/Santisimo.png; no se envió la foto.'), { definiteRejection: true }); }
      body = new FormData();
      for (const [key, value] of Object.entries({ ...payload, allow_paid_broadcast: false })) {
        body.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      }
      body.append('santisimo', new Blob([photo], { type: 'image/png' }), 'Santisimo.png');
      headers = {}; // fetch supplies the multipart boundary.
    }
    for (let attempt = 0; attempt < 3; attempt++) {
      let response, data;
      try {
        response = await fetchImpl(`https://api.telegram.org/bot${token}/${method}`, {
          method: 'POST', headers,
          body, signal: AbortSignal.timeout(60000),
        });
        data = await response.json();
      } catch { throw new Error('Telegram: respuesta incierta; revisa el canal antes de reintentar.'); }
      if (response.ok && data.ok === true) return data.result;
      const code = data.error_code || response.status;
      if (code === 429 && data.ok === false && attempt < 2) {
        const seconds = Number(data.parameters?.retry_after || 2);
        if (seconds > 0 && seconds <= 60) { await wait(seconds * 1000); continue; }
      }
      const error = new Error(`Telegram rechazó la solicitud (HTTP ${code}). Revisa permisos, archivos y configuración.`);
      // 5xx and unparseable responses are ambiguous, never blindly resend.
      error.definiteRejection = data.ok === false && code >= 400 && code < 500;
      throw error;
    }
  };
}

async function publish({ store, telegram, chatId, date, messages, wait = sleep }) {
  const row = await store.claim(chatId, date, messages);
  if (!row) return { status: 'already_sent', date };
  const ids = [...row.message_ids];
  for (let i = row.next_index; i < row.messages.length; i++) {
    const message = row.messages[i];
    let result;
    try {
      result = await telegram(message.method, { ...message.payload, chat_id: chatId });
      if (!Number.isSafeInteger(result?.message_id)) throw new Error('Telegram no confirmó el identificador del mensaje.');
    } catch (error) {
      await store.update(chatId, date, { status: error.definiteRejection ? 'failed' : 'uncertain' });
      throw error;
    }
    ids.push(result.message_id);
    // If this write fails, the row remains sending: operator review avoids duplicate messages.
    await store.update(chatId, date, { next_index: i + 1, message_ids: ids });
    if (i + 1 < row.messages.length) await wait(1100);
  }
  await store.update(chatId, date, { status: 'sent' });
  return { status: 'sent', date, messages: ids.length };
}

async function main(args = process.argv.slice(2), env = process.env) {
  const allowed = /^(--dry-run|--execute|--check|--date=\d{4}-\d{2}-\d{2}|--file=.+)$/;
  if (args.some((arg) => !allowed.test(arg))) throw new Error('Argumento desconocido. Usa --dry-run, --check o --execute; --date=YYYY-MM-DD y --file=ruta son opcionales.');
  const modes = ['--dry-run', '--execute', '--check'].filter((mode) => args.includes(mode));
  if (modes.length !== 1) throw new Error('Selecciona exactamente un modo: --dry-run, --check o --execute.');
  const date = validateDate(args.find((arg) => arg.startsWith('--date='))?.slice(7) || dateInZone(new Date(), env.TELEGRAM_TIMEZONE || 'America/Santiago'));
  const file = args.find((arg) => arg.startsWith('--file='))?.slice(7);
  if (file && modes[0] !== '--dry-run') throw new Error('--file solo se permite con --dry-run. Los envíos reales leen Supabase.');
  if (modes[0] === '--execute' && env.TELEGRAM_ENABLED !== 'true') throw new Error('Envío desactivado: configura TELEGRAM_ENABLED=true después de verificar --check.');
  const store = file ? null : createStore(env);
  const content = file ? JSON.parse((await fs.readFile(file, 'utf8')).replace(/^\uFEFF/, '')) : await store.content(date);
  const messages = buildMessages(content, date, { audio: env.TELEGRAM_INCLUDE_AUDIO !== 'false', image: env.TELEGRAM_INCLUDE_IMAGE !== 'false', siteUrl: env.TELEGRAM_SITE_URL });
  if (messages.some((message) => message.payload.photo === DAILY_PHOTO)) {
    await fs.access(DAILY_PHOTO_PATH);
  }
  if (modes[0] === '--dry-run') { console.log(JSON.stringify({ date, messages }, null, 2)); return; }
  const telegram = createTelegram(env.TELEGRAM_BOT_TOKEN?.trim());
  if (!env.TELEGRAM_CHANNEL_ID?.trim()) throw new Error('Configura TELEGRAM_CHANNEL_ID (@canal o ID -100...).');
  const chat = await telegram('getChat', { chat_id: env.TELEGRAM_CHANNEL_ID.trim() });
  if (chat.type !== 'channel') throw new Error('El destino debe ser un canal de Telegram.');
  const bot = await telegram('getMe', {});
  const member = await telegram('getChatMember', { chat_id: chat.id, user_id: bot.id });
  if (member.status !== 'administrator' || member.can_post_messages !== true) throw new Error('El bot debe ser administrador del canal con permiso para publicar.');
  await store.check();
  if (modes[0] === '--check') { console.log(JSON.stringify({ status: 'ready', date, messages: messages.length })); return; }
  console.log(JSON.stringify(await publish({ store, telegram, chatId: String(chat.id), date, messages })));
}

module.exports = { dateInZone, validateDate, splitText, buildMessages, createStore, createTelegram, publish, main };
if (require.main === module) main().catch((error) => { console.error(error.message); process.exitCode = 1; });
