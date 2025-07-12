import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, BookOpen, Star, Crown, Cross, MapPin, Search, Filter } from 'lucide-react';
import AdBanner from '../components/Ads/AdBanner';
import LiturgicalInfo from '../components/LiturgicalCalendar/LiturgicalInfo';
import UpcomingCelebrations from '../components/LiturgicalCalendar/UpcomingCelebrations';
import { useLiturgicalMonth } from '../hooks/useLiturgicalCalendar';

const LiturgicalCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'solemnity' | 'feast' | 'local'>('all');

  const { monthEvents, isLoading } = useLiturgicalMonth(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1
  );

  const liturgicalSeasons = {
    Adviento: { name: 'Adviento', color: 'bg-purple-600', textColor: 'text-purple-600' },
    Navidad: { name: 'Navidad', color: 'bg-yellow-500', textColor: 'text-yellow-600' },
    'Tiempo Ordinario': { name: 'Tiempo Ordinario', color: 'bg-green-600', textColor: 'text-green-600' },
    Cuaresma: { name: 'Cuaresma', color: 'bg-purple-700', textColor: 'text-purple-700' },
    Pascua: { name: 'Pascua', color: 'bg-white border-2 border-yellow-400', textColor: 'text-yellow-600' },
  };

  const getEventType = (type: string) => {
    switch (type) {
      case 'solemnity':
        return { icon: Crown, color: 'text-yellow-600 dark:text-yellow-400', label: 'Solemnidad' };
      case 'feast':
        return { icon: Star, color: 'text-blue-600 dark:text-blue-400', label: 'Fiesta' };
      case 'memorial':
      case 'optional_memorial':
        return { icon: BookOpen, color: 'text-green-600 dark:text-green-400', label: 'Memoria' };
      case 'special':
        return { icon: Cross, color: 'text-purple-600 dark:text-purple-400', label: 'Especial' };
      default:
        return { icon: Calendar, color: 'text-gray-600 dark:text-gray-400', label: 'Evento' };
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    // Convertir domingo (0) a 6, lunes (1) a 0, etc.
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const getEventsForDate = (date: Date) => {
    // Crear fecha en formato YYYY-MM-DD sin problemas de zona horaria
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    console.log('Buscando eventos para fecha:', dateStr, 'Eventos disponibles:', monthEvents.length);
    
    return monthEvents.filter(event => {
      console.log('Comparando:', event.date, 'con', dateStr);
      return event.date === dateStr;
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();
    
    console.log('Renderizando calendario para:', year, month + 1);
    console.log('Días en el mes:', daysInMonth);
    console.log('Primer día de la semana:', firstDay);
    console.log('Eventos del mes:', monthEvents);
    
    const days = [];

    // Días del mes anterior
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
    
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push(
        <div key={`prev-${day}`} className="h-24 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50">
          <div className="text-sm text-gray-400 p-1">{day}</div>
        </div>
      );
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const events = getEventsForDate(date);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

      // Filtrar eventos basado en el filtro seleccionado
      const filteredEvents = events.filter(event => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'local') return event.is_local_celebration;
        return event.celebration_type === selectedFilter;
      });

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-24 border border-gray-200 dark:border-gray-700 p-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 ${
            isToday ? 'bg-marian-blue-100 dark:bg-gray-700 border-2 border-marian-blue-500' : ''
          } ${isSelected ? 'ring-2 ring-marian-blue-500' : ''}`}
        >
          <div className={`text-sm font-medium ${isToday ? 'text-marian-blue-900 dark:text-white font-bold' : 'text-gray-900 dark:text-gray-100'}`}>
            {day}
          </div>
          <div className="mt-1 space-y-1">
            {filteredEvents.slice(0, 2).map((event, index) => {
              const eventType = getEventType(event.celebration_type);
              return (
                <div
                  key={index}
                  className={`text-xs px-1 py-0.5 rounded flex items-center space-x-1 ${
                    event.celebration_type === 'solemnity' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                    event.celebration_type === 'feast' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  }`}
                  title={event.title}
                >
                  <eventType.icon className="h-2 w-2 flex-shrink-0" />
                  <span className="truncate">
                    {event.title.length > 12 ? event.title.substring(0, 12) + '...' : event.title}
                  </span>
                  {event.is_local_celebration && (
                    <MapPin className="h-2 w-2 flex-shrink-0" />
                  )}
                </div>
              );
            })}
            {filteredEvents.length > 2 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                +{filteredEvents.length - 2} más
              </div>
            )}
          </div>
        </div>
      );
    }

    // Días del mes siguiente
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDay + daysInMonth);
    
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div key={`next-${day}`} className="h-24 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50">
          <div className="text-sm text-gray-400 p-1">{day}</div>
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Calendar className="h-8 w-8 text-marian-blue-600 dark:text-sacred-gold-400" />
            <h1 className="text-4xl font-serif font-bold text-marian-blue-900 dark:text-white">
              Calendario Litúrgico Católico
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Sigue el año litúrgico católico 2025 con las celebraciones, santos y tiempos sagrados de Chile
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar celebraciones, santos..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-marian-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las celebraciones</option>
                <option value="solemnity">Solo Solemnidades</option>
                <option value="feast">Solo Fiestas</option>
                <option value="local">Celebraciones de Chile</option>
              </select>
            </div>
          </div>
        </div>

        <AdBanner position="inline" size="medium" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              {/* Calendar Header */}
              <div className="bg-gradient-to-r from-marian-blue-600 to-marian-blue-700 dark:from-gray-700 dark:to-gray-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <h2 className="text-2xl font-serif font-semibold">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-6">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-0 mb-2">
                  {dayNames.map((day) => (
                    <div key={day} className="h-10 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {day}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-0">
                  {isLoading ? (
                    <div className="col-span-7 flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-2 border-marian-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    renderCalendarDays()
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Liturgical Seasons Legend */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
                Tiempos Litúrgicos
              </h3>
              <div className="space-y-3">
                {Object.entries(liturgicalSeasons).map(([key, season]) => (
                  <div key={key} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${season.color}`}></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {season.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Types Legend */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
                Tipos de Celebración
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Crown className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Solemnidad</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Fiesta</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Memoria</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Cross className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Especial</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Local (Chile)</span>
                </div>
              </div>
            </div>

            {/* Selected Date Info */}
            {selectedDate && (
              <LiturgicalInfo 
                date={selectedDate.toISOString().split('T')[0]} 
                showDetails={true}
              />
            )}

            <AdBanner position="sidebar" />
          </div>
        </div>

        <AdBanner position="inline" size="small" />

        {/* Upcoming Celebrations */}
        <div className="mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <UpcomingCelebrations 
              days={60} 
              maxItems={8}
              showLocalOnly={false}
            />
            <UpcomingCelebrations 
              days={365} 
              maxItems={6}
              showLocalOnly={true}
            />
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-16 bg-marian-blue-50 dark:bg-gray-800 rounded-xl shadow-lg border border-marian-blue-100 dark:border-gray-700 p-8">
          <h2 className="text-3xl font-serif font-bold text-marian-blue-900 dark:text-white mb-6 text-center">
            Calendario Litúrgico Católico de Chile 2025
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
                <Crown className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-marian-blue-900 dark:text-white mb-4">
                  Santos Chilenos
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Incluye celebraciones especiales de Chile como San Alberto Hurtado, 
                  Beata Laura Vicuña y Nuestra Señora del Carmen, Patrona de Chile.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
                <Calendar className="h-8 w-8 text-marian-blue-600 dark:text-sacred-gold-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-marian-blue-900 dark:text-white mb-4">
                  Año Litúrgico Completo
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Sigue todos los tiempos litúrgicos: Adviento, Navidad, Cuaresma, 
                  Pascua y Tiempo Ordinario con sus colores correspondientes.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
                <Star className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-marian-blue-900 dark:text-white mb-4">
                  Celebraciones Importantes
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Todas las solemnidades, fiestas y memorias del calendario romano 
                  adaptado para la Iglesia en Chile según las normas litúrgicas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiturgicalCalendar;