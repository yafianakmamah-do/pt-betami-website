'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, PlayCircle } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { CountUp } from '@/components/ScrollMotion';

export default function Hero() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();

  const facts = useMemo(
    () => [
      { k: lang === 'id' ? 'Lokasi PKS' : 'Mill Location', v: 'Rantau, Aceh Tamiang' },
      { k: lang === 'id' ? 'Pengalaman' : 'Experience', v: lang === 'id' ? '20+ Tahun' : '20+ Years' },
      { k: lang === 'id' ? 'Desa Mitra' : 'Partner Villages', v: 'Suka Jadi, Benua Raja, Durian' },
      { k: lang === 'id' ? 'Fokus' : 'Focus', v: 'TBS • CPO • CSR' },
    ],
    [lang]
  );

  return (
    <div className="home-opening">
      <section className="home-opening__stage">
        <motion.div
          className="home-opening__photo"
          initial={reduceMotion ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/images/tbs-harvest.jpg"
            alt={lang === 'id' ? 'Tandan buah segar kelapa sawit hasil panen' : 'Harvested fresh fruit bunches'}
            fill
            priority
            decoding="sync"
            quality={75}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <Image
          src="/images/logo-resmi-betami-cropped.png"
          alt=""
          aria-hidden="true"
          width={600}
          height={590}
          className="home-opening__brand-watermark"
        />
        <div className="home-opening__scrim" />
        <motion.div
          className="home-opening__topline"
          initial={reduceMotion ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.2 }}
        >
          <span>{lang === 'id' ? 'PERKEBUNAN & PABRIK KELAPA SAWIT' : 'PALM ESTATE & OIL MILL'}</span>
          <span>ACEH TAMIANG · INDONESIA</span>
        </motion.div>
        <motion.div
          className="home-opening__copy"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.85, delay: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <p>{lang === 'id' ? 'Dari tanah Aceh Tamiang, untuk masa depan bersama.' : 'Rooted in Aceh Tamiang, growing toward a shared future.'}</p>
          <div className="home-opening__actions">
            <Link href="/tentang-kami" className="editorial-button">
              {lang === 'id' ? 'Kenali BETAMI' : 'Discover BETAMI'} <ArrowRight aria-hidden="true" />
            </Link>
            <Link href="/bisnis" className="editorial-link">
              {lang === 'id' ? 'Kegiatan usaha' : 'Our operations'}
            </Link>
          </div>
        </motion.div>
        <motion.h1
          className="home-opening__wordmark"
          initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 1, delay: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          BETAMI
        </motion.h1>
        <motion.div
          className="home-opening__bottom"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.65 }}
        >
          <div className="home-opening__facts">
            {facts.slice(0, 3).map((fact) => (
              <div key={fact.k}>
                <small>{fact.k}</small>
                <strong>
                  {fact.k === (lang === 'id' ? 'Pengalaman' : 'Experience')
                    ? <><CountUp value={20} suffix="+" /> {lang === 'id' ? 'Tahun' : 'Years'}</>
                    : fact.v}
                </strong>
              </div>
            ))}
          </div>
          <a href="#tentang" className="home-opening__scroll">
            <span>{lang === 'id' ? 'GULIR UNTUK MENJELAJAH' : 'SCROLL TO EXPLORE'}</span><ArrowDown aria-hidden="true" />
          </a>
        </motion.div>
      </section>
      <div className="home-opening__caption">
        <span>01 / 06</span>
        <span>{lang === 'id' ? 'RANTAU, ACEH TAMIANG' : 'RANTAU, ACEH TAMIANG'}</span>
        <a href="#tentang"><PlayCircle aria-hidden="true" /> {lang === 'id' ? 'Mulai cerita' : 'Start the story'}</a>
      </div>
    </div>
  );
}
