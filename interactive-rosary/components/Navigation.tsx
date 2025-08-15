import React from 'react';

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
        className="px-5 py-2.5 w-full text-sm font-medium text-white bg-marian-blue-600 rounded-lg shadow-sm hover:bg-marian-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-marian-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
    >
        {children}
    </button>
);

export const Navigation: React.FC<NavigationProps> = ({ onNext, onPrev, onReset, currentIndex, total }) => {
  return (
    <div className="mt-auto pt-6 border-t border-marian-blue-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-marian-blue-800 dark:text-marian-blue-200 font-medium">
                Progreso: {currentIndex + 1} / {total}
            </span>
            <button 
                onClick={onReset}
                className="text-sm font-medium text-marian-blue-600 dark:text-marian-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-marian-blue-500 rounded"
            >
                Reiniciar
            </button>
        </div>
      <div className="flex items-center justify-between gap-3">
        <NavButton onClick={onPrev} disabled={currentIndex === 0} ariaLabel="Oración anterior">
          Anterior
        </NavButton>
        <NavButton onClick={onNext} disabled={currentIndex === total - 1} ariaLabel="Siguiente oración">
          Siguiente
        </NavButton>
      </div>
    </div>
  );
};
