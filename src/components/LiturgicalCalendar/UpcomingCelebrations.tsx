import React from 'react';
import { Calendar, Crown, Star, BookOpen, MapPin, ChevronRight } from 'lucide-react';
import { useUpcomingCelebrations } from '../../hooks/useLiturgicalCalendar';

interface UpcomingCelebrationsProps {
  days?: number;
  maxItems?: number;
  showLocalOnly?: boolean;
}

const UpcomingCelebrations: React.FC<UpcomingCelebrationsProps> = ({ 
  days = 30, 
  maxItems = 5,
  showLocalOnly = false 
}) => {
  const { upcomingEvents, isLoading, error } = useUpcomingCelebrations(days, showLocalOnly);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'solemnity':
        return Crown;
      case 'feast':
        return Star;
      default:
        return BookOpen;
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'solemnity':
        return 'Solemnidad';
      case 'feast':
        return 'Fiesta';
      case 'memorial':
        return 'Memoria';
      case 'optional_memorial':
        return 'Memoria facultativa';
      default:
        return type;
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'Blanco':
        return 'bg-white border border-gray-300 text-gray-900';
      case 'Rojo':
        return 'bg-red-500 text-white';
      case 'Verde':
        return 'bg-green-500 text-white';
      case 'Morado':
        return 'bg-purple-500 text-white';
      case 'Rosa':
        return 'bg-pink-400 text-white';
      case 'Dorado':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizar a medianoche
    
    const eventDate = new Date(dateString);
    eventDate.setHours(0, 0, 0, 0); // Normalizar a medianoche
    
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays < 7) return `En ${diffDays} días`;
    if (diffDays < 14) return 'La próxima semana';
    if (diffDays < 30) return `En ${Math.ceil(diffDays / 7)} semanas`;
    return `En ${Math.ceil(diffDays / 30)} meses`;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  const displayEvents = upcomingEvents.slice(0, maxItems);

  if (displayEvents.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-serif font-semibold text-gray-900 dark:text-white mb-2">
          {showLocalOnly ? 'Sin celebraciones locales próximas' : 'Sin celebraciones próximas'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          No hay {showLocalOnly ? 'celebraciones locales' : 'celebraciones importantes'} en los próximos {days} días.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif font-semibold text-marian-blue-900 dark:text-white">
          {showLocalOnly ? 'Celebraciones de Chile' : 'Próximas Celebraciones'}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Próximos {days} días
        </span>
      </div>

      <div className="space-y-4">
        {displayEvents.map((event) => {
          const EventIcon = getEventIcon(event.celebration_type);
          return (
            <div
              key={event.id}
              className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-100 dark:border-gray-600"
            >
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  event.celebration_type === 'solemnity' ? 'bg-yellow-100 dark:bg-yellow-900' :
                  event.celebration_type === 'feast' ? 'bg-blue-100 dark:bg-blue-900' :
                  'bg-green-100 dark:bg-green-900'
                }`}>
                  <EventIcon className={`h-5 w-5 ${
                    event.celebration_type === 'solemnity' ? 'text-yellow-600 dark:text-yellow-400' :
                    event.celebration_type === 'feast' ? 'text-blue-600 dark:text-blue-400' :
                    'text-green-600 dark:text-green-400'
                  }`} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-marian-blue-900 dark:text-white truncate">
                    {event.title}
                  </h4>
                  {event.is_local_celebration && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 flex-shrink-0">
                      <MapPin className="h-3 w-3 mr-1" />
                      Chile
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {formatDate(event.date)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {getDaysUntil(event.date)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-marian-blue-100 text-marian-blue-800 dark:bg-gray-600 dark:text-gray-300">
                    {getEventTypeLabel(event.celebration_type)}
                  </span>
                  <div className={`w-3 h-3 rounded-full ${getColorClass(event.liturgical_color)}`}></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {event.liturgical_color}
                  </span>
                </div>

                {event.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>

              <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
            </div>
          );
        })}
      </div>

      {upcomingEvents.length > maxItems && (
        <div className="mt-4 text-center">
          <button className="text-marian-blue-600 dark:text-sacred-gold-400 hover:text-marian-blue-800 dark:hover:text-sacred-gold-300 text-sm font-medium transition-colors duration-200">
            Ver todas las celebraciones ({upcomingEvents.length - maxItems} más)
          </button>
        </div>
      )}
    </div>
  );
};

export default UpcomingCelebrations;