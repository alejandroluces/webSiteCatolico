# 📋 Guía de Mantenimiento - Camino de Fe

## 🎯 Resumen Ejecutivo

Esta guía proporciona instrucciones completas para el mantenimiento y actualización periódica del contenido del portal católico Camino de Fe. El sistema está diseñado para facilitar la gestión diaria del contenido espiritual.

## 🏗️ Arquitectura del Sistema de Contenido

### Componentes Principales

1. **Base de Datos Supabase**
   - `daily_content`: Contenido principal (evangelios, santos, lecturas)
   - `content_schedule`: Programación de publicaciones
   - `admin_users`: Usuarios administradores
   - `content_analytics`: Métricas y estadísticas

2. **Sistema de Gestión**
   - Panel de administración web
   - Scripts automatizados
   - API de contenido
   - Sistema de programación

3. **Automatización**
   - Publicación automática diaria
   - Verificación de contenido faltante
   - Generación de reportes
   - Notificaciones de mantenimiento

## 👥 Roles y Responsabilidades

### 🔑 Administrador Principal
- **Responsabilidades:**
  - Gestión completa del sistema
  - Configuración de usuarios
  - Supervisión de contenido
  - Resolución de problemas técnicos

- **Tareas Diarias:**
  - Verificar publicación automática
  - Revisar métricas de contenido
  - Aprobar contenido pendiente

### ✏️ Editor de Contenido
- **Responsabilidades:**
  - Creación y edición de contenido
  - Programación de publicaciones
  - Revisión de calidad

- **Tareas Diarias:**
  - Crear contenido para los próximos 7 días
  - Revisar y corregir contenido existente
  - Programar publicaciones

### 📝 Colaborador
- **Responsabilidades:**
  - Creación de contenido específico
  - Investigación y documentación
  - Apoyo en tareas de contenido

## 📅 Rutinas de Mantenimiento

### 🌅 Rutina Diaria (6:00 AM - Automática)

```bash
# Script ejecutado automáticamente por cron
npm run content:publish
```

**Acciones realizadas:**
- Publicar contenido programado para el día
- Activar evangelio, santo y lecturas del día
- Generar logs de publicación
- Enviar notificaciones si hay errores

### 📊 Rutina Semanal (Lunes 8:00 AM)

```bash
# Verificar contenido para la próxima semana
npm run content:check 7

# Generar reporte semanal
npm run content:report
```

**Tareas manuales:**
1. Revisar contenido faltante
2. Programar contenido para los próximos 14 días
3. Verificar métricas de engagement
4. Actualizar calendario litúrgico si es necesario

### 📈 Rutina Mensual (Primer día del mes)

```bash
# Verificar contenido para el próximo mes
npm run content:check 30

# Generar reporte mensual completo
npm run content:report --full
```

**Tareas manuales:**
1. Análisis completo de métricas
2. Planificación de contenido especial (festividades)
3. Backup de base de datos
4. Actualización de categorías y etiquetas
5. Revisión de feedback de usuarios

## 🛠️ Herramientas de Gestión

### 🖥️ Panel de Administración Web

**Acceso:** `/admin` (requiere autenticación)

**Funcionalidades:**
- ✅ Crear y editar contenido
- ✅ Programar publicaciones
- ✅ Ver estadísticas y métricas
- ✅ Gestionar usuarios
- ✅ Configurar categorías y etiquetas

### 📱 Scripts de Línea de Comandos

#### Publicar Contenido Programado
```bash
npm run content:publish
```

#### Verificar Contenido Faltante
```bash
# Verificar próximos 7 días
npm run content:check

# Verificar próximos 30 días
npm run content:check 30
```

#### Generar Reportes
```bash
# Reporte básico
npm run content:report

# Reporte completo con métricas
npm run content:report --full
```

## 📝 Proceso de Creación de Contenido

### 📖 Evangelio del Día

1. **Investigación:**
   - Consultar leccionario católico oficial
   - Verificar referencias bíblicas
   - Revisar comentarios patrísticos

