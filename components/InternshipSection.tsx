'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { ScrollReveal } from '@/components/ScrollMotion';
import SmartInternCarousel from '@/components/SmartInternCarousel';

export default function InternshipSection() {
  const { lang, t } = useLanguage();

  return (
    <section
      id="magang"
      className="py-16 sm:py-20 bg-gradient-to-b from-white via-slate-50 to-white border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 text-xs font-bold uppercase tracking-wider mb-4">
            {t.internshipSection.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            {t.internshipSection.title}
          </h2>
          <div className="w-20 h-1 bg-teal-600 mx-auto mb-6 rounded-full" />
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            {t.internshipSection.desc}
          </p>
        </ScrollReveal>

        {/* Smart Carousel (Foto & Pengalaman, Geser Kiri Kanan & Klik Modal) */}
        <div className="mb-12">
          <SmartInternCarousel lang={lang} />
        </div>

        {/* Action Button */}
        <div className="text-center pt-4">
          <Link
            href="/magang"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10 border border-slate-700"
          >
            {t.internshipSection.btnInfo}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
