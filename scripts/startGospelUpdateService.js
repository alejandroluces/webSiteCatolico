#!/usr/bin/env node

/**
 * Script para iniciar el servicio de actualización automática del evangelio
 * Ejecuta el script updateDailyGospel.js en modo cron
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al script de actualización
const updateScriptPath = path.join(__dirname, 'updateDailyGospel.js');

console.log('🌟 Iniciando servicio de actualización automática del evangelio');
console.log('=' .repeat(70));
console.log(`📅 Fecha: ${new Date().toISOString()}`);
console.log(`📂 Script: ${updateScriptPath}`);
console.log('⏰ Configurado para ejecutarse a la 1:00 AM todos los días');
console.log('=' .repeat(70));

// Iniciar el proceso
const updateProcess = spawn('node', [updateScriptPath, '--cron'], {
  detached: true,
  stdio: 'inherit'
});

updateProcess.on('error', (error) => {
  console.error('Error al iniciar el proceso:', error);
  process.exit(1);
});

console.log('✅ Servicio iniciado correctamente');
console.log('ℹ️  Presiona Ctrl+C para detener el servicio');

// Mantener el proceso principal vivo
process.stdin.resume();

// Manejar señales de terminación
process.on('SIGINT', () => {
  console.log('\n🛑 Deteniendo servicio...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Servicio terminado');
  process.exit(0);
});