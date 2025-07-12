/*
  # Sistema de Gestión de Contenido para Luz de Fe

  1. Nuevas Tablas
    - `daily_content` - Almacena el contenido diario (evangelios, santos, lecturas)
    - `content_schedule` - Programa la publicación de contenido
    - `admin_users` - Usuarios administradores del sistema
    - `content_categories` - Categorías para organizar el contenido
    - `content_tags` - Etiquetas para clasificar el contenido
    - `content_analytics` - Métricas de visualización y engagement

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas para administradores y editores
    - Políticas de lectura pública para contenido activo

  3. Funcionalidades
    - Versionado de contenido
    - Programación automática
    - Métricas y analytics
    - Sistema de aprobación
*/

-- Tabla principal de contenido diario
CREATE TABLE IF NOT EXISTS daily_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  type text NOT NULL CHECK (type IN ('gospel', 'saint', 'reading')),
  title text NOT NULL,
  content text NOT NULL,
  reference text,
  reflection text,
  prayer text,
  author text,
  feast_day text,
  liturgical_season text,
  liturgical_color text,
  image_url text,
  audio_url text,
  video_url text,
  source_attribution text,
  version integer DEFAULT 1,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'published', 'archived')),
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamptz,
  
  -- Índices únicos para evitar duplicados
  UNIQUE(date, type)
);

-- Tabla de programación de contenido
CREATE TABLE IF NOT EXISTS content_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('gospel', 'saint', 'reading')),
  scheduled_date date NOT NULL,
  content_id uuid REFERENCES daily_content(id) ON DELETE CASCADE,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  
  -- Un solo contenido por tipo por fecha
  UNIQUE(scheduled_date, content_type)
);

-- Tabla de usuarios administradores
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'contributor' CHECK (role IN ('admin', 'editor', 'contributor')),
  permissions text[] DEFAULT '{}',
  department text,
  bio text,
  avatar_url text,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de categorías de contenido
CREATE TABLE IF NOT EXISTS content_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  color text DEFAULT '#3B82F6',
  icon text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Tabla de etiquetas
CREATE TABLE IF NOT EXISTS content_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Tabla de relación contenido-categorías
CREATE TABLE IF NOT EXISTS content_category_relations (
  content_id uuid REFERENCES daily_content(id) ON DELETE CASCADE,
  category_id uuid REFERENCES content_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, category_id)
);

-- Tabla de relación contenido-etiquetas
CREATE TABLE IF NOT EXISTS content_tag_relations (
  content_id uuid REFERENCES daily_content(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES content_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, tag_id)
);

-- Tabla de analytics de contenido
CREATE TABLE IF NOT EXISTS content_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES daily_content(id) ON DELETE CASCADE,
  date date DEFAULT CURRENT_DATE,
  views integer DEFAULT 0,
  shares integer DEFAULT 0,
  likes integer DEFAULT 0,
  time_spent_seconds integer DEFAULT 0,
  bounce_rate decimal(5,2),
  source text, -- 'direct', 'social', 'search', etc.
  device_type text, -- 'desktop', 'mobile', 'tablet'
  country text,
  created_at timestamptz DEFAULT now(),
  
  -- Un registro por contenido por día
  UNIQUE(content_id, date)
);

-- Tabla de comentarios y feedback
CREATE TABLE IF NOT EXISTS content_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES daily_content(id) ON DELETE CASCADE,
  user_email text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_approved boolean DEFAULT false,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamptz
);

-- Habilitar RLS en todas las tablas
ALTER TABLE daily_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_category_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_feedback ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para daily_content
CREATE POLICY "Contenido público visible para todos"
  ON daily_content
  FOR SELECT
  TO public
  USING (is_active = true AND status = 'published');

CREATE POLICY "Administradores pueden ver todo el contenido"
  ON daily_content
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() 
      AND is_active = true
    )
  );

CREATE POLICY "Administradores pueden crear contenido"
  ON daily_content
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() 
      AND is_active = true
    )
  );

CREATE POLICY "Administradores pueden actualizar contenido"
  ON daily_content
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() 
      AND is_active = true
    )
  );

-- Políticas para content_schedule
CREATE POLICY "Administradores pueden gestionar programación"
  ON content_schedule
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() 
      AND is_active = true
    )
  );

-- Políticas para admin_users
CREATE POLICY "Administradores pueden ver otros administradores"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() 
      AND is_active = true
    )
  );

-- Políticas para categorías y etiquetas (públicas para lectura)
CREATE POLICY "Categorías públicas para lectura"
  ON content_categories
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Etiquetas públicas para lectura"
  ON content_tags
  FOR SELECT
  TO public
  USING (true);

-- Políticas para analytics (solo administradores)
CREATE POLICY "Solo administradores pueden ver analytics"
  ON content_analytics
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

-- Políticas para feedback (público para insertar, administradores para gestionar)
CREATE POLICY "Cualquiera puede enviar feedback"
  ON content_feedback
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Feedback aprobado es público"
  ON content_feedback
  FOR SELECT
  TO public
  USING (is_approved = true AND is_public = true);

CREATE POLICY "Administradores pueden gestionar feedback"
  ON content_feedback
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() 
      AND is_active = true
    )
  );

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_daily_content_updated_at
  BEFORE UPDATE ON daily_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para publicar contenido programado automáticamente
CREATE OR REPLACE FUNCTION publish_scheduled_content()
RETURNS void AS $$
BEGIN
  -- Activar contenido programado para hoy
  UPDATE daily_content 
  SET is_active = true, status = 'published'
  WHERE id IN (
    SELECT cs.content_id 
    FROM content_schedule cs
    WHERE cs.scheduled_date = CURRENT_DATE 
    AND cs.is_published = false
  );
  
  -- Marcar como publicado en el schedule
  UPDATE content_schedule 
  SET is_published = true, published_at = now()
  WHERE scheduled_date = CURRENT_DATE 
  AND is_published = false;
END;
$$ LANGUAGE plpgsql;

-- Insertar categorías por defecto
INSERT INTO content_categories (name, description, color, icon) VALUES
  ('Evangelio', 'Lecturas del Evangelio diario', '#DC2626', 'book-open'),
  ('Santos', 'Vidas de santos y beatos', '#2563EB', 'user'),
  ('Lecturas', 'Primera y segunda lectura, salmos', '#059669', 'scroll'),
  ('Tiempo Litúrgico', 'Contenido específico del tiempo litúrgico', '#7C3AED', 'calendar'),
  ('Reflexiones', 'Meditaciones y reflexiones espirituales', '#EA580C', 'heart'),
  ('Oraciones', 'Oraciones tradicionales y contemporáneas', '#0891B2', 'hands-praying')
ON CONFLICT (name) DO NOTHING;

-- Insertar etiquetas comunes
INSERT INTO content_tags (name, description) VALUES
  ('Adviento', 'Contenido del tiempo de Adviento'),
  ('Navidad', 'Contenido del tiempo de Navidad'),
  ('Cuaresma', 'Contenido del tiempo de Cuaresma'),
  ('Pascua', 'Contenido del tiempo de Pascua'),
  ('Tiempo Ordinario', 'Contenido del Tiempo Ordinario'),
  ('María', 'Contenido mariano'),
  ('Jesús', 'Contenido cristológico'),
  ('Espíritu Santo', 'Contenido pneumatológico'),
  ('Familia', 'Contenido sobre la familia'),
  ('Juventud', 'Contenido dirigido a jóvenes'),
  ('Vocaciones', 'Contenido sobre vocaciones'),
  ('Misión', 'Contenido misionero y evangelizador')
ON CONFLICT (name) DO NOTHING;