import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { textToSpeech } from './elevenlabs';
import { utils, writeFile } from 'xlsx';

const ID_INSTANCE = '7105451115';
const API_TOKEN = 'fa2e670b70be427eba9fef6aca111afb4cbcfd442b4a4238b5';
const BASE_URL = `https://api.greenapi.com/waInstance${ID_INSTANCE}`;
const MEDIA_URL = `https://7105.media.greenapi.com/waInstance${ID_INSTANCE}`;

// Configuración global de Axios
axios.defaults.timeout = 60000;
axios.defaults.maxBodyLength = 16 * 1024 * 1024;
axios.defaults.maxContentLength = 16 * 1024 * 1024;

// Interfaz para resultados de envío
export interface MessageResult {
  phoneNumber: string | number;
  message: string;
  name?: string;
  success: boolean;
  error?: string;
  timestamp: string;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.code === 'ECONNABORTED') {
      return 'La conexión tardó demasiado tiempo. Por favor, verifica tu conexión a internet.';
    }
    if (error.response?.status === 401) {
      return 'Error de autenticación. Por favor, verifica tus credenciales de Green API.';
    }
    if (error.response?.status === 466) {
      return 'El número de WhatsApp no es válido o no está registrado.';
    }
    if (error.response?.status === 471) {
      return 'WhatsApp no está inicializado. Por favor, espera unos segundos y vuelve a intentar.';
    }
    return error.message || 'Error de red desconocido';
  }
  
  // Si el error es un objeto con propiedad message
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as Error).message);
  }
  
  // Si es un string
  if (typeof error === 'string') {
    return error;
  }
  
  return 'Error desconocido';
};

