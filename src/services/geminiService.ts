export class GeminiService {
  /**
   * Genera una reflexión para el evangelio del día
   */
  static async generateGospelReflection(gospelText: string, reference: string, title: string): Promise<string> {
    try {
      const response = await fetch('/.netlify/functions/generate-reflection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'reflection',
          gospelText,
          reference,
          title,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      const data = await response.json();
      return data.text;

    } catch (error) {
      console.error('Error al generar reflexión con la función de Netlify:', error);
      return this.getFallbackReflection();
    }
  }
  
  /**
   * Genera una oración para el evangelio del día
   */
  static async generateGospelPrayer(gospelText: string, reference: string): Promise<string> {
    try {
      const response = await fetch('/.netlify/functions/generate-reflection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'prayer',
          gospelText,
          reference,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      const data = await response.json();
      return data.text;

    } catch (error) {
      console.error('Error al generar oración con la función de Netlify:', error);
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
