import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { useDailyContent } from '../hooks/useDailyContent';

const GospelWidget: React.FC = () => {
  const { content, isLoading, error } = useDailyContent('gospel');
  const [excerpt, setExcerpt] = useState('');
  
  useEffect(() => {
    if (content?.content) {
      // Crear un extracto del contenido
      const maxLength = 200;
      setExcerpt(
        content.content.length > maxLength
          ? content.content.substring(0, maxLength) + '...'
          : content.content
      );
    }
  }, [content]);

  // Formatear la fecha actual
  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <h3 className="text-lg font-serif font-semibold text-red-800 dark:text-red-300 mb-2">
          Error al cargar el evangelio
        </h3>
        <p className="text-red-600 dark:text-red-400 text-sm">
          No se pudo cargar el evangelio del día. Por favor, intenta nuevamente más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-marian-blue-600 to-marian-blue-700 dark:from-gray-700 dark:to-gray-600 text-white p-6">
        <div className="flex items-center space-x-2 mb-2">
          <BookOpen className="h-5 w-5" />
          <h3 className="text-xl font-serif font-semibold">
            Evangelio del Día
          </h3>
        </div>
        <p className="text-marian-blue-100 dark:text-gray-300 text-sm">
          {formatDate()}
        </p>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {content ? (
          <>
            <h4 className="text-lg font-serif font-semibold text-marian-blue-900 dark:text-white mb-2">
              {content.title}
            </h4>
            
            {content.reference && (
              <div className="inline-block bg-marian-blue-100 dark:bg-gray-700 text-marian-blue-800 dark:text-gray-300 px-3 py-1 rounded-full text-sm mb-4">
                {content.reference}
              </div>
            )}
            
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-4">
              {excerpt}
            </p>
            
            <Link
              to="/evangelio-del-dia"
              className="inline-flex items-center text-marian-blue-600 dark:text-sacred-gold-400 font-medium hover:text-marian-blue-800 dark:hover:text-sacred-gold-300 transition-colors duration-200"
            >
              Leer completo
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400">
              No hay evangelio disponible para hoy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GospelWidget;