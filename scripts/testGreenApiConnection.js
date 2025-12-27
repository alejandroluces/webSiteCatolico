/**
 * Verifica conexión con Green API (estado de la instancia).
 *
 * Requiere en .env:
 *   GREEN_API_ID_INSTANCE
 *   GREEN_API_TOKEN
 */

import 'dotenv/config';

const cleanEnv = (v) => (v || '').trim().replace(/^['\"]|['\"]$/g, '').replace(/;$/, '').trim();

const ID = cleanEnv(process.env.GREEN_API_ID_INSTANCE);
const TOKEN = cleanEnv(process.env.GREEN_API_TOKEN);
const API_URL = cleanEnv(process.env.GREEN_API_API_URL);

async function main() {
  if (!ID || !TOKEN) {
    console.error('Faltan variables: GREEN_API_ID_INSTANCE / GREEN_API_TOKEN');
    process.exit(1);
  }

  const derivedHostPrefix = ID.slice(0, 4);
  const defaultApiHost = `https://${derivedHostPrefix}.api.greenapi.com`;
  const apiHost = API_URL || defaultApiHost;

  const base = `${apiHost}/waInstance${ID}`;

  const urls = {
    state: `${base}/getStateInstance/${TOKEN}`,
    status: `${base}/getStatusInstance/${TOKEN}`,
  };

  for (const [name, url] of Object.entries(urls)) {
    const resp = await fetch(url);
    const text = await resp.text();
    console.log(`\n[${name}] HTTP ${resp.status}`);
    console.log(text);
  }

  console.log('\nTip: si te da 401, revisa que el ID_INSTANCE y API_TOKEN pertenezcan a la misma instancia en Green API y que la instancia esté autorizada (QR) y online.');
}

main().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
