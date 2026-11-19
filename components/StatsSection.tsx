'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { CountUp, ScrollReveal } from '@/components/ScrollMotion';

export default function StatsSection() {
  const { lang } = useLanguage();

  const stats = [
    { count: 20, suffix: '+', label: lang === 'id' ? 'Tahun Pengalaman' : 'Years Experience', desc: lang === 'id' ? 'Beroperasi di sektor perkebunan & pengolahan sawit' : 'Operating in palm plantation & processing sector' },
    { value: 'PKS', label: lang === 'id' ? 'Pabrik Kelapa Sawit' : 'Palm Oil Mill', desc: lang === 'id' ? 'Pengolahan TBS menjadi CPO di Aceh Tamiang' : 'FFB to CPO processing in Aceh Tamiang' },
    { count: 3, label: lang === 'id' ? 'Desa Mitra Sekitar' : 'Nearby Partner Villages', desc: lang === 'id' ? 'Suka Jadi, Benua Raja, dan Durian (Kec. Rantau)' : 'Suka Jadi, Benua Raja, and Durian (Rantau District)' },
    { value: 'CSR', label: lang === 'id' ? 'Kontribusi Sosial' : 'Social Contribution', desc: lang === 'id' ? 'Bantuan sembako, perawatan jalan, dukungan fasilitas' : 'Food aid, road maintenance, community facility support' },
  ];

  return (
    <section id="fakta" className="py-16 sm:py-20 bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.25) 1px, transparent 0)', backgroundSize:'26px 26px'}} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-300 block mb-1">{lang === 'id' ? 'Sekilas Operasional' : 'Operational Snapshot'}</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{lang === 'id' ? 'PT BETAMI dalam Angka & Fakta' : 'PT BETAMI in Facts'}</h2>
          <p className="text-sm text-teal-100 mt-2">{lang === 'id' ? 'Informasi ringkas berdasarkan profil operasional dan kegiatan perusahaan di Aceh Tamiang.' : 'Summary based on company operational profile and activities in Aceh Tamiang.'}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, idx) => (
            <ScrollReveal key={idx} className="p-6 bg-white/10 backdrop-blur border border-white/15 rounded-2xl text-center hover:bg-white/15 transition" delay={idx * 0.08} y={30}>
              <div className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight">
                {'count' in s ? <CountUp value={s.count ?? 0} suffix={s.suffix ?? ''} /> : s.value}
              </div>
              <div className="text-sm font-bold text-white mt-1">{s.label}</div>
              <p className="text-xs text-teal-50/90 mt-2 leading-relaxed">{s.desc}</p>
            </ScrollReveal>
          ))}
        </div>

        <p className="text-[11px] text-teal-100/70 text-center mt-8 max-w-2xl mx-auto">
          {lang === 'id' ? 'Catatan: Detail kapasitas/angka teknis spesifik dapat diperbarui sesuai data resmi perusahaan. Informasi lokasi & kegiatan merujuk pada data operasional dan pemberitaan publik.' : 'Note: Specific technical figures can be updated per official company data. Location & activity info references operational and public sources.'}
        </p>
      </div>
    </section>
  );
}
