'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Leaf, Camera } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollMotion';
import { useLanguage } from '@/lib/LanguageContext';

export default function VideoSection() {
  const { lang } = useLanguage();

  return (
    <section id="video-sawit" className="py-16 sm:py-20 bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.35),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(245,158,11,0.25),transparent_25%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <ScrollReveal className="lg:col-span-5 space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-teal-200 text-xs font-bold uppercase tracking-wider"><Play className="w-3.5 h-3.5" /> {lang === 'id' ? 'Video Perkebunan & Sawit' : 'Palm Estate & Oil Palm Video'}</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">{lang === 'id' ? 'Gambaran Industri Kelapa Sawit' : 'An Overview of the Palm Oil Industry'}</h2>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              {lang === 'id'
                ? 'Video bertema perkebunan dan pengolahan kelapa sawit untuk memberikan gambaran visual tentang lanskap kebun, buah sawit, dan aktivitas industri. Konten video ini bersifat ilustratif industri sawit.'
                : 'This video offers a visual overview of palm estates, palm fruit, and processing activities. It is illustrative industry footage, not a record of PT BETAMI operations.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm">
              <div className="flex items-center gap-2 text-slate-200"><Leaf className="w-4 h-4 text-teal-300" /> {lang === 'id' ? 'Lanskap perkebunan sawit' : 'Palm estate landscapes'}</div>
              <div className="flex items-center gap-2 text-slate-200"><Camera className="w-4 h-4 text-amber-300" /> {lang === 'id' ? 'Visual lapangan & panen' : 'Field and harvest footage'}</div>
            </div>
            <div className="pt-2">
              <Link href="/galeri" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition">{lang === 'id' ? 'Lihat Galeri Foto' : 'View Photo Gallery'}</Link>
            </div>
          </ScrollReveal>
          <ScrollReveal className="lg:col-span-7" delay={0.12}>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/mjlaG1900_8?rel=0&modestbranding=1"
                title={lang === 'id' ? 'Video Perkebunan Kelapa Sawit' : 'Palm Oil Plantation Video'}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {lang === 'id' ? 'Sumber video: YouTube (ilustrasi industri perkebunan kelapa sawit).' : 'Video source: YouTube (illustrative palm oil industry footage).'}
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
