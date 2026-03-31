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
import {
  resolveAudioStorageProvider,
  shouldSaveLocalAudioCopy,
  uploadAudioBuffer,
} from './lib/audioStorage.js';

// Cargar variables de entorno
config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;
const deepseekApiKey = process.env.DEEPSEEK_API_KEY;

// Configuración de proveedores para generar la reflexión
const reflectionProvider = (process.env.REFLECTION_PROVIDER || 'auto').toLowerCase();
const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.0-flash-001';
const openaiReflectionModel = process.env.OPENAI_REFLECTION_MODEL || 'gpt-4o-mini';
const deepseekBaseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';
const deepseekModel = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
const saveLocalAudioCopy = shouldSaveLocalAudioCopy(process.env);

let audioStorageProvider;

try {
  audioStorageProvider = resolveAudioStorageProvider(process.env);
} catch (error) {
  console.error(`❌ ${error.message}`);
  process.exit(1);
}

// Verificar variables de entorno requeridas
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

// OpenAI se usa para TTS en este script (audios). Si no lo quieres, habría que agregar una opción para omitir audios.
if (!openaiApiKey) {
  console.error('❌ Falta la clave de API de OpenAI (se usa para generar audios TTS)');
  process.exit(1);
}

// Validar proveedor seleccionado
const validProviders = ['auto', 'gemini', 'openai', 'deepseek', 'none'];
if (!validProviders.includes(reflectionProvider)) {
  console.error(`❌ REFLECTION_PROVIDER inválido: "${reflectionProvider}". Valores válidos: ${validProviders.join(', ')}`);
  process.exit(1);
}

if (reflectionProvider === 'gemini' && !geminiApiKey) {
  console.error('❌ REFLECTION_PROVIDER=gemini pero falta GEMINI_API_KEY');
  process.exit(1);
}

if (reflectionProvider === 'deepseek' && !deepseekApiKey) {
  console.error('❌ REFLECTION_PROVIDER=deepseek pero falta DEEPSEEK_API_KEY');
  process.exit(1);
}

// Inicializar clientes
const supabase = createClient(supabaseUrl, supabaseServiceKey);
const genAI = geminiApiKey ? new GoogleGenAI(geminiApiKey) : null;
const openai = new OpenAI({ apiKey: openaiApiKey });
const deepseek = deepseekApiKey ? new OpenAI({ apiKey: deepseekApiKey, baseURL: deepseekBaseUrl }) : null;

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
      image: imageName ? `/images/gospels/${imageName}` : null,
      reading: data.gospel.reading ? {
        title: data.gospel.reading.title,
        reference: data.gospel.reading.reference,
        content: data.gospel.reading.text
      } : null
    };
    
    console.log(`✅ Evangelio encontrado: ${gospelData.title}`);
    if (gospelData.reading) {
      console.log(`✅ Lectura del día encontrada: ${gospelData.reading.title}`);
    }
    return gospelData;
    
  } catch (error) {
    console.error(`❌ No se encontró o no se pudo leer el archivo JSON para la fecha ${date}:`, error.message);
    return null;
  }
}

/**
 * Genera una reflexión para el evangelio usando Gemini AI
 */
function isQuotaOrRateLimitError(error) {
  const msg = String(error?.message || '');
  return (
    error?.status === 429 ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.toLowerCase().includes('quota exceeded') ||
    msg.toLowerCase().includes('rate limit')
  );
}

function buildReflectionPrompt(gospelData) {
  return `
Eres un experto en teología católica y espiritualidad cristiana.

Escribe una reflexión profunda y significativa sobre el siguiente evangelio:
- Referencia: ${gospelData.reference}
- Título: ${gospelData.title}
- Texto: ${gospelData.content}

Requisitos:
- 300 a 500 palabras.
- Fiel a la doctrina católica.
- Con aplicaciones prácticas para la vida diaria.
- Inspiradora, con lenguaje accesible pero profundo.
- Formato: párrafos bien estructurados, sin encabezados y sin conclusiones explícitas.
`;
}

