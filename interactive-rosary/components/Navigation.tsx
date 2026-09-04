import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface NavigationProps {
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  currentIndex: number;
  total: number;
}

const NavButton: React.FC<{ onClick: () => void; children: React.ReactNode; disabled?: boolean; ariaLabel: string }> = ({ onClick, children, disabled, ariaLabel }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-marian-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-marian-blue-800 focus:outline-none focus:ring-2 focus:ring-marian-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 dark:bg-marian-blue-600 dark:hover:bg-marian-blue-500 dark:focus:ring-offset-slate-900"
    >
        {children}
    </button>
);

export const Navigation: React.FC<NavigationProps> = ({ onNext, onPrev, onReset, currentIndex, total }) => {
  return (
    <div className="mt-auto shrink-0 border-t border-white/15 pt-4">
        <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-marian-blue-50">
                Progreso: {currentIndex + 1} / {total}
            </span>
            <button 
                onClick={onReset}
                className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-semibold text-sacred-gold-200 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-marian-blue-400"
            >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Reiniciar
            </button>
        </div>
      <div className="flex items-center justify-between gap-3">
        <NavButton onClick={onPrev} disabled={currentIndex === 0} ariaLabel="Oración anterior">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Anterior
        </NavButton>
        <NavButton onClick={onNext} disabled={currentIndex === total - 1} ariaLabel="Siguiente oración">
          Siguiente
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </NavButton>
      </div>
    </div>
  );
};
