# Spec Driven Development: Automatizacion de Contenido Diario

## 1. Contexto

El proyecto `webSiteCatolico` publica contenido diario catolico: Evangelio, lectura del dia, santo del dia, reflexiones, oraciones, audios y mensajes por WhatsApp. Hoy el flujo esta dividido en dos proyectos locales:

- Proyecto scraper/generador: `C:\Users\Alejandro Luces\Desktop\Repositorio_proyc_web\Evangelio`
- Proyecto web raiz: `C:\Users\Alejandro Luces\Desktop\Repositorio_proyc_web\webSiteCatolico`

El trabajo manual actual consiste en ejecutar scraping/generacion en `Evangelio`, copiar JSON/PNG/XLSX generados, pegarlos en el proyecto raiz y despues actualizar Supabase y/o preparar el envio de WhatsApp.

La meta de esta spec es definir una implementacion por fases para convertir ese flujo manual en un pipeline reproducible, validable e idempotente.

## 2. Estado Actual Detectado

### 2.1 Proyecto `Evangelio`

Es un proyecto Node separado con `index.js` como entrada principal.

Comandos relevantes:

```bash
node index.js --start 2026-07-01 --end 2026-07-31 --no-images
node index.js --date 2026-07-01 --images
node index.js --saint --start 2026-07-01 --end 2026-07-31 --verbose
```

Produce archivos en:

```text
Evangelio/output/
Evangelio/output/santo del dia/
```

Formatos detectados:

- Evangelio: `DDMMYYYY.json`, `DDMMYYYY.xlsx`, opcional `DDMMYYYY.png`
- Santo del dia: `santo del dia/DDMMYYYY.json`, opcional `santo del dia/DDMMYYYY.png`

### 2.2 Proyecto `webSiteCatolico`

Es una app React/Vite con Supabase, Netlify Functions y scripts Node/Python.

Destinos actuales de archivos estaticos:

```text
public/images/gospels/
public/images/santo-del-dia/
WhatsAppExcelMonitorElevenLabsV2/scripts/excel/
```

Scripts relevantes:

- `scripts/updateDailyGospel.js`: lee `public/images/gospels/DDMMYYYY.json`, genera reflexion, genera audios TTS con OpenAI, sube audio a Supabase Storage o Cloudflare R2, y guarda `gospel`/`reading` en `daily_content`.
- `scripts/runGospelUpdateRange.js`: wrapper interactivo por rango para `updateDailyGospel`.
- `scripts/syncDailyGospelFromJson.js`: sincronizador antiguo desde JSON, con ruta sospechosa `data/public/images/gospels`.
- `scripts/checkMissingContent.js`: auditoria de faltantes en Supabase.
- `scripts/generateContentReport.js`: reporte de contenido.
- `scripts/syncWhatsappSubscribersToExcel.py`: agrega suscriptores activos de Supabase al Excel diario.
- `scripts/syncWhatsappSubscribersToExcelRange.py`: wrapper por rango para sincronizar suscriptores a Excel.
- `netlify/functions/whatsapp-send-daily-gospel.ts`: envia WhatsApp desde Supabase usando Green API, sin depender de Excel.
- `WhatsAppExcelMonitorElevenLabsV2/scripts/autoSender.js`: envia WhatsApp desde Excel diario y marca `SMS=1`.

### 2.3 Base de Datos

Tablas principales:

- `daily_content`: contenido diario, con `UNIQUE(date, type)`.
- `content_schedule`: programacion de contenido.
- `whatsapp_subscriptions`: suscriptores de WhatsApp, con `phone` unico y `last_sent_date`.

Columnas de audio ya agregadas:

- `gospel_audio_url`
- `reflection_audio_url`
- `prayer_audio_url`

## 3. Contratos de Datos

### 3.1 JSON de Evangelio

Archivo: `DDMMYYYY.json`

Destino final:

```text
public/images/gospels/DDMMYYYY.json
```

Contrato esperado:

```json
{
  "date": "YYYY-MM-DD",
  "formattedDate": "miercoles, 1 de julio de 2026",
  "gospel": {
    "title": "Evangelio del Dia",
    "reference": "Lectura del santo evangelio segun san Mateo",
    "text": "Texto completo",
    "url": "https://www.vaticannews.va/es/evangelio-de-hoy/YYYY/MM/DD.html",
    "reading": {
      "title": "Lectura del Dia",
      "reference": "Lectura...",
      "text": "Texto completo"
    }
  },
  "prayer": "Oracion generada",
  "imagePath": null
}
```

