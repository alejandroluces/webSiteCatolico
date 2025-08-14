import { useState, useEffect } from 'react';
import { liturgicalCalendarService, LiturgicalEvent, LiturgicalSeason, SaintOfDay } from '../services/liturgicalCalendar';

export const useLiturgicalCalendar = (date?: string) => {
  const [events, setEvents] = useState<LiturgicalEvent[]>([]);
  const [season, setSeason] = useState<LiturgicalSeason | null>(null);
  const [saints, setSaints] = useState<SaintOfDay[]>([]);
  const [liturgicalColor, setLiturgicalColor] = useState<string>('Verde');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getTargetDate = () => {
    if (date) return date;
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    const loadLiturgicalData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const targetDate = getTargetDate();

        const [eventsData, seasonData, saintsData, colorData] = await Promise.all([
          liturgicalCalendarService.getEventsForDateSafe(targetDate),
          liturgicalCalendarService.getCurrentLiturgicalSeason(targetDate),
          liturgicalCalendarService.getSaintsOfDay(targetDate),
          liturgicalCalendarService.getLiturgicalColor(targetDate)
        ]);

        setEvents(eventsData);
        setSeason(seasonData);
        setSaints(saintsData);
        setLiturgicalColor(colorData);
      } catch (err) {
        setError('Error al cargar datos litúrgicos');
        console.error('Error loading liturgical data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadLiturgicalData();
  }, [date]);

  return {
    events,
    season,
    saints,
    liturgicalColor,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      const targetDate = getTargetDate();
      liturgicalCalendarService.getEventsForDateSafe(targetDate)
        .then(eventsData => {
          setEvents(eventsData);
          setIsLoading(false);
        })
        .catch(err => {
          setError('Error al recargar datos litúrgicos');
          console.error('Error reloading liturgical data:', err);
          setIsLoading(false);
        });
    }
  };
};

export const useLiturgicalMonth = (year: number, month: number) => {
  const [monthEvents, setMonthEvents] = useState<LiturgicalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMonthData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Usar la función específica para obtener eventos del mes
        const eventsData = await liturgicalCalendarService.getEventsForMonth(year, month);
        setMonthEvents(eventsData);
      } catch (err) {
        setError('Error al cargar eventos del mes');
        console.error('Error loading month data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMonthData();
  }, [year, month]);

  return {
    monthEvents,
    isLoading,
    error
  };
};

export const useUpcomingCelebrations = (days: number = 30, localOnly: boolean = false) => {
  const [upcomingEvents, setUpcomingEvents] = useState<LiturgicalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUpcomingEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const eventsData = await liturgicalCalendarService.getUpcomingMajorCelebrations(days);
        
        // Filtrar por celebraciones locales si es necesario
        const filteredEvents = localOnly 
          ? eventsData.filter(event => event.is_local_celebration)
          : eventsData;
          
        setUpcomingEvents(filteredEvents);
      } catch (err) {
        setError('Error al cargar próximas celebraciones');
        console.error('Error loading upcoming events:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUpcomingEvents();
  }, [days, localOnly]);

  return {
    upcomingEvents,
    isLoading,
    error
  };
};
