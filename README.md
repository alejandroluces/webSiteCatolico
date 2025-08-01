# Luz de Fe - Portal Católico

![Banner del Proyecto](public/image.png)

Luz de Fe es un portal web católico diseñado para proporcionar recursos espirituales diarios a la comunidad de habla hispana. La plataforma ofrece acceso al Evangelio del día, reflexiones, información sobre los santos, y un blog con artículos de profundización en la fe.

## ✨ Características Principales

-   **Evangelio Diario:** Acceso a las lecturas y el Evangelio del día con reflexiones.
-   **Santo del Día:** Biografías e historias inspiradoras de los santos.
-   **Blog Espiritual:** Artículos sobre teología, vida cristiana, y actualidad de la Iglesia.
-   **Diseño Moderno y Responsivo:** Interfaz limpia y accesible desde cualquier dispositivo.
-   **Modo Oscuro:** Experiencia de lectura cómoda en condiciones de poca luz.

## 🚀 Stack Tecnológico

Este proyecto está construido con tecnologías modernas, enfocado en el rendimiento y la escalabilidad.

-   **Frontend:** [React](https://react.dev/) con [Vite](https://vitejs.dev/) y [TypeScript](https://www.typescriptlang.org/)
-   **Estilos:** [Tailwind CSS](https://tailwindcss.com/) para un diseño rápido y personalizable.
-   **Backend y Base de Datos:** [Supabase](https://supabase.io/) como BaaS (Backend as a Service).
-   **Servidor (para tareas programadas):** [Node.js](https://nodejs.org/) con [Express](https://expressjs.com/).
-   **Despliegue:** [Netlify](https://www.netlify.com/) para el frontend y tareas serverless.

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
    Luego, rellena las variables con tus propias claves de Supabase:
    ```
    VITE_SUPABASE_URL=https://tu-url-de-supabase.co
    VITE_SUPABASE_ANON_KEY=tu-clave-anon-de-supabase
    ```

4.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

## 📜 Scripts Disponibles

Este proyecto incluye varios scripts para facilitar el desarrollo y el mantenimiento.

| Script                 | Descripción                                                              |
| ---------------------- | ------------------------------------------------------------------------ |
| `npm run dev`          | Inicia el servidor de desarrollo de Vite con hot-reloading.              |
| `npm run build`        | Compila la aplicación para producción en el directorio `dist`.           |
| `npm run lint`         | Analiza el código en busca de errores y problemas de estilo con ESLint.  |
| `npm run preview`      | Sirve el build de producción localmente para previsualización.           |
| `npm run content:publish` | Publica contenido programado (ej. artículos de blog).                  |
| `npm run content:check`   | Verifica si falta contenido diario en la base de datos.                  |
| `npm run content:report`  | Genera un informe sobre el estado del contenido.                         |
| `npm run update:gospel`   | Ejecuta el script para actualizar el evangelio del día.                  |
| `npm run sync:gospel`     | Sincroniza los datos del evangelio desde una fuente externa.             |
| `npm run start:server`    | Inicia el servidor Node.js para tareas programadas y procesos de fondo. |

---

Hecho con ❤️ por [Alejandro Luces](https://github.com/alejandroluces).
