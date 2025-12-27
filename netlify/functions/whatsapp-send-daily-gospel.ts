import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

type GreenApiSendMessageResponse = { idMessage?: string };

const formatGospelMessage = (payload: {
  date: string;
  title?: string | null;
  reference?: string | null;
  content: string;
  url?: string;
}) => {
  const parts = [
    `Evangelio del día (${payload.date})`,
    payload.reference ? `\n${payload.reference}` : '',
    payload.title ? `\n${payload.title}` : '',
    `\n\n${payload.content}`,
    payload.url ? `\n\nMás info: ${payload.url}` : '',
  ];

  // Unir y limpiar dobles saltos excesivos
  return parts.join('').replace(/\n{3,}/g, '\n\n').trim();
};

const normalizePhoneToChatId = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return `${digits}@c.us`;
};

const getSantiagoNowParts = () => {
  const dtf = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = dtf.formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value || '';

  const year = get('year');
  const month = get('month');
  const day = get('day');
  const hour = Number(get('hour'));
  const minute = Number(get('minute'));

  return {
    date: `${year}-${month}-${day}`,
    hour,
    minute,
  };
};

export const handler: Handler = async (event) => {
  // Esta función está pensada para ejecutarse en schedule/cron.
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Método no permitido' }) };
  }

  const cleanEnv = (v: string) =>
    (v || '')
      .trim()
      // netlify dev / shells sometimes wrap values with quotes
      .replace(/^[`'\"]+/, '')
      .replace(/[`'\"]+$/, '')
      // common copy/paste trailing semicolon
      .replace(/;$/, '')
      .trim();

  const SUPABASE_URL = cleanEnv(process.env.SUPABASE_URL || '');
  const SUPABASE_SERVICE_ROLE_KEY = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY || '');
  const GREEN_ID_INSTANCE = cleanEnv(process.env.GREEN_API_ID_INSTANCE || '');
  const GREEN_API_TOKEN = cleanEnv(process.env.GREEN_API_TOKEN || '');
  const GREEN_API_API_URL = cleanEnv(process.env.GREEN_API_API_URL || '');

  const tokenMeta = {
    idInstance: GREEN_ID_INSTANCE,
    idLength: GREEN_ID_INSTANCE.length,
    tokenLength: GREEN_API_TOKEN.length,
    tokenTail: GREEN_API_TOKEN.slice(-6),
    tokenLooksHex: /^[a-f0-9]+$/i.test(GREEN_API_TOKEN),
  };

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Supabase no configurado.' }) };
  }
  if (!GREEN_ID_INSTANCE || !GREEN_API_TOKEN) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Green API no configurado.' }) };
  }

  // Fecha objetivo (YYYY-MM-DD).
  // Permitimos override por querystring: ?date=YYYY-MM-DD
  // Si no hay override, usamos la fecha/hora de America/Santiago para evitar problemas de UTC/DST.
  const dateOverride = event.queryStringParameters?.date;
  const force = event.queryStringParameters?.force === '1';
  const debug = event.queryStringParameters?.debug === '1';

  const santiagoNow = getSantiagoNowParts();
  const targetDate = dateOverride || santiagoNow.date;

  // Si está agendado (sin date override) solo enviamos cerca de las 07:00 AM Santiago.
  // Recomendación: agendar esta función cada 10 minutos.
  if (!force && !dateOverride) {
    const isTimeWindow = santiagoNow.hour === 7 && santiagoNow.minute >= 0 && santiagoNow.minute < 10;
    if (!isTimeWindow) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          skipped: true,
          reason: 'Fuera de ventana horaria (07:00 America/Santiago).',
          now: santiagoNow,
        }),
      };
    }
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // 1) obtener gospel de Supabase
  const { data: gospel, error: gospelError } = await supabase
    .from('daily_content')
    .select('id, date, title, reference, content')
    .eq('type', 'gospel')
    .eq('date', targetDate)
    .eq('is_active', true)
    .single();

  if (gospelError || !gospel) {
    console.error('No gospel:', gospelError);
    return { statusCode: 404, body: JSON.stringify({ message: `No hay evangelio activo para ${targetDate}` }) };
  }

  const message = formatGospelMessage({
    date: gospel.date,
    title: gospel.title,
    reference: gospel.reference,
    content: gospel.content,
  });

  // 2) obtener subs activas que aún no recibieron hoy
  const { data: subs, error: subsError } = await supabase
    .from('whatsapp_subscriptions')
    .select('id, phone, last_sent_date')
    .eq('is_active', true);

  if (subsError) {
    console.error('Error fetching subs:', subsError);
    return { statusCode: 500, body: JSON.stringify({ message: 'No se pudieron cargar suscriptores.' }) };
  }

  const pending = (subs || []).filter((s) => String(s.last_sent_date || '') !== targetDate);

  // Green API puede operar con un host regional (ej: https://7105.api.greenapi.com)
  // En caso de no configurarse, intentamos derivarlo desde el idInstance (primeros 4 dígitos).
  const derivedHostPrefix = GREEN_ID_INSTANCE.slice(0, 4);
  const defaultApiHost = `https://${derivedHostPrefix}.api.greenapi.com`;
  const apiHost = GREEN_API_API_URL || defaultApiHost;

  const BASE_URL = `${apiHost}/waInstance${GREEN_ID_INSTANCE}`;

  let ok = 0;
  let failed = 0;
  const debugErrors: Array<{ phone: string; status?: number; response?: string; error?: string }> = [];

  for (const sub of pending) {
    const chatId = normalizePhoneToChatId(sub.phone);
    try {
      const resp = await fetch(`${BASE_URL}/sendMessage/${GREEN_API_TOKEN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, message }),
      });

      const rawText = await resp.text();
      let data: GreenApiSendMessageResponse = {};
      try {
        data = (JSON.parse(rawText || '{}') as GreenApiSendMessageResponse);
      } catch {
        // keep as {}
      }
      if (!resp.ok || !data.idMessage) {
        failed++;
        const hint = resp.status === 401
          ? '401 Unauthorized: revisa GREEN_API_ID_INSTANCE y GREEN_API_TOKEN (que correspondan a la misma instancia), y que la instancia esté autorizada/online en Green API.'
          : undefined;
        console.error('Green API error:', resp.status, rawText || data, hint ? `\n${hint}` : '');
        if (debug) {
          debugErrors.push({ phone: String(sub.phone), status: resp.status, response: rawText || JSON.stringify(data) });
        }
        continue;
      }

      ok++;
      // marcar como enviado
      await supabase
        .from('whatsapp_subscriptions')
        .update({ last_sent_date: targetDate })
        .eq('id', sub.id);
    } catch (e) {
      failed++;
      console.error('Send error:', e);
      if (debug) {
        debugErrors.push({ phone: String(sub.phone), error: e instanceof Error ? e.message : String(e) });
      }
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      date: targetDate,
      totalActive: subs?.length || 0,
      pending: pending.length,
      sent: ok,
      failed,
      ...(debug
        ? {
            debug: {
              apiHost,
              baseUrl: BASE_URL,
              usedTokenPrefix: GREEN_API_TOKEN.slice(0, 6) + '...',
              tokenMeta,
              errors: debugErrors,
            },
          }
        : {}),
    }),
  };
};
