import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializar el cliente de Gemini AI
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export class GeminiService {
  /**
   * Genera una reflexión para el evangelio del día
   */
  static async generateGospelReflection(gospelText: string, reference: string, title: string): Promise<string> {
    try {
      if (!API_KEY) {
        console.error('Error: No se ha configurado la clave de API de Gemini');
        return this.getFallbackReflection();
      }
      
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      const prompt = `
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
      
      const result = await model.generateContent(prompt);
      return result.response.text();
      
    } catch (error) {
      console.error('Error al generar reflexión con Gemini:', error);
      return this.getFallbackReflection();
    }
  }
  
  /**
   * Genera una oración para el evangelio del día
   */
  static async generateGospelPrayer(gospelText: string, reference: string): Promise<string> {
    try {
      if (!API_KEY) {
        console.error('Error: No se ha configurado la clave de API de Gemini');
        return this.getFallbackPrayer();
      }
      
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      const prompt = `
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
      
      const result = await model.generateContent(prompt);
      return result.response.text();
      
    } catch (error) {
      console.error('Error al generar oración con Gemini:', error);
      return this.getFallbackPrayer();
    }
  }
  
  /**
   * Reflexión de respaldo en caso de error
   */
  private static getFallbackReflection(): string {
    return `El Evangelio de hoy nos invita a reflexionar sobre la presencia de Dios en nuestras vidas y cómo podemos responder a su llamado. 

Las palabras de Jesús resuenan en nuestro interior, desafiándonos a vivir con mayor autenticidad y compromiso nuestra fe. En un mundo que a menudo nos distrae con preocupaciones superficiales, el mensaje evangélico nos recuerda lo que verdaderamente importa.

Cada uno de nosotros está llamado a ser discípulo, a seguir a Cristo no solo con palabras sino con acciones concretas. Esto implica estar atentos a las necesidades de nuestros hermanos, practicar la misericordia y la compasión, y buscar siempre la verdad y la justicia.

La invitación de hoy es a renovar nuestra relación con Dios, a profundizar en la oración y a dejarnos transformar por su Palabra. Solo así podremos ser auténticos testigos del Evangelio en nuestras familias, comunidades y lugares de trabajo.`;
  }
  
  /**
   * Oración de respaldo en caso de error
   */
  private static getFallbackPrayer(): string {
    return `Señor Jesús, tu Palabra es luz para nuestro camino y alimento para nuestra alma. Ayúdanos a escucharla con atención y a vivirla con fidelidad.

Que tu Espíritu Santo nos ilumine para comprender tu mensaje y nos dé la fuerza para ponerlo en práctica en nuestra vida cotidiana.

Concédenos un corazón abierto y generoso, capaz de reconocerte en cada persona que encontramos, especialmente en los más necesitados.

Amén.`;
  }
}