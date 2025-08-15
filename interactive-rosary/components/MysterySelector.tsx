import React from 'react';
import { MysteryType } from '../types';

interface MysterySelectorProps {
  selectedMystery: MysteryType;
  dayRecommendedMystery: MysteryType;
  onSelectMystery: (mystery: MysteryType) => void;
}

export const MysterySelector: React.FC<MysterySelectorProps> = ({
  selectedMystery,
  dayRecommendedMystery,
  onSelectMystery,
}) => {
  const mysteries = Object.values(MysteryType);

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-marian-blue-800 dark:text-marian-blue-200 font-serif mb-3">Misterios del Rosario</h3>
      <div className="grid grid-cols-2 gap-2">
        {mysteries.map((mystery) => (
          <button
            key={mystery}
            onClick={() => onSelectMystery(mystery)}
            className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-marian-blue-400
              ${selectedMystery === mystery
                ? 'bg-marian-blue-700 text-white shadow-md'
                : 'bg-marian-blue-50 text-marian-blue-800 hover:bg-marian-blue-100 border border-marian-blue-200 dark:bg-gray-800 dark:text-marian-blue-200 dark:hover:bg-gray-700 dark:border-gray-700'
              }
            `}
            aria-pressed={selectedMystery === mystery}
          >
            {mystery}
            {dayRecommendedMystery === mystery && selectedMystery !== mystery && (
              <span className="text-xs block opacity-80">(Hoy)</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
