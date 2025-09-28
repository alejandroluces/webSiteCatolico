#!/usr/bin/env node

/**
 * Script para actualizar automáticamente el evangelio del día
 * Obtiene datos desde un archivo JSON, genera reflexiones y audios con OpenAI
 */

import { config } from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import cron from 'node-cron';
import OpenAI from 'openai';

// Cargar variables de entorno
config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

// Verificar variables de entorno requeridas
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

if (!geminiApiKey) {
  console.error('❌ Falta la clave de API de Google Gemini');
  process.exit(1);
}

if (!openaiApiKey) {
  console.error('❌ Falta la clave de API de OpenAI');
  process.exit(1);
}

// Inicializar clientes
const supabase = createClient(supabaseUrl, supabaseServiceKey);
const genAI = new GoogleGenAI(geminiApiKey);
const openai = new OpenAI({ apiKey: openaiApiKey });

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
 * Obtiene el evangelio del día desde el archivo JSON
 */
async function getGospelFromJson(date) {
  try {
    console.log(`📄 Buscando evangelio para la fecha: ${date}`);
    const fileDate = getFormattedDateForFile(date);
    const jsonPath = path.join(process.cwd(), 'public', 'images', 'gospels', `${fileDate}.json`);
    console.log(`📂 Buscando archivo: ${jsonPath}`);
    
    await fs.access(jsonPath);
    console.log(`✅ Archivo encontrado: ${jsonPath}`);
    
    const fileContent = await fs.readFile(jsonPath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    const imageName = data.imagePath ? path.basename(data.imagePath) : null;
    
    const gospelData = {
      date: data.date,
      title: data.gospel.title,
      reference: data.gospel.reference,
      content: data.gospel.text,
      prayer: data.prayer,
      image: imageName ? `/images/gospels/${imageName}` : null
    };
    
    console.log(`✅ Evangelio encontrado: ${gospelData.title}`);
    return gospelData;
    
  } catch (error) {
    console.error(`❌ No se encontró o no se pudo leer el archivo JSON para la fecha ${date}:`, error.message);
    return null;
  }
}

/**
 * Genera una reflexión para el evangelio usando Gemini AI
 */
async function generateReflection(gospelData) {
  console.log('🤖 Generando reflexión con Gemini AI...');
  const prompt = `
  Eres un experto en teología católica y espiritualidad cristiana. Escribe una reflexión profunda y significativa sobre el siguiente evangelio:
  Referencia: ${gospelData.reference}, Título: ${gospelData.title}, Texto: ${gospelData.content}
  La reflexión debe tener entre 300-500 palabras, ser fiel a la doctrina católica, incluir aplicaciones prácticas para la vida diaria, ser inspiradora y usar un lenguaje accesible pero profundo.
  Formato: Párrafos bien estructurados sin encabezados ni conclusiones explícitas.`;
  
  const result = await genAI.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: prompt,
  });
  const reflection = result.candidates[0].content.parts[0].text;
  console.log('✅ Reflexión generada exitosamente');
  return reflection;
}

/**
 * Genera audio desde texto usando OpenAI TTS y lo sube a Supabase Storage
 */
async function generateAndSaveAudio(text, date, type) {
  if (!text || text.trim() === '') {
    console.log(`⏭️ Omitiendo generación de audio para "${type}" porque el texto está vacío.`);
    return null;
  }

  console.log(`🔊 Generando audio para "${type}" con OpenAI TTS...`);
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });
    
    const audioBuffer = Buffer.from(await mp3.arrayBuffer());

    const fileName = `${date}_${type}.mp3`;
    const localFolderPath = path.join(process.cwd(), 'public', 'audio');
    const localFilePath = path.join(localFolderPath, fileName);

    // Ensure the local directory exists
    await fs.mkdir(localFolderPath, { recursive: true });

    // Save the audio file locally
    await fs.writeFile(localFilePath, audioBuffer);
    console.log(`✅ Audio guardado localmente en: ${localFilePath}`);

    const filePath = `audio_content/${fileName}`;

    console.log(`☁️ Subiendo audio a Supabase Storage: ${filePath}`);
    const { data, error } = await supabase.storage
      .from('audio_content')
      .upload(filePath, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true,
      });

    if (error) {
      throw new Error(`Error al subir el audio a Supabase: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('audio_content')
      .getPublicUrl(filePath);

    console.log(`✅ Audio para "${type}" guardado en: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`❌ Error al generar o guardar el audio para "${type}":`, error);
    return null;
  }
}