function generateFallbackReflection(gospelData) {
  // Fallback no-AI para no bloquear la publicación cuando no hay cuotas.
  return (
    `Al contemplar el Evangelio de hoy (${gospelData.reference}), somos invitados a mirar nuestra vida a la luz de la Palabra. ` +
    `No se trata solo de entender un texto, sino de dejarnos tocar por Cristo en lo concreto: en nuestras relaciones, en la forma de hablar, ` +
    `en la paciencia ante lo que cuesta y en la misericordia con la que tratamos a los demás.\n\n` +
    `Una clave espiritual es pasar de la prisa a la escucha: detenernos unos minutos, releer una frase del Evangelio y preguntarnos ` +
    `qué nos pide el Señor hoy. A veces la conversión se expresa en gestos pequeños pero reales: pedir perdón, evitar un juicio injusto, ` +
    `servir en silencio, o sostener con oración a quien lo necesita.\n\n` +
    `Pidamos la gracia de vivir este día con fe sencilla, confiando en que Dios trabaja incluso en lo ordinario. ` +
    `Que María nos enseñe a guardar la Palabra en el corazón y a responder con obras de amor.`
  );
}

async function generateReflection(gospelData) {
  const prompt = buildReflectionPrompt(gospelData);

  if (reflectionProvider === 'none') {
    console.log('⏭️ REFLECTION_PROVIDER=none: usando reflexión de respaldo (sin IA).');
    return generateFallbackReflection(gospelData);
  }

  const providersToTry =
    reflectionProvider === 'auto' ? ['gemini', 'openai', 'deepseek'] : [reflectionProvider];

  for (const provider of providersToTry) {
    try {
      if (provider === 'gemini') {
        if (!genAI) {
          console.log('⚠️ Gemini no configurado (falta GEMINI_API_KEY). Saltando...');
          continue;
        }

        console.log(`🤖 Generando reflexión con Gemini AI (modelo: ${geminiModel})...`);
        const result = await genAI.models.generateContent({
          model: geminiModel,
          contents: prompt,
        });

        const reflection = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!reflection) throw new Error('Respuesta vacía desde Gemini');

        console.log('✅ Reflexión generada exitosamente con Gemini');
        return reflection;
      }

      if (provider === 'openai') {
        console.log(`🤖 Generando reflexión con OpenAI (modelo: ${openaiReflectionModel})...`);
        const completion = await openai.chat.completions.create({
          model: openaiReflectionModel,
          temperature: 0.7,
          messages: [
            {
              role: 'system',
              content:
                'Eres un experto en teología católica y espiritualidad cristiana. Responde solo con el texto de la reflexión en párrafos, sin encabezados.',
            },
            { role: 'user', content: prompt },
          ],
        });

        const reflection = completion?.choices?.[0]?.message?.content;
        if (!reflection) throw new Error('Respuesta vacía desde OpenAI');

        console.log('✅ Reflexión generada exitosamente con OpenAI');
        return reflection;
      }

      if (provider === 'deepseek') {
        if (!deepseek) {
          console.log('⚠️ DeepSeek no configurado (falta DEEPSEEK_API_KEY). Saltando...');
          continue;
        }

        console.log(`🤖 Generando reflexión con DeepSeek (modelo: ${deepseekModel})...`);
        const completion = await deepseek.chat.completions.create({
          model: deepseekModel,
          temperature: 0.7,
          messages: [
            {
              role: 'system',
              content:
                'Eres un experto en teología católica y espiritualidad cristiana. Responde solo con el texto de la reflexión en párrafos, sin encabezados.',
            },
            { role: 'user', content: prompt },
          ],
        });

        const reflection = completion?.choices?.[0]?.message?.content;
        if (!reflection) throw new Error('Respuesta vacía desde DeepSeek');

        console.log('✅ Reflexión generada exitosamente con DeepSeek');
        return reflection;
      }

      console.log(`⚠️ Proveedor no soportado: ${provider}. Saltando...`);
    } catch (error) {
      const quotaMsg = isQuotaOrRateLimitError(error)
        ? ' (cuota/rate limit)'
        : '';
      console.error(`❌ Error generando reflexión con ${provider}${quotaMsg}:`, error?.message || error);

      // En modo auto, ante cualquier error, se intenta el siguiente proveedor.
      // En modo fijo, también seguimos intentando por si el usuario quiere fallback manual agregando varios en auto.
      continue;
    }
  }

  console.log('⚠️ No se pudo generar la reflexión con ningún proveedor. Usando reflexión de respaldo (sin IA).');
  return generateFallbackReflection(gospelData);
}

