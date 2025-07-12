-- Corrección de fechas del calendario litúrgico de Chile 2025
-- Verificar y corregir cualquier desplazamiento de fechas

-- Primero, verificar las fechas actuales
SELECT date, title FROM liturgical_calendar WHERE date BETWEEN '2025-01-01' AND '2025-01-31' ORDER BY date;

-- Corregir fechas específicas que pueden estar incorrectas
-- Verificar Santa María, Madre de Dios
UPDATE liturgical_calendar 
SET date = '2025-01-01' 
WHERE title = 'Santa María, Madre de Dios' AND date != '2025-01-01';

-- Verificar Epifanía del Señor
UPDATE liturgical_calendar 
SET date = '2025-01-06' 
WHERE title = 'La Epifanía del Señor' AND date != '2025-01-06';

-- Verificar Bautismo del Señor
UPDATE liturgical_calendar 
SET date = '2025-01-13' 
WHERE title = 'El Bautismo del Señor' AND date != '2025-01-13';

-- Verificar San Antonio Abad
UPDATE liturgical_calendar 
SET date = '2025-01-17' 
WHERE title = 'San Antonio Abad' AND date != '2025-01-17';

-- Verificar Santa Inés
UPDATE liturgical_calendar 
SET date = '2025-01-22' 
WHERE title = 'Santa Inés' AND date != '2025-01-22';

-- Verificar Beata Laura Vicuña
UPDATE liturgical_calendar 
SET date = '2025-01-24' 
WHERE title = 'Beata Laura Vicuña' AND date != '2025-01-24';

-- Verificar Conversión de San Pablo
UPDATE liturgical_calendar 
SET date = '2025-01-25' 
WHERE title = 'La Conversión de San Pablo' AND date != '2025-01-25';

-- Verificar Santo Tomás de Aquino
UPDATE liturgical_calendar 
SET date = '2025-01-28' 
WHERE title = 'Santo Tomás de Aquino' AND date != '2025-01-28';

-- Verificar San Juan Bosco
UPDATE liturgical_calendar 
SET date = '2025-01-31' 
WHERE title = 'San Juan Bosco' AND date != '2025-01-31';

-- Función para verificar y corregir fechas automáticamente
CREATE OR REPLACE FUNCTION verify_liturgical_dates()
RETURNS TABLE(
  expected_date date,
  actual_date date,
  title text,
  needs_correction boolean
) AS $$
BEGIN
  RETURN QUERY
  WITH expected_dates AS (
    SELECT '2025-01-01'::date as exp_date, 'Santa María, Madre de Dios' as exp_title
    UNION ALL SELECT '2025-01-06'::date, 'La Epifanía del Señor'
    UNION ALL SELECT '2025-01-13'::date, 'El Bautismo del Señor'
    UNION ALL SELECT '2025-01-17'::date, 'San Antonio Abad'
    UNION ALL SELECT '2025-01-22'::date, 'Santa Inés'
    UNION ALL SELECT '2025-01-24'::date, 'Beata Laura Vicuña'
    UNION ALL SELECT '2025-01-25'::date, 'La Conversión de San Pablo'
    UNION ALL SELECT '2025-01-28'::date, 'Santo Tomás de Aquino'
    UNION ALL SELECT '2025-01-31'::date, 'San Juan Bosco'
    UNION ALL SELECT '2025-02-02'::date, 'La Presentación del Señor'
    UNION ALL SELECT '2025-03-05'::date, 'Miércoles de Ceniza'
    UNION ALL SELECT '2025-03-19'::date, 'San José'
    UNION ALL SELECT '2025-04-13'::date, 'Domingo de Ramos'
    UNION ALL SELECT '2025-04-17'::date, 'Jueves Santo'
    UNION ALL SELECT '2025-04-18'::date, 'Viernes Santo'
    UNION ALL SELECT '2025-04-20'::date, 'Domingo de Pascua'
    UNION ALL SELECT '2025-06-08'::date, 'Domingo de Pentecostés'
    UNION ALL SELECT '2025-07-16'::date, 'Nuestra Señora del Carmen'
    UNION ALL SELECT '2025-08-15'::date, 'La Asunción de la Virgen María'
    UNION ALL SELECT '2025-08-18'::date, 'San Alberto Hurtado Cruchaga'
    UNION ALL SELECT '2025-11-01'::date, 'Todos los Santos'
    UNION ALL SELECT '2025-12-08'::date, 'Inmaculada Concepción'
    UNION ALL SELECT '2025-12-25'::date, 'Navidad del Señor'
  )
  SELECT 
    ed.exp_date,
    lc.date,
    lc.title,
    (ed.exp_date != lc.date) as needs_correction
  FROM expected_dates ed
  LEFT JOIN liturgical_calendar lc ON lc.title = ed.exp_title
  WHERE lc.title IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Ejecutar verificación
