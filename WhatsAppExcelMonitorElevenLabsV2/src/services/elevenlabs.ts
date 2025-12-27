import axios from 'axios';
import toast from 'react-hot-toast';

const ELEVENLABS_API_KEY = 'sk_b06dc7ddcb6fa1962332aa6cc8f5c13088f48680f7b473a3';
const VOICE_ID = 'pqHfZKP75CvOlQylNhV4';
const BASE_URL = 'https://api.elevenlabs.io/v1';

export async function textToSpeech(text: string): Promise<File | null> {
  try {
    // Validar longitud del texto
    if (text.length > 5000) {
      toast.error('El texto es demasiado largo para convertir a voz');
      return null;
    }

    const response = await axios.post(
      `${BASE_URL}/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
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

    // Convertir la respuesta a un archivo
    const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
    return new File([audioBlob], "message.mp3", { type: "audio/mpeg" });

  } catch (error: any) {
    console.error('Error en text to speech:', error);
    
    // Manejar diferentes tipos de errores
    if (error.response?.status === 401) {
      toast.error('Error de autenticación con ElevenLabs. Por favor, verifica tu API key.');
    } else if (error.response?.status === 429) {
      toast.error('Se ha excedido el límite de solicitudes de ElevenLabs. Por favor, intenta más tarde.');
    } else if (error.response?.status === 400) {
      toast.error('Error en la solicitud. Verifica el texto enviado.');
    } else {
      toast.error('Error al convertir texto a voz. Por favor, inténtalo más tarde.');
    }
    
    return null;
  }
}