/*
  # Calendario Litúrgico Católico de Chile 2025
  
  1. Eventos Litúrgicos
    - Solemnidades, fiestas y memorias del año litúrgico
    - Santos locales de Chile (Beata Laura Vicuña, San Alberto Hurtado, etc.)
    - Tiempos litúrgicos con sus colores correspondientes
    
  2. Estructura de Datos
    - Fechas exactas de cada celebración
    - Tipo de celebración (solemnidad, fiesta, memoria)
    - Color litúrgico correspondiente
    - Información específica para Chile
*/

-- Tabla para eventos del calendario litúrgico
CREATE TABLE IF NOT EXISTS liturgical_calendar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  title text NOT NULL,
  celebration_type text NOT NULL CHECK (celebration_type IN ('solemnity', 'feast', 'memorial', 'optional_memorial', 'special')),
  liturgical_season text NOT NULL CHECK (liturgical_season IN ('Adviento', 'Navidad', 'Tiempo Ordinario', 'Cuaresma', 'Pascua')),
  liturgical_color text NOT NULL CHECK (liturgical_color IN ('Blanco', 'Rojo', 'Verde', 'Morado', 'Rosa', 'Dorado')),
  rank integer DEFAULT 0, -- Para determinar precedencia cuando hay conflictos
  is_local_celebration boolean DEFAULT false, -- Para celebraciones específicas de Chile
  description text,
  patron_of text, -- Para santos patronos
  readings_reference text, -- Referencias de lecturas específicas
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(date, title)
);

-- Habilitar RLS
ALTER TABLE liturgical_calendar ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública
CREATE POLICY "Calendario litúrgico público"
  ON liturgical_calendar
  FOR SELECT
  TO public
  USING (true);

-- Política para administradores
CREATE POLICY "Administradores pueden gestionar calendario"
  ON liturgical_calendar
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() 
      AND is_active = true
    )
  );

-- Insertar eventos del calendario litúrgico 2025 para Chile
INSERT INTO liturgical_calendar (date, title, celebration_type, liturgical_season, liturgical_color, rank, is_local_celebration, description, patron_of, readings_reference) VALUES

