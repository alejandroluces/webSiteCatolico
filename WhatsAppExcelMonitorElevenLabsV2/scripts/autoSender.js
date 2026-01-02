process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const https = require('https');
const insecureAgent = new https.Agent({ rejectUnauthorized: false });
const axios = require('axios');
axios.defaults.httpsAgent = insecureAgent;

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const FormData = require('form-data');

// Helpers para manipular celdas del Excel
function getHeaderMap(worksheet) {
  // Tomamos el rango actual y leemos la primera fila como encabezados
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
  const headerRow = range.s.r; // 0-based
  const map = {};
  for (let c = range.s.c; c <= range.e.c; c++) {
    const addr = XLSX.utils.encode_cell({ r: headerRow, c });
    const v = worksheet[addr]?.v;
    if (v) map[String(v).trim().toUpperCase()] = c;
  }
  return map;
}

function setCell(worksheet, r1Based, c0Based, value) {
  const addr = XLSX.utils.encode_cell({ r: r1Based - 1, c: c0Based });
  worksheet[addr] = worksheet[addr] || { t: 'n', v: value };
  worksheet[addr].v = value;
  // tipo básico
  worksheet[addr].t = typeof value === 'number' ? 'n' : 's';
}

// Configuración
const EXCEL_FOLDER = path.join(__dirname, 'excel');
const ID_INSTANCE = '7105451115';
const API_TOKEN = 'fa2e670b70be427eba9fef6aca111afb4cbcfd442b4a4238b5';
const BASE_URL = `https://api.greenapi.com/waInstance${ID_INSTANCE}`;
const MEDIA_URL = `https://7105.media.greenapi.com/waInstance${ID_INSTANCE}`;
const ELEVENLABS_API_KEY = 'sk_b06dc7ddcb6fa1962332aa6cc8f5c13088f48680f7b473a3';
const VOICE_ID = 'pqHfZKP75CvOlQylNhV4';

