import 'dotenv/config';

/**
 * Script de prueba: dispara el envío del Evangelio por WhatsApp usando la Function local.
 *
 * Requisitos:
 * 1) Tener corriendo `npm run dev:netlify` (server en http://localhost:8888)
 * 2) Tener configuradas env vars (en tu `.env`):
 *    - SUPABASE_URL
 *    - SUPABASE_SERVICE_ROLE_KEY
 *    - GREEN_API_ID_INSTANCE
 *    - GREEN_API_TOKEN
 * 3) Tener al menos 1 suscriptor activo en la tabla `whatsapp_subscriptions`.
 * 4) Tener un evangelio activo en `daily_content` para la fecha que pruebes.
 *
 * Uso:
 *   node scripts/testWhatsAppSend.js
 *   node scripts/testWhatsAppSend.js --date=2025-12-25
 *
 * Nota:
 *   Este script usa `force=1` para enviar fuera de la ventana horaria de las 07:00.
 */

const DEFAULT_BASE_URL = 'http://localhost:8888';

function getArg(name) {
  const prefix = `--${name}=`;
  const found = process.argv.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : undefined;
}

async function main() {
  const date = getArg('date');
  const baseUrl = getArg('baseUrl') || DEFAULT_BASE_URL;

  const url = new URL('/.netlify/functions/whatsapp-send-daily-gospel', baseUrl);
  url.searchParams.set('force', '1');
  if (date) url.searchParams.set('date', date);

  console.log('Disparando envío:', url.toString());

  const resp = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  const text = await resp.text();
  console.log('HTTP', resp.status);
  console.log(text);

  if (!resp.ok) process.exit(1);
}

main().catch((e) => {
  console.error('Error ejecutando testWhatsAppSend:', e);
  process.exit(1);
});
