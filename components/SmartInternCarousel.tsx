'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, X, Quote, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SmartIntern {
  id: string;
  name: string;
  experience: string;
  photo_url?: string;
  photoUrl?: string;
}

interface SmartInternCarouselProps {
  lang?: 'id' | 'en';
}

export default function SmartInternCarousel({ lang = 'id' }: SmartInternCarouselProps) {
  const [interns, setInterns] = useState<SmartIntern[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIntern, setSelectedIntern] = useState<SmartIntern | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const touchStartX = useRef<number | null>(null);

  const fetchInterns = async () => {
    try {
      const res = await fetch('/api/interns', { cache: 'no-store' });
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.items || data.interns || [];
      if (list.length > 0) {
        setInterns(list);
      }
    } catch (e) {
      console.error('Failed to load interns', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  const total = interns.length;
  const prevSlide = () => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };
  const nextSlide = () => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="w-8 h-8 border-3 border-slate-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-medium text-slate-500">Memuat pengalaman magang...</p>
      </div>
    );
  }

  if (total === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Section Header: Title on Left, Round Arrow Controls on Right (Style SMART Tbk) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h3 className="text-xl sm:text-2xl lg:text-[26px] font-black text-slate-900 tracking-tight">
          Simak kesan dan pesan beberapa pekerja magang kami sebelumnya.
        </h3>

        {total > 1 && (
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={prevSlide}
              aria-label="Sebelumnya"
              className="w-11 h-11 rounded-full border border-slate-300 hover:border-slate-800 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 flex items-center justify-center transition-all active:scale-95 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Berikutnya"
              className="w-11 h-11 rounded-full border border-slate-300 hover:border-slate-800 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 flex items-center justify-center transition-all active:scale-95 shadow-sm"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Cards Viewport */}
      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* Displays the 2 visible cards at current index */}
          {Array.from({ length: Math.min(total, 2) }).map((_, offset) => {
            const index = (currentIndex + offset) % total;
            const intern = interns[index];
            const photoSrc =
              intern.photo_url ||
              intern.photoUrl ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face';

            return (
              <div
                key={intern.id || index}
                onClick={() => setSelectedIntern(intern)}
                className="group cursor-pointer bg-white rounded-2xl border border-slate-200/90 hover:border-slate-400 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Photo: Clean, clear, full aspect */}
                <div className="relative aspect-[16/10] sm:aspect-[16/11] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={photoSrc}
                    alt={intern.name}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-white text-base sm:text-lg font-bold drop-shadow-sm">
                      {intern.name}
                    </span>
                  </div>
                </div>

                {/* Experience text only */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed line-clamp-4 font-normal">
                    "{intern.experience}"
                  </p>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                    <span>Baca Pengalaman Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pop-Up Modal Detail Pengalaman */}
      <AnimatePresence>
        {selectedIntern && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setSelectedIntern(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedIntern(null)}
                aria-label="Tutup"
                className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden shrink-0">
                <Image
                  src={selectedIntern.photo_url || selectedIntern.photoUrl || ''}
                  alt={selectedIntern.name}
                  fill
                  unoptimized
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <h4 className="text-xl sm:text-2xl font-bold tracking-tight">
                    {selectedIntern.name}
                  </h4>
                </div>
              </div>

              <div className="p-6 sm:p-7 overflow-y-auto space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                  <Quote className="w-4 h-4 text-teal-700" />
                  <span>Kesan & Pengalaman Magang</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">
                    {selectedIntern.experience}
                  </p>
                </div>

                <div className="pt-2 text-right">
                  <button
                    onClick={() => setSelectedIntern(null)}
                    className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
