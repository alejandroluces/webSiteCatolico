# Camino de Fe - Portal Católico

![Banner del Proyecto](public/image.png)

Camino de Fe es un portal web católico diseñado para proporcionar recursos espirituales diarios a la comunidad de habla hispana. La plataforma ofrece acceso al Evangelio del día, reflexiones, información sobre los santos, un rosario interactivo y un blog con artículos de profundización en la fe.

## ✨ Características Principales

-   **Contenido Diario:**
    -   **Evangelio del Día:** Acceso a las lecturas y el Evangelio del día con reflexiones generadas por IA.
    -   **Santo del Día:** Biografías e historias inspiradoras de los santos.
-   **Rosario Interactivo:** Una experiencia inmersiva para rezar el rosario, con guías visuales y seguimiento de las oraciones.
-   **Blog Espiritual:** Artículos sobre teología, vida cristiana, y actualidad de la Iglesia.
-   **Diseño Moderno y Responsivo:** Interfaz limpia y accesible desde cualquier dispositivo.
-   **Modo Oscuro:** Experiencia de lectura cómoda en condiciones de poca luz.

## 🚀 Stack Tecnológico

Este proyecto está construido con tecnologías modernas, enfocado en el rendimiento y la escalabilidad.

-   **Frontend:** [React](https://react.dev/) con [Vite](https://vitejs.dev/) y [TypeScript](https://www.typescriptlang.org/)
-   **Estilos:** [Tailwind CSS](https://tailwindcss.com/) para un diseño rápido y personalizable.
-   **Backend y Base de Datos:** [Supabase](https://supabase.io/) como BaaS (Backend as a Service).
-   **Storage de Audios:** [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) recomendado para MP3 y archivos estáticos pesados.
-   **Inteligencia Artificial:** [Google Gemini](https://ai.google/) para la generación de reflexiones.
-   **Servidor (para tareas programadas):** [Node.js](https://nodejs.org/) con [Express](https://expressjs.com/).
-   **Despliegue:** [Netlify](https://www.netlify.com/) para el frontend y tareas serverless.

## 📁 Estructura del Proyecto

El proyecto está organizado en las siguientes carpetas principales:

-   `src/`: Contiene el código fuente de la aplicación principal de React.
    -   `components/`: Componentes reutilizables de la interfaz.
    -   `pages/`: Componentes que representan las páginas de la aplicación.
    -   `services/`: Lógica para interactuar con servicios externos como Supabase y Gemini.
    -   `hooks/`: Hooks personalizados de React.
-   `interactive-rosary/`: Contiene el código fuente del subproyecto del Rosario Interactivo.
-   `scripts/`: Scripts de Node.js para tareas de mantenimiento y gestión de contenido.
-   `public/`: Archivos estáticos como imágenes y fuentes.
-   `netlify/functions/`: Funciones serverless para Netlify.
-   `supabase/migrations/`: Migraciones de la base de datos de Supabase.

## 🛠️ Instalación y Uso Local

Para ejecutar este proyecto en tu entorno local, sigue estos pasos:

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/alejandroluces/webSiteCatolico.git
    cd webSiteCatolico
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto, copiando el contenido de `.env.example`.
    ```bash
    cp .env.example .env
    ```
    Luego, rellena las variables con tus propias claves de Supabase y otros servicios.

4.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

## 📲 WhatsApp (Suscripción + Envío) en local

### Levantar el proyecto con Functions (recomendado para probar WhatsApp)

Para que funcionen los endpoints `/.netlify/functions/*` en tu PC, debes usar el proxy de Netlify:

```bash
npm run dev:netlify
```

> Importante: no ejecutes `npm run dev` al mismo tiempo, porque puede ocupar el puerto 5173 y Netlify dev terminará levantando Vite en otro puerto.

Abre la web en:
- **http://localhost:8888**

> Nota: `http://localhost:5173` es el Vite interno. Ahí `/.netlify/functions/*` dará 404.

### Variables necesarias para enviar WhatsApp

En tu `.env` (no commitear), agrega:

```env
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

GREEN_API_ID_INSTANCE=...
GREEN_API_TOKEN=...
GREEN_API_API_URL=https://7105.api.greenapi.com
```

## 📲 WhatsApp en Producción (Netlify)

Si en producción ves el error **"Backend no configurado (Supabase)."** al intentar suscribirte,
significa que a tu sitio en Netlify le faltan variables de entorno.

Configúralas en:
**Netlify → Site settings → Build & deploy → Environment → Environment variables**

Variables mínimas requeridas por `/.netlify/functions/whatsapp-subscribe`:

- `SUPABASE_URL` (o alternativamente `VITE_SUPABASE_URL`)
- `SUPABASE_SERVICE_ROLE_KEY`

### ✉️ Notificación por correo al suscribirse (EmailJS)

El endpoint `/.netlify/functions/whatsapp-subscribe` ahora puede enviar una **notificación por correo**
cada vez que alguien se suscribe para recibir el Evangelio por WhatsApp.

#### 1) Crear el template en EmailJS

En EmailJS:
1. **Email Services**: crea/conecta tu servicio (por ejemplo Gmail) y copia el **Service ID**.
2. **Email Templates**: crea un template y copia el **Template ID**.
3. Ve a tu cuenta/keys y copia:
   - **Public Key**
   - **Private Key** (a veces aparece como **Access Token**)

En el template, usa estas variables (template params) según lo que envía la función:

- `{{to_email}}`  (correo donde quieres recibir la notificación)
- `{{first_name}}`
- `{{last_name}}`
- `{{phone}}`
- `{{email}}`
- `{{subscribed_at}}`
- `{{source}}`
- `{{channel}}`

> Importante: configura el campo **To Email** del template como `{{to_email}}`.

#### 2) Variables de entorno en Netlify

En **Netlify → Site settings → Build & deploy → Environment → Environment variables**, agrega:

```env
NOTIFICATION_EMAIL=tu_correo@dominio.com

EMAILJS_SERVICE_ID=service_xxx
EMAILJS_TEMPLATE_ID=template_xxx
EMAILJS_PUBLIC_KEY=xxxxx
EMAILJS_PRIVATE_KEY=xxxxx
```

> Seguridad: `EMAILJS_PRIVATE_KEY` **NO** debe ir al frontend. Está pensado para ejecutarse solo en la function.

##### Si ves error 403 (bloqueo server-side)

Si en logs aparece:
`API calls are disabled for non-browser applications`

Tu cuenta/plan de EmailJS está bloqueando envíos desde backend/serverless.

En ese caso, este repo también soporta notificación **desde el navegador** (frontend) usando solo:

```env
VITE_EMAILJS_SERVICE_ID=service_xxx
VITE_EMAILJS_TEMPLATE_ID=template_xxx
VITE_EMAILJS_PUBLIC_KEY=xxxxx
VITE_NOTIFICATION_EMAIL=tu_correo@dominio.com
```

> Nota: el envío desde backend queda deshabilitado por defecto. Para habilitarlo (si tu plan lo permite), configura:
> `EMAILJS_ENABLE_SERVER=1`

#### 3) Prueba en local

1. Copia `.env.example` a `.env` y completa las variables.
2. Levanta con funciones:
```bash
npm run dev:netlify
```
3. Abre: **http://localhost:8888** y suscríbete.

Si la suscripción se guarda pero no llega el correo, revisa la consola/logs de Netlify dev
(`EmailJS notification failed ...`).

> Nota: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` son para el frontend.
> La función serverless necesita la **service role** para escribir en la tabla `whatsapp_subscriptions`.

### Si aparece error RLS (42501)

Si en Netlify Logs ves algo como:
`new row violates row-level security policy for table "whatsapp_subscriptions" (42501)`

Entonces Supabase está bloqueando el INSERT por políticas RLS.

Opciones:
1) **Recomendado (más simple y robusto):** permitir `INSERT` para roles `anon/authenticated` en la tabla.
   Hay una migración lista en el repo:
   `supabase/migrations/20251227_allow_anon_insert_whatsapp_subscriptions.sql`

   **Nota importante:** el endpoint usa `upsert` (INSERT con ON CONFLICT DO UPDATE).
   Para que `upsert` funcione con RLS, normalmente también necesitas permitir `UPDATE`.
   La migración ya incluye la policy `whatsapp_subscriptions_anon_update`.

2) Alternativa: asegurar que la function esté usando realmente `SUPABASE_SERVICE_ROLE_KEY`
   (sin comillas / sin `;`, y que corresponda al mismo proyecto).

### Pausar/Reanudar suscripciones (bloqueo temporal)

Si quieres **bloquear temporalmente** que se registren nuevos suscriptores, puedes
quitar las policies `anon/authenticated` en Supabase.

- Bloquear (deshabilitar suscripción pública):
  - `supabase/scripts/block_whatsapp_subscriptions.sql`
- Desbloquear (habilitar suscripción pública):
  - `supabase/scripts/unblock_whatsapp_subscriptions.sql`

Ejecuta esos scripts en **Supabase → SQL Editor**.

### Probar envío manual (sin esperar a las 07:00)

Con `npm run dev:netlify` corriendo:

```bash
npm run test:whatsapp:send
# o con fecha específica
node scripts/testWhatsAppSend.js --date=2025-12-25
```

Esto llama a:
`/.netlify/functions/whatsapp-send-daily-gospel?force=1`

## 📄 Sincronizar suscriptores (Supabase) -> Excel (rango de fechas)

Además del script por día (`scripts/syncWhatsappSubscribersToExcel.py`), existe un wrapper
para procesar un rango completo:

```bash
python scripts/syncWhatsappSubscribersToExcelRange.py --from-date 01082025 --to-date 07082025
```

Opciones útiles:

- Simular sin escribir archivos:
```bash
python scripts/syncWhatsappSubscribersToExcelRange.py --from-date 01082025 --to-date 07082025 --dry-run
```

- Pasar una carpeta distinta de excels:
```bash
python scripts/syncWhatsappSubscribersToExcelRange.py --from-date 01082025 --to-date 07082025 --excel-folder "WhatsAppExcelMonitorElevenLabsV2/scripts/excel"
```

## ☁️ Migrar audios a Cloudflare R2

Si quieres dejar de pagar almacenamiento en Supabase por los MP3 del Evangelio, el proyecto ya queda preparado para usar **Cloudflare R2**.

### 1) Configurar variables de entorno

Agrega en tu `.env`:

```env
AUDIO_STORAGE_PROVIDER=r2
R2_ACCOUNT_ID=tu_account_id
R2_ACCESS_KEY_ID=tu_access_key_id
R2_SECRET_ACCESS_KEY=tu_secret_access_key
R2_BUCKET_NAME=tu_bucket
R2_PUBLIC_BASE_URL=https://tu-dominio-publico-r2
R2_AUDIO_PREFIX=audio_content
```

> `R2_PUBLIC_BASE_URL` puede ser un dominio custom de R2 o la URL pública `*.r2.dev` del bucket.

### 2) Migrar audios existentes

Primero ejecuta una simulación:

```bash
npm run audio:migrate:r2:dry
```

Si todo se ve bien, ejecuta la migración real:

```bash
npm run audio:migrate:r2
```

También puedes limitar o filtrar por fechas:

```bash
node scripts/migrateAudioToR2.js --from-date=2025-09-01 --to-date=2025-09-30 --limit=20
```

### Si Supabase quedó bloqueado por quota de storage

Si el proyecto de Supabase ya no deja consultar `daily_content` por `exceed_storage_size_quota`, usa el fallback local:

```bash
npm run audio:local-to-r2:dry
```

Eso toma los MP3 existentes en `public/audio`, simula la subida a R2 y genera un archivo SQL (`data/r2_audio_updates.sql`) con los `UPDATE` necesarios para `daily_content`.

Cuando quieras hacer la subida real:

```bash
npm run audio:local-to-r2
```

Después, cuando Supabase vuelva a estar disponible, ejecuta el SQL generado en **Supabase SQL Editor**.

### 3) Nuevos audios

Una vez configurado `AUDIO_STORAGE_PROVIDER=r2`, el script `scripts/updateDailyGospel.js` dejará de subir los nuevos MP3 a Supabase Storage y los publicará directamente en R2.

### 4) Liberar espacio en Supabase

Cuando confirmes que los audios ya cargan bien desde R2, recién ahí elimina los archivos viejos del bucket `audio_content` de Supabase.

Puedes hacerlo de forma segura así:

```bash
npm run audio:supabase:cleanup:dry
```

Eso lista los objetos detectados en `audio_content/audio_content/` sin borrar nada.

Si el resultado te parece correcto, ejecuta el borrado real:

```bash
npm run audio:supabase:cleanup
```

> Recomendación: primero verifica que varias URLs desde R2 funcionen bien y que el SQL de `data/r2_audio_updates.sql` ya fue aplicado a `daily_content`.


## 📜 Scripts Disponibles

Este proyecto incluye varios scripts para facilitar el desarrollo y el mantenimiento.

| Script                  | Descripción                                                              |
| ----------------------- | ------------------------------------------------------------------------ |
| `npm run dev`           | Inicia el servidor de desarrollo de Vite con hot-reloading.              |
| `npm run build`         | Compila la aplicación para producción en el directorio `dist`.           |
| `npm run lint`          | Analiza el código en busca de errores y problemas de estilo con ESLint.  |
| `npm run preview`       | Sirve el build de producción localmente para previsualización.           |
| `npm run content:publish` | Publica contenido programado (ej. artículos de blog).                  |
| `npm run content:check`   | Verifica si falta contenido diario en la base de datos.                  |
| `npm run content:report`  | Genera un informe sobre el estado del contenido.                         |
| `npm run update:gospel`   | Ejecuta el script para actualizar el evangelio del día.                  |
| `npm run sync:gospel`     | Sincroniza los datos del evangelio desde una fuente externa.             |
| `npm run audio:migrate:r2` | Migra los audios históricos de Supabase/local a Cloudflare R2.         |
| `npm run audio:migrate:r2:dry` | Simula la migración de audios a Cloudflare R2.                    |
| `npm run audio:local-to-r2` | Sube los MP3 de `public/audio` a R2 y genera SQL de actualización.    |
| `npm run audio:local-to-r2:dry` | Simula la subida local a R2 y genera SQL de actualización.      |
| `npm run audio:supabase:cleanup:dry` | Simula el borrado de audios viejos en Supabase Storage.   |
| `npm run audio:supabase:cleanup` | Borra los audios viejos del bucket de Supabase Storage.       |
| `npm run start:server`    | Inicia el servidor Node.js para tareas programadas y procesos de fondo. |
| `node scripts/runGospelUpdateRange.js` | Actualiza los evangelios para un rango de fechas específico de forma interactiva. |

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar este proyecto, por favor sigue estos pasos:

1.  Haz un fork del repositorio.
2.  Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3.  Realiza tus cambios y haz commit (`git commit -m 'Añade nueva funcionalidad'`).
4.  Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5.  Abre un Pull Request.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

Hecho con ❤️ por [Alejandro Luces](https://github.com/alejandroluces).
