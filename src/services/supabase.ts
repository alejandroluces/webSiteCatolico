import { createClient } from '@supabase/supabase-js';

// Obtener las variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verificar que las variables de entorno estén configuradas correctamente
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const hasValidCredentials = supabaseUrl && 
  supabaseAnonKey && 
  isValidUrl(supabaseUrl) && 
  !supabaseUrl.includes('your_supabase_project_url') &&
  !supabaseAnonKey.includes('your_supabase_anon_key');

// Crear el cliente de Supabase solo si las credenciales son válidas
export const supabase = hasValidCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Función para verificar si Supabase está configurado
export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}

// Función para verificar la conexión
export async function checkSupabaseConnection() {
  if (!supabase) {
    console.warn('Supabase no está configurado. Por favor, configura las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
    return false;
  }

  try {
    const { data, error } = await supabase.from('daily_content').select('count(*)', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error al conectar con Supabase:', error);
      return false;
    }
    
    console.log('Conexión con Supabase establecida correctamente');
    return true;
  } catch (error) {
    console.error('Error al verificar la conexión con Supabase:', error);
    return false;
  }
}

// Función helper para mostrar mensaje de configuración
export function getSupabaseConfigMessage(): string {
  if (!hasValidCredentials) {
    return 'Para usar todas las funcionalidades de la aplicación, necesitas configurar Supabase. Haz clic en "Connect to Supabase" en la parte superior derecha para comenzar.';
  }
  return '';
}