import React, { useEffect, useRef } from 'react';
import type { Prayer, Mystery } from '../types';

interface PrayerDisplayProps {
  prayer: Prayer | null;
  mystery: Mystery | null;
  currentPrayerIndex?: number;
}

export const PrayerDisplay: React.FC<PrayerDisplayProps> = ({ prayer, mystery, currentPrayerIndex = 0 }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = contentRef.current;
    if (node) {
      node.classList.remove('animate-fade-in');
      void node.offsetWidth;
      node.classList.add('animate-fade-in');
    }
  }, [currentPrayerIndex]);

  const title = prayer ? prayer.name : "Rosario Interactivo";
  const text = prayer ? prayer.text : "Selecciona un misterio y haz clic en una cuenta para comenzar.";
  const mysteryTitle = mystery ? `Meditación: ${mystery.name}` : null;

  return (
    <div className="my-4 flex min-h-[260px] flex-1 flex-col overflow-y-auto rounded-lg border border-white/15 bg-slate-950/60 p-4 shadow-inner shadow-black/20 sm:p-5 lg:min-h-0">
      <div ref={contentRef} className="animate-fade-in">
        {mysteryTitle && (
          <p className="mb-2 text-sm font-semibold text-sacred-gold-200">{mysteryTitle}</p>
        )}
        <h2 className="mb-3 text-2xl font-bold leading-tight text-red-200">{title}</h2>
        <div className="text-[0.95rem] leading-7 text-slate-100">
          {text.split('\n').map((line, index) => (
            <p key={index} className="mb-3 last:mb-0">{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
};
