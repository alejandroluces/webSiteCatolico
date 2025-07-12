import { supabase } from './supabase';
import { DailyContent } from '../hooks/useDailyContent';
import { readExcelFile } from './excelService';

/**
 * Servicio para gestionar el evangelio del día
 */
export class GospelService {
  /**
   * Obtiene el evangelio del día actual
   */
  static async getTodayGospel(): Promise<DailyContent | null> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_content')
        .select('*')
        .eq('type', 'gospel')
        .eq('date', today)
        .eq('is_active', true)
        .single();
      
      if (error) {
        console.error('Error al obtener el evangelio del día:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error en getTodayGospel:', error);
      return null;
    }
  }

  /**
   * Obtiene el evangelio para una fecha específica
   */
  static async getGospelByDate(date: string): Promise<DailyContent | null> {
    try {
      const { data, error } = await supabase
        .from('daily_content')
        .select('*')
        .eq('type', 'gospel')
        .eq('date', date)
        .eq('is_active', true)
        .single();
      
      if (error) {
        console.error(`Error al obtener el evangelio para ${date}:`, error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error en getGospelByDate:', error);
      return null;
    }
  }

  /**
   * Obtiene los evangelios para un rango de fechas
   */
  static async getGospelsForDateRange(startDate: string, endDate: string): Promise<DailyContent[]> {
    try {
      const { data, error } = await supabase
        .from('daily_content')
        .select('*')
        .eq('type', 'gospel')
        .eq('is_active', true)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error al obtener evangelios por rango de fechas:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error en getGospelsForDateRange:', error);
      return [];
    }
  }

  /**
   * Incrementa el contador de vistas para un evangelio
   */
  static async incrementGospelViews(gospelId: string): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Verificar si ya existe un registro de analytics para este contenido y fecha
      const { data: existingAnalytics } = await supabase
        .from('content_analytics')
        .select('id, views')
        .eq('content_id', gospelId)
        .eq('date', today)
        .single();
      
      if (existingAnalytics) {
        // Actualizar contador existente
        const { error } = await supabase
          .from('content_analytics')
          .update({ 
            views: existingAnalytics.views + 1,
          })
          .eq('id', existingAnalytics.id);
        
        return !error;
      } else {
        // Crear nuevo registro
        const { error } = await supabase
          .from('content_analytics')
          .insert([{
            content_id: gospelId,
            date: today,
            views: 1
          }]);
        
        return !error;
      }
    } catch (error) {
      console.error('Error al incrementar vistas:', error);
      return false;
    }
  }

  /**
   * Actualiza el evangelio del día desde el archivo Excel
   */
  static async updateGospelFromExcel(): Promise<boolean> {
    try {
      // Obtener la fecha actual en formato DDMMYYYY
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      const dateFormatted = `${day}${month}${year}`;
      
      // Ruta al archivo Excel
      const excelPath = `/public/images/gospels/${dateFormatted}.xlsx`;
      
      // Leer el contenido del Excel
      const gospelData = await readExcelFile(excelPath);
      
      if (!gospelData) {
        console.error(`No se encontró el archivo Excel para la fecha ${dateFormatted}`);
        return false;
      }
      
      // Crear o actualizar el registro en la base de datos
      const { error } = await supabase
        .from('daily_content')
        .upsert([{
          date: `${year}-${month}-${day}`,
          type: 'gospel',
          title: gospelData.title,
          content: gospelData.content,
          reference: gospelData.reference,
          prayer: gospelData.prayer,
          image_url: `/images/gospels/${dateFormatted}.png`,
          is_active: true,
          status: 'published',
          updated_at: new Date().toISOString()
        }], {
          onConflict: 'date,type'
        });
      
      if (error) {
        console.error('Error al actualizar el evangelio:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error en updateGospelFromExcel:', error);
      return false;
    }
  }
}