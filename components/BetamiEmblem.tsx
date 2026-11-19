'use client';

import React from 'react';

/**
 * BetamiEmblem — "pajangan" dekoratif berbentuk emblem bulat seperti logo PT BETAMI,
 * namun isinya berupa foto hamparan kebun sawit (dari atas) yang diberi warna
 * korporat hijau-emas. Dipakai sebagai hiasan pada halaman.
 */
export default function BetamiEmblem({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 340 340" className={className} role="img" aria-label="Emblem dekoratif PT BETAMI dengan foto kebun sawit">
      <defs>
        <clipPath id="betamiDisc">
          <circle cx="170" cy="170" r="130" />
        </clipPath>
        <linearGradient id="betamiRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="45%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
        <linearGradient id="betamiWash" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f766e" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#0ea5a4" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.5" />
        </linearGradient>
        <radialGradient id="betamiGlow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="170" cy="170" r="166" fill="url(#betamiGlow)" />

      {/* Foto kebun sawit di dalam emblem (foto dari atas) + lapisan warna korporat */}
      <g clipPath="url(#betamiDisc)">
        <image href="/images/aerial-palm-estate.jpg" x="0" y="0" width="340" height="340" preserveAspectRatio="xMidYMid slice" />
        <rect width="340" height="340" fill="url(#betamiWash)" />
      </g>

      {/* Siluet daun sawit bergaya logo BETAMI di atas foto */}
      <g transform="translate(170,150)" fill="none" stroke="#ffffff" strokeOpacity="0.85" strokeLinecap="round">
        <path d="M0 -34 C-14 -22 -40 -14 -58 -12" strokeWidth="4" />
        <path d="M0 -34 C14 -22 40 -14 58 -12" strokeWidth="4" />
        <path d="M0 -26 C-16 -12 -38 4 -46 20" strokeWidth="3.2" />
        <path d="M0 -26 C16 -12 38 4 46 20" strokeWidth="3.2" />
        <path d="M0 -14 C-12 0 -24 16 -28 30" strokeWidth="2.6" />
        <path d="M0 -14 C12 0 24 16 28 30" strokeWidth="2.6" />
        <path d="M0 -6 L-5 26 C-6 31 -2 35 0 35 C2 35 6 31 5 26 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
        <circle cx="0" cy="16" r="4.5" fill="#fef3c7" stroke="none" />
      </g>

      {/* Cincin dekoratif emas-teal */}
      <circle cx="170" cy="170" r="130" fill="none" stroke="url(#betamiRing)" strokeWidth="9" />
      <circle cx="170" cy="170" r="141" fill="none" stroke="#0f766e" strokeWidth="2" strokeDasharray="5 9" opacity="0.65" />
      <circle cx="170" cy="170" r="119" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.5" />

      {/* Titik aksen */}
      {[0, 90, 180, 270].map((deg) => (
        <circle key={deg} cx={170 + 141 * Math.cos((deg * Math.PI) / 180)} cy={170 + 141 * Math.sin((deg * Math.PI) / 180)} r="4" fill="#fbbf24" stroke="#0f766e" strokeWidth="1.5" />
      ))}

      {/* Pita nama perusahaan */}
      <g transform="translate(170,300)">
        <path d="M-96 0 L96 0 L82 -26 L-82 -26 Z" fill="#0f766e" />
        <text x="0" y="-7" textAnchor="middle" fontSize="19" fontWeight="800" fill="#ffffff" fontFamily="Inter, 'Segoe UI', Arial, sans-serif" letterSpacing="1.5">PT BETAMI</text>
        <text x="0" y="9" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fbbf24" fontFamily="Inter, 'Segoe UI', Arial, sans-serif" letterSpacing="2.5">AGRIBISNIS KELAPA SAWIT</text>
      </g>
    </svg>
  );
}
