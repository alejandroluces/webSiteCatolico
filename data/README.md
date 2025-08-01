# Directorio de Datos

Este directorio (`/public/images/gospels/`) contiene los archivos de datos utilizados por el sistema de actualización automática del evangelio del día.

## Estructura de los Archivos

El sistema no utiliza un único archivo Excel, sino un archivo por cada día.

*   **Nombre del archivo:** Debe seguir el formato `DDMMYYYY.xlsx` (ej. `22062025.xlsx`).
*   **Ubicación:** Los archivos deben estar en la carpeta `public/images/gospels/`.

### Contenido de la Celda I2

Toda la información del evangelio para un día específico debe estar contenida en la **celda I2** del archivo Excel correspondiente, con el siguiente formato de texto:

```
*Evangelio del Día*
Título del Evangelio
Referencia Bíblica (ej. Lucas 9, 11-17)
Texto completo del evangelio...
... más líneas de texto.
*Oración de la mañana*
Texto de la oración...
... más líneas de oración.
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