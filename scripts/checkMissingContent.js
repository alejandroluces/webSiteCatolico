#!/usr/bin/env node

/**
 * Script para verificar contenido faltante
 * Útil para ejecutar manualmente o como parte de reportes
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkMissingContent(days = 30) {
  console.log('🔍 Verificando contenido faltante...');
  console.log(`📅 Período: próximos ${days} días`);
  console.log('=' .repeat(50));

  const missing = [];
  const contentTypes = [
    { key: 'gospel', name: 'Evangelio' },
    { key: 'saint', name: 'Santo' },
    { key: 'reading', name: 'Lectura' }
  ];

  const stats = {
    total_days: days,
    missing_by_type: {},
    missing_total: 0,
    coverage_percentage: 0
  };

  // Inicializar estadísticas
  contentTypes.forEach(type => {
    stats.missing_by_type[type.key] = 0;
  });

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });

    let dayMissing = [];

    for (const type of contentTypes) {
      const { data, error } = await supabase
        .from('daily_content')
        .select('id, title, status')
        .eq('date', dateStr)
        .eq('type', type.key)
        .single();

      if (error || !data) {
        dayMissing.push(type.name);
        stats.missing_by_type[type.key]++;
        stats.missing_total++;
      }
    }

    if (dayMissing.length > 0) {
      missing.push({
        date: dateStr,
        dayName,
        missing: dayMissing
      });
    }
  }

  // Calcular porcentaje de cobertura
  const totalPossible = days * contentTypes.length;
  stats.coverage_percentage = ((totalPossible - stats.missing_total) / totalPossible * 100).toFixed(1);

  // Mostrar resultados
  console.log('\n📊 ESTADÍSTICAS GENERALES:');
  console.log(`   📈 Cobertura total: ${stats.coverage_percentage}%`);
  console.log(`   📝 Contenido faltante: ${stats.missing_total} de ${totalPossible} posibles`);
  
  console.log('\n📋 FALTANTE POR TIPO:');
  contentTypes.forEach(type => {
    const count = stats.missing_by_type[type.key];
    const percentage = ((days - count) / days * 100).toFixed(1);
    console.log(`   ${type.name}: ${count} faltantes (${percentage}% completo)`);
  });

  if (missing.length > 0) {
    console.log('\n⚠️  DÍAS CON CONTENIDO FALTANTE:');
    missing.forEach(day => {
      console.log(`   📅 ${day.date} (${day.dayName}): ${day.missing.join(', ')}`);
    });

    console.log('\n💡 RECOMENDACIONES:');
    console.log('   1. Priorizar la creación del contenido faltante');
    console.log('   2. Programar contenido con anticipación');
    console.log('   3. Considerar contenido de respaldo para emergencias');
    
    if (stats.missing_by_type.gospel > 0) {
      console.log('   4. ⚠️  CRÍTICO: Faltan evangelios - máxima prioridad');
    }
  } else {
    console.log('\n✅ ¡EXCELENTE! Todo el contenido está disponible');
    console.log('   🎉 No se encontró contenido faltante para el período verificado');
  }

  // Verificar contenido próximo a vencer
  await checkExpiringContent();

  return { missing, stats };
}

async function checkExpiringContent() {
  console.log('\n🕒 Verificando contenido próximo a vencer...');
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const { data: expiring, error } = await supabase
    .from('content_schedule')
    .select(`
      *,
      daily_content (title, status)
    `)
    .eq('scheduled_date', tomorrowStr)
    .eq('is_published', false);

  if (error) {
    console.log('   ⚠️  Error al verificar contenido próximo a vencer');
    return;
  }

  if (!expiring || expiring.length === 0) {
    console.log('   ✅ Todo el contenido para mañana está listo');
    return;
  }

  console.log('   📋 Contenido programado para mañana:');
  expiring.forEach(item => {
    const status = item.daily_content?.status || 'sin contenido';
    const title = item.daily_content?.title || 'Sin título';
    console.log(`      ${item.content_type}: ${title} (${status})`);
  });
}

// Función para generar reporte detallado
async function generateDetailedReport() {
  console.log('\n📄 Generando reporte detallado...');
  
  const { data: totalContent, error: totalError } = await supabase
    .from('daily_content')
    .select('type', { count: 'exact' });

  const { data: activeContent, error: activeError } = await supabase
    .from('daily_content')
    .select('type', { count: 'exact' })
    .eq('is_active', true);

  const { data: scheduledContent, error: scheduledError } = await supabase
    .from('content_schedule')
    .select('content_type', { count: 'exact' })
    .eq('is_published', false);

  if (!totalError && !activeError && !scheduledError) {
    console.log('\n📈 MÉTRICAS DEL SISTEMA:');
    console.log(`   📚 Total de contenido: ${totalContent?.length || 0}`);
    console.log(`   ✅ Contenido activo: ${activeContent?.length || 0}`);
    console.log(`   ⏰ Contenido programado: ${scheduledContent?.length || 0}`);
  }
}

// Ejecutar script
async function main() {
  console.log('🌟 Camino de Fe - Verificador de Contenido');
  console.log('=' .repeat(50));
  
  const days = process.argv[2] ? parseInt(process.argv[2]) : 30;
  
  if (isNaN(days) || days < 1 || days > 365) {
    console.error('❌ Número de días inválido. Usa un número entre 1 y 365.');
    process.exit(1);
  }

  await checkMissingContent(days);
  await generateDetailedReport();
  
  console.log('\n✨ Verificación completada');
}

// Ejecutar solo si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
}

export { checkMissingContent };
