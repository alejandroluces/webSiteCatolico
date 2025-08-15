import React from 'react';

interface CrucifixProps {
  isActive: boolean;
  onClick: () => void;
  cx: number;
  cy: number;
}

export const Crucifix: React.FC<CrucifixProps> = ({ isActive, onClick, cx, cy }) => {
  const baseFill = "#D29922";
  const activeFill = "#38bdf8";
  const baseStroke = "#a16207";
  const activeStroke = "#0369a1";

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
      className="cursor-pointer group"
      role="button"
      aria-label="Cross, start of the Rosary"
      style={{ transformOrigin }}
    >
      {/* Halo effect for active state, matching the bead glow */}
      {isActive && (
         <path 
          d="M25,5 L25,20 H10 V30 H25 V55 H35 V30 H50 V20 H35 V5 Z" 
          fill="#38bdf8"
          opacity="0.7"
          filter="url(#glow)"
         />
      )}
      <g 
        className="transition-transform duration-300"
        transform={isActive ? `scale(1.1)` : 'scale(1)'}
        style={{ transformOrigin }}
      >
        {/* Simplified Cross Shape */}
        <path 
          d="M25,5 L25,20 H10 V30 H25 V55 H35 V30 H50 V20 H35 V5 Z" 
          fill={isActive ? activeFill : baseFill} 
          stroke={isActive ? activeStroke : baseStroke} 
          strokeWidth="2" 
          strokeLinejoin="round"
          className="transition-colors duration-300"
        />
      </g>
    </g>
  );
};