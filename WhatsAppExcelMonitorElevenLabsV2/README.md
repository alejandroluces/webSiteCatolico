# Monitor de Mensajes WhatsApp

Una aplicación web moderna para el envío masivo de mensajes de WhatsApp, con soporte para archivos Excel, imágenes y mensajes de voz.

## 🌟 Características

- 📊 Importación de contactos desde archivos Excel
- 📱 Envío masivo de mensajes de WhatsApp
- 🖼️ Soporte para adjuntar imágenes (hasta 16MB)
- 🎤 Generación de mensajes de voz usando IA
- 📝 Vista previa de mensajes completos
- 🔄 Actualización dinámica de datos sin recargar
- 📊 Contador de mensajes pendientes
- ⚡ Interfaz de usuario intuitiva y responsive

## 🛠️ Tecnologías Utilizadas

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Vite
  - XLSX para manejo de archivos Excel
  - Lucide React para iconos

- **Backend:**
  - FastAPI (Python)
  - Green API para integración con WhatsApp
  - OpenAI API para generación de voz

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- Python 3.8 o superior
- Cuenta en Green API
- Cuenta en OpenAI (para la funcionalidad de voz)

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd whatsapp-excel-monitor
   ```

2. **Instalar dependencias del frontend**
   ```bash
   npm install
   ```

3. **Instalar dependencias del backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Configurar variables de entorno**
   
   Crear un archivo `.env` en la raíz del proyecto:
   ```env
   REMOVED_FRONTEND_OPENAI_KEY_ENV=tu_api_key_de_openai
   ```

   Y en la carpeta `backend`:
   ```env
   ID_INSTANCE=tu_id_de_green_api
   API_TOKEN=tu_token_de_green_api
   ```

## 🖥️ Uso

1. **Iniciar el backend**
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. **Iniciar el frontend**
   ```bash
   npm run dev
   ```

3. **Acceder a la aplicación**
   - Abrir http://localhost:5173 en el navegador

## Cómo subir cambios al repositorio

Cuando realices cambios en el proyecto, sigue estos pasos para subirlos al repositorio:

1.  **Añadir los cambios al área de preparación (staging):**
    
    ```bash
    git add .
    ```
    
2.  **Confirmar los cambios con un mensaje descriptivo:**
    
    ```bash
    git commit -m "Tu mensaje de commit aquí"
    ```
    
3.  **Subir los cambios al repositorio remoto:**
    
    ```bash
    git push
    ```
    
    Si es la primera vez que subes cambios a una rama, es posible que necesites usar:
    
    ```bash
    git push -u origin <nombre-de-la-rama>
    ```

## 📝 Formato del Archivo Excel

El archivo Excel debe contener las siguientes columnas:
- `NOMBRES`: Nombre del contacto
- `CELULAR`: Número de teléfono (formato internacional)
- `SMS`: Indicador de envío (0 = pendiente, 1 = enviado)
- `TEXTO_MENSAJE`: Contenido del mensaje a enviar

## 🔒 Seguridad

- Validación de tipos de archivo
- Límite de tamaño para archivos multimedia
- Manejo seguro de credenciales
- Validación de números de teléfono

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## 👥 Autores

- Nombre del Autor - [Perfil de GitHub](URL_DEL_PERFIL)

## 🙏 Agradecimientos

- Green API por su API de WhatsApp
- OpenAI por su API de generación de voz
- Todos los contribuidores que han participado en este proyecto

# Envío Automático de Mensajes WhatsApp

Este sistema permite automatizar el envío de mensajes de WhatsApp basado en archivos Excel con nombres de fecha.

## Estructura de Archivos

- `excel/` - Carpeta donde se deben colocar los archivos Excel e imágenes
- `autoSender.js` - Script principal de Node.js
- `run.bat` - Archivo batch para ejecutar el script

## Formato de Archivos

### Archivo Excel
1. Los archivos Excel deben:
   - Nombrarse con el formato:
     - `DDMMYYYY.xlsx` (sin audio) o
     - `DDMMYYYY_A.xlsx` (con audio)
   - Ejemplo: 
     - `22022025.xlsx` (sin audio)
     - `22022025_A.xlsx` (con audio)
   - Colocarse en la carpeta `excel/`
   - Tener las columnas: `CELULAR`, `TEXTO_MENSAJE`, `SMS`

2. Estructura de columnas:
   - `CELULAR`: Número de teléfono del destinatario (puede ser texto o número)
   - `TEXTO_MENSAJE`: Contenido del mensaje a enviar
   - `SMS`: Estado del envío (0 = pendiente, 1 = enviado)

### Imagen Adjunta (Opcional)
1. Si desea incluir una imagen en los mensajes:
   - Debe tener el mismo nombre que el archivo Excel (sin el _A)
   - Debe usar una de estas extensiones: .jpg, .jpeg, o .png
   - Ejemplo: `22022025.jpg`
   - Colocarla en la misma carpeta `excel/`
   - Tamaño máximo: 16MB

### Audio (Opcional)
1. Para incluir mensaje de voz:
   - Nombrar el archivo Excel con "_A" al final
   - Ejemplo: `22022025_A.xlsx`
   - El sistema generará automáticamente el audio del mensaje

## Configuración del Programador de Tareas de Windows

1. Abrir el Programador de Tareas de Windows
2. Crear una nueva tarea básica
3. Configurar:
   - Nombre: "Envío Automático WhatsApp"
   - Desencadenador: Diario
   - Hora: (elegir hora deseada)
   - Acción: Iniciar un programa
   - Programa/script: Ruta completa al archivo `run.bat`

## Notas Importantes

- El script buscará primero un archivo Excel con "_A" y luego sin "_A"
- Si existe una imagen con el mismo nombre, se adjuntará a todos los mensajes
- Si el archivo tiene "_A", se generará y enviará un mensaje de voz
- Solo procesará mensajes donde SMS = 0
- Se mantiene un registro en la consola de los mensajes enviados
- Hay una pausa de 1 segundo entre mensajes para evitar sobrecarga
- **Manejo de errores**: Si ocurre un error con un contacto, el script continuará con el siguiente
- **Formato de teléfonos**: El script maneja automáticamente diferentes formatos de números
- Al final del proceso se muestra un resumen detallado con los errores encontrados
