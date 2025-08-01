import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Share2, Volume2, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import AdBanner from '../components/Ads/AdBanner';

const DailyReadings: React.FC = () => {
  const [selectedReading, setSelectedReading] = useState<'first' | 'psalm' | 'second' | 'gospel'>('first');
  const [readingsData, setReadingsData] = useState<any>(null); // Estado para los datos
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado de error
  
  // 2. Usar useEffect para obtener los datos al cargar el componente
  useEffect(() => {
    const fetchReadings = async () => {
      // Lógica para obtener las lecturas del día desde Supabase
      // Por ahora, usaremos los datos de muestra mientras conectamos la API
    };

    fetchReadings();
  }, []);

  const today = new Date();
  const currentDate = today.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Datos de muestra (serán reemplazados por la llamada a la API)
  const sampleReadingsData = {
    date: currentDate,
    liturgicalSeason: 'Tiempo Ordinario',
    liturgicalColor: 'Verde',
    weekday: 'Miércoles de la 2ª semana del Tiempo Ordinario',
    firstReading: {
      reference: 'Primera Lectura: Hebreos 7:1-3, 15-17',
      title: 'Cristo, sacerdote eterno según el orden de Melquisedec',
      text: `Lectura de la carta a los Hebreos.

Hermanos: Melquisedec, rey de Salem y sacerdote del Dios altísimo, salió al encuentro de Abrahán cuando volvía de derrotar a los reyes, y lo bendijo. Abrahán le dio la décima parte de todo. Su nombre significa primero "rey de justicia", y además es rey de Salem, es decir, "rey de paz". Sin padre, sin madre, sin genealogía, sin comienzo de días ni fin de vida, asemejado al Hijo de Dios, permanece sacerdote para siempre.

Esto resulta aún más evidente si surge otro sacerdote semejante a Melquisedec, que no ha llegado a serlo por una ley de prescripción carnal, sino por el poder de una vida indestructible. Pues se da testimonio: "Tú eres sacerdote eterno según el orden de Melquisedec."

Palabra de Dios.`,
    },
    psalm: {
      reference: 'Salmo Responsorial: Salmo 109, 1. 2. 3. 4',
      response: 'Tú eres sacerdote eterno según el orden de Melquisedec.',
      verses: [
        'Oráculo del Señor a mi Señor: "Siéntate a mi derecha, y haré de tus enemigos estrado de tus pies."',
        'Desde Sión extenderá el Señor el poder de tu cetro: somete en la batalla a tus enemigos.',
        'Eres príncipe desde el día de tu nacimiento, entre esplendores sagrados; yo mismo te engendré, como rocío, antes de la aurora.',
        'El Señor lo ha jurado y no se arrepiente: "Tú eres sacerdote eterno según el orden de Melquisedec."'
      ],
    },
    secondReading: null, // No hay segunda lectura en días de semana
    gospel: {
      reference: 'Evangelio: Marcos 3:1-6',
      title: 'Jesús cura en sábado',
      text: `Lectura del santo Evangelio según san Marcos.

En aquel tiempo, entró Jesús otra vez en la sinagoga, y había allí un hombre que tenía la mano paralizada. Y le estaban acechando para ver si lo curaba en sábado, para poder acusarlo.

Jesús le dijo al hombre que tenía la mano paralizada: "Levántate y ponte ahí en medio."

Y les preguntó: "¿Qué está permitido en sábado: hacer el bien o hacer el mal, salvar una vida o matarla?"

Pero ellos callaban. Entonces, mirándolos uno por uno con ira, dolido por la dureza de su corazón, le dijo al hombre: "Extiende la mano."

La extendió, y la mano le quedó restablecida. Nada más salir, los fariseos se pusieron a planear con los herodianos el modo de acabar con él.

Palabra del Señor.`,
    },
  };

  // Simulación de carga de datos
  useEffect(() => {
    setLoading(true);
    // Aquí iría la llamada a Supabase
    // const { data, error } = await supabase.from('...')...
    setTimeout(() => {
      setReadingsData(sampleReadingsData);
      setLoading(false);
    }, 1000); // Simula 1 segundo de carga
  }, []);

  if (loading) {
    return <div className="text-center p-12">Cargando lecturas...</div>;
  }

  if (error || !readingsData) {
    return <div className="text-center p-12 text-red-500">Error al cargar las lecturas: {error}</div>;
  }

  const readings = [
    // ... (El resto del componente usaría `readingsData` del estado)
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Lecturas del día - ${currentDate}`,
        text: 'Lecturas litúrgicas del día',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  const handleAudioPlay = () => {
    // Placeholder for audio functionality
    alert('Función de audio próximamente disponible');
  };

  const handleDownload = () => {
    // Placeholder for download functionality
    alert('Función de descarga próximamente disponible');
  };

  const currentReadingIndex = readings.findIndex(r => r.key === selectedReading);

  const goToPrevious = () => {
    if (currentReadingIndex > 0) {
      setSelectedReading(readings[currentReadingIndex - 1].key as any);
    }
  };

  const goToNext = () => {
    if (currentReadingIndex < readings.length - 1) {
      setSelectedReading(readings[currentReadingIndex + 1].key as any);
    }
  };

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
              <span className="capitalize">{readingsData.date}</span>
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
                {readings.map((reading) => (
                  <button
                    key={reading.key}
                    onClick={() => setSelectedReading(reading.key as any)}
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              {/* Reading Header */}
              <div className="bg-gradient-to-r from-marian-blue-600 to-marian-blue-700 dark:from-gray-700 dark:to-gray-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-serif font-semibold mb-2">
                      {readings.find(r => r.key === selectedReading)?.label}
                    </h2>
                    <p className="text-marian-blue-100 dark:text-gray-300">
                      {readings.find(r => r.key === selectedReading)?.data.reference}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={goToPrevious}
                      disabled={currentReadingIndex === 0}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={goToNext}
                      disabled={currentReadingIndex === readings.length - 1}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Reading Content */}
              <div className="p-6 sm:p-8">
                {selectedReading === 'psalm' ? (
                  <div className="space-y-6">
                    <div className="bg-sacred-gold-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-marian-blue-900 dark:text-white mb-2">
                        Antífona:
                      </h4>
                      <p className="text-gray-800 dark:text-gray-200 italic">
                        {readingsData.psalm.response}
                      </p>
                    </div>
                    <div className="space-y-4">
                      {readingsData.psalm.verses.map((verse, index) => (
                        <div key={index} className="border-l-4 border-sacred-gold-400 dark:border-sacred-gold-300 pl-4">
                          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                            {verse}
                          </p>
                          {index < readingsData.psalm.verses.length - 1 && (
                            <p className="text-sacred-gold-600 dark:text-sacred-gold-400 italic mt-2 text-sm">
                              R. {readingsData.psalm.response}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    {readings.find(r => r.key === selectedReading)?.data.title && (
                      <h3 className="text-xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-4">
                        {readings.find(r => r.key === selectedReading)?.data.title}
                      </h3>
                    )}
                    <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                      {readings.find(r => r.key === selectedReading)?.data.text}
                    </div>
                  </div>
                )}
              </div>
            </div>

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
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Semana:</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      2ª del Tiempo Ordinario
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

            {/* Navigation */}
            <div className="mt-8 flex justify-between items-center">
              <button className="flex items-center space-x-2 text-marian-blue-600 dark:text-sacred-gold-400 hover:text-marian-blue-800 dark:hover:text-sacred-gold-300 transition-colors duration-200">
                <ChevronLeft className="h-4 w-4" />
                <span>Lecturas de ayer</span>
              </button>
              <button className="flex items-center space-x-2 text-marian-blue-600 dark:text-sacred-gold-400 hover:text-marian-blue-800 dark:hover:text-sacred-gold-300 transition-colors duration-200">
                <span>Lecturas de mañana</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReadings;