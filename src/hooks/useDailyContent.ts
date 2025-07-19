import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export interface DailyContent {
  id: string;
  date: string;
  type: 'gospel' | 'saint' | 'reading';
  title: string;
  content: string;
  reference?: string;
  reflection?: string;
  prayer?: string;
  author?: string;
  feast_day?: string;
  liturgical_season?: string;
  liturgical_color?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export const useDailyContent = (type: 'gospel' | 'saint' | 'reading', date?: string) => {
  const [content, setContent] = useState<DailyContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, [type, date]);

  const loadContent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Obtener la fecha actual en formato YYYY-MM-DD
      const today = new Date().toISOString().split('T')[0];
      const targetDate = date || today;
      
      // Verificar si Supabase está configurado
      if (!supabase) {
        console.warn('Supabase no está configurado. Usando contenido estático.');
        setContent(getStaticContent(type, targetDate));
        setIsLoading(false);
        return;
      }
      
      // Consultar la base de datos
      const { data, error: fetchError } = await supabase
        .from('daily_content')
        .select('*')
        .eq('type', type)
        .eq('date', targetDate)
        .eq('is_active', true)
        .maybeSingle();

      if (fetchError) {
        throw new Error(`Error al cargar el contenido: ${fetchError.message}`);
      } else if (data) {
        setContent(data);
      } else {
        // Fallback a contenido estático cuando no hay datos
        setContent(getStaticContent(type, targetDate));
      }
    } catch (err) {
      console.error('Error en useDailyContent:', err);
      setError('Error al cargar el contenido. Por favor, intenta nuevamente.');
      // Fallback a contenido estático en caso de error
      setContent(getStaticContent(type, date || new Date().toISOString().split('T')[0]));
    } finally {
      setIsLoading(false);
    }
  };

  return { content, isLoading, error, refetch: loadContent };
};

// Contenido estático de fallback
const getStaticContent = (type: 'gospel' | 'saint' | 'reading', date: string): DailyContent => {
  switch (type) {
    case 'gospel':
      return {
        id: 'static-gospel',
        date: date,
        type: 'gospel',
        title: 'La multiplicación de los panes',
        content: `En aquel tiempo, Jesús habló del Reino de Dios a la multitud y curó a los enfermos. Cuando caía la tarde, los doce apóstoles se acercaron a decirle: "Despide a la gente para que vayan a los pueblos y caseríos a buscar alojamiento y comida, porque aquí estamos en un lugar solitario". Él les contestó: "Denles ustedes de comer". Pero ellos le replicaron: "No tenemos más que cinco panes y dos pescados; a no ser que vayamos nosotros mismos a comprar víveres para toda esta gente". Eran como cinco mil varones. Entonces Jesús dijo a sus discípulos: "Hagan que se sienten en grupos como de cincuenta". Así lo hicieron, y todos se sentaron. Después Jesús tomó en sus manos los cinco panes y los dos pescados, y levantando su mirada al cielo, pronunció sobre ellos una oración de acción de gracias, los partió y los fue dando a los discípulos para que ellos los distribuyeran entre la gente. Comieron todos y se saciaron, y de lo que sobró se llenaron doce canastos.`,
        reference: 'Lucas 9, 11-17',
        reflection: `El Evangelio de hoy nos presenta el milagro de la multiplicación de los panes y los peces, un relato que aparece en los cuatro evangelios, lo que subraya su importancia en la tradición cristiana.

Este pasaje nos muestra a Jesús atendiendo las necesidades integrales de las personas: primero les habla del Reino de Dios y cura a los enfermos, atendiendo sus necesidades espirituales y físicas. Luego, cuando los discípulos le sugieren despedir a la multitud para que busquen alimento, Jesús responde con una invitación desafiante: "Denles ustedes de comer".

Esta petición de Jesús nos interpela también hoy. Frente a las necesidades de nuestros hermanos, a veces nuestra primera reacción es similar a la de los discípulos: delegar la responsabilidad o sentirnos abrumados por la magnitud del problema. "No tenemos más que cinco panes y dos pescados", dicen ellos, expresando su sensación de impotencia.

Sin embargo, Jesús nos enseña que lo poco que tenemos, puesto en sus manos, puede multiplicarse para alimentar a muchos. El milagro comienza cuando entregamos lo que somos y lo que tenemos, por insignificante que parezca.

Es significativo que Jesús no crea el alimento de la nada, sino que parte de lo disponible. Toma los cinco panes y dos pescados, da gracias al Padre, los parte y los entrega a los discípulos para que ellos los distribuyan. Este gesto anticipa la Eucaristía, donde Jesús se entrega a sí mismo como alimento espiritual para todos.

El resultado es abundancia: "Comieron todos y se saciaron, y de lo que sobró se llenaron doce canastos". Dios no solo satisface nuestras necesidades, sino que lo hace con generosidad desbordante.

Este evangelio nos invita a:
- Confiar en que Dios puede multiplicar nuestros pequeños esfuerzos
- Compartir lo que tenemos en lugar de lamentarnos por lo que nos falta
- Reconocer que somos llamados a ser instrumentos de Dios para alimentar a otros, no solo materialmente sino también espiritualmente
- Vivir con gratitud, reconociendo que todo lo que tenemos es don de Dios

En un mundo marcado por el individualismo y el consumismo, este evangelio nos recuerda la importancia de la solidaridad y la confianza en la providencia divina.`,
        prayer: `Señor Jesús, que multiplicaste los panes y los peces para alimentar a la multitud, multiplica también nuestros pequeños dones y talentos para que podamos servir a nuestros hermanos. Ayúdanos a compartir generosamente lo que somos y lo que tenemos, confiando en que Tú puedes hacer maravillas con nuestra pobreza. Amén.`,
        image_url: 'images/gospels/multiplicacion-panes.jpg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true
      };
    case 'saint':
      return {
        id: 'static-saint',
        date: date,
        type: 'saint',
        title: 'San Antonio Abad',
        content: `San Antonio Abad (251-356), conocido como el "Padre del Monacato", fue uno de los primeros ermitaños cristianos. Nacido en Egipto en una familia acomodada, a los 20 años distribuyó sus bienes entre los pobres y se retiró al desierto para dedicarse completamente a la oración y la penitencia.

Durante más de 80 años vivió en soledad, enfrentando tentaciones y dificultades con una fe inquebrantable. Su ejemplo atrajo a muchos discípulos que buscaban seguir su camino de santidad.

San Antonio es considerado el fundador del monacato cristiano y es venerado tanto en Oriente como en Occidente. Su vida nos enseña la importancia del silencio, la oración y el desprendimiento de los bienes materiales para encontrar a Dios.`,
        feast_day: '17 de enero',
        liturgical_season: 'Tiempo Ordinario',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true
      };
    case 'reading':
      return {
        id: 'static-reading',
        date: date,
        type: 'reading',
        title: 'Primera Lectura del Día',
        content: `Lectura de la carta a los Hebreos.

Hermanos: Melquisedec, rey de Salem y sacerdote del Dios altísimo, salió al encuentro de Abrahán cuando volvía de derrotar a los reyes, y lo bendijo. Abrahán le dio la décima parte de todo. Su nombre significa primero "rey de justicia", y además es rey de Salem, es decir, "rey de paz". Sin padre, sin madre, sin genealogía, sin comienzo de días ni fin de vida, asemejado al Hijo de Dios, permanece sacerdote para siempre.

Palabra de Dios.`,
        reference: 'Hebreos 7:1-3, 15-17',
        liturgical_season: 'Tiempo Ordinario',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true
      };
    default:
      throw new Error('Tipo de contenido no válido');
  }
};
