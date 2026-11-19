'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Building2, Leaf, Users } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { CountUp, ScrollParallax, ScrollReveal } from '@/components/ScrollMotion';

export default function AboutSection() {
  const { lang } = useLanguage();

  return (
    <section id="tentang" className="py-16 sm:py-20 bg-white section-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <ScrollReveal className="lg:col-span-6 space-y-5">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold uppercase tracking-wider">
              {lang === 'id' ? 'Profil Perusahaan' : 'Company Profile'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
              PT Benih Tamiang <span className="text-teal-700">(BETAMI)</span>
            </h2>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              {lang === 'id'
                ? 'PT BETAMI adalah perusahaan yang bergerak di bidang perkebunan dan pengolahan kelapa sawit di Kabupaten Aceh Tamiang, Nanggroe Aceh Darussalam. Beroperasi di Kecamatan Rantau, perusahaan mengelola Pabrik Kelapa Sawit (PKS) untuk mengolah Tandan Buah Segar (TBS) menjadi Crude Palm Oil (CPO).'
                : 'PT BETAMI is a palm oil plantation and processing company in Aceh Tamiang Regency, Nanggroe Aceh Darussalam. Operating in Rantau District, the company runs a Palm Oil Mill (PKS) processing Fresh Fruit Bunches (FFB) into Crude Palm Oil (CPO).'}
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {lang === 'id'
                ? 'Dengan pengalaman lebih dari dua dekade, PT BETAMI berkontribusi pada perekonomian lokal melalui penyerapan tenaga kerja, kemitraan pasokan, serta program tanggung jawab sosial (CSR) bagi desa-desa sekitar seperti Suka Jadi, Benua Raja, dan Durian.'
                : 'With over two decades of experience, PT BETAMI contributes to the local economy through employment, supply partnerships, and CSR programs for nearby villages including Suka Jadi, Benua Raja, and Durian.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-sm">
              {[
                { icon: Building2, text: lang === 'id' ? 'PKS di Kec. Rantau, Aceh Tamiang' : 'PKS in Rantau District, Aceh Tamiang' },
                { icon: Leaf, text: lang === 'id' ? 'Pengolahan TBS menjadi CPO' : 'FFB to CPO processing' },
                { icon: Users, text: lang === 'id' ? 'Penyerapan tenaga kerja lokal' : 'Local employment' },
                { icon: CheckCircle2, text: lang === 'id' ? 'CSR & perawatan infrastruktur desa' : 'CSR & village infrastructure support' },
              ].map((it, i) => (
                <div key={i} className="flex items-center gap-2.5 text-slate-800 font-medium bg-white/70 border border-slate-200 rounded-lg px-3 py-2">
                  <it.icon className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>{it.text}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 flex flex-wrap gap-3">
              <Link href="/tentang-kami" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm transition shadow-soft">
                {lang === 'id' ? 'Selengkapnya Tentang Kami' : 'More About Us'} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/kontak" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-teal-800 font-semibold text-sm transition border border-teal-200">
                {lang === 'id' ? 'Hubungi Perusahaan' : 'Contact Us'}
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-6" delay={0.12}>
            <div className="relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl border border-slate-200">
                <ScrollParallax className="absolute inset-0 scale-[1.08]" distance={22}>
                  <Image src="/images/pks-mill-ramp.jpg" alt={lang === 'id' ? 'Area operasional Pabrik Kelapa Sawit PT BETAMI' : 'PT BETAMI Palm Oil Mill operations'} fill quality={75} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                </ScrollParallax>
              </div>
              <div className="absolute -bottom-5 -left-3 sm:-left-5 w-40 sm:w-48 aspect-[4/3] rounded-xl overflow-hidden shadow-lg border-4 border-white hidden sm:block">
                <ScrollParallax className="absolute inset-0 scale-[1.08]" distance={-14}>
                  <Image src="/images/kegiatan/csr-betami-juli-2026.jpeg" alt={lang === 'id' ? 'Kegiatan sosial PT BETAMI' : 'PT BETAMI community initiative'} fill quality={75} sizes="192px" className="object-cover" />
                </ScrollParallax>
              </div>
              <div className="absolute -top-4 -right-2 sm:-right-4 bg-white/95 backdrop-blur rounded-xl shadow-lg border border-teal-100 px-4 py-3">
                <div className="text-2xl font-extrabold text-teal-700 leading-none"><CountUp value={20} suffix="+" /></div>
                <div className="text-xs text-slate-600 font-medium">{lang === 'id' ? 'Tahun di sektor sawit' : 'Years in palm sector'}</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-6 sm:mt-8 italic">
              {lang === 'id' ? 'Foto: Fasilitas PKS dan dokumentasi kegiatan sosial (sumber: arsip & pemberitaan publik).' : 'Photos: PKS facility and social activity documentation (public/news sources).'}
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
