# Migración de WhatsApp a Telegram en el Cron Job existente

## Estado de configuración

El servicio se ha separado del monitor antiguo en `telegram/`. La carpeta histórica
se conserva solo como copia local en `.local-archive/WhatsAppExcelMonitorElevenLabsV2/`,
ignorada por Git. Las exportaciones opcionales del pipeline usan `data/content-excel/`.
El modo `send-excel` y su workflow de GitHub se retiran; no hay envío desde Excel.

- Canal confirmado: `@caminodefecl`.
- Bot creado: `@caminodefecl_bot`.
- Migración aplicada al proyecto `ecvrpjjytwhdovoibouo` desde el SQL Editor.
  Se verificó RLS activado, acceso público denegado y lectura del registro por
  la API REST con la clave de servidor. La ejecución desde SQL Editor no registra
  automáticamente la versión en `supabase_migrations`; reconciliar ese historial
  antes de un futuro `db push` para no intentar crear otra vez la tabla.
- Render: secretos configurados en el servicio existente. El 6 de octubre de
  2026, `--check` terminó correctamente con `status=ready` y cuatro mensajes.
  Comando activado: `node scripts/telegramSender.js --execute`.
- Primera publicación real completada el 6 de octubre de 2026: evangelio,
  oración y sus dos audios. Una segunda ejecución devolvió `already_sent`,
  confirmando que no vuelve a publicar el contenido de ese día.

## Configuración final de Render

- Servicio: `webSiteCatolico`, tipo Cron Job, plan Starter.
- Repositorio: `alejandroluces/webSiteCatolico`, rama `master`.
- Root Directory: `telegram`.
- Build Command requerido para el PDF personalizado: `npm ci && node --check scripts/telegramSender.js`.
- Command: `node scripts/telegramSender.js --execute`.
- Schedule: `30 09 * * *` (09:30 UTC, todos los días).
- Auto-Deploy: On Commit.

El horario real es 09:30 UTC, no las 07:00 Santiago descritas por la antigua
función de Netlify. Se conserva el horario de Render: la hora local de Chile
variará con el horario de verano. `TELEGRAM_TIMEZONE` determina la fecha del
contenido, no cambia el horario del cron.

## Activación

1. Crear un canal de Telegram. Crear un bot mediante `@BotFather` (`/newbot`).
   Agregarlo al canal como administrador con permiso para publicar mensajes.
2. Aplicar en Supabase la migración
   `supabase/migrations/20261005163859_create_telegram_publications.sql`.
   Revisar y aplicar solo esta migración si el historial remoto y el local no
   están sincronizados; no ejecutar todas las migraciones antiguas a ciegas.
   La tabla tiene RLS y permisos únicamente para `service_role`.
3. Publicar los cambios del repositorio en la rama conectada de Render.
   La migración a Telegram está desplegada desde el commit `773b797`.
4. En **el mismo servicio** de Render, usar Root Directory `telegram` y conservar Schedule.
   Usar Node 22 (por ejemplo `NODE_VERSION=22`). No crear otro Cron Job.
   Instalar las dependencias del PDF usando Build Command
   `npm ci && node --check scripts/telegramSender.js`.
   Command inicial: `node scripts/telegramSender.js --check`.
5. Configurar las variables indicadas abajo. Ejecutar Trigger Run con `--check`:
   comprueba contenido del día, permisos del bot y acceso al registro; no publica.
6. Tras comprobar el resultado `ready`, establecer `TELEGRAM_ENABLED=true` y
   Command: `node scripts/telegramSender.js --execute`. Trigger Run publicará
   el contenido del día; las siguientes ejecuciones del mismo día lo omitirán.
7. Reconstruir la web en Netlify. El canal confirmado es
   `https://t.me/caminodefecl`, usado por defecto. `VITE_TELEGRAM_CHANNEL_URL`
   permite cambiarlo; un enlace configurado inválido muestra «Próximamente».

### Variables en Render

