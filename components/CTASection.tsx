'use client';

import React from 'react';
import Link from 'next/link';
import { PhoneCall, Mail } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { ScrollReveal } from '@/components/ScrollMotion';

export default function CTASection() {
  const { t } = useLanguage();

  return (
    <section id="kontak" className="py-14 sm:py-16 bg-gradient-to-r from-teal-800 to-teal-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase font-bold tracking-widest text-teal-200 block mb-1">{t.ctaSection.badge}</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{t.ctaSection.title}</h2>
            <p className="mt-2 text-sm text-teal-50/90 leading-relaxed">{t.ctaSection.desc}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/kontak" className="px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow flex items-center gap-2">
              <PhoneCall className="w-4 h-4" />
              <span>{t.ctaSection.btnContact}</span>
            </Link>
            <Link href="/magang#formulir" className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition border border-white/30 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{t.ctaSection.btnInternship}</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
