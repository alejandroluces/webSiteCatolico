#!/usr/bin/env node

/**
 * Script para publicar contenido programado
 * Ejecutar diariamente a las 6:00 AM mediante cron job
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function publishScheduledContent() {
  try {
    console.log('🚀 Iniciando publicación de contenido programado...');
    
    const today = new Date().toISOString().split('T')[0];
    console.log(`📅 Fecha: ${today}`);

    // Obtener contenido programado para hoy
    const { data: scheduledItems, error: fetchError } = await supabase
      .from('content_schedule')
      .select(`
        *,
        daily_content (*)
      `)
      .eq('scheduled_date', today)
      .eq('is_published', false);

    if (fetchError) {
      throw new Error(`Error al obtener contenido programado: ${fetchError.message}`);
    }

    if (!scheduledItems || scheduledItems.length === 0) {
      console.log('ℹ️  No hay contenido programado para publicar hoy');
      return;
    }

    console.log(`📝 Encontrados ${scheduledItems.length} elementos para publicar`);

    let publishedCount = 0;
    let errorCount = 0;

    for (const item of scheduledItems) {
      try {
        console.log(`📤 Publicando: ${item.content_type} - ${item.daily_content?.title}`);

        // Activar el contenido
        const { error: updateContentError } = await supabase
          .from('daily_content')
          .update({ 
            is_active: true, 
            status: 'published',
            updated_at: new Date().toISOString()
          })
          .eq('id', item.content_id);

        if (updateContentError) {
          throw new Error(`Error al activar contenido: ${updateContentError.message}`);
        }

        // Marcar como publicado en el schedule
        const { error: updateScheduleError } = await supabase
          .from('content_schedule')
          .update({ 
            is_published: true, 
            published_at: new Date().toISOString()
          })
          .eq('id', item.id);

        if (updateScheduleError) {
          throw new Error(`Error al actualizar schedule: ${updateScheduleError.message}`);
        }

        console.log(`✅ Publicado exitosamente: ${item.content_type}`);
        publishedCount++;

      } catch (itemError) {
        console.error(`❌ Error al publicar ${item.content_type}:`, itemError.message);
        errorCount++;
      }
    }

    // Resumen
    console.log('\n📊 Resumen de publicación:');
    console.log(`✅ Publicados exitosamente: ${publishedCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`📝 Total procesados: ${scheduledItems.length}`);

    if (errorCount > 0) {
      console.log('\n⚠️  Algunos elementos no se pudieron publicar. Revisa los logs arriba.');
      process.exit(1);
    } else {
      console.log('\n🎉 ¡Todos los elementos se publicaron exitosamente!');
    }

  } catch (error) {
    console.error('💥 Error crítico en la publicación:', error.message);
    process.exit(1);
  }
}

// Función para verificar contenido faltante
async function checkMissingContent(days = 7) {
  console.log(`\n🔍 Verificando contenido faltante para los próximos ${days} días...`);
  
  const missing = [];
  const contentTypes = ['gospel', 'saint', 'reading'];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    for (const type of contentTypes) {
      const { data, error } = await supabase
        .from('daily_content')
        .select('id')
        .eq('date', dateStr)
        .eq('type', type)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        missing.push({ date: dateStr, type });
      }
    }
  }

  if (missing.length > 0) {
    console.log('\n⚠️  Contenido faltante encontrado:');
    missing.forEach(item => {
      console.log(`   📅 ${item.date} - ${item.type}`);
    });
  } else {
    console.log('\n✅ Todo el contenido está disponible para los próximos días');
  }

  return missing;
}

// Ejecutar script
async function main() {
  console.log('🌟 Camino de Fe - Sistema de Publicación Automática');
  console.log('=' .repeat(50));
  
  await publishScheduledContent();
  await checkMissingContent();
  
  console.log('\n✨ Proceso completado');
}

// Ejecutar solo si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
}

export { publishScheduledContent, checkMissingContent };
