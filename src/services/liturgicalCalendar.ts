import { supabase } from './supabase';

export interface LiturgicalEvent {
  id: string;
  date: string;
  title: string;
  celebration_type: 'solemnity' | 'feast' | 'memorial' | 'optional_memorial' | 'special';
  liturgical_season: 'Adviento' | 'Navidad' | 'Tiempo Ordinario' | 'Cuaresma' | 'Pascua';
  liturgical_color: 'Blanco' | 'Rojo' | 'Verde' | 'Morado' | 'Rosa' | 'Dorado';
  rank: number;
  is_local_celebration: boolean;
  description?: string;
  patron_of?: string;
  readings_reference?: string;
}

export interface LiturgicalSeason {
  season: string;
  color: string;
  week_number: number;
  season_description: string;
}

export interface SaintOfDay {
  saint_name: string;
  celebration_type: string;
  description: string;
  patron_of: string;
  is_local: boolean;
}

class LiturgicalCalendarService {
  // Normalizar fecha para evitar problemas de zona horaria
  private normalizeDate(date: string | Date): string {
    if (typeof date === 'string') {
      // Si ya es una fecha en formato YYYY-MM-DD, devolverla tal como está
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }
      // Si es una fecha ISO, extraer solo la parte de la fecha
      return date.split('T')[0];
    }
    
