'use client';
import { formatNewsDate } from '@/lib/news';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { getBuiltInGalleryNumber } from '@/lib/gallery';

export const authenticGallery = [
  { id: 1, src: '/images/pks-factory-real.jpg', category: 'mill', titleId: 'Pabrik Kelapa Sawit (PKS) PT BETAMI', titleEn: 'PT BETAMI Palm Oil Mill (PKS)', descId: 'Fasilitas pengolahan TBS menjadi CPO di area operasional Aceh Tamiang.', descEn: 'FFB to CPO processing facility in Aceh Tamiang operations area.' },
  { id: 2, src: '/images/tbs-harvest.jpg', category: 'product', titleId: 'Pemanenan & Pengumpulan TBS', titleEn: 'FFB Harvest & Collection', descId: 'Tandan Buah Segar hasil panen yang dikumpulkan untuk pengolahan di PKS.', descEn: 'Fresh fruit bunches collected for mill processing.' },
  { id: 3, src: '/images/fruit-oil-palm-real.jpg', category: 'product', titleId: 'Brondolan Buah Sawit Segar', titleEn: 'Fresh Loose Palm Fruits', descId: 'Buah kelapa sawit berkualitas sebagai bahan baku pengolahan minyak sawit.', descEn: 'Quality palm fruits as raw material for palm oil processing.' },
  { id: 4, src: '/images/palm-fruit-bunch.jpg', category: 'plantation', titleId: 'Tandan Buah Segar di Pohon', titleEn: 'Fresh Fruit Bunch on Tree', descId: 'TBS matang pada pohon kelapa sawit siap dipanen.', descEn: 'Ripe fresh fruit bunch ready for harvest.' },
  { id: 5, src: '/images/estate-jambi.jpg', category: 'plantation', titleId: 'Perkebunan & Jalan Operasional', titleEn: 'Estate & Operational Roads', descId: 'Infrastruktur kebun dan jalan pendukung distribusi TBS/CPO.', descEn: 'Estate infrastructure and roads supporting FFB/CPO logistics.' },
  { id: 6, src: '/images/kegiatan/csr-betami-juli-2026.jpeg', category: 'csr', titleId: 'Kegiatan Sosial & CSR PT BETAMI', titleEn: 'PT BETAMI Social & CSR Activities', descId: 'Dokumentasi kegiatan sosial perusahaan bersama masyarakat desa sekitar (Sumber: pemberitaan publik).', descEn: 'Company social activities with nearby villages (Source: public news).' },
  { id: 7, src: '/images/kegiatan/csr-sembako-betami.jpg', category: 'csr', titleId: 'Penyaluran Bantuan Sembako', titleEn: 'Food Aid Distribution', descId: 'Program bantuan sembako bagi warga di desa sekitar operasional perusahaan (Sumber: pemberitaan publik).', descEn: 'Food aid program for residents near operational area (Source: public news).' },
  { id: 8, src: '/images/pks-mill-ramp.jpg', category: 'mill', titleId: 'Area Penerimaan TBS', titleEn: 'FFB Receiving Area', descId: 'Area penerimaan dan penanganan TBS sebelum proses pengolahan pabrik.', descEn: 'FFB receiving and handling area before mill processing.' },
  { id: 9, src: '/images/plantation-1.jpg', category: 'plantation', titleId: 'Hamparan Perkebunan Kelapa Sawit', titleEn: 'Oil Palm Plantation Landscape', descId: 'Lanskap perkebunan kelapa sawit sebagai bagian dari rantai pasok TBS.', descEn: 'Oil palm plantation landscape supporting FFB supply chain.' },
  { id: 10, src: '/images/aerial-palm-estate.jpg', category: 'aerial', titleId: 'Hamparan Kebun Sawit dari Atas', titleEn: 'Palm Estate from Above', descId: 'Foto udara hamparan kebun kelapa sawit dengan pola blok tanaman yang tertata (ilustrasi industri).', descEn: 'Aerial view of oil palm estate with neatly arranged planting blocks (industry illustration).' },
  { id: 11, src: '/images/estate-road-aerial-hd.jpg', category: 'aerial', titleId: 'Jalan Kebun Menembus Blok Tanaman', titleEn: 'Estate Road Across Planting Blocks', descId: 'Jalan operasional kebun yang menghubungkan blok tanaman menuju titik pengumpulan TBS (ilustrasi industri).', descEn: 'Operational estate road linking planting blocks to FFB collection points (industry illustration).' },
  { id: 12, src: '/images/pks-aerial-hd.jpg', category: 'mill', titleId: 'Kompleks Pabrik Kelapa Sawit (Udara)', titleEn: 'Palm Oil Mill Complex (Aerial)', descId: 'Tampak udara kompleks PKS beserta area penerimaan TBS dan tangki penyimpanan (ilustrasi industri).', descEn: 'Aerial view of the mill complex with FFB receiving area and storage tanks (industry illustration).' },
  { id: 13, src: '/images/palm-nursery-hd.jpg', category: 'plantation', titleId: 'Pembibitan Kelapa Sawit', titleEn: 'Oil Palm Seedling Nursery', descId: 'Ribuan bibit kelapa sawit dalam polybag siap ditanam — awal dari siklus kebun sawit (ilustrasi industri).', descEn: 'Thousands of oil palm seedlings in polybags ready for planting — the start of the estate cycle (industry illustration).' },
  { id: 14, src: '/images/ffb-harvest-hd.jpg', category: 'product', titleId: 'Tandan Buah Segar Hasil Panen', titleEn: 'Freshly Harvested Fruit Bunches', descId: 'Tandan Buah Segar berwarna merah-oranye yang baru dipanen dan siap diolah (ilustrasi industri).', descEn: 'Freshly harvested red-orange fruit bunches ready for processing (industry illustration).' },
  { id: 15, src: '/images/cpo-kernel-hd.jpg', category: 'product', titleId: 'CPO & Inti Sawit', titleEn: 'CPO & Palm Kernel', descId: 'Produk olahan utama: Crude Palm Oil (CPO) berwarna keemasan dan inti sawit (ilustrasi produk).', descEn: 'Main outputs: golden Crude Palm Oil (CPO) and palm kernel (product illustration).' },
  { id: 16, src: '/images/palm-canopy-sunset-hd.jpg', category: 'aerial', titleId: 'Kanopi Kebun Sawit Saat Senja', titleEn: 'Palm Canopy at Sunset', descId: 'Pemandangan kanopi kebun sawit dari udara saat matahari terbenam di wilayah Aceh Tamiang (ilustrasi industri).', descEn: 'Aerial view of palm canopy at sunset over the Aceh Tamiang area (industry illustration).' },
  { id: 17, src: '/images/palm-fruit-tree.jpg', category: 'plantation', titleId: 'Buah Sawit di Atas Pohon', titleEn: 'Palm Fruit on Tree', descId: 'Buah kelapa sawit segar yang sudah matang di atas pohon.', descEn: 'Ripe fresh palm fruit hanging on the tree.' },
  { id: 18, src: '/images/palm-fruit.jpg', category: 'product', titleId: 'Hasil Panen Buah Sawit', titleEn: 'Palm Harvest Result', descId: 'Hasil panen buah sawit segar dari kebun.', descEn: 'Fresh palm harvest result from the estate.' },
  { id: 19, src: '/images/palm-kernel.jpg', category: 'product', titleId: 'Inti Sawit (Palm Kernel)', titleEn: 'Palm Kernel', descId: 'Inti sawit sebagai produk turunan CPO.', descEn: 'Palm kernel as a CPO derivative.' },
  { id: 20, src: '/images/cpo-product.jpg', category: 'product', titleId: 'Produk CPO', titleEn: 'CPO Product', descId: 'Crude Palm Oil (CPO) hasil olahan pabrik.', descEn: 'Crude Palm Oil output from the mill.' },
  { id: 21, src: '/images/factory.jpg', category: 'mill', titleId: 'Fasilitas Pabrik', titleEn: 'Mill Facility', descId: 'Fasilitas pabrik kelapa sawit PT BETAMI.', descEn: 'PT BETAMI palm oil mill facility.' },
  { id: 22, src: '/images/hero-palm.jpg', category: 'plantation', titleId: 'Lanskap Kebun Sawit', titleEn: 'Palm Landscape', descId: 'Lanskap perkebunan kelapa sawit.', descEn: 'Oil palm plantation landscape.' },
  { id: 23, src: '/images/internship.jpg', category: 'csr', titleId: 'Kegiatan CSR & Kemitraan', titleEn: 'CSR & Community Activities', descId: 'Kegiatan sosial perusahaan bersama masyarakat desa sekitar.', descEn: 'Company social activities with nearby village communities.' },
  { id: 24, src: '/images/about-palm.jpg', category: 'plantation', titleId: 'Sawit untuk Kehidupan', titleEn: 'Palm for Life', descId: 'Sawit sebagai sumber kehidupan masyarakat.', descEn: 'Palm as community livelihood.' },
];

