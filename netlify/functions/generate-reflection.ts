import { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

const API_KEY = process.env.GEMINI_API_KEY || '';

if (!API_KEY) {
  throw new Error('La variable de entorno GEMINI_API_KEY no está configurada.');
}

const genAI = new GoogleGenAI({ apiKey: API_KEY });

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método no permitido' }),
    };
  }

  try {
    const { type, gospelText, reference, title } = JSON.parse(event.body || '{}');
    let prompt = '';

    if (type === 'reflection') {
      prompt = `
      Eres un experto en teología católica y espiritualidad cristiana. Escribe una reflexión profunda y significativa sobre el siguiente evangelio:
      
      Referencia: ${reference}
      Título: ${title}
      Texto: ${gospelText}
      
      La reflexión debe:
      1. Tener entre 300-500 palabras
      2. Ser fiel a la doctrina católica
      3. Incluir aplicaciones prácticas para la vida diaria
      4. Ser inspiradora y motivadora
      5. Usar un lenguaje accesible pero profundo
      6. Evitar clichés y generalidades
      
      Formato: Párrafos bien estructurados sin encabezados ni conclusiones explícitas.
      `;
    } else if (type === 'prayer') {
      prompt = `
      Eres un experto en espiritualidad y oración católica. Escribe una oración hermosa y significativa basada en el siguiente evangelio:
      
      Referencia: ${reference}
      Texto: ${gospelText}
      
      La oración debe:
      1. Tener entre 100-150 palabras
      2. Ser personal y dirigida a Jesús o a Dios Padre
      3. Reflejar el mensaje principal del evangelio
      4. Incluir una petición relacionada con el tema
      5. Ser poética pero sencilla
      
      Formato: Párrafos cortos, sin encabezados ni "Amén" al final.
      `;
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Tipo de solicitud no válido' }),
      };
    }

    const result = await genAI.models.generateContent({
      model: "gemini-1.5-pro",
      contents: prompt,
    });
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return {
      statusCode: 200,
      body: JSON.stringify({ text }),
    };

  } catch (error) {
    console.error('Error en la función de Netlify:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor' }),
    };
  }
};

export { handler };
