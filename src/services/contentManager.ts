import { supabase } from './supabase';

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
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface ContentSchedule {
  id: string;
  content_type: 'gospel' | 'saint' | 'reading';
  scheduled_date: string;
  content_id: string;
  is_published: boolean;
  created_by: string;
}

class ContentManager {
  // Obtener contenido del día actual
  async getTodayContent(type: 'gospel' | 'saint' | 'reading'): Promise<DailyContent | null> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('daily_content')
      .select('*')
      .eq('type', type)
      .eq('date', today)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching today content:', error);
      return null;
    }

    return data;
  }

  // Obtener contenido por fecha específica
  async getContentByDate(date: string, type: 'gospel' | 'saint' | 'reading'): Promise<DailyContent | null> {
    const { data, error } = await supabase
      .from('daily_content')
      .select('*')
      .eq('type', type)
      .eq('date', date)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching content by date:', error);
      return null;
    }

    return data;
  }

  // Obtener contenido programado para los próximos días
  async getScheduledContent(days: number = 7): Promise<ContentSchedule[]> {
    const today = new Date();
    const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
    
    const { data, error } = await supabase
      .from('content_schedule')
      .select(`
        *,
        daily_content (*)
      `)
      .gte('scheduled_date', today.toISOString().split('T')[0])
      .lte('scheduled_date', futureDate.toISOString().split('T')[0])
      .order('scheduled_date', { ascending: true });

    if (error) {
      console.error('Error fetching scheduled content:', error);
      return [];
    }

    return data || [];
  }

  // Crear nuevo contenido
  async createContent(content: Omit<DailyContent, 'id' | 'created_at' | 'updated_at'>): Promise<DailyContent | null> {
    const { data, error } = await supabase
      .from('daily_content')
      .insert([{
        ...content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating content:', error);
      return null;
    }

    return data;
  }

  // Actualizar contenido existente
  async updateContent(id: string, updates: Partial<DailyContent>): Promise<DailyContent | null> {
    const { data, error } = await supabase
      .from('daily_content')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating content:', error);
      return null;
    }

    return data;
  }

  // Programar contenido para una fecha específica
  async scheduleContent(contentId: string, date: string, type: 'gospel' | 'saint' | 'reading'): Promise<boolean> {
    const { error } = await supabase
      .from('content_schedule')
      .insert([{
        content_type: type,
        scheduled_date: date,
        content_id: contentId,
        is_published: false,
        created_by: 'admin' // En producción, usar el ID del usuario autenticado
      }]);

    if (error) {
      console.error('Error scheduling content:', error);
      return false;
    }

    return true;
  }

  // Publicar contenido programado (ejecutar diariamente)
  async publishScheduledContent(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: scheduledItems, error } = await supabase
      .from('content_schedule')
      .select('*')
      .eq('scheduled_date', today)
      .eq('is_published', false);

    if (error) {
      console.error('Error fetching scheduled items:', error);
      return;
    }

    for (const item of scheduledItems || []) {
      // Marcar como publicado
      await supabase
        .from('content_schedule')
        .update({ is_published: true })
        .eq('id', item.id);

      // Activar el contenido correspondiente
      await supabase
        .from('daily_content')
        .update({ is_active: true })
        .eq('id', item.content_id);
    }
  }

  // Obtener estadísticas de contenido
  async getContentStats(): Promise<{
    total_content: number;
    scheduled_content: number;
    active_content: number;
    content_by_type: Record<string, number>;
  }> {
    const { data: totalContent } = await supabase
      .from('daily_content')
      .select('id', { count: 'exact' });

    const { data: scheduledContent } = await supabase
      .from('content_schedule')
      .select('id', { count: 'exact' })
      .eq('is_published', false);

    const { data: activeContent } = await supabase
      .from('daily_content')
      .select('id', { count: 'exact' })
      .eq('is_active', true);

    const { data: contentByType } = await supabase
      .from('daily_content')
      .select('type');

    const typeStats = (contentByType || []).reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total_content: totalContent?.length || 0,
      scheduled_content: scheduledContent?.length || 0,
      active_content: activeContent?.length || 0,
      content_by_type: typeStats
    };
  }
}

export const contentManager = new ContentManager();