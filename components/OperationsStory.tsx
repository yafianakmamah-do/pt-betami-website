'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowDownRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { ScrollReveal } from '@/components/ScrollMotion';

const chapters = [
  {
    image: '/images/tbs-harvest.jpg',
    id: '01',
    titleId: 'Tandan Buah Segar',
    titleEn: 'Fresh Fruit Bunches',
    bodyId: 'TBS dari area pasokan menjadi awal dari rangkaian pengolahan kelapa sawit.',
    bodyEn: 'Fresh fruit bunches from supply areas begin the palm oil processing chain.',
    tagId: 'PASOKAN',
    tagEn: 'SUPPLY',
  },
  {
    image: '/images/pks-mill-ramp.jpg',
    id: '02',
    titleId: 'Di dalam PKS',
    titleEn: 'Inside the Mill',
    bodyId: 'Di Kecamatan Rantau, BETAMI mengoperasikan Pabrik Kelapa Sawit untuk mengolah TBS.',
    bodyEn: 'In Rantau District, BETAMI operates a Palm Oil Mill to process FFB.',
    tagId: 'PENGOLAHAN',
    tagEn: 'PROCESSING',
  },
  {
    image: '/images/palm-fruit-bunch.jpg',
    id: '03',
    titleId: 'CPO & inti sawit',
    titleEn: 'CPO & palm kernel',
    bodyId: 'Hasil pengolahan utama yang menjadi bagian dari rantai pasok industri kelapa sawit.',
    bodyEn: 'Primary outputs that form part of the wider palm oil supply chain.',
    tagId: 'PRODUK',
    tagEn: 'PRODUCTS',
  },
];

export default function OperationsStory() {
  const { lang } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [activeChapter, setActiveChapter] = useState(0);
  const swipeStartX = useRef<number | null>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: photoRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.08]);
  const chapter = chapters[activeChapter];

  const showPrevious = () => setActiveChapter((current) => (current - 1 + chapters.length) % chapters.length);
  const showNext = () => setActiveChapter((current) => (current + 1) % chapters.length);

  return (
    <section id="operasi-bercerita" className="operations-story">
      <div className="operations-story__inner">
        <ScrollReveal className="operations-story__copy">
          <span className="editorial-kicker">{lang === 'id' ? 'RANTAI OPERASIONAL' : 'THE OPERATING CHAIN'}</span>
          <p className="operations-story__index">{chapter.id} / 03 · {lang === 'id' ? chapter.tagId : chapter.tagEn}</p>
          <h2>{lang === 'id' ? 'Dari kebun ke pabrik.' : 'From estate to mill.'}</h2>
          <div className="operations-story__caption" aria-live="polite">
            <h3>{lang === 'id' ? chapter.titleId : chapter.titleEn}</h3>
            <p>{lang === 'id' ? chapter.bodyId : chapter.bodyEn}</p>
          </div>
          <div className="operations-story__controls">
            <button type="button" onClick={showPrevious} aria-label={lang === 'id' ? 'Foto sebelumnya' : 'Previous photo'}>
              <ChevronLeft aria-hidden="true" />
            </button>
            <button type="button" onClick={showNext} aria-label={lang === 'id' ? 'Foto berikutnya' : 'Next photo'}>
              <ChevronRight aria-hidden="true" />
            </button>
            <span>{lang === 'id' ? 'Pilih foto atau geser untuk melihat' : 'Choose a photo or swipe to explore'}</span>
          </div>
          <Link href="/bisnis" className="editorial-link">
            {lang === 'id' ? 'Lihat kegiatan usaha' : 'Explore operations'} <ArrowDownRight aria-hidden="true" />
          </Link>
        </ScrollReveal>

        <div className="operations-story__visual">
          <motion.div
            ref={photoRef}
            key={chapter.id}
            className="operations-story__photo"
            onPointerDown={(event) => {
              if (!event.isPrimary) return;
              swipeStartX.current = event.clientX;
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerUp={(event) => {
              if (swipeStartX.current === null) return;
              const distance = event.clientX - swipeStartX.current;
              swipeStartX.current = null;
              if (Math.abs(distance) < 70) return;
              if (distance < 0) showNext();
              else showPrevious();
            }}
            onPointerCancel={() => {
              swipeStartX.current = null;
            }}
            initial={reduceMotion ? false : { opacity: 0.6, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            aria-label={lang === 'id' ? 'Foto operasional, geser untuk mengganti foto' : 'Operations photo, swipe to change'}
          >
            <motion.div
              className="operations-story__image-layer"
              style={reduceMotion ? undefined : { y: imageY, scale: imageScale }}
            >
              <Image
                src={chapter.image}
                alt={lang === 'id' ? chapter.titleId : chapter.titleEn}
                fill
                quality={75}
                priority={activeChapter === 0}
                sizes="(max-width: 760px) 100vw, 58vw"
                className="object-cover"
                draggable={false}
              />
            </motion.div>
            <span className="operations-story__image-label">{chapter.id} — {lang === 'id' ? chapter.tagId : chapter.tagEn}</span>
          </motion.div>
          <div className="operations-story__pagination" aria-label={lang === 'id' ? 'Pilih foto operasional' : 'Choose an operations photo'}>
            {chapters.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`${lang === 'id' ? 'Tampilkan foto' : 'Show photo'} ${item.id}: ${lang === 'id' ? item.titleId : item.titleEn}`}
                aria-current={index === activeChapter ? 'true' : undefined}
                onClick={() => setActiveChapter(index)}
              >
                {item.id}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
