# WebSiteCatolico

Este proyecto es una aplicación web que muestra contenido religioso, incluyendo el Evangelio del día, el Santo del día y un blog.

## Despliegue en Netlify

Para desplegar este proyecto en Netlify, es necesario configurar las siguientes variables de entorno:

1.  **Inicia sesión en tu cuenta de Netlify.**
2.  **Navega al panel de control de tu sitio.**
3.  **Ve a "Site settings" > "Build & deploy" > "Environment".**
4.  **Haz clic en "Edit variables" y añade lo siguiente:**
    *   `VITE_SUPABASE_URL`: La URL de tu proyecto de Supabase.
    *   `VITE_SUPABASE_ANON_KEY`: Tu clave anónima de Supabase.

Después de añadir estas variables, necesitarás volver a desplegar tu sitio para que los cambios surtan efecto. Esto permitirá que la aplicación se conecte a Supabase y obtenga las lecturas del evangelio diarias como se espera.
