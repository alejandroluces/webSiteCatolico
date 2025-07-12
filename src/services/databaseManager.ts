import { supabase } from './supabase';

export interface SystemStats {
  content: {
    total: number;
    active: number;
    scheduled: number;
    by_type: Record<string, number>;
  };
  users: {
    total_admins: number;
    active_admins: number;
    by_role: Record<string, number>;
  };
  analytics: {
    total_views: number;
    total_shares: number;
    avg_rating: number;
  };
  system: {
    last_backup: string;
    active_sessions: number;
    recent_errors: number;
  };
}

export interface MissingContent {
  missing_date: string;
  missing_type: string;
  days_until: string;
  is_critical: boolean;
}

export interface ContentTemplate {
  id: string;
  name: string;
  type: 'gospel' | 'saint' | 'reading';
  template_content: any;
  description: string;
  is_default: boolean;
}

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description: string;
  is_public: boolean;
}

class DatabaseManager {
  // Obtener estadísticas completas del sistema
  async getSystemStatistics(): Promise<SystemStats | null> {
    try {
      const { data, error } = await supabase.rpc('get_system_statistics');
      
      if (error) {
        console.error('Error fetching system statistics:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getSystemStatistics:', error);
      return null;
    }
  }

  // Verificar contenido crítico faltante
  async checkCriticalMissingContent(): Promise<MissingContent[]> {
    try {
      const { data, error } = await supabase.rpc('check_critical_missing_content');
      
      if (error) {
        console.error('Error checking missing content:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in checkCriticalMissingContent:', error);
      return [];
    }
  }

  // Ejecutar publicación programada
  async executeScheduledPublishing(): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('publish_scheduled_content');
      
      if (error) {
        console.error('Error executing scheduled publishing:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in executeScheduledPublishing:', error);
      return false;
    }
  }

  // Generar métricas diarias
  async generateDailyMetrics(): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('generate_daily_metrics');
      
      if (error) {
        console.error('Error generating daily metrics:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in generateDailyMetrics:', error);
      return false;
    }
  }

  // Limpiar sesiones expiradas
  async cleanupExpiredSessions(): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('cleanup_expired_sessions');
      
      if (error) {
        console.error('Error cleaning up sessions:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in cleanupExpiredSessions:', error);
      return false;
    }
  }

  // Obtener plantillas de contenido
  async getContentTemplates(type?: 'gospel' | 'saint' | 'reading'): Promise<ContentTemplate[]> {
    try {
      let query = supabase.from('content_templates').select('*');
      
      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query.order('is_default', { ascending: false });
      
      if (error) {
        console.error('Error fetching content templates:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getContentTemplates:', error);
      return [];
    }
  }

  // Crear nueva plantilla
  async createContentTemplate(template: Omit<ContentTemplate, 'id'>): Promise<ContentTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('content_templates')
        .insert([template])
        .select()
        .single();

      if (error) {
        console.error('Error creating content template:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createContentTemplate:', error);
      return null;
    }
  }

  // Obtener configuraciones del sistema
  async getSystemSettings(publicOnly: boolean = false): Promise<SystemSetting[]> {
    try {
      let query = supabase.from('system_settings').select('*');
      
      if (publicOnly) {
        query = query.eq('is_public', true);
      }

      const { data, error } = await query.order('setting_key');
      
      if (error) {
        console.error('Error fetching system settings:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSystemSettings:', error);
      return [];
    }
  }

  // Actualizar configuración del sistema
  async updateSystemSetting(key: string, value: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({ 
          setting_value: value,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', key);

      if (error) {
        console.error('Error updating system setting:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateSystemSetting:', error);
      return false;
    }
  }

  // Obtener logs de auditoría
  async getAuditLogs(limit: number = 100, offset: number = 0): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          admin_users!audit_logs_user_id_fkey (email, role)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching audit logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAuditLogs:', error);
      return [];
    }
  }

  // Crear backup manual
  async createManualBackup(): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Contar contenido actual
      const { count } = await supabase
        .from('daily_content')
        .select('*', { count: 'exact', head: true });

      const { error } = await supabase
        .from('content_backups')
        .insert([{
          backup_date: today,
          content_count: count || 0,
          status: 'completed',
          backup_path: `backups/${today}/manual_backup.sql`
        }]);

      if (error) {
        console.error('Error creating manual backup:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in createManualBackup:', error);
      return false;
    }
  }

  // Obtener métricas de contenido por período
  async getContentMetrics(startDate: string, endDate: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('content_analytics')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date');

      if (error) {
        console.error('Error fetching content metrics:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getContentMetrics:', error);
      return [];
    }
  }

  // Obtener feedback de contenido
  async getContentFeedback(contentId?: string, approved?: boolean): Promise<any[]> {
    try {
      let query = supabase
        .from('content_feedback')
        .select(`
          *,
          daily_content (title, type, date)
        `);

      if (contentId) {
        query = query.eq('content_id', contentId);
      }

      if (approved !== undefined) {
        query = query.eq('is_approved', approved);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching content feedback:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getContentFeedback:', error);
      return [];
    }
  }

  // Aprobar feedback
  async approveFeedback(feedbackId: string, approved: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('content_feedback')
        .update({ 
          is_approved: approved,
          approved_at: new Date().toISOString()
        })
        .eq('id', feedbackId);

      if (error) {
        console.error('Error approving feedback:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in approveFeedback:', error);
      return false;
    }
  }

  // Obtener historial de contenido
  async getContentHistory(contentId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('content_history')
        .select(`
          *,
          admin_users!content_history_changed_by_fkey (email, role)
        `)
        .eq('content_id', contentId)
        .order('version_number', { ascending: false });

      if (error) {
        console.error('Error fetching content history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getContentHistory:', error);
      return [];
    }
  }

  // Restaurar versión de contenido
  async restoreContentVersion(contentId: string, versionNumber: number): Promise<boolean> {
    try {
      // Obtener la versión específica
      const { data: historyData, error: historyError } = await supabase
        .from('content_history')
        .select('changes')
        .eq('content_id', contentId)
        .eq('version_number', versionNumber)
        .single();

      if (historyError || !historyData) {
        console.error('Error fetching version data:', historyError);
        return false;
      }

      const oldData = historyData.changes.old;

      // Restaurar el contenido
      const { error: updateError } = await supabase
        .from('daily_content')
        .update({
          title: oldData.title,
          content: oldData.content,
          reflection: oldData.reflection,
          prayer: oldData.prayer,
          updated_at: new Date().toISOString()
        })
        .eq('id', contentId);

      if (updateError) {
        console.error('Error restoring content version:', updateError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in restoreContentVersion:', error);
      return false;
    }
  }
}

export const databaseManager = new DatabaseManager();