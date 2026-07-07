import { useState } from 'react';

export type Hotspot = {
  id: string;
  name: string;
  x: number;
  y: number;
  level: 'crimson' | 'amber';
  size: 'large' | 'medium' | 'small';
};

const HOTSPOTS: Hotspot[] = [
  { id: 'jamtara', name: 'Jamtara (Jharkhand)', x: 65, y: 45, level: 'amber', size: 'large' },
  { id: 'mewat', name: 'Mewat (Haryana)', x: 35, y: 35, level: 'crimson', size: 'large' },
  { id: 'ahmedabad', name: 'Ahmedabad (Gujarat)', x: 15, y: 55, level: 'amber', size: 'medium' },
  { id: 'ncr', name: 'NCR (Delhi)', x: 38, y: 32, level: 'crimson', size: 'medium' },
  { id: 'bengaluru', name: 'Bengaluru (Karnataka)', x: 35, y: 80, level: 'amber', size: 'medium' },
  { id: 'mumbai', name: 'Mumbai (Maharashtra)', x: 20, y: 65, level: 'amber', size: 'small' },
  { id: 'hyderabad', name: 'Hyderabad (Telangana)', x: 40, y: 68, level: 'amber', size: 'small' },
];

export default function IndiaMap({ selectedId, onSelect }: { selectedId: string | null, onSelect: (id: string) => void }) {
  return (
    <div className="relative w-full h-full bg-[#0A1628] rounded border border-border flex items-center justify-center overflow-hidden glass-panel">
      {/* Abstract India Map SVG */}
      <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] opacity-80" preserveAspectRatio="xMidYMid meet">
        {/* Simplified India Path */}
        <path 
          d="M 30,15 L 40,5 L 50,15 L 60,25 L 80,35 L 90,45 L 85,55 L 75,55 L 65,65 L 50,95 L 35,85 L 25,75 L 15,60 L 5,50 L 15,40 L 25,35 Z" 
          fill="rgba(13, 19, 33, 0.5)" 
          stroke="#1F2937" 
          strokeWidth="0.5" 
        />
        {/* State dividers abstract */}
        <path d="M 30,15 L 35,35 M 40,5 L 50,30 M 50,15 L 65,45 M 60,25 L 80,35 M 85,55 L 65,45 M 75,55 L 65,65 M 65,65 L 50,30 M 50,95 L 35,85 M 35,85 L 35,35 M 25,75 L 35,85 M 15,60 L 35,35 M 15,40 L 25,35" stroke="#1F2937" strokeWidth="0.2" fill="none" opacity="0.5" />
        
        {HOTSPOTS.map((spot) => (
          <g key={spot.id} onClick={() => onSelect(spot.id)} className="cursor-pointer">
            <circle 
              cx={spot.x} 
              cy={spot.y} 
              r={spot.size === 'large' ? 4 : spot.size === 'medium' ? 3 : 2} 
              fill={spot.level === 'crimson' ? '#EF4444' : '#F59E0B'} 
              opacity="0.3"
            >
              <animate attributeName="r" values={`${spot.size === 'large' ? 2 : 1};${spot.size === 'large' ? 8 : 5}`} dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle 
              cx={spot.x} 
              cy={spot.y} 
              r={spot.size === 'large' ? 1.5 : spot.size === 'medium' ? 1 : 0.8} 
              fill={spot.level === 'crimson' ? '#EF4444' : '#F59E0B'} 
            />
            {selectedId === spot.id && (
              <circle cx={spot.x} cy={spot.y} r="5" stroke="#F9FAFB" strokeWidth="0.5" fill="none" />
            )}
          </g>
        ))}
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-[#0D1321]/80 backdrop-blur border border-border p-2 rounded text-[10px] font-mono space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse"></div>
          <span className="text-slate-300">CRITICAL THREAT</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse"></div>
          <span className="text-slate-300">ACTIVE SURVEILLANCE</span>
        </div>
      </div>
    </div>
  );
}
