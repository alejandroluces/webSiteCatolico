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

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

> Nota: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` son para el frontend.
> La función serverless necesita la **service role** para escribir en la tabla `whatsapp_subscriptions`.

### Probar envío manual (sin esperar a las 07:00)

Con `npm run dev:netlify` corriendo:

```bash
npm run test:whatsapp:send
# o con fecha específica
node scripts/testWhatsAppSend.js --date=2025-12-25
```

Esto llama a:
`/.netlify/functions/whatsapp-send-daily-gospel?force=1`


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
