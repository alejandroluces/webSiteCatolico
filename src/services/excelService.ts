import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs/promises';

export interface GospelData {
  date: string;
  title: string;
  reference: string;
  content: string;
  prayer: string;
  image_url?: string;
}

/**
 * Convierte una fecha YYYY-MM-DD a formato DDMMYYYY para nombres de archivos
 */
export function formatDateForFileName(date: string): string {
  const parts = date.split('-');
  if (parts.length !== 3) {
    throw new Error('Formato de fecha inválido. Debe ser YYYY-MM-DD');
  }
  return `${parts[2]}${parts[1]}${parts[0]}`;
}

/**
 * Verifica si existe un archivo Excel para la fecha especificada
 */
export async function checkExcelFileExists(date: string): Promise<boolean> {
  try {
    const fileName = formatDateForFileName(date);
    const filePath = path.join(process.cwd(), 'public', 'images', 'gospels', `${fileName}.xlsx`);
    
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Verifica si existe una imagen para la fecha especificada
 */
export async function checkImageFileExists(date: string): Promise<boolean> {
  try {
    const fileName = formatDateForFileName(date);
    const filePath = path.join(process.cwd(), 'public', 'images', 'gospels', `${fileName}.png`);
    
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Lee el archivo Excel para la fecha especificada y extrae los datos del evangelio
 */
export async function readGospelFromExcel(date: string): Promise<GospelData | null> {
  try {
    const fileName = formatDateForFileName(date);
    const filePath = path.join(process.cwd(), 'public', 'images', 'gospels', `${fileName}.xlsx`);
    
    // Verificar si el archivo existe
    try {
      await fs.access(filePath);
      console.log(`Archivo Excel encontrado: ${filePath}`);
    } catch (error) {
      console.error(`No se encontró el archivo Excel para la fecha ${date}`);
      return null;
    }
    
    // Leer el archivo Excel
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      console.error('No se encontró la hoja de trabajo en el archivo Excel');
      return null;
    }
    
    // Leer la celda I2 que contiene el evangelio
    const cellI2 = worksheet.getCell('I2');
    if (!cellI2 || !cellI2.value) {
      console.error('No se encontró contenido en la celda I2');
      return null;
    }
    
    const cellContent = cellI2.text;
    
    // Parsear el contenido
    const lines = cellContent.split('\n').filter(line => line.trim() !== '');
    
    let title = '';
    let reference = '';
    let content = '';
    let prayer = '';
    
    // Buscar las secciones
    let currentSection = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.includes('Evangelio del Día')) {
        title = line.replace(/["*]/g, '').trim();
        currentSection = 'title';
      } else if (line.includes('Lectura del santo evangelio según')) {
        reference = line.trim();
        currentSection = 'reference';
      } else if (line.includes('Oración de la mañana')) {
        currentSection = 'prayer';
      } else {
        if (currentSection === 'reference' && !line.includes('Oración')) {
          content += line + '\n';
        } else if (currentSection === 'prayer') {
          prayer += line + '\n';
        }
      }
    }
    
    // Verificar si existe la imagen correspondiente
    const hasImage = await checkImageFileExists(date);
    
    return {
      date,
      title: title || 'Evangelio del Día',
      reference: reference || '',
      content: content.trim(),
      prayer: prayer.trim(),
      image_url: hasImage ? `/images/gospels/${fileName}.png` : undefined
    };
    
  } catch (error) {
    console.error('Error al leer el archivo Excel:', error);
    return null;
  }
}
