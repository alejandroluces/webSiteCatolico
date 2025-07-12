import React from 'react';
import { User, Calendar } from 'lucide-react';

const SaintOfTheDay: React.FC = () => {
  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-marian-blue-900 dark:text-white mb-4">
            Santo del Día
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {today}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6 text-center">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-200 to-orange-200 dark:from-gray-600 dark:to-gray-500 rounded-full flex items-center justify-center mb-4">
                    <User className="h-16 w-16 text-amber-600 dark:text-amber-300" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    San Antonio Abad
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Padre del monacato
                  </p>
                </div>
              </div>

              <div className="md:w-2/3">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    San Antonio Abad (251-356), conocido como el "Padre del Monacato", fue uno de los primeros ermitaños cristianos. Nacido en Egipto en una familia acomodada, a los 20 años distribuyó sus bienes entre los pobres y se retiró al desierto para dedicarse completamente a la oración y la penitencia.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Durante más de 80 años vivió en soledad, enfrentando tentaciones y dificultades con una fe inquebrantable. Su ejemplo atrajo a muchos discípulos que buscaban seguir su camino de santidad.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    San Antonio es considerado el fundador del monacato cristiano y es venerado tanto en Oriente como en Occidente. Su vida nos enseña la importancia del silencio, la oración y el desprendimiento de los bienes materiales para encontrar a Dios.
                  </p>
                </div>
                
                <div className="mt-6 flex items-center text-gray-500 dark:text-gray-400">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>Fiesta: 17 de enero</span>
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