Campos obligatorios para publicar:

- `date`
- `gospel.title`
- `gospel.reference`
- `gospel.text`
- `prayer`

Campos opcionales:

- `formattedDate`
- `gospel.url`
- `gospel.reading`
- `imagePath`

### 3.2 JSON de Santo del Dia

Archivo: `santo del dia/DDMMYYYY.json`

Destino final:

```text
public/images/santo-del-dia/DDMMYYYY.json
```

Contrato esperado:

```json
{
  "date": "YYYY-MM-DD",
  "formattedDate": "miercoles, 1 de julio de 2026",
  "saint": {
    "title": "Nombre del santo",
    "text": "Resumen",
    "imagePath": null,
    "url": "https://www.vaticannews.va/es/santos/MM/DD.html",
    "biography": "Biografia generada"
  }
}
```

Campos obligatorios para publicar:

- `date`
- `saint.title`
- `saint.text`

Campos recomendados:

- `saint.biography`
- `saint.url`

### 3.3 Excel de WhatsApp

Archivo: `DDMMYYYY.xlsx` o `DDMMYYYY_A.xlsx`

Destino final:

```text
WhatsAppExcelMonitorElevenLabsV2/scripts/excel/DDMMYYYY.xlsx
```

Columnas esperadas:

- `NOMBRES`
- `APELLIDO_PATERNO`
- `APELLIDO_MATERNO`
- `CELULAR`
- `MAIL`
- `CORREO`
- `SMS`
- `WHATSAPP`
- `TEXTO_MENSAJE`

Reglas:

- `SMS=0` o vacio significa pendiente.
- `SMS=1` significa enviado.
- La imagen se adjunta si existe `DDMMYYYY.png`, `DDMMYYYY.jpg` o `DDMMYYYY.jpeg` en la misma carpeta.
- El archivo con sufijo `_A` activa generacion/envio de audio en `autoSender.js`.

## 4. Problemas a Resolver

1. El scraper vive fuera del proyecto raiz, por lo que el pipeline depende de copiar y pegar archivos.
2. Hay dos sistemas de WhatsApp en paralelo: envio desde Supabase por Netlify Function y envio desde Excel por `autoSender.js`.
3. No hay un unico comando que ejecute: scrape, copia, validacion, importacion a Supabase, auditoria y preparacion/envio WhatsApp.
4. `scripts/syncDailyGospelFromJson.js` parece apuntar a `data/public/images/gospels`, mientras el flujo actual usa `public/images/gospels`.
5. La publicacion de santo del dia no tiene un script equivalente tan completo como `updateDailyGospel.js`.
6. No hay reporte unico que diga que una fecha quedo lista para web, Supabase, audios y WhatsApp.

## 5. Objetivos

### 5.1 Objetivo Principal

Crear un pipeline de contenido diario que, dado un rango de fechas, pueda:

1. Ejecutar o consumir la salida del scraper `Evangelio`.
2. Copiar los archivos correctos al proyecto raiz.
3. Validar estructura y consistencia de los JSON.
4. Actualizar Supabase de forma idempotente.
5. Generar o conservar audios del Evangelio.
6. Preparar el envio de WhatsApp sin duplicar destinatarios.
7. Generar un reporte final por fecha.

### 5.2 No Objetivos Iniciales

- Reescribir toda la app React.
- Cambiar el proveedor de scraping.
- Eliminar inmediatamente el flujo Excel si aun se usa en produccion.
- Cambiar credenciales o politicas de Supabase sin una fase dedicada.
- Hacer envios reales de WhatsApp durante pruebas sin `--execute` o confirmacion explicita.

## 6. Diseno Propuesto

### 6.1 Nuevo Orquestador

Crear un script principal:

```text
scripts/contentPipeline.js
```

Comandos propuestos:

