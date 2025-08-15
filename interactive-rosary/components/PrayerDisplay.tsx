import React from 'react';
import type { Prayer, Mystery } from '../types';

interface PrayerDisplayProps {
  prayer: Prayer | null;
  mystery: Mystery | null; // Pass mystery separately for context
}

export const PrayerDisplay: React.FC<PrayerDisplayProps> = ({ prayer, mystery }) => {
  const title = prayer ? prayer.name : "Rosario Interactivo";
  const text = prayer ? prayer.text : "Selecciona un misterio y haz clic en una cuenta para comenzar.";
  const mysteryTitle = mystery ? `Meditación: ${mystery.name}` : null;

  return (
    <div className="flex-grow bg-marian-blue-50 dark:bg-gray-900 rounded-xl p-6 overflow-y-auto my-4 border border-marian-blue-200 dark:border-gray-700 min-h-[300px] flex flex-col">
      {mysteryTitle && (
        <p className="text-sm font-semibold text-sacred-gold-700 dark:text-sacred-gold-300 mb-2 font-serif">{mysteryTitle}</p>
      )}
      <h2 className="text-2xl font-bold text-marian-blue-900 dark:text-marian-blue-100 font-serif mb-3">{title}</h2>
      <div className="prose text-marian-blue-800 dark:text-gray-300 leading-relaxed">
        {text.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  );
};
