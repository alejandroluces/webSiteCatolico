#!/usr/bin/env node

/**
 * Script para actualizar automáticamente el evangelio del día
 * Obtiene datos desde un archivo Excel y genera reflexiones con Gemini AI
 */

import { config } from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import ExcelJS from 'exceljs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import cron from 'node-cron';

// Cargar variables de entorno
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

// Verificar variables de entorno requeridas
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

if (!geminiApiKey) {
  console.error('❌ Falta la clave de API de Google Gemini');
  process.exit(1);
}

// Inicializar clientes
const supabase = createClient(supabaseUrl, supabaseServiceKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 */
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Obtiene la fecha formateada para el nombre de archivo (DDMMYYYY)
 */
function getFormattedDateForFile(date) {
  const parts = date.split('-');
  return `${parts[2]}${parts[1]}${parts[0]}`;
}

/**
 * Obtiene el evangelio del día desde el archivo Excel
 */
async function getGospelFromExcel(date) {
  try {
    console.log(`📊 Buscando evangelio para la fecha: ${date}`);
    
    // Convertir fecha YYYY-MM-DD a DDMMYYYY para el nombre del archivo
    const fileDate = getFormattedDateForFile(date);
    
    // Ruta al archivo Excel
    const excelPath = path.join(process.cwd(), 'public', 'images', 'gospels', `${fileDate}.xlsx`);
    
    console.log(`📂 Buscando archivo: ${excelPath}`);
    
    // Verificar si el archivo existe
    try {
      await fs.access(excelPath);
      console.log(`✅ Archivo encontrado: ${excelPath}`);
    } catch (err) {
      console.error(`❌ No se encontró el archivo Excel: ${excelPath}`);
      return null;
    }
    
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelPath);
    
    const worksheet = workbook.getWorksheet(1);
    
    if (!worksheet) {
      console.error('❌ No se encontró la hoja de trabajo en el archivo Excel');
      return null;
    }
    
    // Obtener el contenido de la celda I2
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
    
    // Verificar la imagen
    const imagePath = path.join(process.cwd(), 'public', 'images', 'gospels', `${fileDate}.png`);
    let imageExists = false;
    
    try {
      await fs.access(imagePath);
      imageExists = true;
      console.log(`✅ Imagen encontrada: ${imagePath}`);
    } catch (err) {
      console.warn(`⚠️ No se encontró la imagen: ${imagePath}`);
    }
    
    const gospelData = {
      date: date,
      title: title || 'Evangelio del Día',
      reference: reference || '',
      content: content.trim(),
      prayer: prayer.trim(),
      image: imageExists ? `/images/gospels/${fileDate}.png` : null
    };
    
    console.log(`✅ Evangelio encontrado: ${gospelData.title}`);
    console.log(`📖 Referencia: ${gospelData.reference}`);
    console.log(`🙏 Oración: ${gospelData.prayer ? 'Encontrada' : 'No encontrada'}`);
    console.log(`🖼️ Imagen: ${gospelData.image ? 'Encontrada' : 'No encontrada'}`);
    
    return gospelData;
    
  } catch (error) {
    console.error('❌ Error al leer el archivo Excel:', error);
    return null;
  }
}

/**
 * Genera una reflexión para el evangelio usando Gemini AI
 */
async function generateReflection(gospelData) {
  try {
    console.log('🤖 Generando reflexión con Gemini AI...');
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `
    Eres un experto en teología católica y espiritualidad cristiana. Escribe una reflexión profunda y significativa sobre el siguiente evangelio:
    
    Referencia: ${gospelData.reference}
    Título: ${gospelData.title}
    Texto: ${gospelData.content}
    
    La reflexión debe:
    1. Tener entre 300-500 palabras
    2. Ser fiel a la doctrina católica
    3. Incluir aplicaciones prácticas para la vida diaria
    4. Ser inspiradora y motivadora
    5. Usar un lenguaje accesible pero profundo
    6. Evitar clichés y generalidades
    
    Formato: Párrafos bien estructurados sin encabezados ni conclusiones explícitas.
    `;
    
    const result = await model.generateContent(prompt);
    const reflection = result.response.text();
    
    console.log('✅ Reflexión generada exitosamente');
    return reflection;
    
  } catch (error) {
    console.error('❌ Error al generar reflexión con Gemini:', error);
    return "No se pudo generar una reflexión para este evangelio. Por favor, medita en silencio sobre la Palabra de Dios y permite que el Espíritu Santo te hable al corazón.";
  }
}

/**
 * Guarda el evangelio en la base de datos
 */
