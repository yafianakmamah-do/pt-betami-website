'use client';

import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { CountUp, ScrollReveal } from '@/components/ScrollMotion';
import { IconExperience, IconMill, IconCSR, IconEstate } from '@/components/BetamiIcons';

export default function StatsSection() {
  const { lang } = useLanguage();

  const stats = [
    {
      icon: IconExperience,
      count: 20, suffix: '+',
      label: lang === 'id' ? 'Tahun Pengalaman' : 'Years Experience',
      desc: lang === 'id' ? 'Beroperasi di sektor perkebunan & pengolahan sawit' : 'Operating in palm plantation & processing sector',
      accent: 'from-amber-500/20 to-amber-400/5',
      iconColor: 'text-amber-300',
    },
    {
      icon: IconMill,
      value: 'PKS',
      label: lang === 'id' ? 'Pabrik Kelapa Sawit' : 'Palm Oil Mill',
      desc: lang === 'id' ? 'Pengolahan TBS menjadi CPO di Aceh Tamiang' : 'FFB to CPO processing in Aceh Tamiang',
      accent: 'from-teal-400/20 to-teal-300/5',
      iconColor: 'text-teal-300',
    },
    {
      icon: IconEstate,
      count: 3,
      label: lang === 'id' ? 'Desa Mitra Sekitar' : 'Nearby Partner Villages',
      desc: lang === 'id' ? 'Suka Jadi, Benua Raja, dan Durian (Kec. Rantau)' : 'Suka Jadi, Benua Raja, and Durian (Rantau District)',
      accent: 'from-emerald-400/20 to-emerald-300/5',
      iconColor: 'text-emerald-300',
    },
    {
      icon: IconCSR,
      value: 'CSR',
      label: lang === 'id' ? 'Kontribusi Sosial' : 'Social Contribution',
      desc: lang === 'id' ? 'Bantuan sembako, perawatan jalan, dukungan fasilitas' : 'Food aid, road maintenance, community facility support',
      accent: 'from-sky-400/20 to-sky-300/5',
      iconColor: 'text-sky-300',
    },
  ];

  return (
    <section id="fakta" className="py-16 sm:py-20 bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white relative overflow-hidden">
      {/* Dot pattern latar */}
      <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.25) 1px, transparent 0)', backgroundSize:'26px 26px'}} />

      {/* Dekorasi cahaya sudut */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl" style={{background:'rgba(16,88,74,0.35)'}} />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-3xl" style={{background:'rgba(211,168,50,0.12)'}} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-300 block mb-1">
            {lang === 'id' ? 'Sekilas Operasional' : 'Operational Snapshot'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {lang === 'id' ? 'PT BETAMI dalam Angka & Fakta' : 'PT BETAMI in Facts'}
          </h2>
          <p className="text-sm text-teal-100 mt-2">
            {lang === 'id'
              ? 'Informasi ringkas berdasarkan profil operasional dan kegiatan perusahaan di Aceh Tamiang.'
              : 'Summary based on company operational profile and activities in Aceh Tamiang.'}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <ScrollReveal
                key={idx}
                className={`relative p-6 bg-gradient-to-b ${s.accent} backdrop-blur border border-white/12 rounded-2xl text-center hover:border-white/25 hover:scale-[1.02] transition-all duration-300 overflow-hidden group`}
                delay={idx * 0.08}
                y={30}
              >
                {/* Ikon custom sawit di atas */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-white/8 border border-white/12 ${s.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={26} strokeWidth={1.4} />
                </div>

                {/* Angka / nilai */}
                <div className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight">
                  {'count' in s
                    ? <CountUp value={s.count ?? 0} suffix={s.suffix ?? ''} />
                    : s.value}
                </div>

                {/* Label */}
                <div className="text-sm font-bold text-white mt-1">{s.label}</div>

                {/* Deskripsi */}
                <p className="text-xs text-teal-50 mt-2 leading-relaxed">{s.desc}</p>

                {/* Garis bawah aksen */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background:'linear-gradient(90deg, transparent, #d3a832, transparent)'}} />
              </ScrollReveal>
            );
          })}
        </div>

        <p className="text-[11px] text-teal-100 text-center mt-8 max-w-2xl mx-auto opacity-70">
          {lang === 'id'
            ? 'Catatan: Detail kapasitas/angka teknis spesifik dapat diperbarui sesuai data resmi perusahaan.'
            : 'Note: Specific technical figures can be updated per official company data.'}
        </p>
      </div>
    </section>
  );
}