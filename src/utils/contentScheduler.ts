// Utilidad para programar y automatizar contenido

export interface ScheduleConfig {
  type: 'gospel' | 'saint' | 'reading';
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string; // HH:MM format
  timezone: string;
  autoPublish: boolean;
}

export class ContentScheduler {
  private schedules: Map<string, ScheduleConfig> = new Map();

  // Configurar programación automática
  setSchedule(id: string, config: ScheduleConfig) {
    this.schedules.set(id, config);
    this.setupScheduleJob(id, config);
  }

  // Configurar trabajo programado
  private setupScheduleJob(id: string, config: ScheduleConfig) {
    // En una implementación real, usarías una librería como node-cron
    // o un servicio de trabajos en segundo plano
    console.log(`Programando trabajo ${id}:`, config);
  }

  // Ejecutar publicación automática
  async executeScheduledPublishing() {
    try {
      // Importar el contentManager aquí para evitar dependencias circulares
      const { contentManager } = await import('../services/contentManager');
      await contentManager.publishScheduledContent();
      console.log('Contenido programado publicado exitosamente');
    } catch (error) {
      console.error('Error al publicar contenido programado:', error);
    }
  }

  // Verificar contenido faltante
  async checkMissingContent(days: number = 7): Promise<{
    date: string;
    type: 'gospel' | 'saint' | 'reading';
  }[]> {
    const missing: { date: string; type: 'gospel' | 'saint' | 'reading' }[] = [];
    const { contentManager } = await import('../services/contentManager');

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      for (const type of ['gospel', 'saint', 'reading'] as const) {
        const content = await contentManager.getContentByDate(dateStr, type);
        if (!content) {
          missing.push({ date: dateStr, type });
        }
      }
    }

    return missing;
  }

  // Generar reporte de contenido
  async generateContentReport(startDate: string, endDate: string) {
    const { contentManager } = await import('../services/contentManager');
    const stats = await contentManager.getContentStats();
    
    return {
      period: { startDate, endDate },
      stats,
      missingContent: await this.checkMissingContent(30),
      recommendations: this.generateRecommendations(stats)
    };
  }

  private generateRecommendations(stats: any): string[] {
    const recommendations: string[] = [];

    if (stats.scheduled_content < 7) {
      recommendations.push('Se recomienda programar contenido para al menos 7 días en adelante');
    }

    if (stats.content_by_type.gospel < stats.content_by_type.saint) {
      recommendations.push('Considerar crear más contenido del Evangelio');
    }

    if (stats.total_content < 30) {
      recommendations.push('Aumentar la biblioteca de contenido para mayor variedad');
    }

    return recommendations;
  }
}

export const contentScheduler = new ContentScheduler();

// Configuración por defecto
contentScheduler.setSchedule('daily-gospel', {
  type: 'gospel',
  frequency: 'daily',
  time: '06:00',
  timezone: 'Europe/Madrid',
  autoPublish: true
});

contentScheduler.setSchedule('daily-saint', {
  type: 'saint',
  frequency: 'daily',
  time: '06:00',
  timezone: 'Europe/Madrid',
  autoPublish: true
});

contentScheduler.setSchedule('daily-reading', {
  type: 'reading',
  frequency: 'daily',
  time: '06:00',
  timezone: 'Europe/Madrid',
  autoPublish: true
});