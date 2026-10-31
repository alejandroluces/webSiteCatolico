# Contenido de noviembre de 2026

Preparación del 1 al 30 de noviembre: evangelios y lecturas de Vatican News,
oraciones de la mañana, reflexiones, santos y tres audios por día. Los textos
generados son contenido editorial, no citas atribuidas a la fuente bíblica.
El calendario de Chile incluye 37 entradas y el inicio de Adviento el 29.
Fuentes del calendario: `data/liturgy-2026-11.json`.

Los JSON de entrada están en `public/images/gospels/` y
`public/images/santo-del-dia/`, con nombres `DDMMYYYY.json`. Los metadatos
litúrgicos se conservan al sincronizar. Los registros activos y publicados se
seleccionan por fecha; preparar el mes no adelanta los envíos de Telegram.

## Ejecución diaria

- La web lee los registros de Supabase por fecha.
- El cron existente de Render ejecuta `node scripts/telegramSender.js --execute`
  a las 09:30 UTC y usa la fecha de `America/Santiago`.
- Telegram publica la imagen fija, evangelio, oración, dos audios y PDF de
  lecturas. El audio de reflexión queda disponible en la web.
- No se necesita ejecutar el generador de IA cada mañana una vez cargado el mes.
- El PDF se genera en cada envío consultando Dominicos. Se verifican tanto sus
  enlaces con ceros iniciales como sin ellos, conservando la validación de fecha
  y dominio. Una caída de esa fuente sigue siendo una dependencia del envío.
- El registro `telegram_publications` impide repetir días ya enviados.

## Verificación sin publicar en Telegram

```powershell
node scripts/auditMonthlyContent.js --from=2026-11-01 --to=2026-11-30
npm run test:telegram
```

La auditoría comprueba los registros, las tres URLs de audio por día y la
preparación real de los PDFs. Guarda el resultado en
`data/content-audit-2026-11-01-2026-11-30.json`. No llama a la API de Telegram
ni escribe en el registro de envíos.

## Reprocesar solo si hace falta

`scripts/prepareNovember2026.js --execute` normaliza los JSON locales ya
importados y carga el calendario. Después se puede ejecutar el pipeline con
`--skip-import` para conservar estos archivos revisados:

```powershell
node scripts/contentPipeline.js --date=2026-11-01 --execute --skip-import --require-saint --whatsapp=none
```

Este último comando vuelve a generar reflexión y audios; no ejecutarlo para
una simple comprobación. Limitarlo a las fechas que requieran reparación.

El scraper externo `../Evangelio/lib/openai.js` se corrigió para usar
`OPENAI_PRAYER_MODEL` con respaldo `gpt-4o-mini`, ya utilizado por el proyecto,
en lugar del modelo retirado `gpt-4`. Se ejecutó con las credenciales de la web
mediante `node --env-file=../webSiteCatolico/.env`; la clave guardada en la
carpeta externa no era válida. Los secretos no se copian al repositorio.