| Variable | Valor |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` | Secreto entregado por BotFather; nunca `VITE_` |
| `TELEGRAM_CHANNEL_ID` | `@caminodefecl` (canal indicado por el propietario) |
| `SUPABASE_URL` | URL HTTPS del proyecto existente |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servidor del mismo proyecto; nunca `VITE_` |
| `TELEGRAM_ENABLED` | `false` para preparar; `true` para publicar |
| `TELEGRAM_TIMEZONE` | `America/Santiago` |
| `TELEGRAM_INCLUDE_AUDIO` | `true` (reutiliza audios disponibles; no genera voces) |
| `TELEGRAM_INCLUDE_IMAGE` | `true` (adjunta siempre Santisimo.png) |
| `TELEGRAM_INCLUDE_PDF` | `true` por defecto (PDF de Camino de Fe con Evangelio y lecturas de Dominicos) |
| `TELEGRAM_SITE_URL` | Dominio HTTPS de la web; necesario si un audio usa ruta relativa |
| `WHATSAPP_ENABLED` | `false` |

Los secretos se introducen en Environment del servicio, no se suben al repositorio.
No se necesitan las credenciales de Green API ni ElevenLabs para Telegram.

## Contenido y recuperación

El emisor lee `daily_content`: `type=gospel`, `is_active=true`, `status=published`
y fecha de Santiago. Exige evangelio y oración no vacíos. Publica `telegram/assets/Santisimo.png`,
evangelio, oración y los dos audios existentes si están disponibles. Los textos
largos se dividen y los mensajes se espacian. Los audios deben ser accesibles
por HTTPS para Telegram y cumplir sus límites de tamaño/formato. Un error de
archivo queda visible como fallo del cron; no se omite silenciosamente.

La preparación de contenido debe seguir ejecutándose antes del envío diario.
Este cron extrae las lecturas de la página de Dominicos de la fecha solicitada
y genera un PDF con el logo, azul mariano y dorado de Camino de Fe, después de los
audios. Incluye primera lectura, salmo, segunda lectura cuando exista y Evangelio,
sin reflexión, anuncios ni vídeos. Valida la generación antes de iniciar el envío.
Guarda las lecturas en el plan original para poder regenerar el PDF en un reintento
sin consultar de nuevo Dominicos. Los planes antiguos con una URL de PDF oficial
siguen siendo compatibles. No requiere cambios en el esquema de la base de datos.
Un fallo de Dominicos detiene la preparación y requiere reintentar el cron; no se
marca el día como enviado. `TELEGRAM_INCLUDE_PDF=false` desactiva el adjunto.
No genera contenido ni consume APIs de IA. No depende
de archivos Excel locales ni de archivos JSON fuera del directorio de Render.

El registro guarda el plan original y cada ID confirmado. Su clave única es
canal/fecha; incluso con dos procesos solo uno inicia o retoma una publicación.

- `sent`: ya completado; no se vuelve a enviar aunque cambie el contenido.
- `failed`: Telegram rechazó explícitamente una parte; corregir el problema y
  ejecutar de nuevo retoma desde la primera parte pendiente.
- `sending` o `uncertain`: no reintentar automáticamente. Puede haberse publicado
  un mensaje sin haber podido guardar la confirmación (timeout, caída del proceso
  o fallo de Supabase). Revisar primero el canal y los logs.

Para recuperar un resultado incierto, detener/suspender el cron y comprobar que
no haya una ejecución activa. Revisar `messages`, `next_index` y `message_ids` en
la fila correspondiente. Si la parte pendiente no llegó, cambiar `status` a
`failed`. Si llegó, añadir su ID a `message_ids`, incrementar `next_index` y pasar
a `failed` (o `sent` si todas llegaron), en una sola actualización. Reanudar.
No borrar registros ni reiniciar índices sin comprobar el canal. Telegram y
Supabase no comparten una transacción: no se promete entrega exactamente una vez
en un fallo de red; se prioriza evitar duplicados y exigir revisión en ese caso.

## Pruebas locales sin enviar

Desde la raíz del repositorio:

```powershell
npm run test:telegram
npm run telegram:preview -- --date=2026-10-05 --file=public/images/gospels/05102026.json
```

Para validar contra servicios reales con variables en `.env` (Node >=20):

```powershell
node --env-file=.env telegram/scripts/telegramSender.js --check
node --env-file=.env telegram/scripts/telegramSender.js --dry-run
```

`--dry-run` nunca escribe en Supabase ni llama a Telegram. `--file` solo está
permitido para esa vista previa. `--check` hace lecturas; no publica ni reserva
el envío. El token no se imprime en errores de conexión.

## Retirada del envío anterior y costos

El formulario público se sustituye por el enlace al canal. El workflow de GitHub,
el monitor y el emisor de Excel se retiran del código. Las funciones WhatsApp
restantes quedan desactivadas salvo `WHATSAPP_ENABLED=true` explícito, sin programación en Netlify.
Esto solo entra en vigor al desplegar; revisar también tareas externas configuradas
fuera del repositorio. Los suscriptores deben unirse al canal por voluntad propia;
los teléfonos existentes no se convierten automáticamente en miembros.

Telegram no cobra por estas publicaciones y el script deshabilita explícitamente
los broadcasts de pago. Render mantiene su mínimo de 1 USD/mes por Cron Job,
más consumo aplicable. Reutilizar el servicio evita crear otro trabajo facturable,
pero no convierte Render en gratuito. Supabase conserva sus cuotas/costos vigentes.

Fuentes: https://render.com/docs/cronjobs, https://core.telegram.org/bots/faq,
https://core.telegram.org/bots/api.

## Imagen fija del evangelio (2026-10-09)

Se adjunta `Santisimo.png` antes del evangelio mediante subida multipart a Telegram.
`telegram/assets/Santisimo.png` es una copia exacta de `public/images/Santisimo.png`,
incluida en el servicio porque Render despliega la raíz `telegram/`. Si se reemplaza
el original, actualizar también esta copia y desplegar. No usa `daily_content.image_url`.
`TELEGRAM_INCLUDE_IMAGE=false` permite desactivar la foto expresamente.
Las publicaciones ya completadas no se repiten; los envíos parciales conservan su plan original.
