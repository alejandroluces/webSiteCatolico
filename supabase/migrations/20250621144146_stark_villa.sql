/*
  # Tablas adicionales para el sistema de gestión de contenido

  1. Nuevas Tablas
    - `content_templates` - Plantillas para diferentes tipos de contenido
    - `content_history` - Historial de cambios y versiones
    - `notification_settings` - Configuración de notificaciones
    - `system_settings` - Configuraciones del sistema
    - `content_backups` - Respaldos automáticos de contenido
    - `user_sessions` - Sesiones de usuarios administradores
    - `audit_logs` - Logs de auditoría del sistema

  2. Funciones
    - Funciones para automatización
    - Triggers para auditoría
    - Procedimientos de mantenimiento

  3. Seguridad
    - Políticas RLS adicionales
    - Funciones de seguridad
*/

-- Tabla de plantillas de contenido
CREATE TABLE IF NOT EXISTS content_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('gospel', 'saint', 'reading')),
  template_content jsonb NOT NULL,
  description text,
  is_default boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de historial de contenido
CREATE TABLE IF NOT EXISTS content_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES daily_content(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  changes jsonb NOT NULL,
  changed_by uuid REFERENCES auth.users(id),
  change_reason text,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(content_id, version_number)
);

-- Tabla de configuración de notificaciones
CREATE TABLE IF NOT EXISTS notification_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type text NOT NULL CHECK (notification_type IN ('email', 'sms', 'push')),
  event_type text NOT NULL CHECK (event_type IN ('content_missing', 'publish_error', 'daily_report', 'weekly_report')),
  is_enabled boolean DEFAULT true,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id, notification_type, event_type)
);

-- Tabla de configuraciones del sistema
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  updated_by uuid REFERENCES auth.users(id),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de respaldos de contenido
CREATE TABLE IF NOT EXISTS content_backups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_date date NOT NULL,
  content_count integer NOT NULL,
  backup_size_mb decimal(10,2),
  backup_path text,
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(backup_date)
);

-- Tabla de sesiones de usuarios
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  ip_address inet,
  user_agent text,
  is_active boolean DEFAULT true,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_activity timestamptz DEFAULT now()
);

-- Tabla de logs de auditoría
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Tabla de métricas diarias del sistema
CREATE TABLE IF NOT EXISTS daily_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  total_views integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  content_published integer DEFAULT 0,
  errors_count integer DEFAULT 0,
  avg_load_time_ms integer DEFAULT 0,
  bounce_rate decimal(5,2) DEFAULT 0,
  top_content jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS en todas las nuevas tablas
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para content_templates
CREATE POLICY "Administradores pueden gestionar plantillas"
  ON content_templates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() 
      AND is_active = true
    )
  );

-- Políticas para content_history
CREATE POLICY "Administradores pueden ver historial"
  ON content_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() 
      AND is_active = true
    )
  );

-- Políticas para notification_settings
CREATE POLICY "Usuarios pueden gestionar sus notificaciones"
  ON notification_settings
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Políticas para system_settings
CREATE POLICY "Configuraciones públicas visibles para todos"
  ON system_settings
  FOR SELECT
  TO public
  USING (is_public = true);

CREATE POLICY "Solo administradores pueden gestionar configuraciones"
  ON system_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() 
      AND is_active = true 
      AND role = 'admin'
    )
  );

-- Políticas para content_backups
CREATE POLICY "Solo administradores pueden ver backups"
  ON content_backups
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() 
      AND is_active = true 
      AND role IN ('admin', 'editor')
    )
  );

-- Políticas para user_sessions
CREATE POLICY "Usuarios pueden ver sus propias sesiones"
  ON user_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Políticas para audit_logs
CREATE POLICY "Solo administradores pueden ver logs de auditoría"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() 
      AND is_active = true 
      AND role = 'admin'
    )
  );

-- Políticas para daily_metrics
CREATE POLICY "Solo administradores pueden ver métricas"
  ON daily_metrics
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() 
      AND is_active = true 
      AND role IN ('admin', 'editor')
    )
  );