type GalleryItem = {
  id: string | number;
  src: string;
  category: string;
  titleId: string;
  titleEn: string;
  descId: string;
  descEn: string;
  sourceKey?: string;
  takenAt?: string | null;
};

export default function GallerySection({ isFullPage = false }: { isFullPage?: boolean }) {
  const { lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [databaseGallery, setDatabaseGallery] = useState<GalleryItem[]>([]);
  const [galleryUnavailable, setGalleryUnavailable] = useState(false);
  const reduceMotion = useReducedMotion();

  const galleryError = galleryUnavailable
    ? lang === 'id'
      ? 'Foto terbaru belum dapat dimuat. Foto yang tersedia tetap ditampilkan.'
      : 'The latest photos could not be loaded. Available photos are still shown.'
    : '';

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/gallery', { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json() as {
          configured?: boolean;
          items?: Array<{
            id: string;
            image_url: string;
            storage_path: string;
            category: string;
            title_id: string;
            title_en: string;
            description_id: string;
            description_en: string;
            taken_at?: string | null;
          }>;
          error?: string;
        };
        if (!response.ok) throw new Error(result.error || 'Galeri tambahan tidak dapat dimuat.');
        if (result.configured && result.items) {
          setDatabaseGallery(result.items.map((item) => ({
            id: item.id,
            src: item.image_url,
            category: item.category,
            titleId: item.title_id,
            titleEn: item.title_en,
            descId: item.description_id,
            descEn: item.description_en,
            takenAt: item.taken_at ?? null,
            sourceKey: getBuiltInGalleryNumber(item.id) ? `builtin:${getBuiltInGalleryNumber(item.id)}` : undefined,
          })));
        }
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error('Gallery content load failed:', error);
        setGalleryUnavailable(true);
      });

    return () => controller.abort();
  }, []);

  const managedDefaults = new Set(databaseGallery.map((item) => item.sourceKey).filter(Boolean));
  const allGallery: GalleryItem[] = [
    ...databaseGallery,
    ...authenticGallery.filter((item) => !managedDefaults.has(`builtin:${item.id}`)),
  ];
  const filteredItems = selectedCategory === 'all' ? allGallery : allGallery.filter((item) => item.category === selectedCategory);

  const openLightbox = (index: number) => setActiveImageIndex(index);
  const closeLightbox = () => setActiveImageIndex(null);
  const nextImage = () => { if (activeImageIndex !== null) setActiveImageIndex((activeImageIndex + 1) % filteredItems.length); };
  const prevImage = () => { if (activeImageIndex !== null) setActiveImageIndex((activeImageIndex - 1 + filteredItems.length) % filteredItems.length); };

  useEffect(() => {
    if (activeImageIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowRight') nextImage();
      if (event.key === 'ArrowLeft') prevImage();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, filteredItems.length]);

  const cats = [
    { id: 'all', label: lang === 'id' ? 'Semua Foto' : 'All Photos' },
    { id: 'aerial', label: lang === 'id' ? 'Foto Udara (Dari Atas)' : 'Aerial (From Above)' },
    { id: 'mill', label: lang === 'id' ? 'Pabrik (PKS)' : 'Mill (PKS)' },
    { id: 'plantation', label: lang === 'id' ? 'Perkebunan' : 'Plantation' },
    { id: 'product', label: 'TBS & CPO' },
    { id: 'csr', label: lang === 'id' ? 'CSR & Kegiatan' : 'CSR & Activities' },
  ];

  return (
    <section id="galeri" className={`py-16 sm:py-20 ${isFullPage ? 'bg-slate-50' : 'bg-slate-50 border-y border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isFullPage && (
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-700 block mb-1">{lang === 'id' ? 'Dokumentasi Visual' : 'Visual Gallery'}</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{lang === 'id' ? 'Galeri Operasional & Kegiatan PT BETAMI' : 'PT BETAMI Operations & Activities Gallery'}</h2>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl">{lang === 'id' ? 'Kumpulan foto fasilitas PKS, buah/TBS sawit, perkebunan, serta dokumentasi kegiatan sosial perusahaan.' : 'Photos of PKS facilities, palm fruits/FFB, plantations, and company social activities.'}</p>
            </div>
            <Link href="/galeri" className="mt-4 md:mt-0 text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 uppercase tracking-wider transition">
              <span>{lang === 'id' ? 'Buka Galeri Lengkap' : 'Open Full Gallery'}</span><ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-8">
          {cats.map((c) => (
            <button key={c.id} onClick={() => setSelectedCategory(c.id)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition border ${selectedCategory === c.id ? 'bg-teal-700 text-white border-teal-700 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}`}>{c.label}</button>
          ))}
        </div>
        {galleryError && <p className="mb-5 text-xs text-amber-800" role="status">{galleryError}</p>}

        <div className="gallery-editorial-grid">
          {filteredItems.map((item, index) => {
            const title = lang === 'id' ? item.titleId : item.titleEn;
            const desc = lang === 'id' ? item.descId : item.descEn;
            return (
              <motion.button
                type="button"
                key={item.id}
                onClick={() => openLightbox(index)}
                className="gallery-editorial-item group"
                aria-label={`${lang === 'id' ? 'Buka foto' : 'Open photo'}: ${title}`}
                whileHover={reduceMotion ? undefined : { y: -5 }}
                whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image src={item.src} alt={title} fill quality={75} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="gallery-editorial-item__image object-cover object-center group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-sm font-bold drop-shadow">{title}</h3>
                  <p className="text-[11px] text-slate-200 mt-1 line-clamp-2">{desc}</p>
                </div>
                <span className="gallery-editorial-item__index">{String(index + 1).padStart(2, '0')} / {String(filteredItems.length).padStart(2, '0')}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeImageIndex !== null && filteredItems[activeImageIndex] && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={lang === 'id' ? 'Galeri foto BETAMI' : 'BETAMI photo gallery'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.28 }}
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-5 right-5 p-2 text-white/80 hover:text-white" aria-label={lang === 'id' ? 'Tutup galeri' : 'Close gallery'}><X className="h-7 w-7" /></button>
            <button onClick={(event) => { event.stopPropagation(); prevImage(); }} className="absolute left-3 p-2 text-white/80 hover:text-white sm:left-6" aria-label={lang === 'id' ? 'Foto sebelumnya' : 'Previous photo'}><ChevronLeft className="h-8 w-8" /></button>
            <button onClick={(event) => { event.stopPropagation(); nextImage(); }} className="absolute right-3 p-2 text-white/80 hover:text-white sm:right-6" aria-label={lang === 'id' ? 'Foto berikutnya' : 'Next photo'}><ChevronRight className="h-8 w-8" /></button>
            <motion.figure
              key={filteredItems[activeImageIndex].id}
              className="relative flex max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-[#0d1410] shadow-2xl"
              initial={{ opacity: 0, y: 24, scale: reduceMotion ? 1 : 0.965 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: reduceMotion ? 1 : 0.98 }}
              transition={{ duration: reduceMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              {/* KIRI: Foto */}
              <div className="relative w-full sm:w-[62%] flex-shrink-0 bg-black" style={{ minHeight: '340px', maxHeight: '88vh' }}>
                <Image
                  src={filteredItems[activeImageIndex].src}
                  alt={lang === 'id' ? filteredItems[activeImageIndex].titleId : filteredItems[activeImageIndex].titleEn}
                  fill
                  quality={85}
                  sizes="(max-width: 640px) 100vw, 60vw"
                  className="object-contain"
                  priority
                />
                {/* Nomor foto */}
                <span className="absolute top-3 left-3 text-[11px] font-bold text-white/60 tracking-widest bg-black/40 px-2 py-0.5 rounded">
                  {String(activeImageIndex + 1).padStart(2, '0')} / {String(filteredItems.length).padStart(2, '0')}
                </span>
              </div>

              {/* KANAN: Penjelasan */}
              <figcaption className="hidden sm:flex flex-col justify-between p-7 w-[38%] border-l border-white/8 text-white">
                <div className="space-y-5">
                  {/* Kategori badge */}
                  <span className="inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-teal-800/60 border border-teal-600/30 text-teal-300">
                    {filteredItems[activeImageIndex].category}
                  </span>
                  {/* Judul */}
                  <h3 className="text-xl font-extrabold leading-tight tracking-tight text-white">
                    {lang === 'id' ? filteredItems[activeImageIndex].titleId : filteredItems[activeImageIndex].titleEn}
                  </h3>
                  {filteredItems[activeImageIndex].takenAt && (
                    <p className="text-xs font-semibold text-amber-300">
                      {formatNewsDate(filteredItems[activeImageIndex].takenAt as string, lang)}
                    </p>
                  )}
                  {/* Deskripsi */}
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {lang === 'id' ? filteredItems[activeImageIndex].descId : filteredItems[activeImageIndex].descEn}
                  </p>
                  {/* Garis emas dekoratif */}
                  <div className="h-px w-16 mt-1" style={{ background: 'linear-gradient(90deg, #d3a832, transparent)' }} />
                </div>

                {/* Navigasi bawah */}
                <div className="flex items-center gap-3 mt-6">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="flex items-center justify-center w-9 h-9 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition"
                    aria-label={lang === 'id' ? 'Foto sebelumnya' : 'Previous photo'}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="flex items-center justify-center w-9 h-9 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition"
                    aria-label={lang === 'id' ? 'Foto berikutnya' : 'Next photo'}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <span className="text-xs text-slate-500 ml-auto">
                    {lang === 'id' ? 'Tekan ← → untuk navigasi' : 'Press ← → to navigate'}
                  </span>
                </div>
              </figcaption>

              {/* Mobile: judul di bawah foto */}
              <div className="sm:hidden absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent text-white">
                <h3 className="text-sm font-bold">
                  {lang === 'id' ? filteredItems[activeImageIndex].titleId : filteredItems[activeImageIndex].titleEn}
                </h3>
                {filteredItems[activeImageIndex].takenAt && (
                  <p className="text-[11px] font-semibold text-amber-300 mt-1">{formatNewsDate(filteredItems[activeImageIndex].takenAt as string, lang)}</p>
                )}
                <p className="text-[11px] text-slate-300 mt-1">
                  {lang === 'id' ? filteredItems[activeImageIndex].descId : filteredItems[activeImageIndex].descEn}
                </p>
              </div>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
