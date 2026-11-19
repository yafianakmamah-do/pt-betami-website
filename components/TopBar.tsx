'use client';

import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';

export default function TopBar() {
  const { lang } = useLanguage();
  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const wib = now
    ? new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', {
        timeZone: 'Asia/Jakarta',
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now).replace(/\./g, ':')
    : lang === 'id' ? 'Memuat waktu...' : 'Loading time...';

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
        <div className="flex items-center gap-2 font-medium tabular-nums whitespace-nowrap">
          <span className="hidden sm:inline text-slate-400">{lang === 'id' ? 'Waktu Indonesia Barat' : 'Western Indonesia Time'}</span>
          <span className="px-2 py-0.5 rounded bg-teal-900/50 text-teal-100 border border-teal-700/40">{wib} WIB</span>
        </div>
      </div>
    </div>
  );
}