```bash
node scripts/contentPipeline.js --from=2026-09-01 --to=2026-09-07 --dry-run
node scripts/contentPipeline.js --from=2026-09-01 --to=2026-09-07 --execute
node scripts/contentPipeline.js --date=2026-09-03 --execute --skip-scrape
node scripts/contentPipeline.js --date=2026-09-03 --execute --whatsapp=netlify
node scripts/contentPipeline.js --date=2026-09-03 --execute --whatsapp=excel
```

Responsabilidades:

- Validar fechas.
- Resolver rutas de origen/destino.
- Ejecutar scraper externo opcionalmente.
- Copiar JSON/PNG/XLSX necesarios.
- Validar contratos de datos.
- Ejecutar actualizacion de Supabase.
- Preparar WhatsApp segun modo elegido.
- Emitir reporte `data/content-pipeline-report-YYYYMMDD-HHMMSS.json`.

### 6.2 Configuracion

Agregar variables opcionales en `.env.example`:

```env
EVANGELIO_PROJECT_PATH=C:\Users\Alejandro Luces\Desktop\Repositorio_proyc_web\Evangelio
CONTENT_PIPELINE_DEFAULT_WHATSAPP_MODE=netlify
CONTENT_PIPELINE_COPY_EXCEL=true
CONTENT_PIPELINE_COPY_IMAGES=true
CONTENT_PIPELINE_RUN_SAINT=true
CONTENT_PIPELINE_RUN_GOSPEL=true
```

### 6.3 Modulos Internos Recomendados

Crear carpeta:

```text
scripts/lib/contentPipeline/
```

Modulos:

- `dates.js`: conversion `YYYY-MM-DD` <-> `DDMMYYYY`, rangos inclusivos.
- `paths.js`: rutas origen/destino y normalizacion Windows.
- `validators.js`: validacion de JSON de Evangelio/Santo/Excel.
- `copyAssets.js`: copia idempotente con hash o comparacion de tamano/mtime.
- `runScraper.js`: ejecucion opcional del proyecto `Evangelio`.
- `supabaseSync.js`: upsert de `gospel`, `reading`, `saint`.
- `whatsappPrep.js`: modo Netlify o Excel.
- `reporter.js`: resumen final.

### 6.4 Estrategia de WhatsApp

Definir un modo unico por ejecucion:

#### Modo `netlify`

Usa `netlify/functions/whatsapp-send-daily-gospel.ts`.

Ventajas:

- Fuente unica: Supabase.
- Control anti-duplicado por `whatsapp_subscriptions.last_sent_date`.
- No requiere Excel diario para enviar.

Requisitos:

- `daily_content` debe tener `gospel` activo para la fecha.
- `whatsapp_subscriptions` debe tener suscriptores activos.
- Green API debe estar configurado.

#### Modo `excel`

Usa `WhatsAppExcelMonitorElevenLabsV2/scripts/autoSender.js`.

Ventajas:

- Compatible con el flujo actual.
- Marca `SMS=1` dentro del Excel.
- Soporta imagen y audio por convencion de nombre.

Requisitos:

- Debe existir `DDMMYYYY.xlsx` o `DDMMYYYY_A.xlsx`.
- Deben sincronizarse suscriptores desde Supabase al Excel antes de enviar.
- Evitar ejecucion simultanea con modo `netlify`.

#### Decision recomendada

Usar `netlify` como modo objetivo a medio plazo, y mantener `excel` como compatibilidad temporal hasta confirmar que los envios desde Supabase cubren todos los casos.

## 7. Fases de Implementacion

### Fase 1: Importador Local Seguro

Crear script:

```text
scripts/importEvangelioOutput.js
```

Debe:

- Recibir `--from`, `--to`, `--source`, `--dry-run`, `--execute`.
- Copiar Evangelio JSON a `public/images/gospels`.
- Copiar Santo JSON a `public/images/santo-del-dia`.
- Copiar PNG de Evangelio a `public/images/gospels`.
- Copiar PNG de Santo a `public/images/santo-del-dia`.
- Copiar XLSX a `WhatsAppExcelMonitorElevenLabsV2/scripts/excel`.
- No sobrescribir archivos diferentes sin reportarlo claramente, salvo `--force`.

Criterios de aceptacion:

- En `--dry-run`, no escribe archivos y lista origen/destino por fecha.
- En `--execute`, copia solo archivos existentes y reporta faltantes.
- Si un destino ya existe igual, lo marca como `unchanged`.
- Si un destino existe diferente, lo marca como `conflict` y no lo pisa sin `--force`.

