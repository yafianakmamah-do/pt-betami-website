'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function Footer() {
  const { lang, t } = useLanguage();

  return (
    <footer className="site-footer bg-slate-950 text-gray-300 pt-14 pb-10 border-t border-slate-800 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-gray-800">
          <div className="lg:col-span-4 space-y-3">
            <Link href="/" className="inline-block">
              <span className="inline-flex items-center gap-3">
                <span className="flex flex-col leading-none">
                  <span className="text-base font-extrabold tracking-tight text-white">BETAMI</span>
                  <span className="mt-1 text-[8px] font-bold tracking-[0.16em] text-teal-200">
                    {lang === 'id' ? 'AGRIBISNIS KELAPA SAWIT' : 'PALM OIL AGRIBUSINESS'}
                  </span>
                </span>
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed pr-4 text-xs">{t.footer.companyDesc}</p>
            <div className="pt-2 flex items-center gap-2 text-teal-300 font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="text-[11px]">{t.footer.sustainableBadge}</span>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.footer.quickLinks}</h4>
            <ul className="space-y-1.5 text-gray-400">
              <li><Link href="/" className="hover:text-amber-400 transition">{t.nav.home}</Link></li>
              <li><Link href="/tentang-kami" className="hover:text-amber-400 transition">{t.nav.about}</Link></li>
              <li><Link href="/bisnis" className="hover:text-amber-400 transition">{t.nav.business}</Link></li>
              <li><Link href="/galeri" className="hover:text-amber-400 transition">{t.nav.gallery}</Link></li>
              <li><Link href="/magang" className="hover:text-amber-400 transition">{t.nav.internship}</Link></li>
              <li><Link href="/kontak" className="hover:text-amber-400 transition">{t.nav.contact}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.footer.businessUnits}</h4>
            <ul className="space-y-1.5 text-gray-400">
              <li><Link href="/bisnis#perkebunan" className="hover:text-amber-400 transition">• {lang === 'id' ? 'Pasokan & Penerimaan TBS' : 'FFB Supply & Receiving'}</Link></li>
              <li><Link href="/bisnis#pengolahan" className="hover:text-amber-400 transition">• {lang === 'id' ? 'Pabrik Kelapa Sawit (PKS)' : 'Palm Oil Mill (PKS)'}</Link></li>
              <li><Link href="/bisnis#produk" className="hover:text-amber-400 transition">• {lang === 'id' ? 'Crude Palm Oil (CPO)' : 'Crude Palm Oil (CPO)'}</Link></li>
              <li><Link href="/bisnis#produk" className="hover:text-amber-400 transition">• {lang === 'id' ? 'Inti Sawit & Turunan' : 'Palm Kernel & Derivatives'}</Link></li>
              <li><Link href="/magang" className="hover:text-amber-400 transition">• {lang === 'id' ? 'Informasi Magang' : 'Internship Information'}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.footer.contactInfo}</h4>
            <div className="space-y-2 text-gray-400 text-xs">
              <div className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 text-teal-300 shrink-0 mt-0.5" /><span>{t.footer.addressOffice}</span></div>
              <div className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /><span>{t.footer.addressPlantation}</span></div>
              <div className="flex items-center gap-2 pt-1"><Phone className="w-3.5 h-3.5 text-teal-300 shrink-0" /><span>{t.footer.phone}</span></div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-teal-300 shrink-0" /><span>{t.footer.email}</span></div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400 text-[11px]">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
            <Link href="/" aria-label={lang === 'id' ? 'Kembali ke beranda BETAMI' : 'Back to BETAMI homepage'}>
              <Image
                src="/images/logo-resmi-betami-cropped.png"
                alt={lang === 'id' ? 'Logo resmi BETAMI' : 'Official BETAMI logo'}
                width={48}
                height={48}
                className="h-10 w-10 object-contain"
              />
            </Link>
            <p>© {new Date().getFullYear()} PT BETAMI (PT Benih Tamiang). {t.footer.rights}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/keberlanjutan" className="hover:text-white">{lang === 'id' ? 'Keberlanjutan & CSR' : 'Sustainability & CSR'}</Link>
            <span>•</span>
            <Link href="/kontak" className="hover:text-white">{lang === 'id' ? 'Hubungi Kami' : 'Contact'}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
