#!/usr/bin/env node

/**
 * Script para generar reportes completos de contenido
 * Útil para análisis y planificación
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function generateContentReport(options = {}) {
  const {
    startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate = new Date().toISOString().split('T')[0],
    format = 'console',
    outputFile = null
  } = options;

  console.log('📊 Generando reporte de contenido...');
  console.log(`📅 Período: ${startDate} a ${endDate}`);
  console.log('=' .repeat(60));

  const report = {
    metadata: {
      generated_at: new Date().toISOString(),
      period: { start: startDate, end: endDate },
      generator: 'Camino de Fe Content Report System'
    },
    summary: {},
    content_analysis: {},
    performance_metrics: {},
    user_engagement: {},
    system_health: {},
    recommendations: []
  };

  try {
    // 1. Resumen general
    console.log('\n📋 1. RESUMEN GENERAL');
    console.log('-' .repeat(30));

    const { data: totalContent } = await supabase
      .from('daily_content')
      .select('id, type, status, created_at', { count: 'exact' });

    const { data: activeContent } = await supabase
      .from('daily_content')
      .select('id', { count: 'exact' })
      .eq('is_active', true);

    const { data: scheduledContent } = await supabase
      .from('content_schedule')
      .select('id', { count: 'exact' })
      .eq('is_published', false);

    report.summary = {
      total_content: totalContent?.length || 0,
      active_content: activeContent?.length || 0,
      scheduled_content: scheduledContent?.length || 0,
      content_by_status: {}
    };

    // Agrupar por estado
    const statusGroups = (totalContent || []).reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    report.summary.content_by_status = statusGroups;

    console.log(`   📚 Total de contenido: ${report.summary.total_content}`);
    console.log(`   ✅ Contenido activo: ${report.summary.active_content}`);
    console.log(`   ⏰ Contenido programado: ${report.summary.scheduled_content}`);
    console.log(`   📊 Por estado:`, statusGroups);

    // 2. Análisis de contenido
    console.log('\n📈 2. ANÁLISIS DE CONTENIDO');
    console.log('-' .repeat(30));

    const { data: contentByType } = await supabase
      .from('daily_content')
      .select('type, created_at')
      .gte('created_at', startDate)
      .lte('created_at', endDate + 'T23:59:59');

    const typeAnalysis = (contentByType || []).reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});

    report.content_analysis = {
      content_by_type: typeAnalysis,
      creation_trend: {},
      coverage_analysis: {}
    };

    console.log(`   📖 Evangelios: ${typeAnalysis.gospel || 0}`);
    console.log(`   👼 Santos: ${typeAnalysis.saint || 0}`);
    console.log(`   📜 Lecturas: ${typeAnalysis.reading || 0}`);

    // 3. Métricas de rendimiento
    console.log('\n⚡ 3. MÉTRICAS DE RENDIMIENTO');
    console.log('-' .repeat(30));

    const { data: analytics } = await supabase
      .from('content_analytics')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate);

    if (analytics && analytics.length > 0) {
      const totalViews = analytics.reduce((sum, item) => sum + (item.views || 0), 0);
      const totalShares = analytics.reduce((sum, item) => sum + (item.shares || 0), 0);
      const totalLikes = analytics.reduce((sum, item) => sum + (item.likes || 0), 0);
      const avgTimeSpent = analytics.reduce((sum, item) => sum + (item.time_spent_seconds || 0), 0) / analytics.length;

      report.performance_metrics = {
        total_views: totalViews,
        total_shares: totalShares,
        total_likes: totalLikes,
        avg_time_spent_seconds: Math.round(avgTimeSpent),
        avg_daily_views: Math.round(totalViews / analytics.length),
        engagement_rate: totalViews > 0 ? ((totalLikes + totalShares) / totalViews * 100).toFixed(2) : 0
      };

      console.log(`   👀 Total de vistas: ${totalViews.toLocaleString()}`);
      console.log(`   📤 Total compartidos: ${totalShares.toLocaleString()}`);
      console.log(`   ❤️  Total me gusta: ${totalLikes.toLocaleString()}`);
      console.log(`   ⏱️  Tiempo promedio: ${Math.round(avgTimeSpent)}s`);
      console.log(`   📊 Tasa de engagement: ${report.performance_metrics.engagement_rate}%`);
    } else {
      console.log('   ℹ️  No hay datos de analytics disponibles');
      report.performance_metrics = {
        total_views: 0,
        total_shares: 0,
        total_likes: 0,
        avg_time_spent_seconds: 0,
        avg_daily_views: 0,
        engagement_rate: 0
      };
    }

    // 4. Engagement de usuarios
    console.log('\n👥 4. ENGAGEMENT DE USUARIOS');
    console.log('-' .repeat(30));

    const { data: feedback } = await supabase
      .from('content_feedback')
      .select('rating, created_at, is_approved')
      .gte('created_at', startDate)
      .lte('created_at', endDate + 'T23:59:59');

    if (feedback && feedback.length > 0) {
      const approvedFeedback = feedback.filter(f => f.is_approved);
      const avgRating = approvedFeedback.length > 0 
        ? (approvedFeedback.reduce((sum, f) => sum + f.rating, 0) / approvedFeedback.length).toFixed(2)
        : 0;

      const ratingDistribution = approvedFeedback.reduce((acc, f) => {
        acc[f.rating] = (acc[f.rating] || 0) + 1;
        return acc;
      }, {});

      report.user_engagement = {
        total_feedback: feedback.length,
        approved_feedback: approvedFeedback.length,
        avg_rating: parseFloat(avgRating),
        rating_distribution: ratingDistribution
      };

      console.log(`   💬 Total feedback: ${feedback.length}`);
      console.log(`   ✅ Feedback aprobado: ${approvedFeedback.length}`);
      console.log(`   ⭐ Calificación promedio: ${avgRating}/5`);
      console.log(`   📊 Distribución de calificaciones:`, ratingDistribution);
    } else {
      console.log('   ℹ️  No hay feedback de usuarios disponible');
      report.user_engagement = {
        total_feedback: 0,
        approved_feedback: 0,
        avg_rating: 0,
        rating_distribution: {}
      };
    }

    // 5. Salud del sistema
    console.log('\n🏥 5. SALUD DEL SISTEMA');
    console.log('-' .repeat(30));

    const { data: recentErrors } = await supabase
      .from('audit_logs')
      .select('id')
      .eq('action', 'ERROR')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const { data: lastBackup } = await supabase
      .from('content_backups')
      .select('backup_date, status')
      .eq('status', 'completed')
      .order('backup_date', { ascending: false })
      .limit(1);

    const { data: activeSessions } = await supabase
      .from('user_sessions')
      .select('id', { count: 'exact' })
      .eq('is_active', true);

    report.system_health = {
      recent_errors: recentErrors?.length || 0,
      last_backup_date: lastBackup?.[0]?.backup_date || null,
      active_sessions: activeSessions?.length || 0,
      system_status: 'healthy'
    };

    // Determinar estado del sistema
    if (report.system_health.recent_errors > 10) {
      report.system_health.system_status = 'warning';
    }
    if (report.system_health.recent_errors > 50) {
      report.system_health.system_status = 'critical';
    }

    console.log(`   🚨 Errores recientes (24h): ${report.system_health.recent_errors}`);
    console.log(`   💾 Último backup: ${report.system_health.last_backup_date || 'No disponible'}`);
    console.log(`   👤 Sesiones activas: ${report.system_health.active_sessions}`);
    console.log(`   🎯 Estado del sistema: ${report.system_health.system_status}`);

    // 6. Recomendaciones
    console.log('\n💡 6. RECOMENDACIONES');
    console.log('-' .repeat(30));

    const recommendations = [];

    // Análisis de contenido
    if (report.summary.scheduled_content < 7) {
      recommendations.push({
        priority: 'high',
        category: 'content',
        message: 'Se recomienda programar contenido para al menos 7 días en adelante'
      });
    }

    if (typeAnalysis.gospel < typeAnalysis.saint) {
      recommendations.push({
        priority: 'medium',
        category: 'content',
        message: 'Considerar crear más contenido del Evangelio para equilibrar los tipos'
      });
    }

    // Análisis de engagement
    if (report.performance_metrics.engagement_rate < 2) {
      recommendations.push({
        priority: 'medium',
        category: 'engagement',
        message: 'La tasa de engagement es baja. Considerar mejorar la calidad del contenido'
      });
    }

    if (report.user_engagement.avg_rating < 4 && report.user_engagement.approved_feedback > 10) {
      recommendations.push({
        priority: 'high',
        category: 'quality',
        message: 'La calificación promedio es baja. Revisar la calidad del contenido'
      });
    }

    // Análisis del sistema
    if (report.system_health.recent_errors > 5) {
      recommendations.push({
        priority: 'high',
        category: 'system',
        message: 'Alto número de errores recientes. Revisar logs del sistema'
      });
    }

    if (!report.system_health.last_backup_date) {
      recommendations.push({
        priority: 'critical',
        category: 'backup',
        message: 'No hay backups recientes. Configurar sistema de backup automático'
      });
    }

    report.recommendations = recommendations;

    recommendations.forEach((rec, index) => {
      const priority = rec.priority === 'critical' ? '🔴' : 
                      rec.priority === 'high' ? '🟠' : 
                      rec.priority === 'medium' ? '🟡' : '🟢';
      console.log(`   ${priority} [${rec.category.toUpperCase()}] ${rec.message}`);
    });

    if (recommendations.length === 0) {
      console.log('   ✅ No se encontraron problemas. ¡Todo funciona correctamente!');
    }

    // 7. Guardar reporte si se especifica
    if (outputFile) {
      const reportDir = path.dirname(outputFile);
      await fs.mkdir(reportDir, { recursive: true });
      
      if (format === 'json') {
        await fs.writeFile(outputFile, JSON.stringify(report, null, 2));
        console.log(`\n💾 Reporte guardado en: ${outputFile}`);
      } else if (format === 'html') {
        const htmlReport = generateHtmlReport(report);
        await fs.writeFile(outputFile, htmlReport);
        console.log(`\n💾 Reporte HTML guardado en: ${outputFile}`);
      }
    }

    console.log('\n✨ Reporte completado');
    return report;

  } catch (error) {
    console.error('💥 Error generando reporte:', error);
    throw error;
  }
}

function generateHtmlReport(report) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Contenido - Camino de Fe</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .metric { display: inline-block; margin: 10px; padding: 15px; background: #f8f9fa; border-radius: 5px; text-align: center; }
        .metric-value { font-size: 24px; font-weight: bold; color: #2563eb; }
        .metric-label { font-size: 12px; color: #666; }
        .recommendation { padding: 10px; margin: 5px 0; border-left: 4px solid #fbbf24; background: #fef3c7; }
        .recommendation.high { border-color: #ef4444; background: #fee2e2; }
        .recommendation.critical { border-color: #dc2626; background: #fecaca; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Reporte de Contenido - Camino de Fe</h1>
            <p>Generado el: ${new Date(report.metadata.generated_at).toLocaleString('es-ES')}</p>
            <p>Período: ${report.metadata.period.start} a ${report.metadata.period.end}</p>
        </div>

        <div class="section">
            <h2>📋 Resumen General</h2>
            <div class="metric">
                <div class="metric-value">${report.summary.total_content}</div>
                <div class="metric-label">Total Contenido</div>
            </div>
            <div class="metric">
                <div class="metric-value">${report.summary.active_content}</div>
                <div class="metric-label">Contenido Activo</div>
            </div>
            <div class="metric">
                <div class="metric-value">${report.summary.scheduled_content}</div>
                <div class="metric-label">Contenido Programado</div>
            </div>
        </div>

        <div class="section">
            <h2>📈 Métricas de Rendimiento</h2>
            <div class="metric">
                <div class="metric-value">${report.performance_metrics.total_views.toLocaleString()}</div>
                <div class="metric-label">Total Vistas</div>
            </div>
            <div class="metric">
                <div class="metric-value">${report.performance_metrics.total_shares.toLocaleString()}</div>
                <div class="metric-label">Total Compartidos</div>
            </div>
            <div class="metric">
                <div class="metric-value">${report.performance_metrics.engagement_rate}%</div>
                <div class="metric-label">Tasa de Engagement</div>
            </div>
        </div>

        <div class="section">
            <h2>💡 Recomendaciones</h2>
            ${report.recommendations.map(rec => `
                <div class="recommendation ${rec.priority}">
                    <strong>[${rec.category.toUpperCase()}]</strong> ${rec.message}
                </div>
            `).join('')}
        </div>

        <div class="section">
            <h2>🏥 Estado del Sistema</h2>
            <table>
                <tr><th>Métrica</th><th>Valor</th></tr>
                <tr><td>Errores recientes (24h)</td><td>${report.system_health.recent_errors}</td></tr>
                <tr><td>Último backup</td><td>${report.system_health.last_backup_date || 'No disponible'}</td></tr>
                <tr><td>Sesiones activas</td><td>${report.system_health.active_sessions}</td></tr>
                <tr><td>Estado del sistema</td><td>${report.system_health.system_status}</td></tr>
            </table>
        </div>
    </div>
</body>
</html>
  `;
}

// Ejecutar script
async function main() {
  console.log('🌟 Camino de Fe - Generador de Reportes de Contenido');
  console.log('=' .repeat(60));
  
  const args = process.argv.slice(2);
  const options = {};
  
  // Parsear argumentos
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace('--', '');
    const value = args[i + 1];
    if (key && value) {
      options[key] = value;
    }
  }
  
  // Configurar opciones por defecto
  if (options.full) {
    options.format = 'html';
    options.outputFile = `reports/content-report-${new Date().toISOString().split('T')[0]}.html`;
  }
  
  await generateContentReport(options);
}

// Ejecutar solo si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
}

export { generateContentReport };
