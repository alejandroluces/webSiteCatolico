import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

// --- Configuración ---
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Asegúrate de tener esta variable en tu .env

const GOSPELS_DATA_PATH = path.resolve(process.cwd(), 'data/public/images/gospels');

// --- Inicialización de Clientes ---
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !GEMINI_API_KEY) {
  throw new Error("Faltan variables de entorno de Supabase o Gemini. Revisa tu archivo .env");
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

/**
 * Genera una reflexión espiritual utilizando la IA de Gemini a partir del texto del evangelio.
 * @param {string} gospelText - El texto completo del evangelio.
 * @returns {Promise<string>} La reflexión generada.
 */
async function generateReflection(gospelText) {
  console.log("🤖 Generando reflexión con IA...");
  const prompt = `Basado en el siguiente texto del Evangelio, escribe una reflexión espiritual profunda y pastoral de 300 a 400 palabras. La reflexión debe ser clara, inspiradora y aplicable a la vida diaria de un católico. Evangelio: "${gospelText}"`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reflection = await response.text();
    console.log("✅ Reflexión generada exitosamente.");
    return reflection;
  } catch (error) {
    console.error("Error al generar la reflexión con Gemini:", error);
    throw new Error("No se pudo generar la reflexión.");
  }
}

/**
 * Procesa el archivo JSON para una fecha específica y lo sube a Supabase.
 * @param {string} dateString - La fecha en formato YYYY-MM-DD.
 */
async function processGospelForDate(dateString) {
  // Convierte la fecha de YYYY-MM-DD a DDMMYYYY para el nombre del archivo
  const [year, month, day] = dateString.split('-');
  const ddmmyyyy = `${day}${month}${year}`;
  const jsonFileName = `${ddmmyyyy}.json`;
  const jsonFilePath = path.join(GOSPELS_DATA_PATH, jsonFileName);

  console.log(`\n--- Procesando fecha: ${dateString} ---`);

  try {
    // 1. Leer y parsear el archivo JSON
    const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
    const data = JSON.parse(fileContent);
    console.log(`📄 Archivo ${jsonFileName} leído correctamente.`);

    // 2. Generar la reflexión
    const reflection = await generateReflection(data.gospel.text);

    // 3. Preparar el objeto para Supabase
    const imageName = data.imagePath ? path.basename(data.imagePath) : null;
    const contentToInsert = {
      date: data.date,
      title: data.gospel.title,
      reference: data.gospel.reference,
      text: data.gospel.text,
      prayer: data.prayer,
      reflection: reflection,
      image_url: imageName ? `/images/gospels/${imageName}` : null,
    };

    // 4. Insertar o actualizar en Supabase
    console.log(`🚀 Subiendo contenido para ${data.date} a Supabase...`);
    const { error } = await supabase
      .from('daily_content')
      .upsert(contentToInsert, { onConflict: 'date' }); // 'upsert' actualiza si la fecha ya existe

    if (error) {
      throw error;
    }

    console.log(`✅ Contenido para ${data.date} sincronizado exitosamente.`);

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`❌ Error: No se encontró el archivo ${jsonFileName}.`);
    } else if (error instanceof SyntaxError) {
      console.error(`❌ Error: El archivo ${jsonFileName} tiene un formato JSON inválido.`);
    } else {
      console.error(`❌ Ocurrió un error al procesar ${dateString}:`, error.message);
    }
  }
}

// --- Ejecución del Script ---
(async () => {
  const dateArg = process.argv[2];
  let dateToProcess;

  if (dateArg) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateArg)) {
      console.error("Formato de fecha inválido. Usa YYYY-MM-DD.");
      process.exit(1);
    }
    dateToProcess = dateArg;
  } else {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateToProcess = tomorrow.toISOString().split('T')[0];
  }

  await processGospelForDate(dateToProcess);
})();
