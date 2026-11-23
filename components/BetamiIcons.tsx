/**
 * BetamiIcons — simbol industri kelapa sawit custom PT BETAMI
 * Setiap ikon dirancang spesifik: bukan ikon AI generik.
 * Gunakan <IconNama size={32} className="text-teal-600" />
 */

import React from 'react';

type IconProps = { size?: number; className?: string; strokeWidth?: number };

/** Daun kelapa sawit tunggal — identitas tanaman */
export function IconPalmLeaf({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 20V8" />
      <path d="M12 8C10 5 6 4 3 6c3 1 6 3 9 7" />
      <path d="M12 8c2-3 6-4 9-2-3 1-6 3-9 7" />
      <path d="M12 14c-1-2-3-3.5-5-4 1.5 1.5 3 4 5 6" />
      <path d="M12 14c1-2 3-3.5 5-4-1.5 1.5-3 4-5 6" />
      <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Tandan buah segar (TBS) — bulir pada batang */
export function IconTBS({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 21V11" />
      <ellipse cx="12" cy="9" rx="4" ry="5" />
      <circle cx="8" cy="12" r="2" />
      <circle cx="16" cy="12" r="2" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="16" cy="8" r="1.5" />
      <circle cx="12" cy="6" r="1.5" />
      <path d="M9 18c-2 0-3-1-3-3" />
      <path d="M15 18c2 0 3-1 3-3" />
    </svg>
  );
}

/** Pabrik kelapa sawit (PKS) — silo + cerobong */
export function IconMill({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {/* Bangunan utama */}
      <rect x="3" y="10" width="12" height="11" rx="0.5" />
      {/* Atap segitiga */}
      <path d="M2 10l7-6 7 6" />
      {/* Cerobong asap */}
      <rect x="16" y="6" width="4" height="15" rx="0.5" />
      {/* Uap cerobong */}
      <path d="M17 4c0-1 1-1.5 1-2.5" />
      <path d="M19 4c0-1 1-1.5 1-2.5" />
      {/* Pintu pabrik */}
      <rect x="6" y="16" width="3" height="5" rx="0.3" />
      {/* Jendela pabrik */}
      <rect x="10" y="13" width="3" height="3" rx="0.3" />
    </svg>
  );
}

/** Tetes minyak CPO — produk utama */
export function IconCPO({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {/* Tetes besar */}
      <path d="M12 3C12 3 6 10 6 14a6 6 0 0 0 12 0c0-4-6-11-6-11z" />
      {/* Kilap/cahaya di dalam tetes */}
      <path d="M9 14c0-2 1.5-4 3-5" strokeWidth={strokeWidth * 0.8} opacity="0.6" />
    </svg>
  );
}

/** Kebun sawit — deretan pohon */
export function IconEstate({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {/* Pohon tengah */}
      <line x1="12" y1="20" x2="12" y2="12" />
      <path d="M12 12c-1.5-2-4-3-6-2 2 0.5 4 1.5 6 4" />
      <path d="M12 12c1.5-2 4-3 6-2-2 0.5-4 1.5-6 4" />
      <path d="M12 9c-1-1.5-3-2-4-1.5 1.5 0.3 3 1 4 3" />
      <path d="M12 9c1-1.5 3-2 4-1.5-1.5 0.3-3 1-4 3" />
      {/* Pohon kiri */}
      <line x1="5" y1="20" x2="5" y2="14" />
      <path d="M5 14c-1-1.5-2.5-2-3.5-1.5 1 0.3 2 1 3.5 3" />
      <path d="M5 14c1-1.5 2.5-2 3.5-1.5-1 0.3-2 1-3.5 3" />
      {/* Pohon kanan */}
      <line x1="19" y1="20" x2="19" y2="14" />
      <path d="M19 14c-1-1.5-2.5-2-3.5-1.5 1 0.3 2 1 3.5 3" />
      <path d="M19 14c1-1.5 2.5-2 3.5-1.5-1 0.3-2 1-3.5 3" />
      {/* Tanah */}
      <path d="M2 20h20" />
    </svg>
  );
}

/** Tanggung jawab sosial (CSR) — tangan + bumi */
export function IconCSR({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {/* Lingkaran bumi */}
      <circle cx="12" cy="10" r="6" />
      {/* Meridian */}
      <path d="M12 4c-2 2-3 4-3 6s1 4 3 6" />
      <path d="M12 4c2 2 3 4 3 6s-1 4-3 6" />
      <path d="M6 10h12" />
      {/* Tangan di bawah */}
      <path d="M8 20c0-2 2-3 4-3s4 1 4 3" />
    </svg>
  );
}

/** Pengalaman / waktu — jam sundial gaya industri */
export function IconExperience({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
      <path d="M5.6 5.6l1.4 1.4" />
      <path d="M18.4 5.6l-1.4 1.4" />
      <path d="M3 12h1" />
      <path d="M20 12h1" />
    </svg>
  );
}

/** Lokasi / pin industri */
export function IconLocation({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 2C8.7 2 6 4.7 6 8c0 5 6 14 6 14s6-9 6-14c0-3.3-2.7-6-6-6z" />
      <circle cx="12" cy="8" r="2.2" />
    </svg>
  );
}

/** Proses / roda gigi industri */
export function IconProcess({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      <path d="M4.9 4.9l2.1 2.1M16.9 16.9l2.1 2.1M4.9 19.1l2.1-2.1M16.9 7.1l2.1-2.1" />
      <circle cx="12" cy="12" r="6" strokeDasharray="2 2" />
    </svg>
  );
}

/** Sertifikasi / kualitas — medal khas industri */
export function IconQuality({ size = 24, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="9" r="5" />
      <path d="M9 14.5l-3 7 3-1.5 3 1.5-1-3.5" />
      <path d="M15 14.5l3 7-3-1.5-3 1.5 1-3.5" />
      <path d="M10 9l1.5 1.5L14 7" />
    </svg>
  );
}