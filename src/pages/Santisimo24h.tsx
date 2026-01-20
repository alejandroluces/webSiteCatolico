import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Maximize, Minimize, Volume2, VolumeX } from 'lucide-react';
import { getSantisimoVideoForDate } from '../utils/santisimoVideo';

function formatHHMM(date: Date) {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

const Santisimo24h: React.FC = () => {
  const { dayLabel, publicSrc, filename } = useMemo(
    () => getSantisimoVideoForDate(new Date()),
    []
  );

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  // Para que autoplay funcione en la mayoría de navegadores, debe estar muteado.
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [liveTime, setLiveTime] = useState(() => formatHHMM(new Date()));
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const tick = () => setLiveTime(formatHHMM(new Date()));
    // Actualiza cada 10s para que cambie rápido al minuto.
    const id = window.setInterval(tick, 10_000);
    tick();
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handler);
    handler();
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }
      // Preferimos pantalla completa del contenedor para mantener overlays/estilos.
      const el = videoContainerRef.current ?? videoRef.current;
      if (el?.requestFullscreen) {
        await el.requestFullscreen();
      }
    } catch {
      // Si el navegador bloquea, no hacemos nada.
    }
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume;
  }, [volume]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-marian-blue-50/30 to-sacred-gold-50/20 dark:bg-gray-900">
      {/* Hero */}
      <section
        className="relative overflow-hidden border-b border-gray-200/60 dark:border-gray-800/80"
        style={{
          backgroundImage: "url('/images/Santisimo.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-18">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow">
              Exposición del Santísimo 24h
            </h1>
            <p className="mt-4 text-lg text-white/90 max-w-3xl mx-auto">
              Un espacio para detenernos, contemplar y orar. Cada día mostramos un video distinto.
            </p>
            <p className="mt-3 text-sm text-white/80">
              Video de hoy: <span className="font-semibold">{dayLabel}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/60 dark:border-gray-700 overflow-hidden">
            {filename ? (
              <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Señal: <span className="font-medium">Adoración Perpetua</span>
                    <span className="mx-2 opacity-60">•</span>
                    <span className="opacity-90">{dayLabel}</span>
                  </div>
                  {/* Controles propios (sin barra de tiempo) */}
                  <div className="flex items-center gap-3 flex-wrap justify-end">
                    <button
                      type="button"
                      onClick={() => void toggleFullscreen()}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-gray-900/5 hover:bg-gray-900/10 text-gray-900 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white transition-colors"
                      aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                      title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                    >
                      {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                      {isFullscreen ? 'Salir' : 'Pantalla completa'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setMuted((m) => !m)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-marian-blue-50 hover:bg-marian-blue-100 text-marian-blue-900 dark:bg-gray-700 dark:hover:bg-gray-650 dark:text-white transition-colors"
                      aria-label={muted ? 'Activar sonido' : 'Silenciar'}
                    >
                      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      {muted ? 'Silencio' : 'Sonido'}
                    </button>

                    <div className="flex items-center gap-2">
                      <input
                        aria-label="Volumen"
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={muted ? 0 : volume}
                        onChange={(e) => {
                          const next = Number(e.target.value);
                          setVolume(next);
                          if (next > 0) setMuted(false);
                          if (next === 0) setMuted(true);
                        }}
                        className="w-32 accent-marian-blue-700 dark:accent-sacred-gold-400"
                      />
                    </div>
                  </div>
                </div>

                <div
                  ref={videoContainerRef}
                  className="relative w-full aspect-video bg-black rounded-xl overflow-hidden"
                >
                  {/* Capa tipo "stream" */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-bold tracking-wide">
                      <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      EN VIVO
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-black/70 text-white text-xs font-semibold">
                        Online
                      </span>
                      <span className="px-3 py-1 rounded-full bg-black/70 text-white text-xs font-semibold tabular-nums">
                        {liveTime}
                      </span>
                    </div>
                  </div>

                  <video
                    key={publicSrc}
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full"
                    src={publicSrc}
                    loop
                    autoPlay
                    playsInline
                    muted={muted}
                    // Cuando está muteado dejamos el volumen en el valor actual, pero el navegador lo silencia.
                    // Cuando desmuteas, se vuelve a escuchar con el valor del slider.
                    onEnded={() => {
                      // Con loop debería bastar, pero esto asegura reinicio incluso si el navegador ignora loop.
                      const v = videoRef.current;
                      if (!v) return;
                      v.currentTime = 0;
                      void v.play();
                    }}
                  />
                </div>

                <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  <p>
                    Nota: el reproductor está en modo “en vivo”, por eso no mostramos barra de tiempo.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center text-gray-800 dark:text-gray-200">
                <div className="text-2xl font-serif font-bold mb-2">No hay transmisión en vivo</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  En breve estará disponible.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Santisimo24h;
