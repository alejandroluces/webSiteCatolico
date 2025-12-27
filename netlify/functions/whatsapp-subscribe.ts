import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

type Body = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
};

const normalizePhone = (raw: string) => raw.replace(/\D/g, '');

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Método no permitido' }) };
  }

  // En PROD (Netlify) a veces se configura solo VITE_SUPABASE_URL.
  // Permitimos fallback para evitar errores de configuración.
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
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

  // Upsert by unique phone
  const { error } = await supabase
    .from('whatsapp_subscriptions')
    .upsert(
      [
        {
          first_name: firstName,
          last_name: lastName || null,
          phone,
          email: email || null,
          is_active: true,
          unsubscribed_at: null,
          timezone: 'America/Santiago',
          source: 'website',
        },
      ],
      { onConflict: 'phone' }
    );

  if (error) {
    console.error('Supabase error:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'No se pudo guardar la suscripción.' }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: '¡Listo! Desde mañana recibirás el Evangelio por WhatsApp.' }),
  };
};
