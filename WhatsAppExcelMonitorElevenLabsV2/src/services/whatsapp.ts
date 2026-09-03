import toast from 'react-hot-toast';
import { utils, writeFile } from 'xlsx';

const FRONTEND_WHATSAPP_DISABLED_MESSAGE =
  'El envío directo desde frontend está deshabilitado para proteger las credenciales de Green API. Usa el backend o autoSender.js con variables de entorno.';

// Interfaz para resultados de envío
export interface MessageResult {
  phoneNumber: string | number;
  message: string;
  name?: string;
  success: boolean;
  error?: string;
  timestamp: string;
}

// Función para envío individual
export async function sendWhatsAppMessage(
  phoneNumber: string | number,
  message: string,
  imageFile?: File,
  sendAudio: boolean = false
): Promise<boolean> {
  void phoneNumber;
  void message;
  void imageFile;
  void sendAudio;
  toast.error(FRONTEND_WHATSAPP_DISABLED_MESSAGE);
  return false;
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
  void messages;
  void imageFile;
  void sendAudio;
  toast.error(FRONTEND_WHATSAPP_DISABLED_MESSAGE);
  return [];
}
