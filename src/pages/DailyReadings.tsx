import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Share2, Volume2, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import AdBanner from '../components/Ads/AdBanner';
import { getDailyReadings, DailyReadingsData } from '../services/dailyReadingsService';

const DailyReadings: React.FC = () => {
  const [selectedReading, setSelectedReading] = useState<'reading' | 'gospel'>('reading');
  const [readingsData, setReadingsData] = useState<DailyReadingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Obtener los datos al cargar el componente
  useEffect(() => {
    const fetchReadings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getDailyReadings();
        
        if (data) {
          setReadingsData(data);
          // Si no hay lectura, seleccionar el evangelio por defecto
          if (!data.reading && data.gospel) {
            setSelectedReading('gospel');
          }
        } else {
          setError('No se encontraron lecturas para hoy');
        }
      } catch (err) {
        console.error('Error fetching readings:', err);
        setError('Error al cargar las lecturas');
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-marian-blue-600 dark:text-sacred-gold-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600 dark:text-gray-300">Cargando lecturas del día...</p>
        </div>
      </div>
    );
  }

  if (error || !readingsData) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-12">
          <p className="text-red-500 dark:text-red-400 mb-4">{error || 'Error al cargar las lecturas'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-marian-blue-600 hover:bg-marian-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Lecturas del día - ${readingsData.formattedDate}`,
        text: 'Lecturas litúrgicas del día',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  const handleAudioPlay = () => {
    alert('Función de audio próximamente disponible');
  };

  const handleDownload = () => {
    alert('Función de descarga próximamente disponible');
  };

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
      setSelectedReading(availableReadings[currentIndex - 1].key as 'reading' | 'gospel');
    }
  };

  const goToNext = () => {
    if (currentIndex < availableReadings.length - 1) {
      setSelectedReading(availableReadings[currentIndex + 1].key as 'reading' | 'gospel');
    }
  };

  const currentReading = selectedReading === 'reading' ? readingsData.reading : readingsData.gospel;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-8 w-8 text-marian-blue-600 dark:text-sacred-gold-400" />
            <h1 className="text-4xl font-serif font-bold text-marian-blue-900 dark:text-white">
              Lecturas del Día
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span className="capitalize">{readingsData.formattedDate}</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span>{readingsData.weekday}</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Tiempo Litúrgico: {readingsData.liturgicalSeason}</span>
            </span>
          </div>
        </div>

        <AdBanner position="inline" size="medium" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sticky top-8">
              <h3 className="text-lg font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
                Lecturas de Hoy
              </h3>
              <nav className="space-y-2">
                {availableReadings.map((reading) => (
                  <button
                    key={reading.key}
                    onClick={() => setSelectedReading(reading.key as 'reading' | 'gospel')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                      selectedReading === reading.key
                        ? 'bg-marian-blue-100 text-marian-blue-900 dark:bg-gray-700 dark:text-sacred-gold-400'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {reading.label}
                  </button>
                ))}
              </nav>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center px-4 py-2 bg-marian-blue-600 hover:bg-marian-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartir
                </button>
                <button
                  onClick={handleAudioPlay}
                  className="w-full flex items-center justify-center px-4 py-2 bg-sacred-gold-500 hover:bg-sacred-gold-600 text-white rounded-lg transition-colors duration-200"
                >
                  <Volume2 className="mr-2 h-4 w-4" />
                  Escuchar
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Descargar
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentReading && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Reading Header */}
                <div className="bg-gradient-to-r from-marian-blue-600 to-marian-blue-700 dark:from-gray-700 dark:to-gray-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-serif font-semibold mb-2">
                        {selectedReading === 'reading' ? 'Primera Lectura' : 'Evangelio'}
                      </h2>
                      <p className="text-marian-blue-100 dark:text-gray-300">
                        {currentReading.reference}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={goToPrevious}
                        disabled={currentIndex === 0}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={goToNext}
                        disabled={currentIndex === availableReadings.length - 1}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reading Content */}
                <div className="p-6 sm:p-8">
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    {currentReading.title && (
                      <h3 className="text-xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
                        {currentReading.title}
                      </h3>
                    )}
                    <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                      {currentReading.content}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <AdBanner position="inline" size="small" />

            {/* Additional Information */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-marian-blue-50 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
                  Información Litúrgica
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tiempo:</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      {readingsData.liturgicalSeason}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Color:</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      {readingsData.liturgicalColor}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-sacred-gold-50 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
                  Enlaces Relacionados
                </h3>
                <div className="space-y-3">
                  <a
                    href="/evangelio-del-dia"
                    className="block text-marian-blue-600 dark:text-sacred-gold-400 hover:text-marian-blue-800 dark:hover:text-sacred-gold-300 transition-colors duration-200"
                  >
                    → Reflexión del Evangelio
                  </a>
                  <a
                    href="/santo-del-dia"
                    className="block text-marian-blue-600 dark:text-sacred-gold-400 hover:text-marian-blue-800 dark:hover:text-sacred-gold-300 transition-colors duration-200"
                  >
                    → Santo del Día
                  </a>
                  <a
                    href="/calendario-liturgico"
                    className="block text-marian-blue-600 dark:text-sacred-gold-400 hover:text-marian-blue-800 dark:hover:text-sacred-gold-300 transition-colors duration-200"
                  >
                    → Calendario Litúrgico
                  </a>
                  <a
                    href="/oraciones"
                    className="block text-marian-blue-600 dark:text-sacred-gold-400 hover:text-marian-blue-800 dark:hover:text-sacred-gold-300 transition-colors duration-200"
                  >
                    → Oraciones del Día
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReadings;
