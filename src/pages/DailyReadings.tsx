import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Share2, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getDailyReadings, DailyReadingsData } from '../services/dailyReadingsService';

const DailyReadings: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [selectedReading, setSelectedReading] = useState<'reading' | 'gospel'>('reading');
  const [readingsData, setReadingsData] = useState<DailyReadingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Obtener los datos al cargar el componente o cuando cambia la fecha
  useEffect(() => {
    const fetchReadings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getDailyReadings(selectedDate);
        
        if (data) {
          setReadingsData(data);
          // Si no hay lectura, seleccionar el evangelio por defecto
          if (!data.reading && data.gospel) {
            setSelectedReading('gospel');
          } else if (data.reading) {
            setSelectedReading('reading');
          }
        } else {
          setError('No se encontraron lecturas para esta fecha');
        }
      } catch (err) {
        console.error('Error fetching readings:', err);
        setError('Error al cargar las lecturas');
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
  }, [selectedDate]);

  const formatDate = (dateStr?: string) => {
    const date = dateStr ? new Date(dateStr + 'T00:00:00') : new Date();
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const goToPreviousDay = () => {
    const currentDate = selectedDate ? new Date(selectedDate + 'T00:00:00') : new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const currentDate = selectedDate ? new Date(selectedDate + 'T00:00:00') : new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (currentDate <= today) {
      setSelectedDate(currentDate.toISOString().split('T')[0]);
    }
  };

  const goToToday = () => {
    setSelectedDate(undefined);
  };

  const canGoNext = () => {
    if (!selectedDate) return false;
    const currentDate = new Date(selectedDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return currentDate < today;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Lecturas del día - ${readingsData?.formattedDate || ''}`,
        text: 'Lecturas litúrgicas del día',
        url: window.location.href,
      }).catch(err => console.error('Error al compartir:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-marian-blue-200 border-t-marian-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando lecturas del día...</p>
        </div>
      </div>
    );
  }

  if (error || !readingsData) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center max-w-md mx-4">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Error al cargar las lecturas'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const availableReadings: Array<{ key: 'reading' | 'gospel'; label: string }> = [];
  if (readingsData.reading) {
    availableReadings.push({ key: 'reading', label: 'Primera Lectura' });
  }
  if (readingsData.gospel) {
    availableReadings.push({ key: 'gospel', label: 'Evangelio' });
  }

  const currentIndex = availableReadings.findIndex(r => r.key === selectedReading);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setSelectedReading(availableReadings[currentIndex - 1].key);
    }
  };

  const goToNext = () => {
    if (currentIndex < availableReadings.length - 1) {
      setSelectedReading(availableReadings[currentIndex + 1].key);
    }
  };

  const currentReading = selectedReading === 'reading' ? readingsData.reading : readingsData.gospel;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-8 w-8 text-marian-blue-600 dark:text-sacred-gold-400" />
            <h1 className="text-4xl font-serif font-bold text-marian-blue-900 dark:text-white">
              Lecturas del Día
            </h1>
          </div>
          <div className="flex items-center justify-center space-x-4 text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span className="capitalize">{formatDate(selectedDate)}</span>
            </div>
            {selectedDate && (
              <button onClick={goToToday} className="text-marian-blue-600 dark:text-sacred-gold-400 text-sm hover:underline">
                Ver hoy
              </button>
            )}
          </div>
          <div className="mt-2 flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Tiempo Litúrgico: {readingsData.liturgicalSeason}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        {availableReadings.length > 1 && (
          <div className="mb-6 flex justify-center">
            <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800">
              {availableReadings.map((reading) => (
                <button
                  key={reading.key}
                  onClick={() => setSelectedReading(reading.key)}
                  className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                    selectedReading === reading.key
                      ? 'bg-marian-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {reading.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        {currentReading && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              {/* Reading Header */}
              <div className="bg-gradient-to-r from-marian-blue-600 to-marian-blue-700 dark:from-gray-700 dark:to-gray-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-serif font-semibold mb-2">
                      {currentReading.reference}
                    </h2>
                    {currentReading.title && (
                      <p className="text-marian-blue-100 dark:text-gray-300 text-lg">
                        {currentReading.title}
                      </p>
                    )}
                  </div>
                  {availableReadings.length > 1 && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={goToPrevious}
                        disabled={currentIndex === 0}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Lectura anterior"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={goToNext}
                        disabled={currentIndex === availableReadings.length - 1}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Lectura siguiente"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Reading Content */}
              <div className="p-6 sm:p-8">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line border-l-4 border-sacred-gold-400 dark:border-sacred-gold-300 pl-6 italic">
                    {currentReading.content}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleShare} 
                className="inline-flex items-center justify-center px-6 py-3 bg-marian-blue-600 hover:bg-marian-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Compartir Lecturas
              </button>
              <a 
                href="/evangelio-del-dia" 
                className="inline-flex items-center justify-center px-6 py-3 bg-sacred-gold-500 hover:bg-sacred-gold-600 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Ver Reflexión del Evangelio
              </a>
            </div>

            {/* Additional Information */}
            <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
                Información Litúrgica
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Tiempo:</span>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    {readingsData.liturgicalSeason}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Color:</span>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    {readingsData.liturgicalColor}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-12 flex justify-between items-center">
              <button 
                onClick={goToPreviousDay} 
                className="flex items-center space-x-2 text-marian-blue-600 dark:text-sacred-gold-400 hover:text-marian-blue-800 dark:hover:text-sacred-gold-300 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Lecturas anteriores</span>
              </button>
              
              {canGoNext() && (
                <button 
                  onClick={goToNextDay} 
                  className="flex items-center space-x-2 text-marian-blue-600 dark:text-sacred-gold-400 hover:text-marian-blue-800 dark:hover:text-sacred-gold-300 transition-colors duration-200"
                >
                  <span>Lecturas siguientes</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DailyReadings;