### Fase 2: Validadores

Crear script:

```text
scripts/validateDailyContentFiles.js
```

Debe:

- Validar JSON de `gospels`.
- Validar JSON de `santo-del-dia`.
- Verificar que `date` dentro del JSON corresponde al nombre del archivo.
- Verificar texto minimo no vacio.
- Verificar que `gospel.reading`, si existe, tenga `title`, `reference`, `text`.
- Validar columnas del Excel si existe.

Criterios de aceptacion:

- Devuelve exit code `0` si todo esta valido.
- Devuelve exit code `1` si hay errores.
- Produce salida JSON con errores por archivo.

### Fase 3: Upsert de Supabase Unificado

Crear script:

```text
scripts/syncDailyContentFromFiles.js
```

Debe:

- Sincronizar `gospel`, `reading` y `saint` desde archivos locales.
- Hacer upsert por `date,type`.
- Mantener `status='published'` e `is_active=true`.
- Guardar `source_attribution` cuando exista URL de Vatican News.
- Para Santo, usar `saint.biography` como `content` preferente si existe; si no, usar `saint.text`.
- Crear/actualizar `content_schedule` de forma idempotente.

Criterios de aceptacion:

- Ejecutar dos veces el mismo rango no crea duplicados.
- Si falta un archivo de Santo, no bloquea Evangelio.
- Si falla Supabase en una fecha, continua con la siguiente y reporta error.

### Fase 4: Orquestador Completo

Crear:

```text
scripts/contentPipeline.js
```

Debe ejecutar:

1. Scrape opcional.
2. Importacion.
3. Validacion.
4. Sync Supabase.
5. Preparacion WhatsApp.
6. Reporte.

Criterios de aceptacion:

- `--dry-run` no llama APIs de escritura ni envia WhatsApp.
- `--execute` exige variables necesarias.
- Cada fecha termina con estado: `ready`, `partial`, `failed`.
- El reporte incluye archivos copiados, filas Supabase afectadas, audios generados y estado WhatsApp.

### Fase 5: WhatsApp Controlado

Agregar opcion:

```bash
--whatsapp=none|prepare-excel|send-excel|send-netlify
```

Reglas:

- Default: `none`.
- `prepare-excel`: solo sincroniza suscriptores al Excel.
- `send-excel`: ejecuta `autoSender.js` y requiere `--execute`.
- `send-netlify`: llama la Netlify Function local o endpoint configurado y requiere `--execute`.
- Nunca ejecutar ambos modos de envio en la misma corrida.

Criterios de aceptacion:

- En `prepare-excel`, no se mandan mensajes reales.
- En `send-netlify`, `last_sent_date` evita reenvios.
- En `send-excel`, `SMS=1` evita reenvios.

## 8. CLI Final Esperada

```bash
# Simular todo para una semana
node scripts/contentPipeline.js --from=2026-09-01 --to=2026-09-07 --dry-run

# Copiar archivos generados, validar y actualizar Supabase
node scripts/contentPipeline.js --from=2026-09-01 --to=2026-09-07 --execute --skip-scrape --whatsapp=prepare-excel

# Ejecutar scraper externo + importar + subir a Supabase
node scripts/contentPipeline.js --from=2026-09-01 --to=2026-09-07 --execute --scrape

# Enviar WhatsApp desde Supabase/Netlify para una fecha
node scripts/contentPipeline.js --date=2026-09-03 --execute --skip-scrape --whatsapp=send-netlify
```

## 9. Riesgos y Decisiones Pendientes

1. Doble envio de WhatsApp si se usa Excel y Netlify el mismo dia.
   - Decision: forzar un solo modo por corrida.

2. Scraper externo fuera del repo.
   - Decision inicial: parametrizar `EVANGELIO_PROJECT_PATH`.
   - Decision futura: migrar scraper dentro de `scripts/` o convertirlo en paquete.

3. Generacion de audios puede fallar por API/quota.
   - Decision: permitir estado parcial, guardando contenido aunque algun audio falle.

4. Imagenes faltantes.
   - Decision: no bloquear publicacion; registrar warning y usar fallback visual del frontend.

5. Santo del dia no se sube hoy de forma completa.
   - Decision: implementar sync de `saint` en Fase 3.

