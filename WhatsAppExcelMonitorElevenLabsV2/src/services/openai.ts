import toast from 'react-hot-toast';

export async function textToSpeech(text: string): Promise<File | null> {
  if (text.length > 4096) {
    toast.error('El texto es demasiado largo para convertir a voz');
    return null;
  }

  toast.error('La generación de audio debe ejecutarse desde backend para proteger la API key.');
  return null;
}