/**
 * Guarda opcionalmente una copia local del audio generado.
 */
async function saveLocalAudioCopyIfEnabled(fileName, audioBuffer) {
  if (!saveLocalAudioCopy) {
    return null;
  }

  const localFolderPath = path.join(process.cwd(), 'public', 'audio');
  const localFilePath = path.join(localFolderPath, fileName);

  await fs.mkdir(localFolderPath, { recursive: true });
  await fs.writeFile(localFilePath, audioBuffer);

  console.log(`✅ Audio guardado localmente en: ${localFilePath}`);
  return localFilePath;
}

/**
 * Sube el audio al proveedor configurado y devuelve la URL pública.
 */
async function uploadAudioToConfiguredStorage(audioBuffer, fileName, type) {
  if (audioStorageProvider === 'r2') {
    console.log(`☁️ Subiendo audio a Cloudflare R2: ${fileName}`);

    const { publicUrl } = await uploadAudioBuffer({
      buffer: audioBuffer,
      fileName,
      contentType: 'audio/mpeg',
    });

    console.log(`✅ Audio para "${type}" guardado en R2: ${publicUrl}`);
    return publicUrl;
  }

  const filePath = `audio_content/${fileName}`;

  console.log(`☁️ Subiendo audio a Supabase Storage: ${filePath}`);
  const { error } = await supabase.storage
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

  console.log(`✅ Audio para "${type}" guardado en Supabase Storage: ${publicUrl}`);
  return publicUrl;
}

/**
 * Genera audio desde texto usando OpenAI TTS y lo sube al storage configurado.
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

    await saveLocalAudioCopyIfEnabled(fileName, audioBuffer);
    return await uploadAudioToConfiguredStorage(audioBuffer, fileName, type);
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
    
    // Si hay lectura del día, también guardarla
    if (gospelData.reading) {
      await saveReadingToDatabase(gospelData);
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Error al guardar en la base de datos:', error);
    return null;
  }
}

/**
 * Guarda la lectura del día en la base de datos
 */
async function saveReadingToDatabase(gospelData) {
  try {
    console.log('💾 Guardando lectura del día en la base de datos...');
    
    const readingContent = {
      date: gospelData.date,
      type: 'reading',
      title: gospelData.reading.title,
      reference: gospelData.reading.reference,
      content: gospelData.reading.content,
      liturgical_season: 'Tiempo Ordinario',
      liturgical_color: 'Verde',
      status: 'published',
      is_active: true,
      updated_at: new Date().toISOString()
    };
    
    const { data: existingReading } = await supabase
      .from('daily_content')
      .select('id')
      .eq('date', gospelData.date)
      .eq('type', 'reading')
      .single();
    
    if (existingReading) {
      const { error } = await supabase
        .from('daily_content')
        .update(readingContent)
        .eq('id', existingReading.id);
      if (error) throw new Error(`Error al actualizar lectura: ${error.message}`);
      console.log(`✅ Lectura actualizada con ID: ${existingReading.id}`);
    } else {
      const { data, error } = await supabase
        .from('daily_content')
        .insert([readingContent])
        .select();
      if (error) throw new Error(`Error al insertar lectura: ${error.message}`);
      console.log(`✅ Nueva lectura creada con ID: ${data[0].id}`);
    }
    
  } catch (error) {
    console.error('❌ Error al guardar la lectura:', error);
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
  console.log(`🎧 Storage de audio activo: ${audioStorageProvider}${saveLocalAudioCopy ? ' + copia local' : ''}`);
  
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


