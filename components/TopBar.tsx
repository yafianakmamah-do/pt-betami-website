'use client';

import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';

function formatTime(date: Date, timeZone: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date).replace(/\./g, ':');
}

export default function TopBar() {
  const { lang } = useLanguage();
  const [now, setNow] = React.useState<Date | null>(null);
  const [localTz, setLocalTz] = React.useState<string>('Asia/Jakarta');
  const [isDifferentTz, setIsDifferentTz] = React.useState(false);

  React.useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setLocalTz(tz);
    setIsDifferentTz(tz !== 'Asia/Jakarta');
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const locale = lang === 'id' ? 'id-ID' : 'en-US';

  const wib = now
    ? formatTime(now, 'Asia/Jakarta', locale).replace(/\./g, ':')
    : lang === 'id' ? 'Memuat...' : 'Loading...';

  const localTime = now && isDifferentTz
    ? formatTime(now, localTz, locale).replace(/\./g, ':')
    : null;

  // Singkatan zona waktu lokal
  const localTzShort = now && isDifferentTz
    ? new Intl.DateTimeFormat('en', { timeZone: localTz, timeZoneName: 'short' })
        .formatToParts(now)
        .find(p => p.type === 'timeZoneName')?.value ?? localTz
    : null;

  return (
    <div className="bg-[#173c30] text-slate-100 text-[11px] sm:text-xs border-b border-[#284f3e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#c6a85b]" />
          <span className="font-semibold tracking-wide text-[#e2d3a8]">BENIH TAMIANG (BETAMI)</span>
          <span className="hidden md:inline text-slate-400 truncate">
            {lang === 'id' ? 'Pabrik Kelapa Sawit • Aceh Tamiang, Nanggroe Aceh Darussalam' : 'Palm Oil Mill • Aceh Tamiang, Nanggroe Aceh Darussalam'}
          </span>
        </div>
        <div className="flex items-center gap-2 font-medium tabular-nums whitespace-nowrap flex-wrap justify-end">
          {/* Waktu lokal pengunjung (hanya tampil kalau beda zona) */}
          {localTime && (
            <>
              <span className="hidden sm:inline text-slate-500 text-[10px]">{lang === 'id' ? 'Waktu Anda' : 'Your time'}</span>
              <span className="px-2 py-0.5 rounded bg-slate-700/50 text-slate-200 border border-slate-600/40 text-[10px] topbar-time-badge">
                {localTime} {localTzShort}
              </span>
              <span className="text-slate-600 hidden sm:inline">|</span>
            </>
          )}
          {/* Waktu WIB (selalu tampil) */}
          <span className="hidden sm:inline text-slate-400">{lang === 'id' ? 'Waktu Indonesia Barat' : 'Western Indonesia Time'}</span>
          <span className="px-2 py-0.5 rounded bg-teal-900/50 text-teal-100 border border-teal-700/40 topbar-time-badge">{wib} WIB</span>
        </div>
      </div>
    </div>
  );
}