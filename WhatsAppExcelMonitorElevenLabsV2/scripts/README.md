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
   - `SMS`: Estado del envío (0 = pendiente, 1 = enviado).

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
- ✅ **Después de enviar exitosamente, el script marca `SMS=1` y guarda el Excel** para evitar reenvíos en próximas ejecuciones.
- Se mantiene un registro en la consola de los mensajes enviados
- Hay una pausa de 1 segundo entre mensajes para evitar sobrecarga
- **Manejo de errores**: Si ocurre un error con un contacto, el script continuará con el siguiente
- **Formato de teléfonos**: El script maneja automáticamente diferentes formatos de números
- Al final del proceso se muestra un resumen detallado con los errores encontrados

## Sincronizar suscriptores (Supabase) -> Excel

En este repo existe un script que toma los suscriptores activos desde Supabase
(tabla `whatsapp_subscriptions`) y los agrega al Excel del día
`scripts/excel/DDMMYYYY.xlsx` si aún no existen en el archivo.

Esto permite mantener el flujo actual de envío (incluida la **imagen**):

- Mensaje: viene desde la columna `TEXTO_MENSAJE`.
- Imagen: se envía automáticamente si existe `DDMMYYYY.png/.jpg/.jpeg` en la misma carpeta `excel/`.

### Ejemplo

Desde la raíz del repo:

```bash
python scripts/syncWhatsappSubscribersToExcel.py --date 01082025
```

Para ver qué haría sin modificar el archivo:

```bash
python scripts/syncWhatsappSubscribersToExcel.py --date 01082025 --dry-run
```
