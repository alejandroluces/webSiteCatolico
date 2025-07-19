import readline from 'readline';
import { updateDailyGospel } from './updateDailyGospel.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function runUpdates() {
  const startDateInput = await askQuestion('Ingrese la fecha inicial (YYYY-MM-DD): ');
  const endDateInput = await askQuestion('Ingrese la fecha final (YYYY-MM-DD): ');

  const startDate = new Date(startDateInput);
  const endDate = new Date(endDateInput);

  if (isNaN(startDate) || isNaN(endDate) || startDate > endDate) {
    console.error('Fechas inválidas. Asegúrese de ingresar fechas válidas y que la fecha inicial sea anterior o igual a la fecha final.');
    rl.close();
    return;
  }

  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const formattedDate = date.toISOString().split('T')[0];
    console.log(`\n🔄 Actualizando evangelio para la fecha: ${formattedDate}`);
    try {
      await updateDailyGospel(formattedDate);
      console.log(`✅ Evangelio actualizado para ${formattedDate}`);
    } catch (error) {
      console.error(`❌ Error al actualizar evangelio para ${formattedDate}:`, error);
    }
  }

  rl.close();
}

runUpdates();