/**
 * Guarda el evangelio y las URLs de los audios en la base de datos
 */
async function saveGospelToDatabase(gospelData, reflection, audioUrls) {
  try {
    console.log('💾 Guardando contenido en la base de datos...');
    
    const { data: existingGospel, error: checkError } = await supabase
      .from('daily_content')
      .select('id')
      .eq('date', gospelData.date)
      .eq('type', 'gospel')
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error(`Error al verificar evangelio existente: ${checkError.message}`);
    }
    
    const contentToSave = {
      date: gospelData.date,
      type: 'gospel',
      title: gospelData.title,
      content: gospelData.content,
      reference: gospelData.reference,
      reflection: reflection,
      prayer: gospelData.prayer,
      image_url: gospelData.image,
      gospel_audio_url: audioUrls.gospel,
      reflection_audio_url: audioUrls.reflection,
      prayer_audio_url: audioUrls.prayer,
      liturgical_season: 'Tiempo Ordinario',
      liturgical_color: 'Verde',
      status: 'published',
      is_active: true,
      updated_at: new Date().toISOString()
    };
    
    let result;
    if (existingGospel) {
      const { data, error } = await supabase
        .from('daily_content')
        .update(contentToSave)
        .eq('id', existingGospel.id)
        .select();
      if (error) throw new Error(`Error al actualizar evangelio: ${error.message}`);
      result = data[0];
      console.log(`✅ Contenido actualizado con ID: ${result.id}`);
    } else {
      const { data, error } = await supabase
        .from('daily_content')
        .insert([contentToSave])
        .select();
      if (error) throw new Error(`Error al insertar evangelio: ${error.message}`);
      result = data[0];
      console.log(`✅ Nuevo contenido creado con ID: ${result.id}`);
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
  console.log('🌟 Camino de Fe - Actualización Automática del Evangelio');
  console.log('='.repeat(50));
  console.log(`📅 Fecha: ${date}`);
  
  try {
    const gospelData = await getGospelFromJson(date);
    if (!gospelData) return false;
    
    const reflection = await generateReflection(gospelData);
    if (!reflection) {
      console.error(`❌ No se pudo generar la reflexión. No se guardará en la base de datos.`);
      return false;
    }

    // Generar y guardar los tres audios en paralelo
    const [gospelAudioUrl, reflectionAudioUrl, prayerAudioUrl] = await Promise.all([
      generateAndSaveAudio(gospelData.content, date, 'gospel'),
      generateAndSaveAudio(reflection, date, 'reflection'),
      generateAndSaveAudio(gospelData.prayer, date, 'prayer')
    ]);

    const audioUrls = {
      gospel: gospelAudioUrl,
      reflection: reflectionAudioUrl,
      prayer: prayerAudioUrl,
    };
    
    const savedGospel = await saveGospelToDatabase(gospelData, reflection, audioUrls);
    
    if (savedGospel) {
      console.log('✅ Evangelio del día actualizado exitosamente (con audios)');
      return true;
    } else {
      console.error('❌ Error al actualizar el evangelio del día');
      return false;
    }
    
  } catch (error) {
    console.error('💥 Error fatal en updateDailyGospel:', error);
    return false;
  }
}

/**
 * Configurar tarea programada
 */
function setupCronJob() {
  console.log('⏰ Configurando tarea programada para las 00:00...');
  cron.schedule('0 0 * * *', () => {
    console.log(`\n[${new Date().toISOString()}] Ejecutando actualización programada...`);
    updateDailyGospel();
  });
  console.log('✅ Tarea programada configurada.');
}

/**
 * Punto de entrada del script
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--now')) {
    const dateArg = args.find(arg => arg.startsWith('--date='));
    const date = dateArg ? dateArg.replace('--date=', '') : getTodayDate();
    await updateDailyGospel(date);
  } else if (args.includes('--cron')) {
    setupCronJob();
    console.log('🔄 Servicio de actualización iniciado. Presiona Ctrl+C para detener.');
    process.stdin.resume();
  } else {
    console.log(`
Uso: node updateDailyGospel.js [opciones]
Opciones:
  --now                Actualiza el evangelio inmediatamente
  --date=YYYY-MM-DD    Especifica una fecha (con --now)
  --cron               Inicia el servicio de actualización automática
    `);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('💥 Error fatal en main:', error);
    process.exit(1);
  });
}

export { updateDailyGospel };