2. **Estructura del Contenido:**
   ```
   - Título: Tema principal del evangelio
   - Referencia: Libro, capítulo y versículos
   - Texto: Evangelio completo
   - Reflexión: Meditación espiritual (300-500 palabras)
   - Oración: Oración relacionada con el tema
   - Tiempo Litúrgico: Adviento, Navidad, etc.
   ```

3. **Calidad y Revisión:**
   - Ortodoxia doctrinal
   - Claridad del lenguaje
   - Relevancia pastoral
   - Corrección ortográfica

### 👼 Santo del Día

1. **Investigación:**
   - Martirologio Romano
   - Fuentes hagiográficas confiables
   - Documentos oficiales de canonización

2. **Estructura del Contenido:**
   ```
   - Título: Nombre completo del santo
   - Fechas: Nacimiento, muerte, festividad
   - Biografía: Vida y obras principales
   - Legado: Importancia para la Iglesia
   - Oración: Oración al santo
   - Patronazgo: De qué es patrono
   ```

### 📚 Lecturas del Día

1. **Fuentes:**
   - Leccionario oficial
   - Liturgia de las Horas
   - Calendario litúrgico

2. **Estructura:**
   ```
   - Primera Lectura: Antiguo Testamento
   - Salmo Responsorial: Con antífona
   - Segunda Lectura: Nuevo Testamento (domingos/solemnidades)
   - Evangelio: Texto evangélico
   ```

## 🔧 Configuración Técnica

### 🗄️ Variables de Entorno

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Audio Storage (recomendado para MP3 históricos)
AUDIO_STORAGE_PROVIDER=auto
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_r2_bucket_name
R2_PUBLIC_BASE_URL=https://your-public-r2-domain
R2_AUDIO_PREFIX=audio_content

# Content Management
CONTENT_AUTO_PUBLISH=true
CONTENT_BACKUP_ENABLED=true
NOTIFICATION_EMAIL=admin@luzdefe.com

# Analytics
ANALYTICS_ENABLED=true
ANALYTICS_RETENTION_DAYS=365
```

### ⏰ Configuración de Cron Jobs

```bash
# Publicación diaria a las 6:00 AM
0 6 * * * cd /path/to/luz-de-fe && npm run content:publish

# Verificación semanal los lunes a las 8:00 AM
0 8 * * 1 cd /path/to/luz-de-fe && npm run content:check 7

# Reporte mensual el primer día del mes a las 9:00 AM
0 9 1 * * cd /path/to/luz-de-fe && npm run content:report --full

