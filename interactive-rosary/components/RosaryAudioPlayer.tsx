import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Volume2 } from 'lucide-react';
import type { MysteryType } from '../types';
import { getRosaryAudioUrl } from '../utils/rosaryAudio';

interface RosaryAudioPlayerProps {
  currentPrayerIndex: number;
  selectedMysteryType: MysteryType;
  totalPrayers: number;
  onGoToPrayer: (index: number) => void;
}

export const RosaryAudioPlayer: React.FC<RosaryAudioPlayerProps> = ({
  currentPrayerIndex,
  selectedMysteryType,
  totalPrayers,
  onGoToPrayer,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingAutoPlayRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [audioError, setAudioError] = useState(false);

  const audioUrl = useMemo(
    () => getRosaryAudioUrl(selectedMysteryType, currentPrayerIndex),
    [currentPrayerIndex, selectedMysteryType],
  );

  const playCurrent = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      setAudioError(false);
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, []);

  const pauseCurrent = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setIsPlaying(false);
  }, []);

  const replayCurrent = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    void playCurrent();
  }, [playCurrent]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setAudioError(false);

    if (pendingAutoPlayRef.current) {
      pendingAutoPlayRef.current = false;
      window.setTimeout(() => {
        void playCurrent();
      }, 80);
    }
  }, [audioUrl, playCurrent]);

  const handleEnded = () => {
    setIsPlaying(false);

    if (!autoAdvance || currentPrayerIndex >= totalPrayers - 1) {
      return;
    }

    pendingAutoPlayRef.current = true;
    onGoToPrayer(currentPrayerIndex + 1);
  };

  const handleError = () => {
    setAudioError(true);
    setIsPlaying(false);
    setAutoAdvance(false);
  };

  return (
    <div className="mb-3 shrink-0 rounded-lg border border-white/15 bg-slate-900/85 p-3 text-white shadow-lg shadow-slate-950/25">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onEnded={handleEnded}
        onError={handleError}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sacred-gold-400 text-slate-950">
            <Volume2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">Rosario guiado</p>
            <p className="truncate text-xs text-marian-blue-50/75">
              Audio {currentPrayerIndex + 1} de {totalPrayers} - {selectedMysteryType}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_auto] gap-2 sm:flex sm:items-center">
          <button
            type="button"
            onClick={isPlaying ? pauseCurrent : playCurrent}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-marian-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-marian-blue-950/30 transition hover:bg-marian-blue-400 focus:outline-none focus:ring-2 focus:ring-sacred-gold-300"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4" aria-hidden="true" />
            )}
            {isPlaying ? 'Pausar' : 'Reproducir'}
          </button>

          <button
            type="button"
            onClick={replayCurrent}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-sacred-gold-300"
            aria-label="Repetir audio actual"
            title="Repetir audio actual"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setAutoAdvance((value) => !value)}
            className={`inline-flex min-h-10 items-center justify-center rounded-md border px-3 py-2 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-sacred-gold-300 ${
              autoAdvance
                ? 'border-sacred-gold-300 bg-sacred-gold-400 text-slate-950'
                : 'border-white/15 bg-white/10 text-white'
            }`}
            aria-pressed={autoAdvance}
          >
            Auto
          </button>
        </div>
      </div>

      {audioError && (
        <p className="mt-2 text-xs font-medium text-sacred-gold-200">
          Audio pendiente. Genera los MP3 con npm run rosary:audio.
        </p>
      )}
    </div>
  );
};
