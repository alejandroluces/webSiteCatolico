import { supabase } from './supabase';

export interface PrayerRequest {
  id?: number;
  name?: string;
  intention: string;
  category: string;
  is_anonymous: boolean;
  prayers?: number;
  created_at?: string;
}

/**
 * Obtiene todas las peticiones de oración desde Supabase.
 */
export async function getPrayerRequests(): Promise<PrayerRequest[]> {
  if (!supabase) throw new Error('Supabase no está configurado');
  const { data, error } = await supabase
    .from('prayer_requests')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

/**
 * Inserta una nueva petición de oración.
 */
export async function addPrayerRequest(request: Omit<PrayerRequest, 'id' | 'created_at' | 'prayers'>): Promise<PrayerRequest> {
  if (!supabase) throw new Error('Supabase no está configurado');
  const { data, error } = await supabase
    .from('prayer_requests')
    .insert([{ ...request, prayers: 0 }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Incrementa el contador de oraciones ofrecidas.
 */
export async function incrementPrayerCount(id: number): Promise<void> {
  if (!supabase) throw new Error('Supabase no está configurado');
  const { error } = await supabase.rpc('increment_prayer_count', { request_id: id });
  if (error) throw error;
}
