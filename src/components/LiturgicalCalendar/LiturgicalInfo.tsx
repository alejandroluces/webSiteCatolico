import React from 'react';
import { Calendar, Crown, Star, BookOpen, MapPin, Palette } from 'lucide-react';
import { useLiturgicalCalendar } from '../../hooks/useLiturgicalCalendar';

interface LiturgicalInfoProps {
  date?: string;
  showDetails?: boolean;
}

const LiturgicalInfo: React.FC<LiturgicalInfoProps> = ({ date, showDetails = true }) => {
  const { events, season, saints, liturgicalColor, isLoading, error } = useLiturgicalCalendar(date);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'solemnity':
        return Crown;
      case 'feast':
        return Star;
      case 'memorial':
      case 'optional_memorial':
        return BookOpen;
      default:
        return Calendar;
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
      case 'special':
        return 'Especial';
      default:
        return type;
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'Blanco':
        return 'bg-white border-gray-300 text-gray-900';
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

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tiempo Litúrgico */}
      {season && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-4 h-4 rounded-full ${getColorClass(season.color)}`}></div>
            <h3 className="text-lg font-serif font-semibold text-marian-blue-900 dark:text-white">
              {season.season}
            </h3>
          </div>
          {showDetails && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Palette className="h-4 w-4" />
                <span>Color litúrgico: {season.color}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {season.season_description}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Eventos Litúrgicos */}
      {events.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
            Celebraciones del Día
          </h3>
          <div className="space-y-3">
            {events.map((event, index) => {
              const EventIcon = getEventIcon(event.celebration_type);
              return (
                <div key={index} className="border-l-4 border-marian-blue-400 dark:border-sacred-gold-400 pl-4">
                  <div className="flex items-start space-x-3">
                    <EventIcon className={`h-5 w-5 mt-0.5 ${
                      event.celebration_type === 'solemnity' ? 'text-yellow-600 dark:text-yellow-400' :
                      event.celebration_type === 'feast' ? 'text-blue-600 dark:text-blue-400' :
                      'text-green-600 dark:text-green-400'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-marian-blue-900 dark:text-white">
                          {event.title}
                        </h4>
                        {event.is_local_celebration && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                            <MapPin className="h-3 w-3 mr-1" />
                            Chile
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-marian-blue-100 text-marian-blue-800 dark:bg-gray-600 dark:text-gray-300">
                          {getEventTypeLabel(event.celebration_type)}
                        </span>
                        <div className={`w-3 h-3 rounded-full ${getColorClass(event.liturgical_color)}`}></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {event.liturgical_color}
                        </span>
                      </div>
                      {showDetails && event.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {event.description}
                        </p>
                      )}
                      {event.patron_of && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Patrono de: {event.patron_of}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Santos del Día */}
      {saints.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
            Santos del Día
          </h3>
          <div className="space-y-3">
            {saints.map((saint, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-sacred-gold-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sacred-gold-600 dark:text-sacred-gold-400 text-sm">👼</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-marian-blue-900 dark:text-white">
                      {saint.saint_name}
                    </h4>
                    {saint.is_local && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                        <MapPin className="h-3 w-3 mr-1" />
                        Local
                      </span>
                    )}
                  </div>
                  {showDetails && saint.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {saint.description}
                    </p>
                  )}
                  {saint.patron_of && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Patrono de: {saint.patron_of}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sin eventos */}
      {events.length === 0 && saints.length === 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
          <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No hay celebraciones especiales registradas para este día
          </p>
        </div>
      )}
    </div>
  );
};

export default LiturgicalInfo;