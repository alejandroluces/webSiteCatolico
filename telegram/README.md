# Emisor diario de Telegram

Servicio independiente para el Cron Job de Render.
Root Directory: `telegram`. Node 22. Build: `npm ci && node --check scripts/telegramSender.js`.
Command: `node scripts/telegramSender.js --execute`.

Configuración, secretos, recuperación y horario: [guía operativa](../docs/TELEGRAM_RENDER.md).
Las variables se definen en Render; no se copian credenciales a esta carpeta.

Desde la raíz del repositorio:

```powershell
npm run test:telegram
node --env-file=.env telegram/scripts/telegramSender.js --check
```

La preparación del contenido permanece en `scripts/`. Este servicio solo publica
los textos y audios ya disponibles en Supabase y registra el resultado para evitar duplicados.

También genera un PDF de Camino de Fe con el Evangelio y las lecturas del día.
Extrae únicamente primera lectura, salmo, segunda lectura cuando exista y Evangelio
de Dominicos para la fecha del envío (incluidos domingos y fiestas), sin reflexiones.
Usa la identidad de la cabecera de la web (cruz dorada y marca Camino de Fe),
dibujada en vector, con título y fecha centrados y un botón enlazado a caminodefe.cl.
Cheerio extrae el contenido y PDFKit compone el documento, sin Python ni navegador.
Las lecturas se guardan con el plan del envío para que un reintento use el mismo texto.
`TELEGRAM_INCLUDE_PDF=false` permite desactivar este adjunto; por defecto está activo.
`--check` y `--dry-run` comprueban la extracción y generación sin publicar. Si faltan lecturas o falla
Dominicos, la preparación falla antes de enviar mensajes; el cron debe reintentarse.
Las fechas ya marcadas como `sent` no reciben un PDF retroactivo.

La imagen fija del evangelio es `assets/Santisimo.png`, copia exacta de
`public/images/Santisimo.png`. Se sube como foto antes del texto y no requiere URL
pública. Mantener ambas copias sincronizadas al reemplazar la imagen.
