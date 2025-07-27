import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface DailyQuote {
  text: string;
  reference: string;
}

interface SupabaseQuote {
  versiculo: string;
  cita: string;
}

export const useDailyQuote = () => {
  const [quote, setQuote] = useState<DailyQuote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      setIsLoading(true);
      setError(null);

      if (!supabase) {
        setError('Supabase no está configurado.');
        setIsLoading(false);
        return;
      }

      try {
        // Llamamos a la función que creamos en la base de datos
        const { data, error: rpcError } = await supabase
          .rpc<SupabaseQuote>('get_random_quote')
          .single(); // .single() porque esperamos una sola fila

        if (rpcError) {
          throw rpcError;
        }

        if (data) {
          setQuote({
            text: data.versiculo, // Mapeamos 'versiculo' a 'text'
            reference: data.cita,   // Mapeamos 'cita' a 'reference'
          });
        }
      } catch (err: any) {
        setError('No se pudo cargar la cita del día. Inténtalo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuote();
  }, []); // Se ejecuta solo una vez cuando el componente se monta

  return { quote, isLoading, error };
};
