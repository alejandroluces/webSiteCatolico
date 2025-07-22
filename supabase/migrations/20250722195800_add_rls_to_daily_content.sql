-- Habilitar Row Level Security (RLS) para la tabla daily_content
ALTER TABLE public.daily_content ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Permitir acceso de lectura a todos" ON public.daily_content;
DROP POLICY IF EXISTS "Permitir acceso completo a service_role" ON public.daily_content;

-- Política para permitir el acceso de lectura (SELECT) a cualquier usuario (anónimo y autenticado)
CREATE POLICY "Permitir acceso de lectura a todos"
ON public.daily_content
FOR SELECT
USING (true);

-- Política para permitir todas las operaciones (INSERT, UPDATE, DELETE) solo a los roles de servicio (backend)
CREATE POLICY "Permitir acceso completo a service_role"
ON public.daily_content
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Forzar la aplicación de RLS para los dueños de la tabla
ALTER TABLE public.daily_content FORCE ROW LEVEL SECURITY;

-- Comentario para la política de lectura
COMMENT ON POLICY "Permitir acceso de lectura a todos" ON public.daily_content IS 'Esta política permite que cualquier usuario, incluso anónimo, pueda leer el contenido de la tabla daily_content.';

-- Comentario para la política de escritura
COMMENT ON POLICY "Permitir acceso completo a service_role" ON public.daily_content IS 'Esta política restringe las operaciones de escritura (INSERT, UPDATE, DELETE) únicamente al rol "service_role", que es utilizado por los scripts del backend y las funciones seguras.';