// Función para obtener la fecha actual en formato DDMMYYYY
function getCurrentDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}${month}${year}`;
}

// Función para verificar la conexión de WhatsApp
async function checkWhatsAppConnection() {
  try {
    const stateResponse = await axios.get(`${BASE_URL}/getStateInstance/${API_TOKEN}`);
    const statusResponse = await axios.get(`${BASE_URL}/getStatusInstance/${API_TOKEN}`);
    
    if (stateResponse.data.stateInstance !== "authorized") {
      console.error("WhatsApp no está autorizado");
      return false;
    }
    
    if (statusResponse.data.statusInstance !== "online") {
      console.error("WhatsApp no está en línea");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error al verificar conexión:', error.message);
    return false;
  }
}

// Función para convertir texto a voz usando ElevenLabs
async function textToSpeech(text) {
  try {
    if (text.length > 5000) {
      console.error('El texto es demasiado largo para convertir a voz');
      return null;
    }

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
      {
        text,
        model_id: 'eleven_multilingual_v2'
      },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error en text to speech:', error.message);
    return null;
  }
}

// Función para formatear número de teléfono
function formatPhoneNumber(phone) {
  if (!phone) return null;
  
  // Convertir a string si es número
  let phoneStr = String(phone);
  
  // Eliminar todos los caracteres no numéricos
  phoneStr = phoneStr.replace(/\D/g, '');
  
  // Verificar que tenga al menos 10 dígitos
  if (phoneStr.length < 10) {
    return null;
  }
  
  // Si no comienza con código de país, agregar 56 (Chile) por defecto
  // Ajustar según el país que necesites
  if (phoneStr.length === 10) {
    phoneStr = '56' + phoneStr;
  }
  
  return phoneStr;
}

// Función para enviar un mensaje de WhatsApp con archivos adjuntos
async function sendWhatsAppMessage(phoneNumber, message, imageBuffer = null, audioBuffer = null) {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    if (!formattedPhone) {
      throw new Error('Número de teléfono inválido o con formato incorrecto');
    }

    // Enviar mensaje con imagen si existe
    if (imageBuffer) {
      const formData = new FormData();
      formData.append('chatId', `${formattedPhone}@c.us`);
      formData.append('caption', message);
      formData.append('file', imageBuffer, {
        filename: 'image.jpg',
        contentType: 'image/jpeg'
      });

      const response = await axios.post(
        `${MEDIA_URL}/sendFileByUpload/${API_TOKEN}`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'Content-Length': formData.getLengthSync()
          }
        }
      );

      if (!response.data.idMessage) {
        throw new Error('No se recibió confirmación del mensaje con imagen');
      }
    } else {
      // Enviar mensaje de texto si no hay imagen
      const response = await axios.post(
        `${BASE_URL}/sendMessage/${API_TOKEN}`,
        {
          chatId: `${formattedPhone}@c.us`,
          message: message
        }
      );

      if (!response.data.idMessage) {
        throw new Error('No se recibió confirmación del mensaje');
      }
    }

    // Si hay audio, enviarlo como mensaje adicional
    if (audioBuffer) {
      const audioFormData = new FormData();
      audioFormData.append('chatId', `${formattedPhone}@c.us`);
      audioFormData.append('file', audioBuffer, {
        filename: 'message.mp3',
        contentType: 'audio/mpeg'
      });

      const audioResponse = await axios.post(
        `${MEDIA_URL}/sendFileByUpload/${API_TOKEN}`,
        audioFormData,
        {
          headers: {
            ...audioFormData.getHeaders(),
            'Content-Length': audioFormData.getLengthSync()
          }
        }
      );

      if (!audioResponse.data.idMessage) {
        throw new Error('No se recibió confirmación del mensaje de audio');
      }
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error.message || 'Error desconocido'
    };
  }
}

// Función para generar un reporte Excel con los resultados
let generateReport = (data, results)=> {
  try {
    // Crear una carpeta para reportes si no existe
    const reportFolder = path.join(__dirname, 'reportes');
    if (!fs.existsSync(reportFolder)) {
      fs.mkdirSync(reportFolder);
    }
    
    // Nombre del archivo con fecha y hora
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(reportFolder, `reporte-${timestamp}.xlsx`);
    
    // Crear un nuevo libro de Excel
    const wb = XLSX.utils.book_new();
    
    // Preparar los datos para el reporte
    const reportData = results.map(result => {
      // Buscar la fila original en los datos
      const originalRow = data[result.index - 1] || {};
      
      return {
        'Índice': result.index,
        'Teléfono': result.celular,
        'Nombre': originalRow.NOMBRES || '',
        'Mensaje': originalRow.TEXTO_MENSAJE || '',
        'Estado': result.success ? 'ENVIADO' : 'ERROR',
        'Detalles': result.error || '',
        'Fecha': new Date().toLocaleString()
      };
    });
    
    // Crear una hoja de cálculo con los datos
    const ws = XLSX.utils.json_to_sheet(reportData);
    
    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 8 },    // Índice
      { wch: 15 },   // Teléfono
      { wch: 20 },   // Nombre
      { wch: 50 },   // Mensaje
      { wch: 10 },   // Estado
      { wch: 40 },   // Detalles
      { wch: 20 }    // Fecha
    ];
    ws['!cols'] = colWidths;
    
    // Añadir la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    
    // Escribir el archivo
    XLSX.writeFile(wb, reportPath);
    
    return reportPath;
  } catch (error) {
    console.error('Error al generar reporte:', error.message);
    return null;
  }
}

// Función principal
async function main() {
  try {
    console.log('Iniciando proceso de envío automático...');
    
    // Verificar conexión de WhatsApp
    if (!await checkWhatsAppConnection()) {
      console.error('Error: WhatsApp no está disponible');
      process.exit(1);
    }

    // Obtener la fecha actual
    const currentDate = getCurrentDate();
    
    // Buscar archivo Excel (con o sin _A)
    let excelPath = path.join(EXCEL_FOLDER, `${currentDate}_A.xlsx`);
    let includeAudio = fs.existsSync(excelPath);
    
    if (!includeAudio) {
      excelPath = path.join(EXCEL_FOLDER, `${currentDate}.xlsx`);
      if (!fs.existsSync(excelPath)) {
        console.log(`No se encontró archivo para la fecha actual: ${currentDate}.xlsx`);
        console.log('No hay mensajes programados para enviar hoy.');
        process.exit(0); // Exit with success code when no file exists
      }
    }

    // Verificar si existe una imagen para el día
    let imageBuffer = null;
    const imageExtensions = ['.jpg', '.jpeg', '.png'];
    for (const ext of imageExtensions) {
      const imagePath = path.join(EXCEL_FOLDER, `${currentDate}${ext}`);
      if (fs.existsSync(imagePath)) {
        imageBuffer = fs.readFileSync(imagePath);
        console.log(`Imagen encontrada: ${currentDate}${ext}`);
        break;
      }
    }

    // Leer el archivo Excel
    try {
      const workbook = XLSX.readFile(excelPath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);

      // Necesitamos poder marcar SMS=1 en el Excel para no reenviar en siguientes ejecuciones
      const headerMap = getHeaderMap(worksheet);
      const smsCol = headerMap['SMS'];

      console.log(`Archivo encontrado: ${path.basename(excelPath)}`);
      console.log(`Total de registros: ${data.length}`);
      console.log(`Modo de envío: ${[
        imageBuffer ? 'Con imagen adjunta' : 'Sin imagen',
        includeAudio ? 'Con audio' : 'Sin audio'
      ].filter(Boolean).join(', ')}`);

      let successCount = 0;
      let failCount = 0;
      let errorDetails = [];
      let results = [];

      // Si se incluye audio, generar el audio una sola vez para el primer mensaje
      let audioBuffer = null;
      if (includeAudio && data.length > 0) {
        console.log('Generando mensaje de voz...');
        audioBuffer = await textToSpeech(data[0].TEXTO_MENSAJE);
        if (!audioBuffer) {
          console.log('⚠️ No se pudo generar el audio, continuando sin mensaje de voz');
          includeAudio = false;
        } else {
          console.log('✓ Mensaje de voz generado correctamente');
        }
      }

      // Procesar cada registro
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        
        try {
          // Verificar si el mensaje debe enviarse
          if (row.SMS === 0 || row.SMS === '0') {
            // Verificar que exista el número de teléfono
            if (!row.CELULAR) {
              throw new Error('Número de teléfono vacío');
            }
            
            // Verificar que exista el mensaje
            if (!row.TEXTO_MENSAJE) {
              throw new Error('Mensaje vacío');
            }
            
            const result = await sendWhatsAppMessage(
              row.CELULAR,
              row.TEXTO_MENSAJE,
              imageBuffer,
              audioBuffer
            );
            
            if (result.success) {
              successCount++;
              console.log(`✓ [${i+1}/${data.length}] Mensaje enviado a: ${row.CELULAR}`);

              // Marcar SMS=1 en el Excel (fila i+2 porque la fila 1 es header)
              if (typeof smsCol === 'number') {
                setCell(worksheet, i + 2, smsCol, 1);
              }

              results.push({
                index: i + 1,
                celular: row.CELULAR,
                success: true
              });
            } else {
              failCount++;
              const errorMsg = `✗ [${i+1}/${data.length}] Error al enviar a: ${row.CELULAR} - ${result.error}`;
              console.log(errorMsg);
              errorDetails.push({
                index: i + 1,
                celular: row.CELULAR,
                error: result.error
              });
              results.push({
                index: i + 1,
                celular: row.CELULAR,
                success: false,
                error: result.error
              });
            }
          } else {
            console.log(`⚠️ [${i+1}/${data.length}] Saltando ${row.CELULAR} (SMS=${row.SMS})`);
          }
        } catch (rowError) {
          failCount++;
          const errorMsg = `✗ [${i+1}/${data.length}] Error al procesar: ${row.CELULAR || 'desconocido'} - ${rowError.message}`;
          console.log(errorMsg);
          errorDetails.push({
            index: i + 1,
            celular: row.CELULAR || 'desconocido',
            error: rowError.message
          });
          results.push({
            index: i + 1,
            celular: row.CELULAR || 'desconocido',
            success: false,
            error: rowError.message
          });
        }
        
        // Esperar 1 segundo entre mensajes
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Mostrar resumen del proceso
      console.log('\n=== RESUMEN DEL PROCESO ===');
      console.log(`✓ Mensajes enviados exitosamente: ${successCount}`);
      console.log(`✗ Mensajes fallidos: ${failCount}`);
      
      // Mostrar detalles de errores si hay alguno
      if (errorDetails.length > 0) {
        console.log('\n=== DETALLES DE ERRORES ===');
        errorDetails.forEach(err => {
          console.log(`Fila ${err.index}: ${err.celular} - ${err.error}`);
        });
      }
      
      // Generar reporte Excel
      if (results.length > 0) {
        const reportPath = generateReport(data, results);
        if (reportPath) {
          console.log(`Se ha generado un reporte detallado en: ${reportPath}`);
        }
      }

      // Persistir cambios (SMS=1) para que los próximos runs no reenvíen
      try {
        XLSX.writeFile(workbook, excelPath);
      } catch (e) {
        console.error('⚠️ No se pudo guardar el Excel con SMS actualizado:', e.message);
      }

    } catch (error) {
      console.error('Error procesando el archivo Excel:', error.message);
      process.exit(1);
    }

  } catch (error) {
    console.error('Error en el proceso:', error.message);
    process.exit(1);
  }
}

// Ejecutar el programa
main();
