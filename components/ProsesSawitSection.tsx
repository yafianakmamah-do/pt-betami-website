'use client';

import React, { useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

const VIDEO_SRC =
  '/images/Dari%20Buah%20Sawit%20Jadi%20Minyak_%2010%20Tahap%20di%20Dalam%20Pabrik!%20%F0%9F%8C%B4.mp4';

const teks = {
  id: {
    label: 'Proses Pengolahan',
    title: 'Proses Pengolahan\nKelapa Sawit',
    paragraphs: [
      'Kelapa sawit diolah mulai dari panen Tandan Buah Segar (TBS) di kebun, lalu dibawa ke Pabrik Kelapa Sawit (PKS) untuk disterilisasi menggunakan uap panas bertekanan tinggi.',
      'Setelah sterilisasi, buah dipisahkan dari tandannya (threshing), lalu dipres untuk menghasilkan minyak kasar. Minyak ini kemudian dimurnikan menjadi Crude Palm Oil (CPO) siap kirim.',
      'Biji sawit yang tersisa diolah terpisah menjadi Palm Kernel (PK) dan Palm Kernel Oil (PKO). Seluruh proses berlangsung efisien dengan standar industri kelapa sawit Indonesia.',
    ],
    steps: [
      { no: '01', label: 'Panen TBS', desc: 'Tandan Buah Segar dipanen saat matang optimal.' },
      { no: '02', label: 'Sterilisasi', desc: 'TBS dikukus dengan uap panas untuk melunakkan buah.' },
      { no: '03', label: 'Threshing', desc: 'Buah dipisahkan dari tandan kosong.' },
      { no: '04', label: 'Pressing', desc: 'Buah dipres untuk menghasilkan minyak kasar (crude oil).' },
      { no: '05', label: 'Klarifikasi', desc: 'Minyak dimurnikan dari air dan kotoran.' },
      { no: '06', label: 'CPO & PK', desc: 'Hasil akhir: Crude Palm Oil dan Palm Kernel siap distribusi.' },
    ],
  },
  en: {
    label: 'Processing Steps',
    title: 'Palm Oil\nProcessing',
    paragraphs: [
      'Palm oil processing begins with harvesting Fresh Fruit Bunches (FFB) from the plantation, then transporting them to the Palm Oil Mill (PKS) for high-pressure steam sterilization.',
      'After sterilization, fruits are stripped from bunches (threshing), then pressed to extract crude oil. This oil is then clarified into Crude Palm Oil (CPO) ready for shipment.',
      'Remaining palm kernels are separately processed into Palm Kernel (PK) and Palm Kernel Oil (PKO). The entire process meets Indonesian palm oil industry standards.',
    ],
    steps: [
      { no: '01', label: 'FFB Harvest', desc: 'Fresh Fruit Bunches harvested at optimal ripeness.' },
      { no: '02', label: 'Sterilization', desc: 'FFB steamed under high pressure to soften fruit.' },
      { no: '03', label: 'Threshing', desc: 'Fruit stripped from empty bunches.' },
      { no: '04', label: 'Pressing', desc: 'Fruit pressed to extract crude oil.' },
      { no: '05', label: 'Clarification', desc: 'Oil purified from water and impurities.' },
      { no: '06', label: 'CPO & PK', desc: 'Final product: Crude Palm Oil and Palm Kernel ready for distribution.' },
    ],
  },
};

export default function ProsesSawitSection() {
  const { lang } = useLanguage();
  const p = teks[lang as 'id' | 'en'] ?? teks.id;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { video.play().catch(() => {}); }
        else { video.pause(); }
      },
      { threshold: 0.2 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="proses-sawit"
      className="py-16 sm:py-24 bg-[#0a110d] text-white relative overflow-hidden"
    >
      {/* Dekorasi latar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(16,88,74,0.12) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl"
        style={{ background: 'rgba(16,88,74,0.18)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 sm:mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-teal-900/60 border border-teal-600/30 text-teal-300 text-xs font-bold uppercase tracking-widest mb-4">
            {p.label}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight whitespace-pre-line">
            {p.title}
          </h2>
        </div>

        {/* Grid: kiri penjelasan, kanan video tall */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

          {/* KIRI: Penjelasan + langkah */}
          <div className="space-y-8">
            {p.paragraphs.map((par, i) => (
              <p key={i} className="text-slate-300 leading-relaxed text-sm sm:text-base">
                {par}
              </p>
            ))}

            {/* Grid langkah 2 kolom */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {p.steps.map((step) => (
                <div
                  key={step.no}
                  className="rounded-xl border border-teal-800/40 bg-teal-950/40 p-4 space-y-1"
                >
                  <span className="text-teal-400 text-xs font-bold tracking-widest">{step.no}</span>
                  <p className="text-white text-sm font-semibold">{step.label}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Garis emas */}
            <div
              className="h-px w-20"
              style={{ background: 'linear-gradient(90deg, #d3a832, transparent)' }}
            />
          </div>

          {/* KANAN: Video tall (portrait-ish, 9:16 ratio) */}
          <div className="flex justify-center lg:justify-end">
            <div
              className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black w-full max-w-xs sm:max-w-sm"
              style={{ aspectRatio: '9 / 16' }}
            >
              <video
                ref={videoRef}
                src={VIDEO_SRC}
                autoPlay
                muted
                loop
                playsInline
                controls
                preload="metadata"
                className="w-full h-full object-cover"
                style={{ display: 'block' }}
                aria-label={lang === 'id' ? 'Video proses pengolahan kelapa sawit' : 'Palm oil processing video'}
              />
              {/* Overlay sudut */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)' }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}