import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../services/supabase';

type ContentType = 'gospel' | 'saint' | 'reading';
type ISODateString = string; // YYYY-MM-DD

function isIsoDateString(value: string): value is ISODateString {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toISODateStringLocal(date: Date): ISODateString {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function useAvailableDailyContentDates(
  type: ContentType,
  monthsBack: number = 12
) {
  const [enabledDates, setEnabledDates] = useState<Set<ISODateString> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    end.setHours(0, 0, 0, 0);

    const start = new Date(end);
    start.setMonth(start.getMonth() - monthsBack);
    start.setHours(0, 0, 0, 0);

    return {
      startDate: toISODateStringLocal(start),
      endDate: toISODateStringLocal(end),
    };
  }, [monthsBack]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!supabase) {
          // In fallback mode we can't discover dates; keep null so UI doesn't restrict.
          setEnabledDates(null);
          return;
        }

        // Fetch only dates for the given type.
        const { data, error: fetchError } = await supabase
          .from('daily_content')
          .select('date')
          .eq('type', type)
          .eq('is_active', true)
          .gte('date', startDate)
          .lte('date', endDate)
          .order('date', { ascending: true });

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        const set = new Set<ISODateString>();
        for (const row of data || []) {
          if (row?.date && isIsoDateString(row.date)) set.add(row.date);
        }
        setEnabledDates(set);
      } catch (e) {
        console.error('Error loading available content dates:', e);
        setError('No se pudieron cargar las fechas disponibles.');
        setEnabledDates(null);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [type, startDate, endDate]);

  return {
    enabledDates,
    isLoading,
    error,
    startDate,
    endDate,
  };
}

