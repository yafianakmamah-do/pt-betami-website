'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft, ArrowRight, X, Quote, Users,
  GraduationCap, Building2, CalendarDays, MapPin, Camera,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SmartIntern {
  id: string;
  name: string;
  experience: string;
  photo_url?: string;
  photoUrl?: string;
  university?: string;
  major?: string;
  period?: string;
  location?: string;
  is_published?: boolean;
  created_at?: string;
}

interface SmartInternCarouselProps {
  lang?: 'id' | 'en';
  /** 'page' = tampilan lengkap di /magang, 'home' = ringkasan di homepage. */
  variant?: 'home' | 'page';
}

const FALLBACK_PHOTO =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop&crop=face';
const PER_PAGE = 2;
/** 1-3 peserta ditampilkan semua tanpa tombol geser. */
const CAROUSEL_THRESHOLD = 3;

export default function SmartInternCarousel({ lang = 'id', variant = 'home' }: SmartInternCarouselProps) {
  const id = lang === 'id';
  const [interns, setInterns] = useState<SmartIntern[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIntern, setSelectedIntern] = useState<SmartIntern | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/interns', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const list = Array.isArray(data) ? data : data.items || data.interns || [];
        setInterns(Array.isArray(list) ? list : []);
      })
      .catch(() => { if (active) setInterns([]); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const total = interns.length;
  const isCarousel = total > CAROUSEL_THRESHOLD;
  const maxIndex = Math.max(0, total - PER_PAGE);

  const visible = useMemo(() => {
    if (!isCarousel) return interns;
    return interns.slice(currentIndex, currentIndex + PER_PAGE);
  }, [interns, currentIndex, isCarousel]);

  const goPrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const goNext = () => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isCarousel) return;
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isCarousel || touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) (diff > 0 ? goNext : goPrev)();
    touchStartX.current = null;
  };

  const photoOf = (intern: SmartIntern) => intern.photo_url || intern.photoUrl || FALLBACK_PHOTO;

  const metaOf = (intern: SmartIntern) => [
    intern.university && { icon: <Building2 className="h-3 w-3" />, text: intern.university },
    intern.major && { icon: <GraduationCap className="h-3 w-3" />, text: intern.major },
    intern.period && { icon: <CalendarDays className="h-3 w-3" />, text: intern.period },
    intern.location && { icon: <MapPin className="h-3 w-3" />, text: intern.location },
  ].filter(Boolean) as { icon: React.ReactNode; text: string }[];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white py-16 shadow-sm">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
        <p className="mt-4 text-xs font-semibold text-slate-500">
          {id ? 'Memuat cerita anak magang...' : 'Loading intern stories...'}
        </p>
      </div>
    );
  }

  const heading = variant === 'page'
    ? {
        eyebrow: id ? 'Foto & Cerita' : 'Photos & Notes',
        title: id ? 'Dokumentasi Anak Magang' : 'Intern Documentation',
        desc: id
          ? 'Foto berasal dari data yang diunggah admin. Klik kartu untuk membaca pengalaman lengkapnya.'
          : 'Photos come from data uploaded by the admin. Click a card to read the full experience.',
      }
    : {
        eyebrow: id ? 'Pengalaman Magang' : 'Internship Experience',
        title: id
          ? 'Simak kesan dan pesan beberapa pekerja magang kami sebelumnya.'
          : 'Hear from some of our former interns.',
        desc: '',
      };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className={variant === 'home' ? 'max-w-3xl' : 'max-w-2xl'}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-teal-700">
            <Users className="h-3 w-3" />
            {heading.eyebrow}
          </span>
          <h3 className={`mt-4 font-black tracking-tight text-slate-900 ${variant === 'page' ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-2xl lg:text-[26px]'}`}>
            {heading.title}
          </h3>
          {heading.desc && (
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{heading.desc}</p>
          )}
        </div>

        {/* Panah hanya muncul jika peserta lebih dari 3 */}
        {isCarousel && (
          <div className="flex shrink-0 items-center gap-2.5">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentIndex === 0}
              aria-label={id ? 'Sebelumnya' : 'Previous'}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[52px] text-center text-xs font-bold tabular-nums text-slate-500">
              {currentIndex + 1} / {maxIndex + 1}
            </span>
            <button
              type="button"
              onClick={goNext}
              disabled={currentIndex >= maxIndex}
              aria-label={id ? 'Berikutnya' : 'Next'}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {total === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Camera className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-semibold text-slate-600">
            {id
              ? 'Belum ada foto anak magang yang ditampilkan.'
              : 'No intern photos have been published yet.'}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            {id
              ? 'Foto dan pengalaman akan muncul setelah admin menambahkannya di dashboard.'
              : 'Photos and stories will appear once added by the admin dashboard.'}
          </p>
        </div>
      ) : (
        <div
          className={`mx-auto grid max-w-5xl gap-5 sm:gap-6 ${
            isCarousel || total === 2
              ? 'max-w-3xl grid-cols-1 sm:grid-cols-2'
              : total === 1
                ? 'max-w-sm grid-cols-1'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {visible.map((intern, index) => (
            <motion.button
              type="button"
              key={intern.id || index}
              onClick={() => setSelectedIntern(intern)}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="group mx-auto flex h-full w-full max-w-md flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl hover:shadow-slate-200/60 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
            >
              <div className="relative aspect-[5/4] w-full overflow-hidden bg-slate-100">
                <Image
                  src={photoOf(intern)}
                  alt={intern.name}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />
                {intern.period && (
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 backdrop-blur">
                    {intern.period}
                  </span>
                )}
                <div className="absolute bottom-4 left-5 right-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-200">
                    {id ? 'Anak Magang' : 'Intern'}
                  </p>
                  <h4 className="mt-0.5 text-xl font-extrabold text-white drop-shadow sm:text-2xl">
                    {intern.name}
                  </h4>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                {metaOf(intern).length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {metaOf(intern).map((meta, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200/70"
                      >
                        {meta.icon}{meta.text}
                      </span>
                    ))}
                  </div>
                )}
                <Quote className="h-5 w-5 text-teal-600/60" />
                <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-slate-700">
                  {intern.experience || (id ? 'Pengalaman akan segera ditambahkan.' : 'Story coming soon.')}
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-teal-700">
                  <span>{id ? 'Baca pengalaman lengkap' : 'Read full story'}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {isCarousel && (
        <div className="mt-7 flex items-center justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`${id ? 'Slide' : 'Slide'} ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === currentIndex ? 'w-7 bg-teal-700' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      )}

      {/* Modal detail pengalaman */}
      <AnimatePresence>
        {selectedIntern && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIntern(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={selectedIntern.name}
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelectedIntern(null)}
                aria-label={id ? 'Tutup' : 'Close'}
                className="absolute right-3.5 top-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/60 text-white transition hover:bg-slate-900"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex max-h-[90vh] flex-col sm:flex-row">
                {/* Foto di kiri, lebih kecil */}
                <div className="relative h-56 w-full shrink-0 overflow-hidden bg-slate-900 sm:h-auto sm:w-[42%] sm:min-h-[420px]">
                  <Image
                    src={photoOf(selectedIntern)}
                    alt={selectedIntern.name}
                    fill
                    unoptimized
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-200">
                      {id ? 'Anak Magang BETAMI' : 'BETAMI Intern'}
                    </p>
                    <h4 className="mt-1 text-xl font-extrabold tracking-tight">{selectedIntern.name}</h4>
                  </div>
                </div>

                {/* Penjelasan di kanan */}
                <div className="flex max-h-[50vh] flex-1 flex-col overflow-y-auto p-6 sm:max-h-[75vh] sm:p-8">
                  {metaOf(selectedIntern).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {metaOf(selectedIntern).map((meta, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
                        >
                          {meta.icon}{meta.text}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
                    <Quote className="h-4 w-4 text-teal-700" />
                    {id ? 'Kesan & Pengalaman Magang' : 'Internship Experience'}
                  </div>
                  <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-slate-800">
                      {selectedIntern.experience}
                    </p>
                  </div>
                  <div className="mt-6 pt-1 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedIntern(null)}
                      className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-slate-800"
                    >
                      {id ? 'Tutup' : 'Close'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
