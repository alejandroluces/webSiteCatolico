#!/usr/bin/env node

/**
 * Script para sincronizar el evangelio del día con Supabase
 * Lee los archivos Excel con formato DDMMYYYY.xlsx y actualiza la base de datos
 */

import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import ExcelJS from 'exceljs';
import fs from 'fs/promises';
import cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';

// Cargar variables de entorno
config();

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

// Inicializar cliente de Supabase
let supabase = null;
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * Verifica la conexión con Supabase
 */
async function checkSupabaseConnection() {
  if (!supabase) {
    console.error('❌ Supabase no está configurado. Verifica las variables de entorno VITE_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
    return false;
  }

  try {
    const { data, error } = await supabase.from('daily_content').select('count(*)', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Error al conectar con Supabase:', error);
      return false;
    }
    
    console.log('✅ Conexión con Supabase establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al verificar la conexión con Supabase:', error);
    return false;
  }
}

/**
 * Convierte una fecha YYYY-MM-DD a formato DDMMYYYY para nombres de archivos
 */
function formatDateForFileName(date) {
  const parts = date.split('-');
  if (parts.length !== 3) {
    throw new Error('Formato de fecha inválido. Debe ser YYYY-MM-DD');
  }
  return `${parts[2]}${parts[1]}${parts[0]}`;
}

/**
 * Verifica si existe un archivo Excel para la fecha especificada
 */
async function checkExcelFileExists(date) {
  try {
    const fileName = formatDateForFileName(date);
    const filePath = path.join(projectRoot, 'public', 'images', 'gospels', `${fileName}.xlsx`);
    
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Verifica si existe una imagen para la fecha especificada
 */
async function checkImageFileExists(date) {
  try {
    const fileName = formatDateForFileName(date);
    const filePath = path.join(projectRoot, 'public', 'images', 'gospels', `${fileName}.png`);
    
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Lee el archivo Excel para la fecha especificada y extrae los datos del evangelio
 */
async function readGospelFromExcel(date) {
  try {
    const fileName = formatDateForFileName(date);
    const filePath = path.join(projectRoot, 'public', 'images', 'gospels', `${fileName}.xlsx`);
    
    // Verificar si el archivo existe
    try {
      await fs.access(filePath);
      console.log(`✅ Archivo Excel encontrado: ${filePath}`);
    } catch (error) {
      console.error(`❌ No se encontró el archivo Excel para la fecha ${date}`);
      return null;
    }
    
    // Leer el archivo Excel
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      console.error('❌ No se encontró la hoja de trabajo en el archivo Excel');
      return null;
    }
    
    // Leer la celda I2 que contiene el evangelio
    const cellI2 = worksheet.getCell('I2');
    if (!cellI2 || !cellI2.value) {
      console.error('❌ No se encontró contenido en la celda I2');
      return null;
    }
    
    const cellContent = cellI2.text;
    console.log('📄 Contenido encontrado en la celda I2');
    
    // Parsear el contenido
    const lines = cellContent.split('\n').filter(line => line.trim() !== '');
    
    let title = '';
    let reference = '';
    let content = '';
    let prayer = '';
    
    // Buscar las secciones
    let currentSection = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.includes('Evangelio del Día')) {
        title = line.replace(/["*]/g, '').trim();
        currentSection = 'title';
      } else if (line.includes('Lectura del santo evangelio según')) {
        reference = line.trim();
        currentSection = 'reference';
      } else if (line.includes('Oración de la mañana')) {
        currentSection = 'prayer';
      } else {
        if (currentSection === 'reference' && !line.includes('Oración')) {
          content += line + '\n';
        } else if (currentSection === 'prayer') {
          prayer += line + '\n';
        }
      }
    }
    
    // Verificar si existe la imagen correspondiente
    const hasImage = await checkImageFileExists(date);
    
    return {
      date,
      title: title || 'Evangelio del Día',
      reference: reference || '',
      content: content.trim(),
      prayer: prayer.trim(),
      image_url: hasImage ? `/images/gospels/${fileName}.png` : undefined
    };
    
  } catch (error) {
    console.error('❌ Error al leer el archivo Excel:', error);
    return null;
  }
}

/**
 * Genera una reflexión para el evangelio
 */
async function generateReflection(content, reference, title) {
  // Implementación simplificada sin Gemini API
  return `El Evangelio de hoy nos invita a reflexionar sobre la presencia de Dios en nuestras vidas y cómo podemos responder a su llamado. 

Las palabras de Jesús resuenan en nuestro interior, desafiándonos a vivir con mayor autenticidad y compromiso nuestra fe. En un mundo que a menudo nos distrae con preocupaciones superficiales, el mensaje evangélico nos recuerda lo que verdaderamente importa.

Cada uno de nosotros está llamado a ser discípulo, a seguir a Cristo no solo con palabras sino con acciones concretas. Esto implica estar atentos a las necesidades de nuestros hermanos, practicar la misericordia y la compasión, y buscar siempre la verdad y la justicia.

La invitación de hoy es a renovar nuestra relación con Dios, a profundizar en la oración y a dejarnos transformar por su Palabra. Solo así podremos ser auténticos testigos del Evangelio en nuestras familias, comunidades y lugares de trabajo.`;
}

/**
 * Sincroniza el evangelio para una fecha específica
 */
async function syncGospelForDate(date, options = {}) {
  try {
    const { force = false, update = false } = options;
    console.log(`🔄 Sincronizando evangelio para la fecha: ${date} (force: ${force}, update: ${update})`);

    // Verificar si Supabase está configurado
    if (!supabase) {
      console.error('❌ Supabase no está configurado. No se puede sincronizar el evangelio.');
      return false;
    }

    // 1. Leer datos del archivo Excel
    const gospelData = await readGospelFromExcel(date);

    if (!gospelData) {
      console.error(`❌ No se pudo leer el archivo Excel para la fecha ${date}`);
      return false;
    }

    // 2. Generar reflexión
    let reflection = '';
    try {
      reflection = await generateReflection(
        gospelData.content,
        gospelData.reference,
        gospelData.title
      );
    } catch (error) {
      console.warn('⚠️ No se pudo generar la reflexión. Usando texto predeterminado.');
      reflection = "Medita en silencio sobre la Palabra de Dios y permite que el Espíritu Santo te hable al corazón.";
    }

    // 3. Verificar si ya existe un registro para esta fecha
    const { data: existingGospel, error: checkError } = await supabase
      .from('daily_content')
      .select('id')
      .eq('date', date)
      .eq('type', 'gospel')
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error(`❌ Error al verificar si existe el evangelio: ${checkError.message}`);
      return false;
    }

    // 4. Preparar datos para guardar
    const gospelToSave = {
      date: gospelData.date,
      type: 'gospel',
      title: gospelData.title,
      content: gospelData.content,
      reference: gospelData.reference,
      reflection: reflection,
      prayer: gospelData.prayer,
      image_url: gospelData.image_url,
      liturgical_season: 'Tiempo Ordinario', // Esto podría determinarse automáticamente
      liturgical_color: 'Verde',
      status: 'published',
      is_active: true,
      updated_at: new Date().toISOString()
    };

    // 5. Lógica de inserción/actualización
    if (force) {
      // Forzar "upsert"
      const { error } = await supabase.from('daily_content').upsert(gospelToSave, { onConflict: 'date, type' });
      if (error) {
        console.error(`❌ Error en la operación upsert: ${error.message}`);
        return false;
      }
      console.log(`✅ Evangelio insertado/actualizado (force) correctamente para la fecha ${date}`);
    } else if (update) {
      // Forzar solo actualización
      if (existingGospel) {
        const { error } = await supabase.from('daily_content').update(gospelToSave).eq('id', existingGospel.id);
        if (error) {
          console.error(`❌ Error al actualizar el evangelio: ${error.message}`);
          return false;
        }
        console.log(`✅ Evangelio actualizado (update) correctamente para la fecha ${date}`);
      } else {
        console.log(`🟡 Registro no encontrado para ${date}, no se puede actualizar. Use el comando sin flags para insertar.`);
      }
    } else {
      // Comportamiento por defecto: solo insertar si no existe
      if (existingGospel) {
        console.log(`🟡 Registro para ${date} ya existe, omitiendo. Use --force o --update para actualizar.`);
      } else {
        const { error } = await supabase.from('daily_content').insert([gospelToSave]);
        if (error) {
          console.error(`❌ Error al insertar el evangelio: ${error.message}`);
          return false;
        }
        console.log(`✅ Evangelio creado correctamente para la fecha ${date}`);
        await scheduleContent(date);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Error al sincronizar el evangelio:', error);
    return false;
  }
}

/**
 * Programa la publicación del evangelio
 */
async function scheduleContent(date) {
  try {
    // Obtener el ID del contenido recién creado
    const { data: content, error: contentError } = await supabase
      .from('daily_content')
      .select('id')
      .eq('date', date)
      .eq('type', 'gospel')
      .single();
    
    if (contentError) {
      console.error(`❌ Error al obtener el ID del contenido: ${contentError.message}`);
      return false;
    }
    
    // Crear registro en content_schedule
    const { error: scheduleError } = await supabase
      .from('content_schedule')
      .insert([{
        content_type: 'gospel',
        scheduled_date: date,
        content_id: content.id,
        is_published: true,
        published_at: new Date().toISOString()
      }]);
    
    if (scheduleError) {
      console.error(`❌ Error al programar el contenido: ${scheduleError.message}`);
      return false;
    }
    
    console.log(`✅ Contenido programado correctamente para la fecha ${date}`);
    return true;
  } catch (error) {
    console.error('❌ Error al programar el contenido:', error);
    return false;
  }
}

/**
 * Sincroniza el evangelio del día actual
 */
async function syncTodayGospel(options = {}) {
  const today = new Date().toISOString().split('T')[0];
  return await syncGospelForDate(today, options);
}

/**
 * Sincroniza el evangelio para los próximos N días
 */
async function syncUpcomingGospels(days = 7, options = {}) {
  const results = {
    success: 0,
    failed: 0
  };

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    const success = await syncGospelForDate(dateStr, options);

    if (success) {
      results.success++;
    } else {
      results.failed++;
    }
  }

  return results;
}

/**
 * Configura una tarea programada para sincronizar el evangelio diariamente
 */
function setupCronJob() {
  console.log('⏰ Configurando tarea programada para sincronizar el evangelio a las 00:00 (medianoche)...');
  
  cron.schedule('0 0 * * *', async () => {
    console.log(`\n[${new Date().toISOString()}] Ejecutando sincronización programada del evangelio...`);
    await syncTodayGospel();
  });
  
  console.log('✅ Tarea programada configurada exitosamente');
}

/**
 * Punto de entrada del script
 */
async function main() {
  console.log('🌟 Camino de Fe - Sincronización del Evangelio del Día');
  console.log('='.repeat(50));

  const args = process.argv.slice(2);
  const options = {
    force: args.includes('--force'),
    update: args.includes('--update')
  };

  if (args.includes('--today')) {
    // Sincronizar el evangelio del día actual
    await syncTodayGospel(options);
  } else if (args.some(arg => arg.startsWith('--date='))) {
    // Sincronizar el evangelio para una fecha específica
    const dateArg = args.find(arg => arg.startsWith('--date='));
    if (dateArg) {
      const date = dateArg.replace('--date=', '');
      await syncGospelForDate(date, options);
    } else {
      console.error('❌ Debes especificar una fecha con --date=YYYY-MM-DD');
    }
  } else if (args.includes('--upcoming')) {
    // Sincronizar los evangelios para los próximos N días
    const daysArg = args.find(arg => arg.startsWith('--days='));
    const days = daysArg ? parseInt(daysArg.replace('--days=', '')) : 7;
    await syncUpcomingGospels(days, options);
  } else if (args.includes('--cron')) {
    // Configurar tarea programada
    setupCronJob();
    console.log('🔄 Servicio de sincronización automática iniciado. Presiona Ctrl+C para detener.');
    
    // Mantener el proceso vivo
    process.stdin.resume();
  } else {
    // Mostrar ayuda
    console.log(`
Uso: node syncDailyGospel.js [comando] [opciones]

Comandos:
  --today              Sincroniza el evangelio del día actual.
  --date=YYYY-MM-DD    Sincroniza el evangelio para una fecha específica.
  --upcoming           Sincroniza los evangelios para los próximos días.
  --cron               Inicia el servicio de sincronización automática.

Opciones de Sincronización:
  --days=N             Número de días a sincronizar con --upcoming (def: 7).
  --force              Fuerza la actualización si el registro ya existe (upsert).
  --update             Actualiza un registro solo si ya existe, de lo contrario lo omite.
  
  Nota: Si no se usa --force o --update, el script solo insertará registros nuevos y omitirá los existentes.

Ejemplos:
  node syncDailyGospel.js --today
  node syncDailyGospel.js --date=2025-06-30
  node syncDailyGospel.js --date=2025-06-30 --force
  node syncDailyGospel.js --upcoming --days=14 --update
  node syncDailyGospel.js --cron
    `);
  }
}

// Ejecutar solo si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
}

export { syncTodayGospel, syncGospelForDate, syncUpcomingGospels };
