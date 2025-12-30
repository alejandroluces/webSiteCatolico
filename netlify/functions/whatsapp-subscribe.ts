import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

type Body = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
};

const normalizePhone = (raw: string) => raw.replace(/\D/g, '');

const cleanEnv = (v: string) =>
  (v || '')
    .trim()
    // netlify / shells sometimes wrap values with quotes
    .replace(/^[`'"]+/, '')
    .replace(/[`'"]+$/, '')
    // common copy/paste trailing semicolon
    .replace(/;$/, '')
    .trim();

type PostgrestErrorLike = {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
};

const asPostgrestErrorLike = (e: unknown): PostgrestErrorLike | null => {
  if (!e || typeof e !== 'object') return null;
  const maybe = e as Partial<PostgrestErrorLike>;
  if (typeof maybe.message !== 'string') return null;
  return {
    message: maybe.message,
    code: typeof maybe.code === 'string' ? maybe.code : undefined,
    details: typeof maybe.details === 'string' ? maybe.details : undefined,
    hint: typeof maybe.hint === 'string' ? maybe.hint : undefined,
  };
};

const sendEmailJsNotification = async (params: {
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string;
}) => {
  // Por defecto, **deshabilitado**: muchas cuentas de EmailJS bloquean envíos desde serverless
  // con el error 403: "API calls are disabled for non-browser applications".
  // Si tu plan permite server-side, habilita explícitamente con:
  // EMAILJS_ENABLE_SERVER=1
  const EMAILJS_ENABLE_SERVER = cleanEnv(process.env.EMAILJS_ENABLE_SERVER || '') === '1';
  if (!EMAILJS_ENABLE_SERVER) return;

  // EmailJS: se recomienda llamar desde backend para NO exponer accessToken/privKey.
  // Docs API: https://www.emailjs.com/docs/rest-api/send-email/
  const EMAILJS_SERVICE_ID = cleanEnv(process.env.EMAILJS_SERVICE_ID || '');
  const EMAILJS_TEMPLATE_ID = cleanEnv(process.env.EMAILJS_TEMPLATE_ID || '');
  const EMAILJS_PUBLIC_KEY = cleanEnv(process.env.EMAILJS_PUBLIC_KEY || '');
  // En EmailJS suele llamarse "Private Key" o "Access Token" (según UI).
  const EMAILJS_PRIVATE_KEY = cleanEnv(
    process.env.EMAILJS_PRIVATE_KEY || process.env.EMAILJS_ACCESS_TOKEN || ''
  );

  // Email destino para recibir notificación (puedes reutilizar esta variable ya existente en el repo)
  const NOTIFICATION_EMAIL = cleanEnv(process.env.NOTIFICATION_EMAIL || '');

  const isConfigured =
    Boolean(EMAILJS_SERVICE_ID) &&
    Boolean(EMAILJS_TEMPLATE_ID) &&
    Boolean(EMAILJS_PUBLIC_KEY) &&
    Boolean(EMAILJS_PRIVATE_KEY) &&
    Boolean(NOTIFICATION_EMAIL);

  if (!isConfigured) {
    console.warn('EmailJS notification skipped (missing env)', {
      hasServiceId: Boolean(EMAILJS_SERVICE_ID),
      hasTemplateId: Boolean(EMAILJS_TEMPLATE_ID),
      hasPublicKey: Boolean(EMAILJS_PUBLIC_KEY),
      hasPrivateKey: Boolean(EMAILJS_PRIVATE_KEY),
      hasNotificationEmail: Boolean(NOTIFICATION_EMAIL),
    });
    return;
  }

  const payload = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    user_id: EMAILJS_PUBLIC_KEY,
    accessToken: EMAILJS_PRIVATE_KEY,
    template_params: {
      // IMPORTANTE: configura tu template EmailJS para usar estas variables.
      // Para enviar a tu correo, en el template pon "To Email" = {{to_email}}
      to_email: NOTIFICATION_EMAIL,
      first_name: params.firstName,
      last_name: params.lastName || '',
      phone: params.phone,
      email: params.email || '',
      subscribed_at: new Date().toISOString(),
      source: 'website',
      channel: 'whatsapp-gospel',
    },
  };

  const resp = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const raw = await resp.text().catch(() => '');
    console.error('EmailJS notification failed', { status: resp.status, raw });
  } else {
    console.log('EmailJS notification sent');
  }
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Método no permitido' }) };
  }

  // En PROD (Netlify) a veces se configura solo VITE_SUPABASE_URL.
  // Permitimos fallback para evitar errores de configuración.
  // Además, sanitizamos comillas/; por copy-paste desde .env.
  const SUPABASE_URL = cleanEnv(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '');
  const SUPABASE_SERVICE_ROLE_KEY = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY || '');
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing env for whatsapp-subscribe', {
      hasSupabaseUrl: Boolean(SUPABASE_URL),
      hasServiceRole: Boolean(SUPABASE_SERVICE_ROLE_KEY),
    });
    return {
      statusCode: 500,
      body: JSON.stringify({
        message:
          'Backend no configurado (Supabase). Configura SUPABASE_URL (o VITE_SUPABASE_URL) y SUPABASE_SERVICE_ROLE_KEY en Netlify.',
      }),
    };
  }

  let body: Body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ message: 'JSON inválido.' }) };
  }

  const firstName = (body.firstName || '').trim();
  const lastName = (body.lastName || '').trim();
  const email = (body.email || '').trim();
  const phoneRaw = (body.phone || '').trim();
  const phone = normalizePhone(phoneRaw);

  if (firstName.length < 2) {
    return { statusCode: 400, body: JSON.stringify({ message: 'Nombre inválido.' }) };
  }
  if (!phone || phone.length < 10) {
    return { statusCode: 400, body: JSON.stringify({ message: 'Teléfono inválido.' }) };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ message: 'Correo inválido.' }) };
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Nota: en algunos proyectos, PostgREST + RLS puede bloquear el `upsert` aunque existan
  // policies de INSERT/UPDATE. Para evitar el 42501 en producción, hacemos:
  // 1) INSERT normal
  // 2) si hay conflicto (23505), hacemos UPDATE por teléfono.

  const payload = {
    first_name: firstName,
    last_name: lastName || null,
    phone,
    email: email || null,
    is_active: true,
    unsubscribed_at: null,
    timezone: 'America/Santiago',
    source: 'website',
  };

  const { error: insertError } = await supabase.from('whatsapp_subscriptions').insert([payload]);

  const insertErrLike = asPostgrestErrorLike(insertError);
  const isDuplicate = Boolean(insertErrLike && insertErrLike.code === '23505');

  const { error } = isDuplicate
    ? await supabase.from('whatsapp_subscriptions').update(payload).eq('phone', phone)
    : { error: insertError };

  if (error) {
    const errLike = asPostgrestErrorLike(error) || { message: 'Unknown error' };
    console.error('Supabase error (whatsapp-subscribe):', {
      message: errLike.message,
      code: errLike.code,
      details: errLike.details,
      hint: errLike.hint,
    });

    // Mensaje más útil para PROD sin exponer datos sensibles.
    const msg =
      errLike.code === 'PGRST301' || /JWT|token/i.test(errLike.message)
        ? 'No se pudo guardar la suscripción. Revisa que SUPABASE_SERVICE_ROLE_KEY sea válida (sin comillas) y corresponda al mismo proyecto.'
        : 'No se pudo guardar la suscripción.';

    return { statusCode: 500, body: JSON.stringify({ message: msg }) };
  }

  // Notificación por correo (NO bloquea la suscripción si falla)
  try {
    await sendEmailJsNotification({
      firstName,
      lastName: lastName || undefined,
      phone,
      email: email || undefined,
    });
  } catch (e) {
    console.error('EmailJS notification threw error', {
      error: e instanceof Error ? e.message : String(e),
    });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: '¡Listo! Desde mañana recibirás el Evangelio por WhatsApp.' }),
  };
};
