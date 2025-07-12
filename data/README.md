# Directorio de Datos

Este directorio contiene los archivos de datos utilizados por el sistema de actualización automática del evangelio del día.

## Estructura del Archivo Excel

El archivo `gospels.xlsx` debe tener la siguiente estructura:

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| I | Fecha (DD/MM/YYYY) | 22/06/2025 |
| J | Título del evangelio | La multiplicación de los panes |
| K | Referencia bíblica | Lucas 9, 11-17 |
| L | Texto del evangelio | En aquel tiempo, Jesús habló del Reino de Dios... |
| M | Oración del día | Señor Jesús, que multiplicaste los panes... |
| N | Ruta de la imagen | /images/gospels/multiplicacion-panes.jpg |

## Instrucciones

1. Actualice este archivo regularmente con los evangelios para las próximas fechas
2. Asegúrese de que las fechas estén en formato DD/MM/YYYY
3. Las imágenes referenciadas deben estar en la carpeta `public/images/gospels/`
4. El sistema leerá este archivo diariamente a la 1:00 AM para actualizar el evangelio del día

## Notas Importantes

- No elimine ni renombre este archivo
- Mantenga un respaldo de este archivo
- Las reflexiones se generarán automáticamente con Google Gemini AI