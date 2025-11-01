import { supabase } from './supabase';

export interface DailyReading {
  id: string;
  date: string;
  type: 'gospel' | 'reading' | 'saint';
  title: string;
  reference: string;
  content: string;
  prayer?: string;
  reflection?: string;
  image_url?: string;
  liturgical_season?: string;
  liturgical_color?: string;
  status: string;
  is_active: boolean;
}

export interface DailyReadingsData {
  date: string;
  formattedDate: string;
  liturgicalSeason: string;
  liturgicalColor: string;
  weekday: string;
  gospel?: DailyReading;
  reading?: DailyReading;
}

/**
 * Obtiene las lecturas del día (evangelio y lectura) desde Supabase
 * @param date - Fecha en formato YYYY-MM-DD. Si no se proporciona, usa la fecha actual
 * @returns Objeto con las lecturas del día
 */
export async function getDailyReadings(date?: string): Promise<DailyReadingsData | null> {
  try {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return null;
    }

    // Si no se proporciona fecha, usar la fecha actual
    const targetDate = date || new Date().toISOString().split('T')[0];

    // Obtener el evangelio y la lectura del día
    const { data, error } = await supabase
      .from('daily_content')
      .select('*')
      .eq('date', targetDate)
      .in('type', ['gospel', 'reading'])
      .eq('is_active', true)
      .eq('status', 'published');

    if (error) {
      console.error('Error fetching daily readings:', error);
      return null;
    }

    if (!data || data.length === 0) {
      console.log('No readings found for date:', targetDate);
      return null;
    }

    // Separar evangelio y lectura
    const gospel = data.find((item: DailyReading) => item.type === 'gospel');
    const reading = data.find((item: DailyReading) => item.type === 'reading');

    // Formatear la fecha
    const dateObj = new Date(targetDate + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Obtener el día de la semana
    const weekday = dateObj.toLocaleDateString('es-ES', { weekday: 'long' });

    return {
      date: targetDate,
      formattedDate,
      liturgicalSeason: gospel?.liturgical_season || 'Tiempo Ordinario',
      liturgicalColor: gospel?.liturgical_color || 'Verde',
      weekday: `${weekday.charAt(0).toUpperCase() + weekday.slice(1)} de la 2ª semana del Tiempo Ordinario`,
      gospel: gospel as DailyReading,
      reading: reading as DailyReading,
    };
  } catch (error) {
    console.error('Error in getDailyReadings:', error);
    return null;
  }
}

/**
 * Obtiene las lecturas para un rango de fechas
 * @param startDate - Fecha inicial en formato YYYY-MM-DD
 * @param endDate - Fecha final en formato YYYY-MM-DD
 * @returns Array de lecturas
 */
export async function getDailyReadingsRange(startDate: string, endDate: string): Promise<DailyReading[]> {
  try {
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return [];
    }

    const { data, error } = await supabase
      .from('daily_content')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .in('type', ['gospel', 'reading'])
      .eq('is_active', true)
      .eq('status', 'published')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching daily readings range:', error);
      return [];
    }

    return data as DailyReading[];
  } catch (error) {
    console.error('Error in getDailyReadingsRange:', error);
    return [];
  }
}
