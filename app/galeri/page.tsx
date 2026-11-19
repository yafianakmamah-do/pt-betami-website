'use client';

import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import GallerySection from '@/components/GallerySection';
import EditorialHero from '@/components/EditorialHero';

export default function GalleryPage() {
  const { lang } = useLanguage();

  return (
    <main className="cinematic-page cinematic-page--gallery">
      <EditorialHero image="/images/aerial-palm-estate.jpg" eyebrow={lang === 'id' ? 'DOKUMENTASI VISUAL' : 'VISUAL DOCUMENTATION'} title={lang === 'id' ? 'Cerita dalam bingkai.' : 'Stories in frames.'} description={lang === 'id' ? 'Kumpulan foto fasilitas Pabrik Kelapa Sawit (PKS), Tandan Buah Segar (TBS), perkebunan, serta dokumentasi kegiatan sosial/CSR perusahaan di Aceh Tamiang.' : 'Collection of photos of the Palm Oil Mill (PKS) facilities, Fresh Fruit Bunches (FFB), plantations, and company social/CSR activities in Aceh Tamiang.'} />
      <GallerySection isFullPage={true} />
    </main>
  );
}
