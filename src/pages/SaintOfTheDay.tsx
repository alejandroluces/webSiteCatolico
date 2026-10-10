import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface SaintData {
  date: string;
  title: string;
  content: string;
  image_url: string | null;
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
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchSaintData = async () => {
      try {
        if (!supabase) {
          throw new Error('No se pudo cargar el santo del día. Por favor, intenta nuevamente más tarde.');
        }
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const date = `${year}-${month}-${day}`;

        const { data, error: fetchError } = await supabase
          .from('daily_content')
          .select('date,title,content,image_url')
          .eq('type', 'saint')
          .eq('date', date)
          .eq('status', 'published')
          .eq('is_active', true)
          .maybeSingle();

        if (fetchError) {
          throw new Error('No se pudo cargar el santo del día. Por favor, intenta nuevamente más tarde.');
        }
        if (!cancelled) setSaintData(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSaintData();
    return () => { cancelled = true; };
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
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">Aún no está disponible el santo del día de hoy.</p>
      </div>
    );
  }

  const [year, month, day] = saintData.date.split('-').map(Number);
  const formattedDate = new Date(year, month - 1, day).toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

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
                  {saintData.image_url && !imageFailed && (
                    <img
                      src={saintData.image_url}
                      alt={saintData.title}
                      onError={() => setImageFailed(true)}
                      className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
                    />
                  )}
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {saintData.title}
                  </h2>
                </div>
              </div>

              <div className="md:w-2/3">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div className="content-prose content-prose--devotional text-gray-700 dark:text-gray-300">
                    {splitParagraphs(saintData.content).map((paragraph, index) => (
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