-- Función para crear entrada en el historial automáticamente
CREATE OR REPLACE FUNCTION create_content_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo crear historial si hay cambios significativos
  IF TG_OP = 'UPDATE' AND (
    OLD.title != NEW.title OR 
    OLD.content != NEW.content OR 
    OLD.reflection != NEW.reflection OR 
    OLD.prayer != NEW.prayer OR
    OLD.status != NEW.status
  ) THEN
    INSERT INTO content_history (
      content_id,
      version_number,
      changes,
      changed_by,
      change_reason
    ) VALUES (
      NEW.id,
      COALESCE((
        SELECT MAX(version_number) + 1 
        FROM content_history 
        WHERE content_id = NEW.id
      ), 1),
      jsonb_build_object(
        'old', row_to_json(OLD),
        'new', row_to_json(NEW),
        'changed_fields', (
          SELECT jsonb_object_agg(key, value)
          FROM jsonb_each(to_jsonb(NEW))
          WHERE to_jsonb(NEW) ->> key != to_jsonb(OLD) ->> key
        )
      ),
      auth.uid(),
      'Actualización automática'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para historial de contenido
CREATE TRIGGER content_history_trigger
  AFTER UPDATE ON daily_content
  FOR EACH ROW
  EXECUTE FUNCTION create_content_history();

-- Función para auditoría automática
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id::text, OLD.id::text),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers de auditoría para tablas importantes
CREATE TRIGGER audit_daily_content
  AFTER INSERT OR UPDATE OR DELETE ON daily_content
  FOR EACH ROW
  EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_content_schedule
  AFTER INSERT OR UPDATE OR DELETE ON content_schedule
  FOR EACH ROW
  EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_admin_users
  AFTER INSERT OR UPDATE OR DELETE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION create_audit_log();

-- Función para limpiar sesiones expiradas
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  UPDATE user_sessions 
  SET is_active = false 
  WHERE expires_at < now() AND is_active = true;
  
  DELETE FROM user_sessions 
  WHERE expires_at < now() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Función para generar métricas diarias
CREATE OR REPLACE FUNCTION generate_daily_metrics()
RETURNS void AS $$
DECLARE
  today_date date := CURRENT_DATE;
  metrics_record daily_metrics%ROWTYPE;
BEGIN
  -- Verificar si ya existen métricas para hoy
  SELECT * INTO metrics_record FROM daily_metrics WHERE date = today_date;
  
  IF NOT FOUND THEN
    -- Crear nuevo registro de métricas
    INSERT INTO daily_metrics (
      date,
      total_views,
      content_published,
      created_at
    ) VALUES (
      today_date,
      0, -- Se actualizará con datos reales de analytics
      (SELECT COUNT(*) FROM daily_content WHERE DATE(created_at) = today_date),
      now()
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Función para verificar contenido crítico faltante
CREATE OR REPLACE FUNCTION check_critical_missing_content()
RETURNS TABLE(
  missing_date date,
  missing_type text,
  days_until date,
  is_critical boolean
) AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      CURRENT_DATE,
      CURRENT_DATE + INTERVAL '7 days',
      INTERVAL '1 day'
    )::date AS check_date
  ),
  content_types AS (
    SELECT unnest(ARRAY['gospel', 'saint', 'reading']) AS content_type
  ),
  expected_content AS (
    SELECT ds.check_date, ct.content_type
    FROM date_series ds
    CROSS JOIN content_types ct
  ),
  existing_content AS (
    SELECT date, type
    FROM daily_content
    WHERE date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
    AND is_active = true
  )
  SELECT 
    ec.check_date,
    ec.content_type,
    ec.check_date,
    (ec.check_date <= CURRENT_DATE + INTERVAL '2 days') AS is_critical
  FROM expected_content ec
  LEFT JOIN existing_content ex ON ec.check_date = ex.date AND ec.content_type = ex.type
  WHERE ex.date IS NULL
  ORDER BY ec.check_date, ec.content_type;
END;
$$ LANGUAGE plpgsql;

-- Insertar configuraciones del sistema por defecto
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
  ('site_name', '"Luz de Fe"', 'Nombre del sitio web', true),
  ('site_description', '"Portal católico para evangelización y formación espiritual"', 'Descripción del sitio', true),
  ('auto_publish_time', '"06:00"', 'Hora de publicación automática', false),
  ('backup_retention_days', '30', 'Días de retención de backups', false),
  ('max_content_versions', '10', 'Máximo número de versiones por contenido', false),
  ('notification_email', '"admin@luzdefe.com"', 'Email para notificaciones del sistema', false),
  ('maintenance_mode', 'false', 'Modo de mantenimiento activado', false),
  ('analytics_enabled', 'true', 'Analytics habilitado', false),
  ('content_approval_required', 'true', 'Requiere aprobación para publicar contenido', false),
  ('emergency_content_enabled', 'true', 'Contenido de emergencia habilitado', false)
ON CONFLICT (setting_key) DO NOTHING;

