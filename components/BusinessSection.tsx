'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { ScrollParallax, ScrollReveal } from '@/components/ScrollMotion';

export default function BusinessSection() {
  const { lang, t } = useLanguage();

  const businessItems = [
    {
      title: t.businessSection.card1Title,
      category: t.businessSection.card1Category,
      desc: t.businessSection.card1Desc,
      image: '/images/tbs-harvest.jpg',
      link: '/bisnis#perkebunan',
    },
    {
      title: t.businessSection.card2Title,
      category: t.businessSection.card2Category,
      desc: t.businessSection.card2Desc,
      image: '/images/pks-mill-ramp.jpg',
      link: '/bisnis#pengolahan',
    },
    {
      title: t.businessSection.card3Title,
      category: t.businessSection.card3Category,
      desc: t.businessSection.card3Desc,
      image: '/images/fruit-oil-palm-real.jpg',
      link: '/bisnis#produk',
    },
  ];

  return (
    <section id="bisnis" className="py-16 sm:py-20 bg-slate-50 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700 block mb-1">{t.businessSection.badge}</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{t.businessSection.title}</h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">{t.businessSection.subtitle}</p>
          </div>
          <Link href="/bisnis" className="mt-4 md:mt-0 text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 uppercase tracking-wider transition">
            <span>{t.businessSection.viewAllBtn}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {businessItems.map((item, idx) => (
            <ScrollReveal key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col group" delay={idx * 0.1} y={36}>
              <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                <ScrollParallax className="absolute inset-0 scale-[1.08] group-hover:scale-[1.13] transition-transform duration-700" distance={16 + idx * 4}>
                  <Image src={item.image} alt={item.title} fill quality={75} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover object-center" />
                </ScrollParallax>
                <div className="absolute top-3 left-3 bg-teal-700 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  {item.category}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">{item.title}</h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link href={item.link} className="text-xs font-bold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 group/link">
                    <span>{lang === 'id' ? 'Selengkapnya' : 'Learn More'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
