# Directorio de Datos

Este directorio (`/data/public/images/gospels/`) contiene los archivos de datos utilizados por el sistema de actualización automática del evangelio del día.

## Estructura de los Archivos

El sistema utiliza un archivo JSON por cada día para el contenido diario.

*   **Nombre del archivo:** Debe seguir el formato `DDMMYYYY.json` (ej. `01092025.json`).
*   **Ubicación:** Los archivos deben estar en la carpeta `data/public/images/gospels/`.

### Contenido del Archivo JSON

Toda la información para un día específico debe estar contenida en el archivo JSON correspondiente, con la siguiente estructura:

```json
{
  "date": "2025-09-01",
  "formattedDate": "lunes, 1 de septiembre de 2025",
  "gospel": {
    "title": "Evangelio según san Lucas",
    "reference": "Lucas 4, 16-30",
    "text": "Texto completo del evangelio...",
    "url": "https://..."
  },
  "prayer": "Texto de la oración...",
  "imagePath": "01092025.png"
}
```

## Instrucciones

1.  Cree un archivo `.xlsx` por cada día que desee agregar en la carpeta `public/images/gospels/`.
2.  Asegúrese de que el nombre del archivo sea `DDMMYYYY.xlsx`.
3.  Coloque todo el texto del evangelio y la oración en la celda `I2`, siguiendo la estructura mencionada.
4.  Si existe una imagen para el día, nómbrela `DDMMYYYY.png` y colóquela en la misma carpeta.
5.  El script `updateDailyGospel.js` leerá este archivo para actualizar el contenido en la base de datos.

## Notas Importantes

- Mantenga un respaldo de estos archivos.
- Las reflexiones se generarán automáticamente con Google Gemini AI a partir del contenido extraído.