import React, { useState, useEffect } from 'react';

interface Saint {
  title: string;
  text: string;
  imagePath: string;
  url: string;
  biography: string;
}

interface SaintData {
  date: string;
  formattedDate: string;
  saint: Saint;
}

const splitParagraphs = (text?: string) =>
  (text || '')
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

const SaintOfTheDay: React.FC = () => {
  const [saintData, setSaintData] = useState<SaintData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSaintData = async () => {
      try {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const formattedDate = `${day}${month}${year}`;
        
        const response = await fetch(`/images/santo-del-dia/${formattedDate}.json`);
        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType || !contentType.includes("application/json")) {
          throw new Error('No se encontró el santo del día de hoy.');
        }
        const data: SaintData = await response.json();
        setSaintData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
      } finally {
        setLoading(false);
      }
    };

    fetchSaintData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!saintData) {
    return null;
  }

  const { formattedDate, saint } = saintData;
  
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const imageName = `${day}${month}${year}.png`;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-marian-blue-900 dark:text-white mb-4">
            Santo del Día
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {formattedDate}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6 text-center">
                  <img 
                    src={`/images/santo-del-dia/${imageName}`} 
                    alt={saint.title}
                    className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
                  />
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {saint.title}
                  </h2>
                </div>
              </div>

              <div className="md:w-2/3">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="content-prose text-gray-700 dark:text-gray-300 mb-4 font-semibold">
                    {saint.text}
                  </p>
                  <div className="content-prose content-prose--devotional text-gray-700 dark:text-gray-300">
                    {splitParagraphs(saint.biography).map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaintOfTheDay;
