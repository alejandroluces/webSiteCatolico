import React from 'react';

interface CenterpieceProps {
  cx: number;
  cy: number;
}

export const Centerpiece: React.FC<CenterpieceProps> = ({ cx, cy }) => {
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <defs>
         <linearGradient id="centerpieceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C7D2FE" />
            <stop offset="100%" stopColor="#A5B4FC" />
        </linearGradient>
         <linearGradient id="centerpieceBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE08D" />
            <stop offset="100%" stopColor="#D29922" />
        </linearGradient>
      </defs>
      {/* Decorative Border */}
      <path 
        d="M0,-22 L5,-18 L12,-18 L18,-12 L20,-5 L20,5 L18,12 L12,18 L5,18 L0,22 L-5,18 L-12,18 L-18,12 L-20,5 L-20,-5 L-18,-12 L-12,-18 L-5,-18 Z"
        fill="url(#centerpieceBorder)"
        stroke="#a16207"
        strokeWidth="1"
      />
      {/* Main body */}
      <ellipse 
        cx="0" 
        cy="0" 
        rx="15" 
        ry="19" 
        fill="url(#centerpieceGradient)" 
        stroke="#4F46E5"
        strokeWidth="1"
      />
       <text 
        x="0" y="5" 
        fontFamily="Cormorant Garamond, serif" 
        fontSize="18" 
        fill="#312e81"
        textAnchor="middle"
        fontWeight="bold"
       >
        M
       </text>
    </g>
  );
};