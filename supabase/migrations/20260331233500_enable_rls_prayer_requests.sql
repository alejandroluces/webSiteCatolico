-- Habilitar Row Level Security (RLS) en la tabla prayer_requests
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas previas si existieran
DROP POLICY IF EXISTS "Permitir lectura de peticiones a todos" ON public.prayer_requests;
DROP POLICY IF EXISTS "Permitir inserción de peticiones a todos" ON public.prayer_requests;

-- Permitir lectura a todos (anon y authenticated)
CREATE POLICY "Permitir lectura de peticiones a todos"
ON public.prayer_requests
FOR SELECT
USING (true);

-- Permitir inserción a todos (anon y authenticated)
CREATE POLICY "Permitir inserción de peticiones a todos"
ON public.prayer_requests
FOR INSERT
WITH CHECK (true);

-- Nota: No se requiere política para UPDATE porque la función increment_prayer_count
-- tiene la directiva SECURITY DEFINER y se ejecuta con permisos de dueño (postgres).
-- Esto evita que usuarios anónimos o maliciosos modifiquen libremente las peticiones.

-- Forzar RLS para mayor seguridad
ALTER TABLE public.prayer_requests FORCE ROW LEVEL SECURITY;
