import OpenAI from 'openai';
import toast from 'react-hot-toast';

// Obtener la API key de las variables de entorno o usar una por defecto
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || 'tu-api-key-aqui';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function textToSpeech(text: string): Promise<File | null> {
  try {
    // Validar que tenemos una API key válida
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'tu-api-key-aqui') {
      toast.error('Por favor, configura una API key válida de OpenAI');
      return null;
    }

    // Validar longitud del texto
    if (text.length > 4096) {
      toast.error('El texto es demasiado largo para convertir a voz');
      return null;
    }

    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "onyx",
      input: text,
    });

    const audioBlob = await response.blob();
    return new File([audioBlob], "message.mp3", { type: "audio/mpeg" });
  } catch (error: any) {
    console.error('Error en text to speech:', error);
    
    // Manejar diferentes tipos de errores
    if (error?.error?.code === 'insufficient_quota') {
      toast.error('La cuota de OpenAI se ha excedido. Por favor, verifica tu plan y detalles de facturación en OpenAI.');
    } else if (error?.error?.code === 'invalid_api_key') {
      toast.error('La clave API de OpenAI no es válida. Por favor, verifica tu configuración.');
    } else if (error?.error?.code === 'rate_limit_exceeded') {
      toast.error('Se ha excedido el límite de solicitudes. Por favor, intenta más tarde.');
    } else {
      toast.error('Error al convertir texto a voz. Por favor, inténtalo más tarde.');
    }
    
    return null;
  }
}