# SPEC — Retirada del monitor WhatsApp

Fecha: 2026-10-06. Requisitos: RF-07, RF-08, RF-11 de la SDD.

## Objetivo

Separar Telegram del monitor antiguo y retirar `WhatsAppExcelMonitorElevenLabsV2`
sin interrumpir el cron ni perder datos locales. Las demás funciones heredadas de
WhatsApp permanecen desactivadas; no se borran sus registros de Supabase.

## Criterios de aceptación

- Telegram reside en `telegram/`, con paquete CommonJS independiente y sin dependencias.
- Render usa la nueva raíz conservando comando, secretos y horario.
- Las 11 pruebas del emisor pasan y una ejecución de Render termina correctamente.
- Una publicación ya enviada devuelve `already_sent`; no se fuerza otro envío al canal.
- El pipeline no recrea la carpeta antigua: Excel y copias de medios usan `data/content-excel/`.
- El modo `send-excel` falla antes de realizar operaciones; se retira su workflow.
- Se conserva una copia local ignorada por Git del monitor, incluidos sus datos y configuración.

## Orden y recuperación

Primero publicar el nuevo servicio, cambiar Render y verificarlo. Después retirar
la carpeta antigua del repositorio y actualizar referencias. El código histórico
permanece recuperable en Git; los archivos no versionados quedan en
`.local-archive/WhatsAppExcelMonitorElevenLabsV2/`. Esa copia contiene configuración
privada y no debe publicarse. Las exportaciones de trabajo continúan en
`data/content-excel/`.

Para recuperar el emisor anterior a la separación, usar el commit `0e29065` y su
raíz original. No ejecutar el emisor WhatsApp ni borrar registros de entrega.

## Validación

- 11 pruebas del emisor aprobadas en la nueva ubicación.
- `npm run build` aprobado; conserva advertencias de tamaño de bundle y Browserslist.
- Pipeline en `--dry-run` para 2026-10-06: sin errores y rutas nuevas verificadas.
- `--whatsapp=send-excel` rechazado antes de acceder a servicios externos.
- 334 exportaciones conservadas en `data/content-excel/`.
- Build de Render `b66096e` exitoso con raíz `telegram`.
- Ejecución manual de Render finalizada el 2026-10-06 a las 09:22:31 UTC:
  resultado `already_sent`, sin duplicar la publicación del día.