// Función para formatear número de teléfono
const formatPhoneNumber = (phone: string | number | null | undefined): string | null => {
  if (phone === null || phone === undefined) return null;
  
  // Convertir a string si es número
  const phoneStr = String(phone);
  
  // Eliminar todos los caracteres no numéricos
  const cleanedPhone = phoneStr.replace(/\D/g, '');
  
  // Verificar que tenga al menos 10 dígitos
  if (cleanedPhone.length < 10) {
    return null;
  }
  
  return cleanedPhone;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const checkWhatsAppConnection = async (retries = 3): Promise<boolean> => {
  for (let i = 0; i < retries; i++) {
    try {
      const stateResponse = await axios.get(`${BASE_URL}/getStateInstance/${API_TOKEN}`);
      const statusResponse = await axios.get(`${BASE_URL}/getStatusInstance/${API_TOKEN}`);
      
      if (stateResponse.data.stateInstance !== "authorized") {
        toast.error("WhatsApp no está autorizado. Por favor, escanee el código QR en Green API.");
        return false;
      }
      
      if (statusResponse.data.statusInstance !== "online") {
        if (i < retries - 1) {
          await delay(3000);
          continue;
        }
        toast.error("WhatsApp no está en línea. Por favor, asegúrese que su WhatsApp esté conectado y activo.");
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error al verificar conexión:', error);
      if (i < retries - 1) {
        await delay(3000);
        continue;
      }
      toast.error(`Error de conexión: ${getErrorMessage(error)}`);
      return false;
    }
  }
  return false;
};

const sendMediaMessage = async (
  phoneNumber: string,
  message: string,
  file: File,
  toastId: string
): Promise<boolean> => {
  try {
    if (file.size > 16 * 1024 * 1024) {
      throw new Error('El archivo es demasiado grande. Máximo 16MB.');
    }

    const formData = new FormData();
    formData.append('chatId', `${phoneNumber}@c.us`);
    formData.append('caption', message);
    formData.append('file', file);

    const response = await axios.post(
      `${MEDIA_URL}/sendFileByUpload/${API_TOKEN}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    if (!response.data.idMessage) {
      throw new Error('No se recibió confirmación del envío');
    }

    return true;
  } catch (error) {
    console.error('Error al enviar archivo:', error);
    toast.error(`Error al enviar archivo: ${getErrorMessage(error)}`, { id: toastId });
    return false;
  }
};

// Función para envío individual
export async function sendWhatsAppMessage(
  phoneNumber: string | number, 
  message: string, 
  imageFile?: File,
  sendAudio: boolean = false
): Promise<boolean> {
  const toastId = toast.loading('Verificando conexión con WhatsApp...', {
    duration: 10000
  });

  try {
    if (!await checkWhatsAppConnection(3)) {
      return false;
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    if (!formattedPhone) {
      toast.error(`Número de teléfono inválido: ${phoneNumber}`, { id: toastId });
      return false;
    }
    
    // Generar audio si está habilitado
    let audioFile: File | null = null;
    if (sendAudio) {
      toast.loading('Generando audio...', { id: toastId });
      audioFile = await textToSpeech(message);
      if (!audioFile) {
        toast.error('No se pudo generar el audio', { id: toastId });
        return false;
      }
    }

    // Enviar mensaje con imagen y/o audio
    if (imageFile || audioFile) {
      toast.loading('Enviando mensaje con archivos...', { id: toastId });
      
      if (imageFile) {
        const success = await sendMediaMessage(formattedPhone, message, imageFile, toastId);
        if (!success) return false;
      }
      
      if (audioFile) {
        // Pequeña pausa para evitar sobrecarga
        await delay(1000);
        const success = await sendMediaMessage(formattedPhone, '', audioFile, toastId);
        if (!success) return false;
      }
    } else {
      // Si no hay archivos, enviar solo mensaje de texto
      toast.loading('Enviando mensaje de texto...', { id: toastId });
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

    toast.success('Mensaje enviado correctamente', { id: toastId });
    return true;
  } catch (error) {
    console.error('Error en sendWhatsAppMessage:', error);
    toast.error(`Error: ${getErrorMessage(error)}`, { id: toastId });
    return false;
  }
}

// Función para envío masivo
interface BulkMessage {
  phoneNumber: string | number;
  message: string;
  name?: string;
}

// Función para generar y descargar el reporte
export function downloadMessageReport(results: MessageResult[], format: 'excel' | 'txt' = 'excel'): void {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    if (format === 'excel') {
      // Crear un libro de Excel
      const worksheet = utils.json_to_sheet(results.map(r => ({
        Teléfono: r.phoneNumber,
        Nombre: r.name || '',
        Mensaje: r.message.length > 100 ? r.message.substring(0, 100) + '...' : r.message,
        Estado: r.success ? 'Enviado' : 'Error',
        Detalles: r.error || '',
        Fecha: r.timestamp
      })));
      
      // Ajustar ancho de columnas
      const colWidths = [
        { wch: 15 }, // Teléfono
        { wch: 20 }, // Nombre
        { wch: 50 }, // Mensaje
        { wch: 10 }, // Estado
        { wch: 40 }, // Detalles
        { wch: 20 }  // Fecha
      ];
      worksheet['!cols'] = colWidths;
      
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, 'Reporte');
      
      // Descargar archivo
      writeFile(workbook, `reporte-whatsapp-${timestamp}.xlsx`);
      toast.success('Reporte Excel descargado correctamente');
    } else {
      // Crear archivo de texto
      let content = 'REPORTE DE ENVÍO DE MENSAJES WHATSAPP\n';
      content += `Fecha: ${new Date().toLocaleString()}\n`;
      content += `Total mensajes: ${results.length}\n`;
      content += `Enviados: ${results.filter(r => r.success).length}\n`;
      content += `Fallidos: ${results.filter(r => !r.success).length}\n\n`;
      content += '='.repeat(80) + '\n\n';
      
      // Agregar detalles de cada mensaje
      results.forEach((result, index) => {
        content += `[${index + 1}] Teléfono: ${result.phoneNumber}\n`;
        if (result.name) {
          content += `Nombre: ${result.name}\n`;
        }
        content += `Estado: ${result.success ? 'ENVIADO' : 'ERROR'}\n`;
        if (!result.success && result.error) {
          content += `Error: ${result.error}\n`;
        }
        content += `Fecha: ${result.timestamp}\n`;
        content += '-'.repeat(40) + '\n';
      });
      
      // Crear y descargar el archivo
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-whatsapp-${timestamp}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Reporte TXT descargado correctamente');
    }
  } catch (error) {
    console.error('Error al generar reporte:', error);
    toast.error('Error al generar el reporte');
  }
}

export async function sendWhatsAppMessageBulk(
  messages: BulkMessage[],
  imageFile?: File | null,
  sendAudio: boolean = false
): Promise<MessageResult[]> {
  const toastId = toast.loading('Preparando envío masivo...', {
    duration: 10000
  });

  const results: MessageResult[] = [];

  try {
    if (!await checkWhatsAppConnection(3)) {
      return results;
    }

    // Generar audio una sola vez si está habilitado
    let audioFile: File | null = null;
    if (sendAudio && messages.length > 0) {
      toast.loading('Generando audio...', { id: toastId });
      // Usamos el primer mensaje como base para el audio
      audioFile = await textToSpeech(messages[0].message);
      if (!audioFile) {
        toast.error('No se pudo generar el audio', { id: toastId });
        return results;
      }
    }

    let successCount = 0;
    let failCount = 0;
    let errorMessages: string[] = [];

    toast.loading(`Enviando mensajes (0/${messages.length})...`, { id: toastId });

    for (const [index, msg] of messages.entries()) {
      const timestamp = new Date().toLocaleString();
      const result: MessageResult = {
        phoneNumber: msg.phoneNumber,
        message: msg.message,
        name: msg.name,
        success: false,
        timestamp
      };

      try {
        const formattedPhone = formatPhoneNumber(msg.phoneNumber);
        if (!formattedPhone) {
          const errorMsg = `Número inválido: ${msg.phoneNumber}`;
          result.error = errorMsg;
          errorMessages.push(errorMsg);
          console.error(errorMsg);
          failCount++;
          results.push(result);
          continue;
        }
        
        if (imageFile) {
          const success = await sendMediaMessage(formattedPhone, msg.message, imageFile, toastId);
          if (!success) {
            const errorMsg = `Error al enviar imagen a ${formattedPhone}`;
            result.error = errorMsg;
            errorMessages.push(errorMsg);
            failCount++;
            results.push(result);
            continue;
          }
        } else {
          const response = await axios.post(
            `${BASE_URL}/sendMessage/${API_TOKEN}`,
            {
              chatId: `${formattedPhone}@c.us`,
              message: msg.message
            }
          );
          
          if (!response.data.idMessage) {
            const errorMsg = `No se recibió confirmación para ${formattedPhone}`;
            result.error = errorMsg;
            errorMessages.push(errorMsg);
            failCount++;
            results.push(result);
            continue;
          }
        }

        if (audioFile) {
          await delay(1000); // Pequeña pausa entre envíos
          const success = await sendMediaMessage(formattedPhone, '', audioFile, toastId);
          if (!success) {
            const errorMsg = `Error al enviar audio a ${formattedPhone}`;
            result.error = errorMsg;
            errorMessages.push(errorMsg);
            failCount++;
            results.push(result);
            continue;
          }
        }

        successCount++;
        result.success = true;
        results.push(result);
        toast.loading(`Enviando mensajes (${index + 1}/${messages.length})...`, { id: toastId });
        
        // Pequeña pausa entre mensajes para evitar sobrecarga
        await delay(1000);
      } catch (error) {
        console.error(`Error enviando a ${msg.phoneNumber}:`, error);
        const errorMsg = `${msg.phoneNumber}: ${getErrorMessage(error)}`;
        result.error = getErrorMessage(error);
        errorMessages.push(errorMsg);
        failCount++;
        results.push(result);
      }
    }

    if (successCount === messages.length) {
      toast.success(`Envío masivo completado. ${successCount} mensajes enviados.`, { id: toastId });
    } else {
      // Mostrar un resumen de los errores
      const errorSummary = errorMessages.length > 3 
        ? errorMessages.slice(0, 3).join('\n') + `\n...y ${errorMessages.length - 3} más`
        : errorMessages.join('\n');
        
      toast.success(
        `Envío masivo completado. ${successCount} mensajes enviados, ${failCount} fallidos.`,
        { id: toastId }
      );
      
      if (errorMessages.length > 0) {
        toast.error(`Errores: ${errorSummary}`, { duration: 5000 });
      }
    }

    return results;
  } catch (error) {
    console.error('Error en envío masivo:', error);
    toast.error(`Error en envío masivo: ${getErrorMessage(error)}`, { id: toastId });
    return results;
  }
}