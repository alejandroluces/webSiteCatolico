import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Calendar, Share2, Heart, ArrowLeft, ArrowRight, Volume2, Play, Pause } from 'lucide-react';
import { useDailyContent } from '../hooks/useDailyContent';

const FALLBACK_GOSPEL_IMAGE = '/images/Santisimo.png';

const DailyGospel: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const { content, isLoading, error, refetch } = useDailyContent('gospel', selectedDate);
  const [imageSrc, setImageSrc] = useState<string>(FALLBACK_GOSPEL_IMAGE);
  
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        setPlayingAudio(null);
        setIsPaused(true);
      };
    }
  }, [playingAudio]);

  useEffect(() => {
    // Siempre mostrar una imagen:
    // 1) si hay imagen del día -> usarla
    // 2) si no hay / falla -> fallback (Santisimo.png)
    setImageSrc(content?.image_url || FALLBACK_GOSPEL_IMAGE);
  }, [content?.image_url]);

  const handlePlayPause = (audioUrl: string) => {
    if (playingAudio === audioUrl) {
      if (isPaused) {
        audioRef.current?.play();
        setIsPaused(false);
      } else {
        audioRef.current?.pause();
        setIsPaused(true);
      }
    } else {
      setPlayingAudio(audioUrl);
      setIsPaused(false);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    }
  };

  const AudioButton: React.FC<{ url: string | undefined, type: string }> = ({ url, type }) => {
    if (!url) return null;
    const isCurrentlyPlaying = playingAudio === url && !isPaused;
    return (
      <button
        onClick={() => handlePlayPause(url)}
        className="ml-4 p-2 rounded-full bg-marian-blue-100 dark:bg-gray-600 hover:bg-marian-blue-200 dark:hover:bg-gray-500 transition-colors"
        aria-label={`Escuchar ${type}`}
      >
        {isCurrentlyPlaying ? <Pause className="h-5 w-5 text-marian-blue-800 dark:text-white" /> : <Play className="h-5 w-5 text-marian-blue-800 dark:text-white" />}
      </button>
    );
  };

  const formatDate = (dateStr?: string) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const goToPreviousDay = () => {
    const currentDate = selectedDate ? new Date(selectedDate) : new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const currentDate = selectedDate ? new Date(selectedDate) : new Date();
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Evangelio del día - ${content?.reference || ''}`,
        text: content?.title || 'Evangelio del día',
        url: window.location.href,
      }).catch(err => console.error('Error al compartir:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  const canGoNext = () => {
    if (!selectedDate) return false;
    const currentDate = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return currentDate < today;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <audio ref={audioRef} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-8 w-8 text-marian-blue-600 dark:text-sacred-gold-400" />
            <h1 className="text-4xl font-serif font-bold text-marian-blue-900 dark:text-white">
              Evangelio del Día
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
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-marian-blue-200 border-t-marian-blue-600 rounded-full animate-spin"></div>
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button onClick={() => refetch()} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
              Reintentar
            </button>
          </div>
        )}

        {!isLoading && !error && content && (
          <>
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
              <img
                src={imageSrc}
                alt={content.title}
                className="w-full h-auto object-cover"
                onError={() => {
                  // Evitar bucle infinito si el fallback también faltara
                  if (imageSrc !== FALLBACK_GOSPEL_IMAGE) {
                    setImageSrc(FALLBACK_GOSPEL_IMAGE);
                  }
                }}
              />
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-marian-blue-600 to-marian-blue-700 dark:from-gray-700 dark:to-gray-600 text-white p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-serif font-semibold mb-2">{content.reference}</h2>
                  <p className="text-marian-blue-100 dark:text-gray-300 text-lg">{content.title}</p>
                </div>
                <AudioButton url={content.gospel_audio_url} type="evangelio" />
              </div>

              <div className="p-6 sm:p-8">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line border-l-4 border-sacred-gold-400 dark:border-sacred-gold-300 pl-6 italic">
                    {content.content}
                  </div>
                </div>
              </div>
            </div>

            {content.reflection && (
              <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-serif font-semibold text-marian-blue-900 dark:text-white flex items-center">
                    <Heart className="mr-2 h-6 w-6 text-red-500" />
                    Reflexión
                  </h3>
                  <AudioButton url={content.reflection_audio_url} type="reflexión" />
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                    {content.reflection.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-justify">{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {content.prayer && (
              <div className="mt-8 bg-marian-blue-50 dark:bg-gray-700 rounded-xl shadow-lg border border-marian-blue-100 dark:border-gray-600 p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-serif font-semibold text-marian-blue-900 dark:text-white">
                    Oración del Día
                  </h3>
                  <AudioButton url={content.prayer_audio_url} type="oración" />
                </div>
                <div className="text-gray-800 dark:text-gray-200 leading-relaxed italic whitespace-pre-line">
                  {content.prayer}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleShare} className="inline-flex items-center px-6 py-3 bg-marian-blue-600 hover:bg-marian-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
                <Share2 className="mr-2 h-4 w-4" />
                Compartir Evangelio
              </button>
              <a href="/lecturas-del-dia" className="inline-flex items-center px-6 py-3 bg-sacred-gold-500 hover:bg-sacred-gold-600 text-white font-medium rounded-lg transition-colors duration-200 text-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Ver Lecturas Completas
              </a>
            </div>

            <div className="mt-12 flex justify-between items-center">
              <button onClick={goToPreviousDay} className="flex items-center space-x-2 text-marian-blue-600 dark:text-sacred-gold-400 hover:text-marian-blue-800 dark:hover:text-sacred-gold-300 transition-colors duration-200">
                <ArrowLeft className="h-4 w-4" />
                <span>Evangelio anterior</span>
              </button>
              
              {canGoNext() && (
                <button onClick={goToNextDay} className="flex items-center space-x-2 text-marian-blue-600 dark:text-sacred-gold-400 hover:text-marian-blue-800 dark:hover:text-sacred-gold-300 transition-colors duration-200">
                  <span>Evangelio siguiente</span>
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

export default DailyGospel;