-- ENERO 2025
('2025-01-01', 'Santa María, Madre de Dios', 'solemnity', 'Navidad', 'Blanco', 10, false, 'Octava de Navidad. Día Mundial de la Paz.', null, 'Nm 6,22-27; Sal 66; Gal 4,4-7; Lc 2,16-21'),
('2025-01-02', 'Santos Basilio Magno y Gregorio de Nacianzo', 'memorial', 'Navidad', 'Blanco', 3, false, 'Doctores de la Iglesia', null, null),
('2025-01-03', 'El Santísimo Nombre de Jesús', 'optional_memorial', 'Navidad', 'Blanco', 2, false, 'Memoria facultativa', null, null),
('2025-01-06', 'La Epifanía del Señor', 'solemnity', 'Navidad', 'Blanco', 10, false, 'Manifestación de Jesús a los Magos de Oriente', null, 'Is 60,1-6; Sal 71; Ef 3,2-3a.5-6; Mt 2,1-12'),
('2025-01-07', 'San Raimundo de Peñafort', 'optional_memorial', 'Navidad', 'Blanco', 2, false, 'Presbítero', null, null),
('2025-01-13', 'El Bautismo del Señor', 'feast', 'Navidad', 'Blanco', 8, false, 'Fin del Tiempo de Navidad', null, 'Is 42,1-4.6-7; Sal 28; Hch 10,34-38; Mc 1,7-11'),
('2025-01-15', 'San Hilario', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Obispo y doctor', null, null),
('2025-01-17', 'San Antonio Abad', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Padre del monacato', null, null),
('2025-01-20', 'San Fabián', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Papa y mártir', null, null),
('2025-01-21', 'San Sebastián', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Mártir', null, null),
('2025-01-22', 'Santa Inés', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Virgen y mártir', null, null),
('2025-01-24', 'Beata Laura Vicuña', 'memorial', 'Tiempo Ordinario', 'Verde', 3, true, 'Virgen, memoria local de Chile', null, null),
('2025-01-25', 'La Conversión de San Pablo', 'feast', 'Tiempo Ordinario', 'Verde', 8, false, 'Apóstol', null, 'Hch 22,3-16; Sal 116; Mc 16,15-18'),
('2025-01-28', 'Santo Tomás de Aquino', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Doctor de la Iglesia', null, null),
('2025-01-31', 'San Juan Bosco', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Presbítero', null, null),

-- FEBRERO 2025
('2025-02-02', 'La Presentación del Señor', 'feast', 'Tiempo Ordinario', 'Blanco', 8, false, 'Candelaria', null, 'Mal 3,1-4; Sal 23; Heb 2,14-18; Lc 2,22-40'),
('2025-02-03', 'San Blas', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Obispo y mártir', null, null),
('2025-02-05', 'Santa Águeda', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Virgen y mártir', null, null),
('2025-02-06', 'Santos Pablo Miki y compañeros', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Mártires del Japón', null, null),
('2025-02-08', 'Beato Pío IX', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Papa', null, null),
('2025-02-10', 'Santa Escolástica', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Virgen', null, null),
('2025-02-17', 'Los Santos Siete Fundadores de la Orden de los Servitas', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Fundadores', null, null),
('2025-02-21', 'San Pedro Damián', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Obispo y doctor', null, null),
('2025-02-22', 'La Cátedra de San Pedro', 'feast', 'Tiempo Ordinario', 'Verde', 8, false, 'Apóstol', null, '1Pe 5,1-4; Sal 22; Mt 16,13-19'),

-- MARZO 2025 - CUARESMA
('2025-03-05', 'Miércoles de Ceniza', 'special', 'Cuaresma', 'Morado', 9, false, 'Inicio de la Cuaresma', null, 'Jl 2,12-18; Sal 50; 2Cor 5,20-6,2; Mt 6,1-6.16-18'),
('2025-03-08', 'San Juan de Dios', 'optional_memorial', 'Cuaresma', 'Morado', 2, false, 'Religioso', null, null),
('2025-03-17', 'San Patricio', 'optional_memorial', 'Cuaresma', 'Morado', 2, false, 'Obispo', null, null),
('2025-03-18', 'San Cirilo de Jerusalén', 'optional_memorial', 'Cuaresma', 'Morado', 2, false, 'Obispo y doctor', null, null),
('2025-03-19', 'San José', 'solemnity', 'Cuaresma', 'Blanco', 10, false, 'Esposo de la Virgen María', 'Trabajadores', '2Sam 7,4-5a.12-14a.16; Sal 88; Rom 4,13.16-18.22; Mt 1,16.18-21.24a'),

-- ABRIL 2025 - SEMANA SANTA Y PASCUA
('2025-04-01', 'San Francisco de Paula', 'optional_memorial', 'Cuaresma', 'Morado', 2, false, 'Ermitaño', null, null),
('2025-04-04', 'San Isidoro', 'optional_memorial', 'Cuaresma', 'Morado', 2, false, 'Obispo y doctor', null, null),
('2025-04-05', 'San Vicente Ferrer', 'optional_memorial', 'Cuaresma', 'Morado', 2, false, 'Presbítero', null, null),
('2025-04-07', 'San Juan Bautista de La Salle', 'memorial', 'Cuaresma', 'Morado', 3, false, 'Presbítero', 'Educadores', null),
('2025-04-11', 'San Estanislao', 'memorial', 'Cuaresma', 'Morado', 3, false, 'Obispo y mártir', null, null),
('2025-04-13', 'Domingo de Ramos', 'special', 'Cuaresma', 'Rojo', 9, false, 'Entrada triunfal de Jesús en Jerusalén', null, 'Is 50,4-7; Sal 21; Flp 2,6-11; Mc 14,1-15,47'),
('2025-04-17', 'Jueves Santo', 'special', 'Cuaresma', 'Blanco', 9, false, 'Institución de la Eucaristía', null, 'Ex 12,1-8.11-14; Sal 115; 1Cor 11,23-26; Jn 13,1-15'),
('2025-04-18', 'Viernes Santo', 'special', 'Cuaresma', 'Rojo', 9, false, 'Pasión y Muerte del Señor', null, 'Is 52,13-53,12; Sal 30; Heb 4,14-16; 5,7-9; Jn 18,1-19,42'),
('2025-04-20', 'Domingo de Pascua', 'solemnity', 'Pascua', 'Blanco', 10, false, 'Resurrección del Señor', null, 'Hch 10,34a.37-43; Sal 117; Col 3,1-4; Jn 20,1-9'),
('2025-04-28', 'San Luis María Grignion de Montfort', 'optional_memorial', 'Pascua', 'Blanco', 2, false, 'Presbítero', null, null),
('2025-04-29', 'Santa Catalina de Siena', 'feast', 'Pascua', 'Blanco', 8, false, 'Doctora de la Iglesia', 'Europa', '1Jn 1,5-2,2; Sal 102; Mt 11,25-30'),

-- MAYO 2025 - TIEMPO PASCUAL
('2025-05-01', 'San José Obrero', 'optional_memorial', 'Pascua', 'Blanco', 2, false, 'Esposo de la Virgen María', 'Trabajadores', null),
('2025-05-02', 'San Atanasio', 'memorial', 'Pascua', 'Blanco', 3, false, 'Obispo y doctor', null, null),
('2025-05-03', 'Santos Felipe y Santiago', 'feast', 'Pascua', 'Blanco', 8, false, 'Apóstoles', null, '1Cor 15,1-8; Sal 18; Jn 14,6-14'),
('2025-05-10', 'San Juan de Ávila', 'optional_memorial', 'Pascua', 'Blanco', 2, false, 'Presbítero y doctor', null, null),
('2025-05-12', 'San Pancracio', 'optional_memorial', 'Pascua', 'Blanco', 2, false, 'Mártir', null, null),
('2025-05-14', 'San Matías', 'feast', 'Pascua', 'Blanco', 8, false, 'Apóstol', null, 'Hch 1,15-17.20-26; Sal 112; Jn 15,9-17'),
('2025-05-20', 'San Bernardino de Siena', 'optional_memorial', 'Pascua', 'Blanco', 2, false, 'Presbítero', null, null),
('2025-05-22', 'Santa Rita de Casia', 'optional_memorial', 'Pascua', 'Blanco', 2, false, 'Religiosa', null, null),
('2025-05-25', 'San Felipe Neri', 'memorial', 'Pascua', 'Blanco', 3, false, 'Presbítero', null, null),
('2025-05-26', 'San Agustín de Canterbury', 'optional_memorial', 'Pascua', 'Blanco', 2, false, 'Obispo', null, null),
('2025-05-29', 'La Ascensión del Señor', 'solemnity', 'Pascua', 'Blanco', 10, false, 'Ascensión de Jesús al cielo', null, 'Hch 1,1-11; Sal 46; Ef 1,17-23; Mc 16,15-20'),
('2025-05-31', 'La Visitación de la Virgen María', 'feast', 'Pascua', 'Blanco', 8, false, 'María visita a Isabel', null, 'Sof 3,14-18a; Is 12,2-6; Lc 1,39-56'),

-- JUNIO 2025
('2025-06-01', 'San Justino', 'memorial', 'Pascua', 'Blanco', 3, false, 'Mártir', null, null),
('2025-06-03', 'Santos Carlos Luanga y compañeros', 'memorial', 'Pascua', 'Blanco', 3, false, 'Mártires de Uganda', null, null),
('2025-06-05', 'San Bonifacio', 'memorial', 'Pascua', 'Blanco', 3, false, 'Obispo y mártir', null, null),
('2025-06-06', 'San Norberto', 'optional_memorial', 'Pascua', 'Blanco', 2, false, 'Obispo', null, null),
('2025-06-08', 'Domingo de Pentecostés', 'solemnity', 'Pascua', 'Rojo', 10, false, 'Venida del Espíritu Santo', null, 'Hch 2,1-11; Sal 103; 1Cor 12,3b-7.12-13; Jn 20,19-23'),
('2025-06-09', 'Virgen María, Madre de la Iglesia', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Lunes después de Pentecostés', null, null),
('2025-06-11', 'San Bernabé', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Apóstol', null, null),
('2025-06-13', 'San Antonio de Padua', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Doctor de la Iglesia', null, null),
('2025-06-15', 'La Santísima Trinidad', 'solemnity', 'Tiempo Ordinario', 'Blanco', 10, false, 'Misterio de la Trinidad', null, 'Dt 4,32-34.39-40; Sal 32; Rom 8,14-17; Mt 28,16-20'),
('2025-06-19', 'El Cuerpo y la Sangre de Cristo', 'solemnity', 'Tiempo Ordinario', 'Blanco', 10, false, 'Corpus Christi', null, 'Ex 24,3-8; Sal 115; Heb 9,11-15; Mc 14,12-16.22-26'),
('2025-06-24', 'San Juan Bautista', 'solemnity', 'Tiempo Ordinario', 'Blanco', 10, false, 'Nacimiento del Precursor', null, 'Is 49,1-6; Sal 138; Hch 13,22-26; Lc 1,57-66.80'),
('2025-06-27', 'El Sagrado Corazón de Jesús', 'solemnity', 'Tiempo Ordinario', 'Blanco', 10, false, 'Devoción al Corazón de Jesús', null, 'Ez 34,11-16; Sal 22; Rom 5,5b-11; Lc 15,3-7'),
('2025-06-28', 'El Inmaculado Corazón de María', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Sábado después del Sagrado Corazón', null, null),
('2025-06-29', 'Santos Pedro y Pablo', 'solemnity', 'Tiempo Ordinario', 'Rojo', 10, false, 'Apóstoles', null, 'Hch 12,1-11; Sal 33; 2Tim 4,6-8.17-18; Mt 16,13-19'),

-- JULIO 2025
('2025-07-03', 'Santo Tomás', 'feast', 'Tiempo Ordinario', 'Verde', 8, false, 'Apóstol', null, 'Ef 2,19-22; Sal 116; Jn 20,24-29'),
('2025-07-11', 'San Benito', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Abad', 'Europa', null),
('2025-07-14', 'San Camilo de Lellis', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Presbítero', null, null),
('2025-07-15', 'San Buenaventura', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Obispo y doctor', null, null),
('2025-07-16', 'Nuestra Señora del Carmen', 'feast', 'Tiempo Ordinario', 'Blanco', 8, true, 'Madre y Reina de Chile', 'Chile', '1Re 18,41-46; Sal 95; Gal 4,4-7; Mt 12,46-50'),
('2025-07-22', 'Santa María Magdalena', 'feast', 'Tiempo Ordinario', 'Verde', 8, false, 'Discípula del Señor', null, 'Cant 3,1-4a; Sal 62; 2Cor 5,14-17; Jn 20,1-2.11-18'),
('2025-07-23', 'Santa Brígida de Suecia', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Religiosa', 'Europa', null),
('2025-07-25', 'Santiago', 'feast', 'Tiempo Ordinario', 'Verde', 8, false, 'Apóstol', 'España', '2Cor 4,7-15; Sal 125; Mt 20,20-28'),
('2025-07-26', 'Santos Joaquín y Ana', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Padres de la Virgen María', null, null),
('2025-07-31', 'San Ignacio de Loyola', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Presbítero', null, null),

-- AGOSTO 2025
('2025-08-01', 'San Alfonso María de Ligorio', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Doctor de la Iglesia', null, null),
('2025-08-04', 'San Juan María Vianney', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Presbítero', 'Párrocos', null),
('2025-08-05', 'Dedicación de Santa María la Mayor', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Basílica romana', null, null),
('2025-08-06', 'La Transfiguración del Señor', 'feast', 'Tiempo Ordinario', 'Verde', 8, false, 'Transfiguración en el monte', null, 'Dn 7,9-10.13-14; Sal 96; 2Pe 1,16-19; Mc 9,2-10'),
('2025-08-08', 'Santo Domingo', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Presbítero', null, null),
('2025-08-09', 'Santa Teresa Benedicta de la Cruz', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Virgen y mártir', 'Europa', null),
('2025-08-10', 'San Lorenzo', 'feast', 'Tiempo Ordinario', 'Verde', 8, false, 'Diácono y mártir', null, '2Cor 9,6-10; Sal 111; Jn 12,24-26'),
('2025-08-11', 'Santa Clara', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Virgen', null, null),
('2025-08-14', 'San Maximiliano María Kolbe', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Mártir', null, null),
('2025-08-15', 'La Asunción de la Virgen María', 'solemnity', 'Tiempo Ordinario', 'Blanco', 10, false, 'Asunción de María al cielo', null, 'Ap 11,19a; 12,1-6a.10ab; Sal 44; 1Cor 15,20-27; Lc 1,39-56'),
('2025-08-18', 'San Alberto Hurtado Cruchaga', 'feast', 'Tiempo Ordinario', 'Blanco', 8, true, 'Presbítero, fiesta nacional chilena', 'Chile', 'Is 58,6-11; Sal 111; 1Jn 3,14-18; Mt 25,31-46'),
('2025-08-20', 'San Bernardo', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Abad y doctor', null, null),
('2025-08-21', 'San Pío X', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Papa', null, null),
('2025-08-22', 'La Virgen María, Reina', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Realeza de María', null, null),
('2025-08-24', 'San Bartolomé', 'feast', 'Tiempo Ordinario', 'Verde', 8, false, 'Apóstol', null, 'Ap 21,9b-14; Sal 144; Jn 1,45-51'),
('2025-08-26', 'Beato Ceferino Namuncurá', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, true, 'Joven mapuche, memoria local', null, null),
('2025-08-27', 'Santa Mónica', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Madre de San Agustín', null, null),
('2025-08-28', 'San Agustín', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Obispo y doctor', null, null),
('2025-08-29', 'El Martirio de San Juan Bautista', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Muerte del Precursor', null, null),
('2025-08-30', 'Santa Rosa de Lima', 'feast', 'Tiempo Ordinario', 'Verde', 8, false, 'Virgen', 'América Latina', '2Cor 10,17-11,2; Sal 148; Mt 13,44-46'),

-- SEPTIEMBRE 2025
('2025-09-03', 'San Gregorio Magno', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Papa y doctor', null, null),
('2025-09-08', 'Natividad de la Virgen María', 'feast', 'Tiempo Ordinario', 'Verde', 8, false, 'Nacimiento de María', null, 'Miq 5,1-4a; Sal 12; Mt 1,1-16.18-23'),
('2025-09-09', 'San Pedro Claver', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Presbítero', null, null),
('2025-09-13', 'San Juan Crisóstomo', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Obispo y doctor', null, null),
('2025-09-14', 'Exaltación de la Santa Cruz', 'feast', 'Tiempo Ordinario', 'Verde', 8, false, 'Triunfo de la Cruz', null, 'Nm 21,4b-9; Sal 77; Flp 2,6-11; Jn 3,13-17'),
('2025-09-15', 'Nuestra Señora de los Dolores', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Dolores de María', null, null),
('2025-09-16', 'Santos Cornelio y Cipriano', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Papa y obispo mártires', null, null),
('2025-09-17', 'San Roberto Belarmino', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Obispo y doctor', null, null),
('2025-09-18', 'Fiestas Patrias de Chile', 'special', 'Tiempo Ordinario', 'Verde', 1, true, 'Independencia de Chile', null, null),
('2025-09-19', 'San Jenaro', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Obispo y mártir', null, null),
('2025-09-20', 'Santos Andrés Kim Taegon y Pablo Chong Hasang y compañeros', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Mártires de Corea', null, null),
('2025-09-21', 'San Mateo', 'feast', 'Tiempo Ordinario', 'Verde', 8, false, 'Apóstol y evangelista', null, 'Ef 4,1-7.11-13; Sal 18; Mt 9,9-13'),
('2025-09-23', 'San Pío de Pietrelcina', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Presbítero', null, null),
('2025-09-26', 'Santos Cosme y Damián', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Mártires', null, null),
('2025-09-27', 'San Vicente de Paúl', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Presbítero', null, null),
('2025-09-28', 'San Wenceslao', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Mártir', null, null),
('2025-09-29', 'Santos Miguel, Gabriel y Rafael', 'feast', 'Tiempo Ordinario', 'Verde', 8, false, 'Arcángeles', null, 'Dn 7,9-10.13-14; Sal 137; Ap 12,7-12a; Jn 1,47-51'),
('2025-09-30', 'San Jerónimo', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Presbítero y doctor', null, null),

-- OCTUBRE 2025
('2025-10-01', 'Santa Teresita del Niño Jesús', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Doctora de la Iglesia', null, null),
('2025-10-02', 'Los Santos Ángeles Custodios', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Ángeles guardianes', null, null),
('2025-10-04', 'San Francisco de Asís', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Fundador franciscano', null, null),
('2025-10-06', 'San Bruno', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Presbítero', null, null),
('2025-10-07', 'Nuestra Señora del Rosario', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Devoción mariana', null, null),
('2025-10-09', 'San Dionisio y compañeros', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Obispo y mártires', null, null),
('2025-10-11', 'San Juan XXIII', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Papa', null, null),
('2025-10-14', 'San Calixto I', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Papa y mártir', null, null),
('2025-10-15', 'Santa Teresa de Jesús', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Doctora de la Iglesia', null, null),
('2025-10-16', 'Santa Eduvigis', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Religiosa', null, null),
('2025-10-17', 'San Ignacio de Antioquía', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Obispo y mártir', null, null),
('2025-10-18', 'San Lucas', 'feast', 'Tiempo Ordinario', 'Verde', 8, false, 'Evangelista', null, '2Tim 4,10-17b; Sal 144; Lc 10,1-9'),
('2025-10-19', 'Santos Juan de Brébeuf e Isaac Jogues y compañeros', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Mártires de América del Norte', null, null),
('2025-10-23', 'San Juan de Capistrano', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Presbítero', null, null),
('2025-10-24', 'San Antonio María Claret', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Obispo', null, null),
('2025-10-28', 'Santos Simón y Judas', 'feast', 'Tiempo Ordinario', 'Verde', 8, false, 'Apóstoles', null, 'Ef 2,19-22; Sal 18; Lc 6,12-16'),

-- NOVIEMBRE 2025
('2025-11-01', 'Todos los Santos', 'solemnity', 'Tiempo Ordinario', 'Blanco', 10, false, 'Comunión de los santos', null, 'Ap 7,2-4.9-14; Sal 23; 1Jn 3,1-3; Mt 5,1-12a'),
('2025-11-02', 'Fieles Difuntos', 'special', 'Tiempo Ordinario', 'Morado', 9, false, 'Conmemoración de los difuntos', null, 'Sab 3,1-9; Sal 22; Rom 5,5-11; Jn 6,37-40'),
('2025-11-03', 'San Martín de Porres', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Religioso', null, null),
('2025-11-04', 'San Carlos Borromeo', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Obispo', null, null),
('2025-11-09', 'Dedicación de la Basílica de Letrán', 'feast', 'Tiempo Ordinario', 'Verde', 8, false, 'Catedral del Papa', null, 'Ez 47,1-2.8-9.12; Sal 45; 1Cor 3,9c-11.16-17; Jn 2,13-22'),
('2025-11-10', 'San León Magno', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Papa y doctor', null, null),
('2025-11-11', 'San Martín de Tours', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Obispo', null, null),
('2025-11-12', 'San Josafat', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Obispo y mártir', null, null),
('2025-11-15', 'San Alberto Magno', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Obispo y doctor', null, null),
('2025-11-16', 'Santa Margarita de Escocia', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Reina', null, null),
('2025-11-17', 'Santa Isabel de Hungría', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Religiosa', null, null),
('2025-11-18', 'Dedicación de las Basílicas de San Pedro y San Pablo', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Basílicas romanas', null, null),
('2025-11-20', 'San Edmundo', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Rey y mártir', null, null),
('2025-11-21', 'Presentación de la Virgen María', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'María presentada en el Templo', null, null),
('2025-11-22', 'Santa Cecilia', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Virgen y mártir', 'Músicos', null),
('2025-11-23', 'San Clemente I', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Papa y mártir', null, null),
('2025-11-24', 'Santos Andrés Dung-Lac y compañeros', 'memorial', 'Tiempo Ordinario', 'Verde', 3, false, 'Mártires de Vietnam', null, null),
('2025-11-25', 'Santa Catalina de Alejandría', 'optional_memorial', 'Tiempo Ordinario', 'Verde', 2, false, 'Virgen y mártir', null, null),
('2025-11-30', 'San Andrés', 'feast', 'Adviento', 'Morado', 8, false, 'Apóstol', 'Escocia', 'Rom 10,9-18; Sal 18; Mt 4,18-22'),

-- DICIEMBRE 2025 - ADVIENTO Y NAVIDAD
('2025-12-01', 'Primer Domingo de Adviento', 'special', 'Adviento', 'Morado', 9, false, 'Inicio del Adviento', null, 'Jer 33,14-16; Sal 24; 1Tes 3,12-4,2; Lc 21,25-28.34-36'),
('2025-12-03', 'San Francisco Javier', 'memorial', 'Adviento', 'Morado', 3, false, 'Presbítero', 'Misiones', null),
('2025-12-04', 'San Juan Damasceno', 'optional_memorial', 'Adviento', 'Morado', 2, false, 'Presbítero y doctor', null, null),
('2025-12-06', 'San Nicolás', 'optional_memorial', 'Adviento', 'Morado', 2, false, 'Obispo', null, null),
('2025-12-07', 'San Ambrosio', 'memorial', 'Adviento', 'Morado', 3, false, 'Obispo y doctor', null, null),
('2025-12-08', 'Inmaculada Concepción', 'solemnity', 'Adviento', 'Blanco', 10, false, 'Concepción sin pecado de María', null, 'Gn 3,9-15.20; Sal 97; Ef 1,3-6.11-12; Lc 1,26-38'),
('2025-12-09', 'San Juan Diego Cuauhtlatoatzin', 'optional_memorial', 'Adviento', 'Morado', 2, false, 'Vidente de Guadalupe', null, null),
('2025-12-11', 'San Dámaso I', 'optional_memorial', 'Adviento', 'Morado', 2, false, 'Papa', null, null),
('2025-12-12', 'Nuestra Señora de Guadalupe', 'feast', 'Adviento', 'Blanco', 8, false, 'Patrona de América', 'América', 'Zac 2,14-17; Jdt 13,18bcde.19; Lc 1,26-38'),
('2025-12-13', 'Santa Lucía', 'memorial', 'Adviento', 'Morado', 3, false, 'Virgen y mártir', null, null),
('2025-12-14', 'San Juan de la Cruz', 'memorial', 'Adviento', 'Morado', 3, false, 'Doctor de la Iglesia', null, null),
('2025-12-21', 'San Pedro Canisio', 'optional_memorial', 'Adviento', 'Morado', 2, false, 'Presbítero y doctor', null, null),
('2025-12-23', 'San Juan de Kety', 'optional_memorial', 'Adviento', 'Morado', 2, false, 'Presbítero', null, null),
('2025-12-25', 'Navidad del Señor', 'solemnity', 'Navidad', 'Blanco', 10, false, 'Nacimiento de Jesús', null, 'Is 52,7-10; Sal 97; Heb 1,1-6; Jn 1,1-18'),
('2025-12-26', 'San Esteban', 'feast', 'Navidad', 'Rojo', 8, false, 'Protomártir', null, 'Hch 6,8-10; 7,54-59; Sal 30; Mt 10,17-22'),
('2025-12-27', 'San Juan', 'feast', 'Navidad', 'Blanco', 8, false, 'Apóstol y evangelista', null, '1Jn 1,1-4; Sal 96; Jn 20,1a.2-8'),
('2025-12-28', 'Santos Inocentes', 'feast', 'Navidad', 'Rojo', 8, false, 'Mártires', null, '1Jn 1,5-2,2; Sal 123; Mt 2,13-18'),
('2025-12-29', 'Santo Tomás Becket', 'optional_memorial', 'Navidad', 'Blanco', 2, false, 'Obispo y mártir', null, null),
('2025-12-31', 'San Silvestre I', 'optional_memorial', 'Navidad', 'Blanco', 2, false, 'Papa', null, null);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_liturgical_calendar_date ON liturgical_calendar(date);
CREATE INDEX IF NOT EXISTS idx_liturgical_calendar_season ON liturgical_calendar(liturgical_season);
CREATE INDEX IF NOT EXISTS idx_liturgical_calendar_type ON liturgical_calendar(celebration_type);
CREATE INDEX IF NOT EXISTS idx_liturgical_calendar_local ON liturgical_calendar(is_local_celebration);
CREATE INDEX IF NOT EXISTS idx_liturgical_calendar_rank ON liturgical_calendar(rank DESC);

-- Función para obtener eventos litúrgicos por fecha
CREATE OR REPLACE FUNCTION get_liturgical_events(target_date date)
RETURNS TABLE(
  title text,
  celebration_type text,
  liturgical_season text,
  liturgical_color text,
  rank integer,
  is_local_celebration boolean,
  description text,
  patron_of text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    lc.title,
    lc.celebration_type,
    lc.liturgical_season,
    lc.liturgical_color,
    lc.rank,
    lc.is_local_celebration,
    lc.description,
    lc.patron_of
  FROM liturgical_calendar lc
  WHERE lc.date = target_date
  ORDER BY lc.rank DESC, lc.celebration_type DESC;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener el tiempo litúrgico actual
CREATE OR REPLACE FUNCTION get_current_liturgical_season(target_date date DEFAULT CURRENT_DATE)
RETURNS TABLE(
  season text,
  color text,
  week_number integer,
  season_description text
) AS $$
DECLARE
  current_season text;
  current_color text;
  week_num integer := 1;
  season_desc text;
BEGIN
  -- Determinar el tiempo litúrgico basado en la fecha
  
  -- Adviento (4 domingos antes de Navidad)
  IF target_date >= '2024-12-01' AND target_date <= '2024-12-24' THEN
    current_season := 'Adviento';
    current_color := 'Morado';
    season_desc := 'Tiempo de preparación para la Navidad';
    
  -- Navidad (25 dic - Bautismo del Señor)
  ELSIF target_date >= '2024-12-25' OR target_date <= '2025-01-13' THEN
    current_season := 'Navidad';
    current_color := 'Blanco';
    season_desc := 'Celebración del nacimiento de Jesús';
    
  -- Cuaresma (Miércoles de Ceniza - Sábado Santo)
  ELSIF target_date >= '2025-03-05' AND target_date <= '2025-04-19' THEN
    current_season := 'Cuaresma';
    current_color := 'Morado';
    season_desc := 'Tiempo de penitencia y preparación para la Pascua';
    
  -- Pascua (Domingo de Pascua - Pentecostés)
  ELSIF target_date >= '2025-04-20' AND target_date <= '2025-06-08' THEN
    current_season := 'Pascua';
    current_color := 'Blanco';
    season_desc := 'Celebración de la Resurrección de Jesús';
    
  -- Tiempo Ordinario
  ELSE
    current_season := 'Tiempo Ordinario';
    current_color := 'Verde';
    season_desc := 'Tiempo de crecimiento en la fe cristiana';
  END IF;
  
  -- Verificar si hay una celebración especial que cambie el color
  SELECT lc.liturgical_color INTO current_color
  FROM liturgical_calendar lc
  WHERE lc.date = target_date
  AND lc.rank >= 8
  ORDER BY lc.rank DESC
  LIMIT 1;
  
  RETURN QUERY SELECT current_season, current_color, week_num, season_desc;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener santos del día
CREATE OR REPLACE FUNCTION get_saints_of_day(target_date date DEFAULT CURRENT_DATE)
RETURNS TABLE(
  saint_name text,
  celebration_type text,
  description text,
  patron_of text,
  is_local boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    lc.title,
    lc.celebration_type,
    lc.description,
    lc.patron_of,
    lc.is_local_celebration
  FROM liturgical_calendar lc
  WHERE lc.date = target_date
  AND lc.title NOT LIKE '%Domingo%'
  AND lc.title NOT LIKE '%Miércoles de Ceniza%'
  AND lc.title NOT LIKE '%Viernes Santo%'
  AND lc.title NOT LIKE '%Pascua%'
  AND lc.title NOT LIKE '%Pentecostés%'
  ORDER BY lc.rank DESC;
END;
$$ LANGUAGE plpgsql;

-- Insertar configuración específica para Chile
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
  ('liturgical_country', '"Chile"', 'País para calendario litúrgico específico', false),
  ('local_celebrations_enabled', 'true', 'Habilitar celebraciones locales', false),
  ('liturgical_calendar_year', '2025', 'Año del calendario litúrgico actual', false)
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- Insertar categorías específicas para contenido litúrgico
INSERT INTO content_categories (name, description, color, icon) VALUES
  ('Solemnidades', 'Celebraciones de máximo rango litúrgico', '#DC2626', 'crown'),
  ('Fiestas', 'Celebraciones de segundo rango litúrgico', '#2563EB', 'star'),
  ('Memorias', 'Celebraciones de tercer rango litúrgico', '#059669', 'bookmark'),
  ('Santos Chilenos', 'Santos y beatos específicos de Chile', '#EA580C', 'flag'),
  ('Tiempo Litúrgico', 'Contenido específico de cada tiempo', '#7C3AED', 'calendar-days')
ON CONFLICT (name) DO NOTHING;

-- Insertar etiquetas para el calendario litúrgico
INSERT INTO content_tags (name, description) VALUES
  ('Calendario Litúrgico', 'Eventos del calendario litúrgico católico'),
  ('Santos Chilenos', 'Santos y beatos de Chile'),
  ('Solemnidades', 'Celebraciones de máximo rango'),
  ('Fiestas Litúrgicas', 'Fiestas del calendario litúrgico'),
  ('Memorias Litúrgicas', 'Memorias del calendario litúrgico'),
  ('Adviento 2025', 'Tiempo de Adviento'),
  ('Navidad 2025', 'Tiempo de Navidad'),
  ('Cuaresma 2025', 'Tiempo de Cuaresma'),
  ('Pascua 2025', 'Tiempo de Pascua'),
  ('Tiempo Ordinario 2025', 'Tiempo Ordinario'),
  ('Beata Laura Vicuña', 'Beata chilena'),
  ('San Alberto Hurtado', 'Santo chileno'),
  ('Nuestra Señora del Carmen', 'Patrona de Chile'),
  ('Beato Ceferino Namuncurá', 'Beato mapuche')
ON CONFLICT (name) DO NOTHING;