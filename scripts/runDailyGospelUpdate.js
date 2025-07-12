#!/usr/bin/env node

/**
 * Script para ejecutar la actualización del evangelio del día
 * Este script puede ser ejecutado por un cron job del sistema
 */

import { updateDailyGospel } from './updateDailyGospel.js';

// Obtener la fecha actual en formato YYYY-MM-DD
const today = new Date().toISOString().split('T')[0];

console.log(`[${new Date().toISOString()}] Iniciando actualización automática del evangelio para ${today}`);

updateDailyGospel(today)
  .then(success => {
    if (success) {
      console.log(`[${new Date().toISOString()}] Actualización completada exitosamente`);
      process.exit(0);
    } else {
      console.error(`[${new Date().toISOString()}] La actualización falló`);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error(`[${new Date().toISOString()}] Error en la actualización:`, error);
    process.exit(1);
  });