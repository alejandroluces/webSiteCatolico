import React, { useEffect, useState } from 'react';
import { Rosary } from '../../interactive-rosary/components/Rosary';
import { PrayerDisplay } from '../../interactive-rosary/components/PrayerDisplay';
import { MysterySelector } from '../../interactive-rosary/components/MysterySelector';
import { Navigation } from '../../interactive-rosary/components/Navigation';
import { useRosary } from '../../interactive-rosary/hooks/useRosary';
import type { MysteryType } from '../../interactive-rosary/types';

const InteractiveRosary: React.FC = () => {
  const [dockRosary, setDockRosary] = useState(false);
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

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 1023px)');

    const updateDockState = () => {
      setDockRosary(mobileQuery.matches && window.scrollY > 220);
    };

    updateDockState();
    window.addEventListener('scroll', updateDockState, { passive: true });
    mobileQuery.addEventListener('change', updateDockState);

    return () => {
      window.removeEventListener('scroll', updateDockState);
      mobileQuery.removeEventListener('change', updateDockState);
    };
  }, []);

  return (
    <main className="rosary-background min-h-screen overflow-x-hidden text-slate-100 selection:bg-sacred-gold-300 selection:text-slate-950">
      <div className="rosary-shell relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-sacred-gold-300">Camino de Fe</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Rosario Interactivo
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-marian-blue-50/85 sm:text-base">
              Una pausa de oración serena para acompañar cada misterio.
            </p>
          </div>
          <div className="rounded-md border border-white/15 bg-slate-950/35 px-3 py-2 text-sm text-white/85 backdrop-blur-md">
            <span className="font-semibold text-sacred-gold-200">{currentPrayerIndex + 1}</span>
            <span className="mx-1 text-white/45">/</span>
            <span>{totalPrayers}</span>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(340px,420px)_minmax(0,1fr)] lg:gap-6">
          <section className="order-2 flex min-h-0 flex-col rounded-lg border border-white/15 bg-slate-950/75 p-4 text-white shadow-2xl shadow-slate-950/35 backdrop-blur-xl sm:p-5 lg:order-1 lg:max-h-[calc(100vh-8.5rem)]">
            <header className="mb-4 border-b border-white/15 pb-4">
              <h2 className="text-2xl font-bold text-white">
                Guía de Oración
              </h2>
            </header>

            <div className="min-h-0 flex-1 overflow-hidden">
              <div className="flex h-full min-h-0 flex-col">
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
            </div>
          </section>

          <section
            className={`order-1 flex items-center justify-center rounded-lg border border-white/10 bg-slate-950/35 p-3 shadow-2xl shadow-slate-950/25 backdrop-blur-sm transition-[transform,box-shadow,background-color] duration-300 lg:static lg:order-2 lg:min-h-[calc(100vh-8.5rem)] lg:p-6 ${
              dockRosary
                ? 'fixed left-4 right-4 top-20 z-40 min-h-0 h-[min(46vh,420px)] bg-slate-950/75 shadow-slate-950/60 sm:left-6 sm:right-6'
                : 'relative z-20 min-h-[min(52vh,460px)]'
            }`}
          >
            <div className="rosary-stage relative flex w-full max-w-[760px] items-center justify-center">
              <Rosary
                currentPrayerIndex={currentPrayerIndex}
                onBeadClick={handleBeadClick}
              />
            </div>
          </section>
          {dockRosary && <div className="order-1 h-[min(52vh,460px)] lg:hidden" aria-hidden="true" />}
        </div>

        <footer className="relative z-10 mt-4 text-center text-xs text-white/65 sm:text-sm">
          Que esta oración te lleve con calma al encuentro con Cristo.
        </footer>
      </div>

      <img
        src="/images/virgin-mary.jpeg"
        alt=""
        className="pointer-events-none fixed h-px w-px opacity-0"
        aria-hidden="true"
      />
      <img
        src="/images/Santisimo.png"
        alt=""
        className="pointer-events-none fixed h-px w-px opacity-0"
        aria-hidden="true"
      />
    </main>
  );
};

export default InteractiveRosary;