SELECT * FROM verify_liturgical_dates() WHERE needs_correction = true;

-- Función para obtener eventos del día con manejo de zona horaria
CREATE OR REPLACE FUNCTION get_liturgical_events_safe(target_date date)
RETURNS TABLE(
  id uuid,
  date date,
  title text,
  celebration_type text,
  liturgical_season text,
  liturgical_color text,
  rank integer,
  is_local_celebration boolean,
  description text,
  patron_of text,
  readings_reference text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    lc.id,
    lc.date,
    lc.title,
    lc.celebration_type,
    lc.liturgical_season,
    lc.liturgical_color,
    lc.rank,
    lc.is_local_celebration,
    lc.description,
    lc.patron_of,
    lc.readings_reference
  FROM liturgical_calendar lc
  WHERE lc.date = target_date
  ORDER BY lc.rank DESC, lc.celebration_type DESC;
END;
$$ LANGUAGE plpgsql;

-- Verificar que las fechas principales estén correctas
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN SELECT * FROM verify_liturgical_dates() WHERE needs_correction = true
  LOOP
    RAISE NOTICE 'FECHA INCORRECTA: % - Esperada: %, Actual: %', 
      rec.title, rec.expected_date, rec.actual_date;
  END LOOP;
END $$;

-- Insertar eventos faltantes si no existen (con fechas correctas)
INSERT INTO liturgical_calendar (date, title, celebration_type, liturgical_season, liturgical_color, rank, is_local_celebration, description) VALUES
('2025-01-01', 'Santa María, Madre de Dios', 'solemnity', 'Navidad', 'Blanco', 10, false, 'Octava de Navidad. Día Mundial de la Paz.'),
('2025-01-06', 'La Epifanía del Señor', 'solemnity', 'Navidad', 'Blanco', 10, false, 'Manifestación de Jesús a los Magos de Oriente'),
('2025-01-13', 'El Bautismo del Señor', 'feast', 'Navidad', 'Blanco', 8, false, 'Fin del Tiempo de Navidad'),
('2025-01-17', 'San Antonio Abad', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Padre del monacato'),
('2025-01-22', 'Santa Inés', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Virgen y mártir'),
('2025-01-24', 'Beata Laura Vicuña', 'memorial', 'Tiempo Ordinario', 'Verde', 3, true, 'Virgen, memoria local de Chile'),
('2025-01-25', 'La Conversión de San Pablo', 'feast', 'Tiempo Ordinario', 'Verde', 8, false, 'Apóstol'),
('2025-01-28', 'Santo Tomás de Aquino', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Doctor de la Iglesia'),
('2025-01-31', 'San Juan Bosco', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Presbítero')
ON CONFLICT (date, title) DO NOTHING;

-- Verificar que las fechas estén correctas después de la corrección
SELECT 
  date,
  title,
  celebration_type,
  liturgical_season,
  is_local_celebration
FROM liturgical_calendar 
WHERE date BETWEEN '2025-01-01' AND '2025-01-31' 
ORDER BY date;