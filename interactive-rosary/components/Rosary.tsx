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

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 400 380" className="max-w-full" aria-label="Interactive Rosary" style={{ opacity: 2 }}>
        <defs>
          {/* Gradients for beads for a more 3D/shiny look */}
          <radialGradient id="goldBeadGradient" cx="0.25" cy="0.25" r="0.75">
            <stop offset="0%" stopColor="var(--sacred-gold-100)" />
            <stop offset="50%" stopColor="var(--sacred-gold-300)" />
            <stop offset="100%" stopColor="var(--sacred-gold-600)" />
          </radialGradient>
          <radialGradient id="blueBeadGradient" cx="0.25" cy="0.25" r="0.75">
            <stop offset="0%" stopColor="var(--marian-blue-100)" />
            <stop offset="50%" stopColor="var(--marian-blue-300)" />
            <stop offset="100%" stopColor="var(--marian-blue-600)" />
          </radialGradient>
          <radialGradient id="activeBeadGradient" cx="0.25" cy="0.25" r="0.75">
            <stop offset="0%" stopColor="var(--marian-blue-200)" />
            <stop offset="50%" stopColor="var(--marian-blue-400)" />
            <stop offset="100%" stopColor="var(--marian-blue-700)" />
          </radialGradient>
           <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Lines connecting beads */}
        <path d={CHAIN_PATH} stroke="var(--sacred-gold-700)" strokeWidth="0.75" fill="none" opacity="0.5"/>

        {/* Centerpiece */}
        <Centerpiece cx={CENTERPIECE_POSITION.cx} cy={CENTERPIECE_POSITION.cy} />

        {/* Render beads */}
        {VISUAL_BEAD_LAYOUT.map((bead, visualIndex) => {
          const isActive = visualIndex === activeVisualIndex;
          
          if (visualIndex === 0) { // Crucifix is always at visual index 0
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
            <g key={visualIndex} onClick={() => handleVisualBeadClick(visualIndex)} className="cursor-pointer group" role="button" aria-label={`Prayer bead ${visualIndex + 1}`}>
                {/* Halo effect for active bead */}
                 {isActive && (
                    <circle
                        cx={bead.cx}
                        cy={bead.cy}
                        r={bead.r + 2}
                        fill="var(--marian-blue-400)"
                        opacity="0.7"
                        filter="url(#glow)"
                    />
                 )}
                <circle
                    cx={bead.cx}
                    cy={bead.cy}
                    r={bead.r}
                    fill={isActive ? "url(#activeBeadGradient)" : `url(#${bead.type === 'major' ? 'blueBeadGradient' : 'goldBeadGradient'})`}
                    stroke={isActive ? "var(--marian-blue-700)" : "var(--sacred-gold-700)"}
                    strokeWidth="0.75"
                    className="transition-all duration-300 group-hover:stroke-marian-blue-500"
                    style={{ transformOrigin: `${bead.cx}px ${bead.cy}px` }}
                    transform={isActive ? 'scale(1.2)' : 'scale(1)'}
                />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
