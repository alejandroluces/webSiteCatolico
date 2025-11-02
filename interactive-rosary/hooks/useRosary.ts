import { useState, useMemo, useCallback } from 'react';
import { ROSARY_SEQUENCE, PRAYERS, MYSTERIES } from '../constants/rosaryData';
import { MysteryType, Prayer, Mystery } from '../types';

const getDayMystery = (): MysteryType => {
  const day = new Date().getDay(); // Sunday - 0, Monday - 1, etc.
  switch (day) {
    case 1: // Monday
    case 6: // Saturday
      return MysteryType.Joyful;
    case 3: // Wednesday
    case 0: // Sunday
      return MysteryType.Glorious;
    case 2: // Tuesday
    case 5: // Friday
      return MysteryType.Sorrowful;
    case 4: // Thursday
      return MysteryType.Luminous;
    default:
      return MysteryType.Joyful;
  }
};

export const useRosary = () => {
  const dayRecommendedMystery = getDayMystery();
  const [selectedMysteryType, setSelectedMysteryType] = useState<MysteryType>(dayRecommendedMystery);
  const [currentPrayerIndex, setCurrentPrayerIndex] = useState(0);

  const totalPrayers = ROSARY_SEQUENCE.length;

  const currentBead = ROSARY_SEQUENCE[currentPrayerIndex];
  
  const currentPrayer = useMemo((): Prayer | null => {
    let prayerData: Prayer | null;

    if (currentBead.prayerKey === 'mystery_announcement') {
      const mysteries = MYSTERIES[selectedMysteryType];
      const mystery = mysteries[currentBead.mysteryIndex ?? 0];
      prayerData = { name: mystery.name, text: mystery.announcement };
    } else if (currentBead.prayerKey === 'apostles_creed') {
      prayerData = PRAYERS.sign_of_cross;
    } else {
      prayerData = PRAYERS[currentBead.prayerKey];
    }

    // Return a new object to ensure re-render even if the prayer is the same
    return prayerData ? { ...prayerData } : null;
  }, [currentPrayerIndex, selectedMysteryType, currentBead]);

  const currentMystery = useMemo((): Mystery | null => {
    if (currentBead.mysteryIndex !== undefined) {
      const mysteries = MYSTERIES[selectedMysteryType];
      return mysteries[currentBead.mysteryIndex];
    }
    // Find the current or next mystery
    for (let i = currentPrayerIndex; i < ROSARY_SEQUENCE.length; i++) {
        const bead = ROSARY_SEQUENCE[i];
        if (bead.mysteryIndex !== undefined) {
            return MYSTERIES[selectedMysteryType][bead.mysteryIndex];
        }
    }
    return null;
  }, [currentPrayerIndex, selectedMysteryType]);

  const goToNextPrayer = useCallback(() => {
    setCurrentPrayerIndex((prev) => Math.min(prev + 1, totalPrayers - 1));
  }, [totalPrayers]);

  const goToPreviousPrayer = useCallback(() => {
    setCurrentPrayerIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const selectMysteryType = useCallback((mysteryType: MysteryType) => {
    setSelectedMysteryType(mysteryType);
    // If we are in the middle of mysteries, stay at the same relative position
    const currentBead = ROSARY_SEQUENCE[currentPrayerIndex];
    if (currentBead.mysteryIndex === undefined) {
        // If we are in the intro, reset to beginning to avoid confusion
        setCurrentPrayerIndex(0);
    }
  }, [currentPrayerIndex]);

  const handleBeadClick = useCallback((index: number) => {
    setCurrentPrayerIndex(index);
  }, []);

  const resetToBeginning = useCallback(() => {
    setCurrentPrayerIndex(0);
  }, []);

  return {
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
  };
};
