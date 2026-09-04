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
    <div className="mb-4 shrink-0">
      <h3 className="mb-3 text-lg font-semibold text-sacred-gold-200">Misterios del Rosario</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
        {mysteries.map((mystery) => (
          <button
            key={mystery}
            onClick={() => onSelectMystery(mystery)}
            className={`min-h-12 rounded-md px-3 py-2 text-sm font-semibold leading-tight transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-marian-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900
              ${selectedMystery === mystery
                ? 'border border-marian-blue-300 bg-marian-blue-600 text-white shadow-md shadow-marian-blue-950/30'
                : 'border border-white/15 bg-white/10 text-marian-blue-50 hover:border-sacred-gold-300/50 hover:bg-white/20'
              }
            `}
            aria-pressed={selectedMystery === mystery}
          >
            {mystery}
            {dayRecommendedMystery === mystery && selectedMystery !== mystery && (
              <span className="block text-xs font-medium opacity-75">Hoy</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
