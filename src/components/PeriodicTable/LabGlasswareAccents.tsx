import React from 'react';

export const LabBeakerAccent: React.FC = () => {
  return (
    <div className="relative w-28 h-28 select-none pointer-events-none drop-shadow-[0_0_20px_rgba(6,182,212,0.45)]">
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Liquid gradient */}
          <linearGradient id="beakerLiquid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.95" />
          </linearGradient>

          {/* Glass sheen */}
          <linearGradient id="glassSheen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
          </linearGradient>

          <filter id="neonCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Flask Glow Aura */}
        <path
          d="M 50 16 L 70 16 L 70 38 L 102 96 C 105 102 100 108 94 108 L 26 108 C 20 108 15 102 18 96 L 50 38 Z"
          fill="rgba(6, 182, 212, 0.08)"
          filter="url(#neonCyanGlow)"
        />

        {/* Liquid Inside Flask */}
        <clipPath id="flaskLiquidClip">
          <path d="M 50 16 L 70 16 L 70 38 L 102 96 C 105 102 100 108 94 108 L 26 108 C 20 108 15 102 18 96 L 50 38 Z" />
        </clipPath>

        <g clipPath="url(#flaskLiquidClip)">
          {/* Liquid Body */}
          <path
            d="M 10 62 Q 60 56 110 62 L 110 115 L 10 115 Z"
            fill="url(#beakerLiquid)"
          />
          {/* Meniscus wave */}
          <path
            d="M 28 62 Q 60 58 92 62 Q 60 66 28 62"
            fill="#67e8f9"
            opacity="0.8"
          />

          {/* Rising bubbles inside liquid */}
          <circle cx="48" cy="95" r="3.5" fill="#ffffff" opacity="0.8" className="animate-bubble-1" />
          <circle cx="68" cy="90" r="2.5" fill="#e0f2fe" opacity="0.75" className="animate-bubble-2" />
          <circle cx="58" cy="100" r="4" fill="#ffffff" opacity="0.85" className="animate-bubble-3" />
          <circle cx="38" cy="85" r="2" fill="#bae6fd" opacity="0.7" className="animate-bubble-4" />
          <circle cx="78" cy="98" r="3" fill="#ffffff" opacity="0.8" className="animate-bubble-5" />

          {/* Graduations marks */}
          <line x1="38" y1="72" x2="48" y2="72" stroke="#ffffff" strokeWidth="1.2" opacity="0.6" />
          <line x1="33" y1="84" x2="45" y2="84" stroke="#ffffff" strokeWidth="1.2" opacity="0.6" />
          <line x1="28" y1="96" x2="42" y2="96" stroke="#ffffff" strokeWidth="1.2" opacity="0.6" />
        </g>

        {/* Glass Flask Outline */}
        <path
          d="M 48 16 L 72 16 M 52 16 L 52 38 L 20 96 C 17 102 21 108 27 108 L 93 108 C 99 108 103 102 100 96 L 68 38 L 68 16"
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Flask Rim Top */}
        <ellipse cx="60" cy="16" rx="12" ry="2.5" stroke="#38bdf8" strokeWidth="2" fill="rgba(255,255,255,0.15)" />

        {/* Glass light reflection streak */}
        <path
          d="M 54 38 L 30 84"
          stroke="url(#glassSheen)"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Rising vapor bubbles above flask */}
        <circle cx="56" cy="10" r="2" fill="#38bdf8" opacity="0.6" className="animate-bubble-2" />
        <circle cx="64" cy="5" r="3" fill="#67e8f9" opacity="0.5" className="animate-bubble-4" />
      </svg>
    </div>
  );
};

export const LabTestTubesAccent: React.FC = () => {
  return (
    <div className="relative w-28 h-28 select-none pointer-events-none drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="tubeCyan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="tubeIndigo" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="tubeMagenta" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#c026d3" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Wooden / Glass Rack Base */}
        <rect x="15" y="98" width="90" height="8" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
        <rect x="20" y="56" width="80" height="5" rx="2" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />

        {/* Tube 1 (Cyan) */}
        <g>
          {/* Glass tube body */}
          <path
            d="M 28 25 L 28 85 A 7 7 0 0 0 42 85 L 42 25"
            stroke="#38bdf8"
            strokeWidth="1.8"
            fill="rgba(56, 189, 248, 0.05)"
          />
          {/* Liquid */}
          <path
            d="M 29 48 L 29 85 A 6 6 0 0 0 41 85 L 41 48 Z"
            fill="url(#tubeCyan)"
          />
          {/* Meniscus */}
          <ellipse cx="35" cy="48" rx="6" ry="1.5" fill="#67e8f9" />
          {/* Bubbles */}
          <circle cx="34" cy="74" r="1.8" fill="#ffffff" className="animate-bubble-1" />
          <circle cx="37" cy="62" r="1.3" fill="#ffffff" className="animate-bubble-3" />
          {/* Rim */}
          <ellipse cx="35" cy="25" rx="8" ry="2" stroke="#38bdf8" strokeWidth="1.5" />
        </g>

        {/* Tube 2 (Indigo) */}
        <g>
          <path
            d="M 53 20 L 53 85 A 7 7 0 0 0 67 85 L 67 20"
            stroke="#818cf8"
            strokeWidth="1.8"
            fill="rgba(129, 140, 248, 0.05)"
          />
          <path
            d="M 54 38 L 54 85 A 6 6 0 0 0 66 85 L 66 38 Z"
            fill="url(#tubeIndigo)"
          />
          <ellipse cx="60" cy="38" rx="6" ry="1.5" fill="#a5b4fc" />
          <circle cx="59" cy="68" r="1.8" fill="#ffffff" className="animate-bubble-2" />
          <circle cx="62" cy="54" r="1.3" fill="#ffffff" className="animate-bubble-4" />
          <ellipse cx="60" cy="20" rx="8" ry="2" stroke="#818cf8" strokeWidth="1.5" />
        </g>

        {/* Tube 3 (Magenta) */}
        <g>
          <path
            d="M 78 28 L 78 85 A 7 7 0 0 0 92 85 L 92 28"
            stroke="#f472b6"
            strokeWidth="1.8"
            fill="rgba(244, 114, 182, 0.05)"
          />
          <path
            d="M 79 55 L 79 85 A 6 6 0 0 0 91 85 L 91 55 Z"
            fill="url(#tubeMagenta)"
          />
          <ellipse cx="85" cy="55" rx="6" ry="1.5" fill="#fbcfe8" />
          <circle cx="84" cy="78" r="1.8" fill="#ffffff" className="animate-bubble-5" />
          <circle cx="86" cy="65" r="1.3" fill="#ffffff" className="animate-bubble-1" />
          <ellipse cx="85" cy="28" rx="8" ry="2" stroke="#f472b6" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};
