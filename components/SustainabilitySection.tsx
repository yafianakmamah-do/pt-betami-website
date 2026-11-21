'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { ScrollParallax, ScrollReveal } from '@/components/ScrollMotion';

export default function SustainabilitySection() {
  const { lang } = useLanguage();

  return (
    <section className="sustainability-story">
      <div className="sustainability-story__inner">
        <ScrollReveal className="sustainability-story__copy">
          <span className="editorial-kicker">{lang === 'id' ? 'CSR & KEMITRAAN' : 'CSR & PARTNERSHIPS'}</span>
          <h2>{lang === 'id' ? 'Tumbuh bersama masyarakat sekitar.' : 'Growing alongside nearby communities.'}</h2>
          <p>
            {lang === 'id'
              ? 'PT BETAMI menjalankan kegiatan sosial di sekitar wilayah operasional, termasuk dukungan bantuan, fasilitas, dan perawatan infrastruktur desa.'
              : 'PT BETAMI carries out community initiatives around its operational area, including aid, facility support, and village infrastructure maintenance.'}
          </p>
          <Link href="/keberlanjutan" className="editorial-button editorial-button--light">
            {lang === 'id' ? 'Cerita keberlanjutan' : 'Our community work'} <ArrowRight aria-hidden="true" />
          </Link>
        </ScrollReveal>
        <ScrollReveal className="sustainability-story__visual" delay={0.12}>
          <div className="sustainability-story__photo sustainability-story__photo--main">
            <ScrollParallax className="absolute inset-0 scale-[1.08]" distance={20}>
              <Image src="/images/kegiatan/csr-betami-juli-2026.jpeg" alt={lang === 'id' ? 'Dokumentasi kegiatan sosial PT BETAMI' : 'PT BETAMI community initiative documentation'} fill quality={75} sizes="(max-width: 900px) 100vw, 55vw" className="object-cover" />
            </ScrollParallax>
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <span>{lang === 'id' ? 'KEGIATAN SOSIAL · ACEH TAMIANG' : 'COMMUNITY · ACEH TAMIANG'}</span>
          </div>
          <div className="sustainability-story__photo sustainability-story__photo--overlap">
            <ScrollParallax className="absolute inset-0 scale-[1.08]" distance={-14}>
              <Image src="/images/kegiatan/csr-sembako-betami.jpg" alt={lang === 'id' ? 'Kegiatan bantuan sosial PT BETAMI' : 'PT BETAMI social aid activity'} fill quality={75} sizes="260px" className="object-cover" />
            </ScrollParallax>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
