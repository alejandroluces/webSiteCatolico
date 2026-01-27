import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, User, Heart, Sparkles } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  type: 'evangelio' | 'santo' | 'oracion' | 'novena';
  excerpt: string;
  url: string;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchData = [
    {
      id: '1',
      title: 'Evangelio según San Juan 3:16',
      type: 'evangelio' as const,
      excerpt: 'Porque tanto amó Dios al mundo que dio a su Hijo único...',
      url: '/evangelio-del-dia',
    },
    {
      id: '2',
      title: 'Santa Teresa de Jesús',
      type: 'santo' as const,
      excerpt: 'Doctora de la Iglesia, mística y reformadora del Carmelo...',
      url: '/santo-del-dia',
    },
    {
      id: '3',
      title: 'Oración por la familia',
      type: 'oracion' as const,
      excerpt: 'Señor, bendice a nuestra familia y manténla unida...',
      url: '/oraciones/familia',
    },
    {
      id: '4',
      title: 'Novena al Sagrado Corazón',
      type: 'novena' as const,
      excerpt: 'Nueve días de oración al Corazón de Jesús...',
      url: '/novenas/sagrado-corazon',
    },
  ];

  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const filtered = searchData.filter(item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.excerpt.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'evangelio':
        return <BookOpen className="h-4 w-4" />;
      case 'santo':
        return <User className="h-4 w-4" />;
      case 'oracion':
        return <Heart className="h-4 w-4" />;
      case 'novena':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'evangelio':
        return 'Evangelio';
      case 'santo':
        return 'Santo';
      case 'oracion':
        return 'Oración';
      case 'novena':
        return 'Novena';
      default:
        return 'Resultado';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen pt-16 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-semibold text-gray-900 dark:text-white">
                Buscar en Camino de Fe
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar evangelios, santos, oraciones..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-marian-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>

            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-marian-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((result) => (
                    <a
                      key={result.id}
                      href={result.url}
                      className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                      onClick={onClose}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 text-marian-blue-600 dark:text-sacred-gold-400 mt-1">
                          {getIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {result.title}
                            </h4>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-marian-blue-100 text-marian-blue-800 dark:bg-gray-600 dark:text-gray-300">
                              {getTypeLabel(result.type)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {result.excerpt}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : query.trim() ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No se encontraron resultados para "{query}"</p>
                  <p className="text-sm mt-2">Intenta con otros términos de búsqueda</p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Comienza a escribir para buscar</p>
                  <p className="text-sm mt-2">Evangelios, santos, oraciones, novenas y más</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
