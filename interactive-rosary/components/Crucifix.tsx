import React from 'react';

interface CrucifixProps {
  isActive: boolean;
  onClick: () => void;
  cx: number;
  cy: number;
}

export const Crucifix: React.FC<CrucifixProps> = ({ isActive, onClick, cx, cy }) => {
  const baseFill = "url(#crucifixGold)";
  const activeFill = "url(#crucifixBlue)";
  const baseStroke = "#f2c25e";
  const activeStroke = "#bae6fd";

  // The cross path's top-center is at (x=30, y=5) within its own coordinate system.
  // The scale is 0.8.
  // We calculate the translation needed to place the scaled top-center of the cross
  // at the exact (cx, cy) coordinates provided, which corresponds to the end of the chain.
  const scale = 0.8;
  const pathCenterX = 30;
  const pathTopY = 5;
  
  const translateX = cx - (pathCenterX * scale);
  const translateY = cy - (pathTopY * scale);
  const transformOrigin = `${pathCenterX}px ${pathTopY}px`;

  return (
    <g 
      transform={`translate(${translateX}, ${translateY}) scale(${scale})`} 
      onClick={onClick} 
      className="group cursor-pointer"
      role="button"
      aria-label="Cross, start of the Rosary"
      style={{ transformOrigin }}
    >
      <defs>
        <linearGradient id="crucifixGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff4b8" />
          <stop offset="45%" stopColor="#d99a19" />
          <stop offset="100%" stopColor="#8a4f08" />
        </linearGradient>
        <linearGradient id="crucifixBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="48%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>
      {isActive && (
         <path 
          d="M25,5 L25,20 H10 V30 H25 V55 H35 V30 H50 V20 H35 V5 Z" 
          fill="#38bdf8"
          opacity="0.62"
          filter="url(#glow)"
         />
      )}
      <g 
        className="transition-transform duration-300"
        transform={isActive ? `scale(1.1)` : 'scale(1)'}
        style={{ transformOrigin }}
      >
        <path 
          d="M25,5 L25,20 H10 V30 H25 V55 H35 V30 H50 V20 H35 V5 Z" 
          fill="rgba(0,0,0,0.28)" 
          transform="translate(2.2 2.8)"
          opacity="0.7"
        />
        <path 
          d="M25,5 L25,20 H10 V30 H25 V55 H35 V30 H50 V20 H35 V5 Z" 
          fill={isActive ? activeFill : baseFill} 
          stroke={isActive ? activeStroke : baseStroke} 
          strokeWidth="2" 
          strokeLinejoin="round"
          className="transition-colors duration-300"
          filter="url(#beadShadow)"
        />
        <path
          d="M30,8 V52 M13,25 H47"
          stroke="rgba(255,255,255,0.42)"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.72"
        />
      </g>
    </g>
  );
};
