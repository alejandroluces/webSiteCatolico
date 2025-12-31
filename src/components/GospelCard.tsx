import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { DailyContent } from '../hooks/useDailyContent';

const FALLBACK_GOSPEL_IMAGE = '/images/Santisimo.png';

interface GospelCardProps {
  gospel: DailyContent;
  isHighlighted?: boolean;
}

const GospelCard: React.FC<GospelCardProps> = ({ gospel, isHighlighted = false }) => {
  // Formatear la fecha
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Extraer un extracto del contenido
  const getExcerpt = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className={`bg-gradient-to-br from-white via-white to-marian-blue-50/30 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200/60 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-marian-blue-200/50 dark:hover:shadow-gray-900/50 ${
      isHighlighted ? 'ring-2 ring-sacred-gold-400 dark:ring-sacred-gold-500' : ''
    }`}>
      {/* Imagen del evangelio (con fallback) */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={gospel.image_url || FALLBACK_GOSPEL_IMAGE}
          alt={gospel.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const img = e.currentTarget;
            // Evitar loop si el fallback también faltara
            if (!img.src.endsWith(FALLBACK_GOSPEL_IMAGE)) {
              img.src = FALLBACK_GOSPEL_IMAGE;
            }
          }}
        />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(gospel.date)}</span>
            </div>
          </div>
      </div>
      
      <div className="p-6">
        {/* La fecha ya se muestra en el overlay de la imagen */}
        
        <h3 className="text-xl font-serif font-semibold text-marian-blue-900 dark:text-white mb-3">
          {gospel.title}
        </h3>
        
        {gospel.reference && (
          <div className="inline-block bg-marian-blue-100 dark:bg-gray-700 text-marian-blue-800 dark:text-gray-300 px-3 py-1 rounded-full text-sm mb-4">
            {gospel.reference}
          </div>
        )}
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {getExcerpt(gospel.content)}
        </p>
        
        <Link
          to={`/evangelio-del-dia?date=${gospel.date}`}
          className="inline-flex items-center text-marian-blue-600 dark:text-sacred-gold-400 font-medium hover:text-marian-blue-800 dark:hover:text-sacred-gold-300 transition-colors duration-200"
        >
          Leer completo
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default GospelCard;
