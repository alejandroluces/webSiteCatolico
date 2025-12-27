import 'dotenv/config';

/**
 * Prueba envío directo a Green API (sin pasar por Supabase ni por Functions).
 *
 * Uso:
 *   node scripts/testGreenApiSendMessage.js --to=569XXXXXXXX --text="hola"
 *
 * Requiere en .env:
 *   GREEN_API_ID_INSTANCE
 *   GREEN_API_TOKEN
 *   GREEN_API_API_URL (recomendado) e.g. https://7105.api.greenapi.com
 */

const cleanEnv = (v) => (v || '').trim().replace(/^['"]|['"]$/g, '').replace(/;$/, '').trim();

function getArg(name) {
  const prefix = `--${name}=`;
  const found = process.argv.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : undefined;
}

async function main() {
  const ID = cleanEnv(process.env.GREEN_API_ID_INSTANCE);
  const TOKEN = cleanEnv(process.env.GREEN_API_TOKEN);
  const API_URL = cleanEnv(process.env.GREEN_API_API_URL);

  if (!ID || !TOKEN) {
    console.error('Faltan variables: GREEN_API_ID_INSTANCE / GREEN_API_TOKEN');
    process.exit(1);
  }

  const to = getArg('to');
  const text = getArg('text') || 'Prueba WhatsApp desde Green API';
  if (!to) {
    console.error('Uso: node scripts/testGreenApiSendMessage.js --to=569XXXXXXXX --text="hola"');
    process.exit(1);
  }

  const digits = String(to).replace(/\D/g, '');
  const chatId = `${digits}@c.us`;

  const derivedHostPrefix = ID.slice(0, 4);
  const defaultApiHost = `https://${derivedHostPrefix}.api.greenapi.com`;
  const apiHost = API_URL || defaultApiHost;
  const url = `${apiHost}/waInstance${ID}/sendMessage/${TOKEN}`;

  const payload = { chatId, message: text };

  console.log('POST', url);
  console.log('payload', payload);

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const respText = await resp.text();
  console.log('HTTP', resp.status);
  console.log(respText);

  if (!resp.ok) process.exit(1);
}

main().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});