-- Insertar plantillas por defecto
INSERT INTO content_templates (name, type, template_content, description, is_default) VALUES
  (
    'Plantilla Evangelio Estándar',
    'gospel',
    '{
      "structure": {
        "title": "Título del evangelio",
        "reference": "Libro capítulo:versículos",
        "content": "Texto del evangelio",
        "reflection": "Reflexión espiritual (300-500 palabras)",
        "prayer": "Oración relacionada con el tema",
        "liturgical_season": "Tiempo litúrgico"
      },
      "guidelines": [
        "Usar lenguaje claro y accesible",
        "Incluir aplicación práctica",
        "Mantener ortodoxia doctrinal",
        "Longitud apropiada para lectura diaria"
      ]
    }',
    'Plantilla estándar para evangelios diarios',
    true
  ),
  (
    'Plantilla Santo del Día',
    'saint',
    '{
      "structure": {
        "title": "Nombre completo del santo",
        "content": "Biografía y vida del santo",
        "feast_day": "Fecha de festividad",
        "patronage": "Patronazgo",
        "prayer": "Oración al santo",
        "liturgical_season": "Tiempo litúrgico"
      },
      "guidelines": [
        "Incluir fechas importantes",
        "Destacar virtudes principales",
        "Mencionar milagros o hechos notables",
        "Incluir relevancia contemporánea"
      ]
    }',
    'Plantilla estándar para santos del día',
    true
  ),
  (
    'Plantilla Lectura Litúrgica',
    'reading',
    '{
      "structure": {
        "title": "Título de la lectura",
        "reference": "Libro bíblico y capítulos",
        "content": "Texto de la lectura",
        "liturgical_season": "Tiempo litúrgico",
        "liturgical_color": "Color litúrgico"
      },
      "guidelines": [
        "Usar traducción oficial",
        "Incluir contexto bíblico",
        "Verificar referencias",
        "Mantener formato litúrgico"
      ]
    }',
    'Plantilla estándar para lecturas litúrgicas',
    true
  )
ON CONFLICT (name) DO NOTHING;

-- Insertar configuraciones de notificación por defecto para administradores
INSERT INTO notification_settings (user_id, notification_type, event_type, is_enabled, settings)
SELECT 
  au.id,
  'email',
  event_type,
  true,
  '{"priority": "high"}'
FROM admin_users au
CROSS JOIN (
  VALUES 
    ('content_missing'),
    ('publish_error'),
    ('daily_report')
) AS events(event_type)
WHERE au.role = 'admin'
ON CONFLICT (user_id, notification_type, event_type) DO NOTHING;

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_daily_content_date_type ON daily_content(date, type);
CREATE INDEX IF NOT EXISTS idx_daily_content_status ON daily_content(status);
CREATE INDEX IF NOT EXISTS idx_daily_content_active ON daily_content(is_active);
CREATE INDEX IF NOT EXISTS idx_content_schedule_date ON content_schedule(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_content_analytics_date ON content_analytics(date);
CREATE INDEX IF NOT EXISTS idx_content_analytics_content_id ON content_analytics(content_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_content_history_content_id ON content_history(content_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active, expires_at);

-- Función para obtener estadísticas completas del sistema
CREATE OR REPLACE FUNCTION get_system_statistics()
RETURNS jsonb AS $$
DECLARE
  stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'content', jsonb_build_object(
      'total', (SELECT COUNT(*) FROM daily_content),
      'active', (SELECT COUNT(*) FROM daily_content WHERE is_active = true),
      'scheduled', (SELECT COUNT(*) FROM content_schedule WHERE is_published = false),
      'by_type', (
        SELECT jsonb_object_agg(type, count)
        FROM (
          SELECT type, COUNT(*) as count
          FROM daily_content
          GROUP BY type
        ) t
      )
    ),
    'users', jsonb_build_object(
      'total_admins', (SELECT COUNT(*) FROM admin_users),
      'active_admins', (SELECT COUNT(*) FROM admin_users WHERE is_active = true),
      'by_role', (
        SELECT jsonb_object_agg(role, count)
        FROM (
          SELECT role, COUNT(*) as count
          FROM admin_users
          WHERE is_active = true
          GROUP BY role
        ) r
      )
    ),
    'analytics', jsonb_build_object(
      'total_views', (SELECT COALESCE(SUM(views), 0) FROM content_analytics),
      'total_shares', (SELECT COALESCE(SUM(shares), 0) FROM content_analytics),
      'avg_rating', (
        SELECT ROUND(AVG(rating), 2)
        FROM content_feedback
        WHERE is_approved = true
      )
    ),
    'system', jsonb_build_object(
      'last_backup', (SELECT MAX(backup_date) FROM content_backups WHERE status = 'completed'),
      'active_sessions', (SELECT COUNT(*) FROM user_sessions WHERE is_active = true),
      'recent_errors', (
        SELECT COUNT(*)
        FROM audit_logs
        WHERE action = 'ERROR'
        AND created_at > now() - INTERVAL '24 hours'
      )
    )
  ) INTO stats;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql;