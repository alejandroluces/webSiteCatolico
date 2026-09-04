import React from 'react';
import { 
  VISUAL_BEAD_LAYOUT, 
  CHAIN_PATH, 
  CENTERPIECE_POSITION, 
  PRAYER_TO_VISUAL_MAP,
  VISUAL_TO_PRAYER_MAP
} from '../constants/rosaryLayout';
import { Crucifix } from './Crucifix';
import { Centerpiece } from './Centerpiece';

interface RosaryProps {
  currentPrayerIndex: number;
  onBeadClick: (index: number) => void;
}

export const Rosary: React.FC<RosaryProps> = ({ currentPrayerIndex, onBeadClick }) => {
  const activeVisualIndex = PRAYER_TO_VISUAL_MAP[currentPrayerIndex];
  
  const handleVisualBeadClick = (visualIndex: number) => {
    const prayerIndex = VISUAL_TO_PRAYER_MAP[visualIndex];
    if (prayerIndex !== undefined) {
      onBeadClick(prayerIndex);
    }
  };

  const handleVisualBeadKeyDown = (event: React.KeyboardEvent<SVGGElement>, visualIndex: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleVisualBeadClick(visualIndex);
    }
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="pointer-events-none absolute inset-4 rounded-full border border-sacred-gold-300/10 bg-[radial-gradient(ellipse_at_center,rgba(255,245,210,0.10),rgba(8,19,38,0.04)_46%,rgba(8,19,38,0)_70%)] blur-[1px]" />
      <svg viewBox="0 0 400 380" className="relative h-full w-full max-h-[720px] drop-shadow-[0_30px_54px_rgba(0,0,0,0.55)]" aria-label="Rosario interactivo">
        <defs>
          <linearGradient id="chainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8f5f12" />
            <stop offset="42%" stopColor="var(--sacred-gold-200)" />
            <stop offset="100%" stopColor="#b7791f" />
          </linearGradient>

          <radialGradient id="goldBeadGradient" cx="32%" cy="24%" r="76%">
            <stop offset="0%" stopColor="#fff8cc" />
            <stop offset="34%" stopColor="#ffd85a" />
            <stop offset="68%" stopColor="#f1a914" />
            <stop offset="100%" stopColor="#8a4f08" />
          </radialGradient>

          <radialGradient id="blueBeadGradient" cx="32%" cy="24%" r="76%">
            <stop offset="0%" stopColor="#f6fbff" />
            <stop offset="40%" stopColor="#9bd9ff" />
            <stop offset="76%" stopColor="#2388d7" />
            <stop offset="100%" stopColor="#07528c" />
          </radialGradient>

          <radialGradient id="activeBeadGradient" cx="30%" cy="20%" r="82%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="32%" stopColor="#ffef9b" />
            <stop offset="70%" stopColor="#29a8ff" />
            <stop offset="100%" stopColor="#075985" />
          </radialGradient>

          <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="beadShadow" x="-70%" y="-70%" width="240%" height="240%">
            <feDropShadow dx="0" dy="2.2" stdDeviation="1.7" floodColor="#000000" floodOpacity="0.5" />
          </filter>

          <filter id="chainShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.1" floodColor="#000000" floodOpacity="0.45" />
          </filter>
        </defs>

        <ellipse cx="200" cy="118" rx="126" ry="96" fill="none" stroke="rgba(255,232,136,0.16)" strokeWidth="0.8" />
        <ellipse cx="200" cy="118" rx="103" ry="78" fill="rgba(4,12,27,0.16)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
        
        <path d={CHAIN_PATH} stroke="rgba(56,39,12,0.9)" strokeWidth="3.2" fill="none" opacity="0.34" filter="url(#chainShadow)" />
        <path d={CHAIN_PATH} stroke="url(#chainGradient)" strokeWidth="1.45" fill="none" opacity="0.95" />

        <Centerpiece cx={CENTERPIECE_POSITION.cx} cy={CENTERPIECE_POSITION.cy} />

        {VISUAL_BEAD_LAYOUT.map((bead, visualIndex) => {
          const isActive = visualIndex === activeVisualIndex;
          
          if (visualIndex === 0) {
            return (
              <Crucifix 
                key={visualIndex} 
                cx={bead.cx}
                cy={bead.cy}
                isActive={isActive} 
                onClick={() => handleVisualBeadClick(visualIndex)} 
              />
            );
          }

          return (
            <g
              key={visualIndex}
              onClick={() => handleVisualBeadClick(visualIndex)}
              onKeyDown={(event) => handleVisualBeadKeyDown(event, visualIndex)}
              className="group cursor-pointer focus:outline-none"
              role="button"
              aria-label={`Cuenta ${visualIndex + 1}`}
              tabIndex={0}
            >
              <circle
                cx={bead.cx}
                cy={bead.cy}
                r={Math.max(bead.r + 6, 11)}
                fill="transparent"
              />
              {isActive && (
                <>
                  <circle
                    cx={bead.cx}
                    cy={bead.cy}
                    r={bead.r + 5.5}
                    fill="rgba(14,165,233,0.44)"
                    filter="url(#glow)"
                  />
                  <circle
                    cx={bead.cx}
                    cy={bead.cy}
                    r={bead.r + 3}
                    fill="none"
                    stroke="var(--sacred-gold-100)"
                    strokeWidth="1.4"
                    opacity="0.96"
                  />
                </>
              )}
              <circle
                cx={bead.cx}
                cy={bead.cy}
                r={bead.r}
                fill={isActive ? 'url(#activeBeadGradient)' : `url(#${bead.type === 'major' ? 'blueBeadGradient' : 'goldBeadGradient'})`}
                stroke={isActive ? '#fff1a8' : bead.type === 'major' ? '#f7d678' : '#b8750d'}
                strokeWidth={isActive ? 1.35 : 0.9}
                filter="url(#beadShadow)"
                className="transition-all duration-300 group-hover:stroke-white"
                style={{ transformOrigin: `${bead.cx}px ${bead.cy}px` }}
                transform={isActive ? 'scale(1.26)' : 'scale(1)'}
              />
              <circle
                cx={bead.cx - bead.r * 0.34}
                cy={bead.cy - bead.r * 0.36}
                r={Math.max(bead.r * 0.24, 1.3)}
                fill="rgba(255,255,255,0.72)"
                opacity={isActive ? 0.95 : 0.68}
                pointerEvents="none"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
