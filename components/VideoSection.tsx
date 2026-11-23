'use client';

import React from 'react';
import { Play } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const prosesSawit = {
  id: {
    title: 'Proses Kelapa Sawit di PT BETAMI',
    intro: 'PT BETAMI mengelola kelapa sawit dari tahap pembibitan hingga produksi minyak sawit nabati (CPO) yang siap distribusi.',
    steps: [
      'Pembibitan dan penanaman benih sawit berkualitas',
      'Perawatan tanaman dan pemupukan yang berkelanjutan',
      'Panen tandan buah segar (TBS) secara tepat waktu',
      'Pengolahan TBS di pabrik kelapa sawit (PKS)',
      'Produksi minyak sawit nabati (CPO) dan inti kelapa sawit (PK)',
    ],
  },
  en: {
    title: 'Palm Oil Process at PT BETAMI',
    intro: 'PT BETAMI manages oil palm from seedlings to the production of crude palm oil (CPO) ready for distribution.',
    steps: [
      'Seedling breeding and planting of quality oil palm seeds',
      'Plant maintenance and sustainable fertilization',
      'Timely harvest of fresh fruit bunches (FFB)',
      'Processing FFB at the palm oil mill (PKS)',
      'Production of crude palm oil (CPO) and palm kernel (PK)',
    ],
  },
};

export default function VideoSection() {
  const { lang } = useLanguage();
  const p = prosesSawit[lang as 'id' | 'en'] ?? prosesSawit.id;

  return (
    <section id="video-sawit" className="py-16 sm:py-20 bg-slate-950 text-white relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Kiri: Penjelasan proses sawit */}
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-teal-200 text-xs font-bold uppercase tracking-wider">
              <Play className="w-3.5 h-3.5" /> {lang === 'id' ? 'Proses Produksi' : 'Production Process'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">{p.title}</h2>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">{p.intro}</p>
            <ul className="space-y-3 text-sm sm:text-base text-slate-300">
              {p.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kanan: Video hanya, tanpa bacaan di atas maupun di bawah */}
          <div className="lg:col-span-6">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/mjlaG1900_8?rel=0&modestbranding=1"
                title={lang === 'id' ? 'Video Proses Kelapa Sawit' : 'Palm Oil Process Video'}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}