6. Rutas absolutas dentro de `imagePath`.
   - Decision: no persistir rutas locales en Supabase; convertirlas a `/images/gospels/...` o `/images/santo-del-dia/...`.

## 10. Checklist de Implementacion

- [x] Crear `scripts/lib/contentPipeline/dates.js`
- [x] Crear `scripts/lib/contentPipeline/paths.js`
- [x] Crear `scripts/lib/contentPipeline/validators.js`
- [x] Crear `scripts/importEvangelioOutput.js`
- [x] Crear `scripts/validateDailyContentFiles.js`
- [x] Crear `scripts/syncDailyContentFromFiles.js`
- [x] Crear `scripts/contentPipeline.js`
- [x] Agregar scripts npm a `package.json`
- [x] Actualizar `.env.example`
- [x] Actualizar `README.md`
- [ ] Agregar pruebas de validacion con fixtures pequenos
- [ ] Probar `--dry-run` con un rango de 2 dias
- [ ] Probar `--execute --skip-scrape` con una fecha ya existente
- [ ] Probar idempotencia ejecutando dos veces el mismo rango
- [ ] Validar que no hay doble envio de WhatsApp

## 11. Scripts npm Propuestos

```json
{
  "content:import": "node scripts/importEvangelioOutput.js",
  "content:validate-files": "node scripts/validateDailyContentFiles.js",
  "content:sync-files": "node scripts/syncDailyContentFromFiles.js",
  "content:pipeline": "node scripts/contentPipeline.js"
}
```

## 12. Definicion de Terminado

La automatizacion se considera completa cuando:

- Una fecha nueva puede pasar de `Evangelio/output` a `webSiteCatolico` con un solo comando.
- El comando puede ejecutarse en `--dry-run` sin efectos secundarios.
- Los JSON, imagenes y Excel quedan en las carpetas correctas.
- Supabase queda actualizado con `gospel`, `reading` y `saint`.
- El envio de WhatsApp queda preparado o ejecutado segun modo, sin riesgo de doble envio.
- Existe un reporte final que permita saber exactamente que paso por cada fecha.
- Ejecutar el mismo rango dos veces no duplica contenido ni reenvia mensajes.

## 13. Registro de Ejecuciones

### 2026-09-03: prueba real agosto 2026

Solicitud:

```bash
node scripts/contentPipeline.js --from=2026-08-01 --to=2026-08-03 --execute --scrape --whatsapp=none
```

Resultado:

- El primer intento detecto que el scraper externo `Evangelio/index.js` no respeta `--no-images` porque Commander guarda esa opcion como `options.images=false`, mientras el codigo revisa `options.noImages`.
- Se actualizo `scripts/contentPipeline.js` para responder `n` automaticamente al prompt de imagenes del scraper, sin modificar el proyecto externo.
- El segundo intento genero correctamente JSON y Excel de Evangelio para `01082026`, `02082026` y `03082026`.
- El scraper de Santo del Dia genero correctamente JSON para `01082026`, `02082026` y `03082026`.
- El pipeline importo los archivos al proyecto raiz, valido los contratos y sincronizo Supabase.
- WhatsApp quedo en modo `none`, por lo que no se enviaron mensajes.

Filas verificadas en `daily_content`:

- `2026-08-01`: `gospel`, `reading`, `saint`
- `2026-08-02`: `gospel`, `reading`, `saint`
- `2026-08-03`: `gospel`, `reading`, `saint`

Todas quedaron con:

- `status='published'`
- `is_active=true`

Reporte generado:

```text
data/content-pipeline-report-20260902-225823.json
```

### 2026-09-03: correccion de reflexiones, audios y santos

Problema detectado despues de la primera prueba:

- Los registros `gospel` de `2026-08-01`, `2026-08-02` y `2026-08-03` estaban publicados, pero no tenian `reflection`, `gospel_audio_url`, `reflection_audio_url` ni `prayer_audio_url`.
- La causa fue que el primer sync uso el camino basico de JSON (`syncDailyContentFromFiles.js`), que no ejecuta la generacion IA ni TTS.
- Los registros `saint` si tenian biografia en `content`; para Santo del Dia no se usan los campos de audio/reflexion del Evangelio.