# Backup diario a las 2:00 AM
0 2 * * * cd /path/to/luz-de-fe && npm run backup:create
```

## 📊 Métricas y Monitoreo

### 📈 KPIs Principales

1. **Cobertura de Contenido**
   - % de días con contenido completo
   - Días de anticipación en programación
   - Contenido faltante por tipo

2. **Engagement**
   - Visualizaciones diarias
   - Tiempo de permanencia
   - Compartidos en redes sociales
   - Comentarios y feedback

3. **Calidad**
   - Calificación promedio de usuarios
   - Reportes de errores
   - Feedback positivo vs negativo

### 🚨 Alertas y Notificaciones

**Alertas Críticas:**
- Falla en publicación automática
- Contenido faltante para mañana
- Errores en base de datos
- Caída del sistema

**Alertas de Advertencia:**
- Contenido faltante en 3 días
- Métricas de engagement bajas
- Feedback negativo recurrente
- Espacio de almacenamiento bajo

## 🔒 Seguridad y Backups

### 🛡️ Medidas de Seguridad

1. **Autenticación:**
   - Autenticación de dos factores para administradores
   - Roles y permisos granulares
   - Sesiones con expiración automática

2. **Datos:**
   - Encriptación en tránsito y reposo
   - Auditoría de cambios
   - Versionado de contenido

3. **Acceso:**
   - VPN para acceso administrativo
   - Logs de acceso detallados
   - Monitoreo de actividad sospechosa

### 💾 Estrategia de Backup

1. **Backup Automático Diario:**
   - Base de datos completa
   - Archivos de configuración
   - Logs del sistema

2. **Backup Semanal:**
   - Imágenes y multimedia
   - Configuraciones de servidor
   - Certificados SSL

3. **Backup Mensual:**
   - Archivo completo del sistema
   - Documentación actualizada
   - Procedimientos de recuperación

## 🚨 Procedimientos de Emergencia

### ⚡ Falla en Publicación Automática

1. **Detección:**
   - Verificar logs de error
   - Comprobar conectividad a base de datos
   - Revisar estado de servicios

2. **Acción Inmediata:**
   ```bash
   # Publicación manual
   npm run content:publish --force
   
   # Verificar resultado
   npm run content:check 1
   ```

3. **Seguimiento:**
   - Investigar causa raíz
   - Implementar corrección
   - Documentar incidente

### 📱 Contenido Faltante de Emergencia

1. **Contenido de Respaldo:**
   - Evangelios universales
   - Santos populares
   - Lecturas comunes

2. **Procedimiento:**
   ```bash
   # Activar contenido de emergencia
   npm run content:emergency --type=gospel --date=today
   ```

### 🔧 Problemas de Base de Datos

1. **Diagnóstico:**
   - Verificar conectividad
   - Revisar logs de Supabase
   - Comprobar límites de uso

2. **Recuperación:**
   - Restaurar desde backup más reciente
   - Verificar integridad de datos
   - Reactivar servicios

## 📞 Contactos de Soporte

### 🆘 Emergencias (24/7)
- **Administrador Principal:** +34 600 000 001
- **Desarrollador Principal:** +34 600 000 002
- **Soporte Técnico:** soporte@luzdefe.com

### 📧 Contactos Regulares
- **Director Espiritual:** padre.miguel@luzdefe.com
- **Coordinadora de Contenido:** maria.gonzalez@luzdefe.com
- **Equipo de Desarrollo:** dev@luzdefe.com

### 🔗 Recursos Externos
- **Supabase Support:** https://supabase.com/support
- **Hosting Provider:** [Información del proveedor]
- **CDN Support:** [Información del CDN]

## 📚 Recursos y Referencias

### 📖 Fuentes de Contenido Católico
- **Vaticano:** vatican.va
- **Conferencia Episcopal Española:** conferenciaepiscopal.es
- **Leccionario Romano:** [Fuente oficial]
- **Martirologio Romano:** [Fuente oficial]

### 🛠️ Documentación Técnica
- **Supabase Docs:** https://supabase.com/docs
- **React Documentation:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com/docs

### 📋 Plantillas y Formularios
- **Plantilla de Evangelio:** [Enlace a plantilla]
- **Plantilla de Santo:** [Enlace a plantilla]
- **Formulario de Reporte de Incidente:** [Enlace a formulario]

---

## ✅ Lista de Verificación Diaria

- [ ] Verificar publicación automática del día
- [ ] Revisar métricas de ayer
- [ ] Comprobar contenido para mañana
- [ ] Responder feedback de usuarios
- [ ] Verificar estado de sistemas

## ✅ Lista de Verificación Semanal

- [ ] Programar contenido para próximos 14 días
- [ ] Generar reporte semanal
- [ ] Revisar y aprobar contenido pendiente
- [ ] Actualizar calendario litúrgico
- [ ] Verificar backups

## ✅ Lista de Verificación Mensual

- [ ] Análisis completo de métricas
- [ ] Planificación de contenido especial
- [ ] Backup completo del sistema
- [ ] Revisión de seguridad
- [ ] Actualización de documentación

---

*Esta guía debe actualizarse regularmente para reflejar cambios en el sistema y mejores prácticas.*

**Última actualización:** Enero 2025  
**Próxima revisión:** Abril 2025