async function saveGospelToDatabase(gospelData, reflection) {
  try {
    console.log('💾 Guardando evangelio en la base de datos...');
    
    // Verificar si ya existe un evangelio para esta fecha
    const { data: existingGospel, error: checkError } = await supabase
      .from('daily_content')
      .select('id')
      .eq('date', gospelData.date)
      .eq('type', 'gospel')
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error(`Error al verificar evangelio existente: ${checkError.message}`);
    }
    
    // Preparar datos para guardar
    const gospelToSave = {
      date: gospelData.date,
      type: 'gospel',
      title: gospelData.title,
      content: gospelData.content,
      reference: gospelData.reference,
      reflection: reflection,
      prayer: gospelData.prayer,
      image_url: gospelData.image,
      liturgical_season: 'Tiempo Ordinario', // Esto podría determinarse automáticamente
      liturgical_color: 'Verde',
      status: 'published',
      is_active: true,
      updated_at: new Date().toISOString()
    };
    
    let result;
    
    if (existingGospel) {
      // Actualizar evangelio existente
      const { data, error } = await supabase
        .from('daily_content')
        .update(gospelToSave)
        .eq('id', existingGospel.id)
        .select();
      
      if (error) throw new Error(`Error al actualizar evangelio: ${error.message}`);
      result = data[0];
      console.log(`✅ Evangelio actualizado con ID: ${result.id}`);
      
    } else {
      // Crear nuevo evangelio
      const { data, error } = await supabase
        .from('daily_content')
        .insert([gospelToSave])
        .select();
      
      if (error) throw new Error(`Error al insertar evangelio: ${error.message}`);
      result = data[0];
      console.log(`✅ Nuevo evangelio creado con ID: ${result.id}`);
      
      // Programar publicación
      await scheduleContent(result.id, gospelData.date);
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Error al guardar en la base de datos:', error);
    return null;
  }
}

/**
 * Programa la publicación del contenido
 */
async function scheduleContent(contentId, date) {
  try {
    const { error } = await supabase
      .from('content_schedule')
      .insert([{
        content_type: 'gospel',
        scheduled_date: date,
        content_id: contentId,
        is_published: true,
        published_at: new Date().toISOString()
      }]);
    
    if (error) throw new Error(`Error al programar contenido: ${error.message}`);
    console.log(`✅ Contenido programado para: ${date}`);
    
  } catch (error) {
    console.error('❌ Error al programar contenido:', error);
  }
}

/**
 * Función principal para actualizar el evangelio del día
 */
async function updateDailyGospel(date = getTodayDate()) {
  console.log('🌟 Luz de Fe - Actualización Automática del Evangelio');
  console.log('=' .repeat(50));
  console.log(`📅 Fecha: ${date}`);
  
  try {
    // 1. Obtener datos del evangelio desde Excel
    const gospelData = await getGospelFromExcel(date);
    
    if (!gospelData) {
      console.error(`❌ No se encontró el evangelio para la fecha ${date}`);
      return false;
    }
    
    // 2. Generar reflexión con Gemini AI
    const reflection = await generateReflection(gospelData);
    
    // 3. Guardar en la base de datos
    const savedGospel = await saveGospelToDatabase(gospelData, reflection);
    
    if (savedGospel) {
      console.log('✅ Evangelio del día actualizado exitosamente');
      return true;
    } else {
      console.error('❌ Error al actualizar el evangelio del día');
      return false;
    }
    
  } catch (error) {
    console.error('💥 Error fatal:', error);
    return false;
  }
}

/**
 * Configurar tarea programada para actualizar el evangelio a la 1:00 AM
 */
function setupCronJob() {
  console.log('⏰ Configurando tarea programada para actualizar el evangelio a la 1:00 AM...');
  
  cron.schedule('0 1 * * *', async () => {
    console.log(`\n[${new Date().toISOString()}] Ejecutando actualización programada del evangelio...`);
    await updateDailyGospel();
  });
  
  console.log('✅ Tarea programada configurada exitosamente');
}

/**
 * Punto de entrada del script
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Verificar si se debe ejecutar inmediatamente o configurar cron
  if (args.includes('--now')) {
    // Ejecutar actualización inmediatamente
    const dateArg = args.find(arg => arg.startsWith('--date='));
    const date = dateArg ? dateArg.replace('--date=', '') : getTodayDate();
    await updateDailyGospel(date);
  } else if (args.includes('--cron')) {
    // Configurar tarea programada
    setupCronJob();
    console.log('🔄 Servicio de actualización automática iniciado. Presiona Ctrl+C para detener.');
    
    // Mantener el proceso vivo
    process.stdin.resume();
  } else {
    // Mostrar ayuda
    console.log(`
Uso: node updateDailyGospel.js [opciones]

Opciones:
  --now                Actualiza el evangelio inmediatamente
  --date=YYYY-MM-DD    Especifica una fecha (con --now)
  --cron               Inicia el servicio de actualización automática

Ejemplos:
  node updateDailyGospel.js --now
  node updateDailyGospel.js --now --date=2025-06-30
  node updateDailyGospel.js --cron
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

export { updateDailyGospel };