
import React from 'react';
import { Rosary } from './components/Rosary';
import { PrayerDisplay } from './components/PrayerDisplay';
import { MysterySelector } from './components/MysterySelector';
import { Navigation } from './components/Navigation';
import { useRosary } from './hooks/useRosary';
import type { MysteryType } from './types';

const App: React.FC = () => {
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
    <div className="bg-gradient-to-br from-gray-50 to-blue-100 min-h-screen text-gray-800 flex flex-col items-center justify-center p-4 selection:bg-blue-200">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Left Panel: Controls and Prayer Display */}
        <div className="lg:w-1/3 w-full bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 lg:p-8 flex flex-col order-2 lg:order-1 h-full lg:max-h-[90vh]">
          <header className="text-center mb-6 border-b border-gray-300 pb-4">
            <h1 className="text-4xl font-bold text-gray-700 font-serif">Rosario Interactivo</h1>
            <p className="text-gray-500 mt-1">Una guía para la oración y meditación</p>
          </header>
          
          <MysterySelector
            selectedMystery={selectedMysteryType}
            dayRecommendedMystery={dayRecommendedMystery}
            onSelectMystery={(mystery: MysteryType) => selectMysteryType(mystery)}
          />

          <PrayerDisplay
            prayer={currentPrayer}
            mystery={currentMystery}
            currentPrayerIndex={currentPrayerIndex}
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
        <div className="lg:w-2/3 w-full flex items-center justify-center order-1 lg:order-2">
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

export default App;
