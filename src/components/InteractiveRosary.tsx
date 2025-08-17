import React from 'react';
import { Rosary } from '../../interactive-rosary/components/Rosary';
import { PrayerDisplay } from '../../interactive-rosary/components/PrayerDisplay';
import { MysterySelector } from '../../interactive-rosary/components/MysterySelector';
import { Navigation } from '../../interactive-rosary/components/Navigation';
import { useRosary } from '../../interactive-rosary/hooks/useRosary';
import type { MysteryType } from '../../interactive-rosary/types';

const InteractiveRosary: React.FC = () => {
  const {
    currentPrayer,
    currentMystery,
    currentPrayerIndex,
    totalPrayers,
    selectedMysteryType,
    dayRecommendedMystery,
    goToNextPrayer,
    goToPreviousPrayer,
    selectMysteryType,
    handleBeadClick,
    resetToBeginning,
  } = useRosary();

  return (
    <div className="rosary-background min-h-screen text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center p-4 selection:bg-marian-blue-200">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 z-10">
        
        {/* Left Panel: Controls and Prayer Display */}
        <div className="lg:w-1/3 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 lg:p-8 flex flex-col order-2 lg:order-1 h-[90vh]">
          <header className="text-center mb-6 border-b border-marian-blue-200 dark:border-gray-700 pb-4">
            <h1 className="text-4xl font-bold text-marian-blue-900 dark:text-white font-serif">Rosario Interactivo</h1>
            <p className="text-marian-blue-700 dark:text-marian-blue-200 mt-1">Una guía para la oración y meditación</p>
          </header>
          
          <MysterySelector
            selectedMystery={selectedMysteryType}
            dayRecommendedMystery={dayRecommendedMystery}
            onSelectMystery={(mystery: MysteryType) => selectMysteryType(mystery)}
          />

          <PrayerDisplay
            prayer={currentPrayer}
            mystery={currentMystery}
          />
          
          <Navigation
            onNext={goToNextPrayer}
            onPrev={goToPreviousPrayer}
            onReset={resetToBeginning}
            currentIndex={currentPrayerIndex}
            total={totalPrayers}
          />
        </div>

        {/* Right Panel: Interactive Rosary */}
        <div className="lg:w-2/3 w-full flex items-center justify-center order-1 lg:order-2 sticky top-12 lg:top-0 z-10 h-[360px] lg:h-auto">
          <Rosary
            currentPrayerIndex={currentPrayerIndex}
            onBeadClick={handleBeadClick}
          />
        </div>

      </div>
       <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Creado con devoción. Que esta herramienta te acerque a la paz.</p>
        </footer>
    </div>
  );
};

export default InteractiveRosary;
