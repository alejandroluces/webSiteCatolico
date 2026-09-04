import React from 'react';

interface CenterpieceProps {
  cx: number;
  cy: number;
}

export const Centerpiece: React.FC<CenterpieceProps> = ({ cx, cy }) => {
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <defs>
        <radialGradient id="centerpieceGradient" cx="32%" cy="22%" r="78%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="38%" stopColor="#dbeafe" />
          <stop offset="72%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#2563eb" />
        </radialGradient>
        <linearGradient id="centerpieceBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff4c2" />
          <stop offset="48%" stopColor="#d29922" />
          <stop offset="100%" stopColor="#8a4f08" />
        </linearGradient>
      </defs>
      <path
        d="M0,-32 L5,-22 L13,-26 L13,-15 L24,-16 L17,-7 L27,0 L17,7 L24,16 L13,15 L13,26 L5,22 L0,32 L-5,22 L-13,26 L-13,15 L-24,16 L-17,7 L-27,0 L-17,-7 L-24,-16 L-13,-15 L-13,-26 L-5,-22 Z"
        fill="rgba(255,232,136,0.16)"
      />
      <path 
        d="M0,-22 L5,-18 L12,-18 L18,-12 L20,-5 L20,5 L18,12 L12,18 L5,18 L0,22 L-5,18 L-12,18 L-18,12 L-20,5 L-20,-5 L-18,-12 L-12,-18 L-5,-18 Z"
        fill="url(#centerpieceBorder)"
        stroke="#f8d376"
        strokeWidth="1.1"
        filter="url(#beadShadow)"
      />
      <ellipse 
        cx="0" 
        cy="0" 
        rx="15.4" 
        ry="19.2" 
        fill="url(#centerpieceGradient)" 
        stroke="#e9c56a"
        strokeWidth="1.1"
      />
      <path
        d="M-7,-7 C-2,-12 2,-12 7,-7"
        fill="none"
        stroke="rgba(255,255,255,0.72)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <text 
        x="0" y="5" 
        fontFamily="Merriweather, serif" 
        fontSize="18" 
        fill="#1e3a8a"
        textAnchor="middle"
        fontWeight="bold"
        paintOrder="stroke"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="0.7"
       >
        M
      </text>
    </g>
  );
};
