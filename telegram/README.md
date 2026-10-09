# Emisor diario de Telegram

Servicio independiente, sin dependencias npm, para el Cron Job de Render.
Root Directory: `telegram`. Node 22. Build: `node --check scripts/telegramSender.js`.
Command: `node scripts/telegramSender.js --execute`.

Configuración, secretos, recuperación y horario: [guía operativa](../docs/TELEGRAM_RENDER.md).
Las variables se definen en Render; no se copian credenciales a esta carpeta.

Desde la raíz del repositorio:

```powershell
npm run test:telegram
node --env-file=.env telegram/scripts/telegramSender.js --check
```

La preparación del contenido permanece en `scripts/`. Este servicio solo publica
contenido ya disponible en Supabase y registra el resultado para evitar duplicados.

La imagen fija del evangelio es `assets/Santisimo.png`, copia exacta de
`public/images/Santisimo.png`. Se sube como foto antes del texto y no requiere URL
pública. Mantener ambas copias sincronizadas al reemplazar la imagen.