    // Si es un objeto Date, convertir a formato YYYY-MM-DD en zona horaria local
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Obtener eventos litúrgicos para una fecha específica
  async getEventsForDate(date: string | Date): Promise<LiturgicalEvent[]> {
    try {
      const normalizedDate = this.normalizeDate(date);
      
      // Usar consulta directa para evitar problemas con funciones RPC
      const { data, error } = await supabase
        .from('liturgical_calendar')
        .select('*')
        .eq('date', normalizedDate)
        .order('rank', { ascending: false });

      if (error) {
        console.error('Error fetching liturgical events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getEventsForDate:', error);
      return [];
    }
  }

  // Obtener eventos para un rango de fechas
  async getEventsForDateRange(startDate: string | Date, endDate: string | Date): Promise<LiturgicalEvent[]> {
    try {
      const normalizedStartDate = this.normalizeDate(startDate);
      const normalizedEndDate = this.normalizeDate(endDate);

      const { data, error } = await supabase
        .from('liturgical_calendar')
        .select('*')
        .gte('date', normalizedStartDate)
        .lte('date', normalizedEndDate)
        .order('date', { ascending: true })
        .order('rank', { ascending: false });

      if (error) {
        console.error('Error fetching liturgical events range:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getEventsForDateRange:', error);
      return [];
    }
  }

  // Obtener el tiempo litúrgico actual
  async getCurrentLiturgicalSeason(date?: string | Date): Promise<LiturgicalSeason | null> {
    try {
      const targetDate = date ? this.normalizeDate(date) : this.normalizeDate(new Date());
      
      // Determinar el tiempo litúrgico basado en la fecha
      const dateObj = new Date(targetDate + 'T00:00:00');
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      
      // Lógica simplificada para determinar el tiempo litúrgico
      if ((month === 12 && day >= 25) || month === 1 && day <= 13) {
        return {
          season: 'Navidad',
          color: 'Blanco',
          week_number: 1,
          season_description: 'Celebración del nacimiento de Jesús'
        };
      } else if (month >= 3 && month <= 4) {
        return {
          season: 'Cuaresma',
          color: 'Morado',
          week_number: 1,
          season_description: 'Tiempo de preparación para la Pascua'
        };
      } else if (month >= 4 && month <= 5) {
        return {
          season: 'Pascua',
          color: 'Blanco',
          week_number: 1,
          season_description: 'Celebración de la Resurrección de Cristo'
        };
      } else if (month === 12 && day < 25) {
        return {
          season: 'Adviento',
          color: 'Morado',
          week_number: 1,
          season_description: 'Tiempo de preparación para la Navidad'
        };
      } else {
        return {
          season: 'Tiempo Ordinario',
          color: 'Verde',
          week_number: 1,
          season_description: 'Tiempo de crecimiento en la fe'
        };
      }
    } catch (error) {
      console.error('Error in getCurrentLiturgicalSeason:', error);
      return null;
    }
  }

  // Obtener santos del día
  async getSaintsOfDay(date?: string | Date): Promise<SaintOfDay[]> {
    try {
      const targetDate = date ? this.normalizeDate(date) : this.normalizeDate(new Date());
      
      const events = await this.getEventsForDate(targetDate);
      
      return events.map(event => ({
        saint_name: event.title,
        celebration_type: event.celebration_type,
        description: event.description || '',
        patron_of: event.patron_of || '',
        is_local: event.is_local_celebration
      }));
    } catch (error) {
      console.error('Error in getSaintsOfDay:', error);
      return [];
    }
  }

  // Obtener eventos por tipo de celebración
  async getEventsByType(
    celebrationType: 'solemnity' | 'feast' | 'memorial' | 'optional_memorial' | 'special',
    year: number = 2025
  ): Promise<LiturgicalEvent[]> {
    try {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;

      const { data, error } = await supabase
        .from('liturgical_calendar')
        .select('*')
        .eq('celebration_type', celebrationType)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching events by type:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getEventsByType:', error);
      return [];
    }
  }

  // Obtener celebraciones locales de Chile
  async getLocalCelebrations(year: number = 2025): Promise<LiturgicalEvent[]> {
    try {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;

      const { data, error } = await supabase
        .from('liturgical_calendar')
        .select('*')
        .eq('is_local_celebration', true)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching local celebrations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getLocalCelebrations:', error);
      return [];
    }
  }

  // Obtener eventos por tiempo litúrgico
  async getEventsBySeason(
    season: 'Adviento' | 'Navidad' | 'Tiempo Ordinario' | 'Cuaresma' | 'Pascua',
    year: number = 2025
  ): Promise<LiturgicalEvent[]> {
    try {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;

      const { data, error } = await supabase
        .from('liturgical_calendar')
        .select('*')
        .eq('liturgical_season', season)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching events by season:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getEventsBySeason:', error);
      return [];
    }
  }

  // Buscar eventos por texto
  async searchEvents(query: string, year: number = 2025): Promise<LiturgicalEvent[]> {
    try {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;

      const { data, error } = await supabase
        .from('liturgical_calendar')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,patron_of.ilike.%${query}%`)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('rank', { ascending: false })
        .order('date', { ascending: true });

      if (error) {
        console.error('Error searching events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchEvents:', error);
      return [];
    }
  }

  // Obtener próximas celebraciones importantes
  async getUpcomingMajorCelebrations(days: number = 30): Promise<LiturgicalEvent[]> {
    try {
      const today = this.normalizeDate(new Date());
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      const endDate = this.normalizeDate(futureDate);

      const { data, error } = await supabase
        .from('liturgical_calendar')
        .select('*')
        .gte('date', today)
        .lte('date', endDate)
        .or('rank.gte.8,is_local_celebration.eq.true') // Solemnidades, fiestas o celebraciones locales
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching upcoming celebrations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUpcomingMajorCelebrations:', error);
      return [];
    }
  }

  // Obtener color litúrgico para una fecha
  async getLiturgicalColor(date?: string | Date): Promise<string> {
    try {
      const targetDate = date ? this.normalizeDate(date) : this.normalizeDate(new Date());
      
      // Primero verificar si hay una celebración específica
      const events = await this.getEventsForDate(targetDate);
      
      if (events.length > 0) {
        // Tomar el color de la celebración de mayor rango
        const highestRankEvent = events.reduce((prev, current) => 
          current.rank > prev.rank ? current : prev
        );
        return highestRankEvent.liturgical_color;
      }

      // Si no hay celebración específica, usar el tiempo litúrgico
      const season = await this.getCurrentLiturgicalSeason(targetDate);
      return season?.color || 'Verde';
    } catch (error) {
      console.error('Error getting liturgical color:', error);
      return 'Verde';
    }
  }

  // Obtener estadísticas del calendario litúrgico
  async getCalendarStatistics(year: number = 2025): Promise<{
    total_events: number;
    by_type: Record<string, number>;
    by_season: Record<string, number>;
    local_celebrations: number;
    major_celebrations: number;
  }> {
    try {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;

      const { data: allEvents, error } = await supabase
        .from('liturgical_calendar')
        .select('celebration_type, liturgical_season, is_local_celebration, rank')
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) {
        console.error('Error fetching calendar statistics:', error);
        return {
          total_events: 0,
          by_type: {},
          by_season: {},
          local_celebrations: 0,
          major_celebrations: 0
        };
      }

      const events = allEvents || [];

      const byType = events.reduce((acc, event) => {
        acc[event.celebration_type] = (acc[event.celebration_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const bySeason = events.reduce((acc, event) => {
        acc[event.liturgical_season] = (acc[event.liturgical_season] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const localCelebrations = events.filter(e => e.is_local_celebration).length;
      const majorCelebrations = events.filter(e => e.rank >= 8).length;

      return {
        total_events: events.length,
        by_type: byType,
        by_season: bySeason,
        local_celebrations: localCelebrations,
        major_celebrations: majorCelebrations
      };
    } catch (error) {
      console.error('Error in getCalendarStatistics:', error);
      return {
        total_events: 0,
        by_type: {},
        by_season: {},
        local_celebrations: 0,
        major_celebrations: 0
      };
    }
  }

  // Obtener eventos para un mes completo (para el calendario)
  async getEventsForMonth(year: number, month: number): Promise<LiturgicalEvent[]> {
    try {
      // Asegurar que el mes esté en formato de dos dígitos
      const monthStr = month.toString().padStart(2, '0');
      const startDate = `${year}-${monthStr}-01`;
      
      // Calcular el último día del mes
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${monthStr}-${lastDay.toString().padStart(2, '0')}`;

      const { data, error } = await supabase
        .from('liturgical_calendar')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })
        .order('rank', { ascending: false });

      if (error) {
        console.error('Error fetching month events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getEventsForMonth:', error);
      return [];
    }
  }

  // Obtener eventos para una fecha específica (versión segura)
  async getEventsForDateSafe(dateStr: string): Promise<LiturgicalEvent[]> {
    try {
      // Asegurar que la fecha esté en formato YYYY-MM-DD
      const normalizedDate = this.normalizeDate(dateStr);
      
      return await this.getEventsForDate(normalizedDate);
    } catch (error) {
      console.error('Error in getEventsForDateSafe:', error);
      return [];
    }
  }
}

export const liturgicalCalendarService = new LiturgicalCalendarService();