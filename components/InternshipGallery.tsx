'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

type InternshipGalleryProps = {
  lang: 'id' | 'en';
};

const photos = [
  {
    src: '/images/pks-aerial-hd.jpg',
    id: 'Kompleks pabrik kelapa sawit dari udara',
    en: 'Aerial view of a palm oil mill complex',
  },
  {
    src: '/images/estate-road-aerial-hd.jpg',
    id: 'Jalan operasional di antara blok kebun',
    en: 'Estate road between plantation blocks',
  },
  {
    src: '/images/ffb-harvest-hd.jpg',
    id: 'Tandan buah segar siap diolah',
    en: 'Fresh fruit bunches ready for processing',
  },
  {
    src: '/images/cpo-kernel-hd.jpg',
    id: 'Minyak sawit dan inti sawit',
    en: 'Palm oil and palm kernel',
  },
];

export default function InternshipGallery({ lang }: InternshipGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const swipeStartX = useRef<number | null>(null);
  const suppressClick = useRef(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;
  const isOpen = activeIndex !== null;

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      const currentIndex = activeIndexRef.current;
      if (currentIndex === null) return;

      if (event.key === 'Escape') {
        setActiveIndex(null);
      } else if (event.key === 'ArrowRight') {
        setActiveIndex((currentIndex + 1) % photos.length);
      } else if (event.key === 'ArrowLeft') {
        setActiveIndex((currentIndex - 1 + photos.length) % photos.length);
      } else if (event.key === 'Tab') {
        const controls = Array.from(
          document.querySelectorAll<HTMLButtonElement>(
            '.internship-lightbox__close, .internship-lightbox__previous, .internship-lightbox__next',
          ),
        );
        const firstControl = controls[0];
        const lastControl = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === firstControl) {
          event.preventDefault();
          lastControl?.focus();
        } else if (!event.shiftKey && document.activeElement === lastControl) {
          event.preventDefault();
          firstControl?.focus();
        }
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen]);

  const caption = (photo: (typeof photos)[number]) =>
    `${lang === 'id' ? photo.id : photo.en} — ${lang === 'id' ? 'Foto ilustrasi lingkungan industri, bukan dokumentasi peserta magang.' : 'Illustrative industry photo, not intern documentation.'}`;

  const showPrevious = () => setCarouselIndex((current) => (current - 1 + photos.length) % photos.length);
  const showNext = () => setCarouselIndex((current) => (current + 1) % photos.length);
  const displayedPhoto = photos[carouselIndex];

  return (
    <>
      <div className="internship-gallery">
        <div className="internship-gallery__viewport">
          <motion.div
            className="internship-gallery__slide"
            onPointerDown={(event) => {
              if (!event.isPrimary) return;
              swipeStartX.current = event.clientX;
              event.currentTarget
                .querySelector<HTMLButtonElement>('.internship-gallery__item')
                ?.setPointerCapture(event.pointerId);
            }}
            onPointerUp={(event) => {
              if (swipeStartX.current === null) return;
              const distance = event.clientX - swipeStartX.current;
              swipeStartX.current = null;
              if (Math.abs(distance) < 70) return;
              suppressClick.current = true;
              window.setTimeout(() => {
                suppressClick.current = false;
              }, 0);
              if (distance < 0) showNext();
              else showPrevious();
            }}
            onPointerCancel={() => {
              swipeStartX.current = null;
            }}
            initial={reduceMotion ? false : { opacity: 0.75, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
          >
            <button
              type="button"
              className="internship-gallery__item"
              onClick={(event) => {
                if (suppressClick.current) {
                  event.preventDefault();
                  suppressClick.current = false;
                  return;
                }
                setActiveIndex(carouselIndex);
              }}
              aria-label={`${lang === 'id' ? 'Perbesar foto' : 'View photo'}: ${caption(displayedPhoto)}`}
            >
              <Image
                src={displayedPhoto.src}
                alt=""
                fill
                quality={75}
                sizes="(max-width: 760px) 100vw, 72vw"
                className="internship-gallery__image"
              />
              <span className="internship-gallery__count">0{carouselIndex + 1} / 0{photos.length}</span>
              <span className="internship-gallery__caption">{caption(displayedPhoto)}</span>
            </button>
          </motion.div>
        </div>
        <div className="internship-gallery__controls">
          <button type="button" onClick={showPrevious} aria-label={lang === 'id' ? 'Foto sebelumnya' : 'Previous photo'}>
            <ChevronLeft aria-hidden="true" />
          </button>
          <div className="internship-gallery__pagination" aria-label={lang === 'id' ? 'Pilih foto' : 'Choose a photo'}>
            {photos.map((photo, index) => (
              <button
                key={photo.src}
                type="button"
                aria-label={`${lang === 'id' ? 'Tampilkan foto' : 'Show photo'} ${index + 1}: ${lang === 'id' ? photo.id : photo.en}`}
                aria-current={index === carouselIndex ? 'true' : undefined}
                onClick={() => setCarouselIndex(index)}
              />
            ))}
          </div>
          <button type="button" onClick={showNext} aria-label={lang === 'id' ? 'Foto berikutnya' : 'Next photo'}>
            <ChevronRight aria-hidden="true" />
          </button>
          <span>{lang === 'id' ? 'Geser foto untuk melihat berikutnya' : 'Swipe the photo to explore'}</span>
        </div>
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
        <motion.div
          className="internship-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'id' ? 'Galeri foto operasional BETAMI' : 'BETAMI operations photo gallery'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.25 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveIndex(null);
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="internship-lightbox__close"
            onClick={() => setActiveIndex(null)}
            aria-label={lang === 'id' ? 'Tutup galeri' : 'Close gallery'}
          >
            <X aria-hidden="true" />
          </button>
          <button
            type="button"
            className="internship-lightbox__previous"
            onClick={() => setActiveIndex((activeIndex - 1 + photos.length) % photos.length)}
            aria-label={lang === 'id' ? 'Foto sebelumnya' : 'Previous photo'}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <motion.figure
            key={activeIndex}
            className="internship-lightbox__figure"
            initial={{ opacity: 0, y: 20, scale: reduceMotion ? 1 : 0.965 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: reduceMotion ? 1 : 0.985 }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="internship-lightbox__image">
              <Image
                src={photos[activeIndex].src}
                alt={caption(photos[activeIndex])}
                fill
                quality={75}
                sizes="100vw"
                priority
                className="object-contain"
              />
            </div>
            <figcaption>{caption(photos[activeIndex])}</figcaption>
          </motion.figure>
          <button
            type="button"
            className="internship-lightbox__next"
            onClick={() => setActiveIndex((activeIndex + 1) % photos.length)}
            aria-label={lang === 'id' ? 'Foto berikutnya' : 'Next photo'}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