Decision de implementacion:

- El pipeline unificado debe usar `--gospel-sync=full` por defecto.
- En modo `full`, el Evangelio y la Lectura se actualizan con `scripts/updateDailyGospel.js`, que genera/refresca reflexion, audios TTS y URLs de Storage.
- Despues de esa actualizacion completa, el pipeline solo sincroniza `saint` desde JSON para no sobrescribir los campos enriquecidos del Evangelio.
- El modo `--gospel-sync=basic` queda disponible solo para casos donde se quiera subir JSON sin IA ni audios.

Ejecucion correctiva:

```bash
node scripts/contentPipeline.js --from=2026-08-01 --to=2026-08-03 --execute --whatsapp=none
```

Resultado verificado en Supabase:

- `2026-08-01` `gospel`: reflexion presente, audio de evangelio presente, audio de reflexion presente, audio de oracion presente.
- `2026-08-02` `gospel`: reflexion presente, audio de evangelio presente, audio de reflexion presente, audio de oracion presente.
- `2026-08-03` `gospel`: reflexion presente, audio de evangelio presente, audio de reflexion presente, audio de oracion presente.
- `2026-08-01` `saint`: publicado, activo, biografia en `content`.
- `2026-08-02` `saint`: publicado, activo, biografia en `content`.
- `2026-08-03` `saint`: publicado, activo, biografia en `content`.

Observacion tecnica:

- Gemini fallo con el modelo configurado `gemini-2.0-flash-001` porque la API respondio que ya no esta disponible.
- El fallback a OpenAI funciono y genero correctamente las reflexiones.
- Queda pendiente actualizar la configuracion de Gemini a un modelo vigente si se quiere volver a usar Gemini como proveedor primario.

Reporte generado:

```text
data/content-pipeline-report-20260902-230604.json
```

### 2026-09-03: corrida real 2026-08-27 a 2026-09-30

Solicitud:

```bash
node scripts/contentPipeline.js --from=2026-08-27 --to=2026-09-30 --execute --scrape --whatsapp=none
```

Resultado:

- El scraper externo genero Evangelio, oracion y Excel para las 35 fechas.
- El scraper externo genero Santo del Dia y biografia IA para las 35 fechas.
- El pipeline importo JSON/Excel al proyecto raiz.
- El pipeline valido correctamente los archivos locales.
- El pipeline actualizo Supabase con `--gospel-sync=full`.
- Para cada fecha se genero/refresco la reflexion del Evangelio con OpenAI.
- Para cada fecha se generaron y subieron 3 audios a Supabase Storage: evangelio, reflexion y oracion.
- WhatsApp quedo en modo `none`, por lo que no se enviaron mensajes.

Verificacion directa en Supabase:

- Fechas verificadas: 35.
- Filas verificadas en `daily_content`: 105.
- `gospel` completos con reflexion y 3 audios: 35.
- `reading` publicadas y activas: 35.
- `saint` publicados, activos y con biografia en `content`: 35.
- Faltantes detectados: 0.

Observacion tecnica:

- Gemini continuo fallando para reflexiones de Evangelio por el modelo configurado `gemini-2.0-flash-001`.
- El fallback a OpenAI funciono en todas las fechas.

Reporte generado:

```text
data/content-pipeline-report-20260903-161539.json
```

### Estado MCP Supabase

Comandos intentados:

```bash
codex mcp add supabase --url "https://mcp.supabase.com/mcp?project_ref=ecvrpjjytwhdovoibouo&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching"
codex mcp login supabase
```

Resultado:

- La entrada MCP `supabase` se agrego en la configuracion global de Codex.
- El login OAuth fallo antes de autenticar por rechazo de scopes del servidor MCP.
- Error principal: Supabase espera scopes como `database:read`, `database:write`, `projects:read`, `edge_functions:read`, etc., pero el flujo recibio grupos tipo `docs`, `account`, `database`, `debugging`, `development`, `functions`, `branching`.
- Para esta ejecucion se actualizo Supabase con el cliente existente del proyecto usando `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` desde `.env`.

Agent skills:

```bash
npx skills add supabase/agent-skills
```

Resultado:

- Instaladas correctamente en `.agents/skills`.
- Skills instaladas: `supabase` y `supabase-postgres-best-practices`.
