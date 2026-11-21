'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { ScrollReveal } from '@/components/ScrollMotion';
import { INFO_PAGES } from '@/lib/infoPages';

export default function InfoPage() {
  const params = useParams<{ slug: string }>();
  const { lang } = useLanguage();
  const id = lang === 'id';
  const page = INFO_PAGES[params?.slug || ''];

  if (!page) {
    return (
      <main className="cinematic-page flex min-h-[60vh] flex-col items-center justify-center bg-[#f7f6f2] px-4 text-center text-slate-900">
        <h1 className="text-slate-900">{id ? 'Halaman tidak ditemukan' : 'Page not found'}</h1>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900">
          {id ? 'Kembali ke beranda' : 'Back to home'}<ArrowRight className="h-4 w-4" />
        </Link>
      </main>
    );
  }

  return (
    <main className="cinematic-page bg-[#f7f6f2] pb-24 pt-28 text-slate-900 sm:pt-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-16">
          {/* Foto di kiri */}
          <div className="lg:sticky lg:top-32">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={page.image}
                  alt=""
                  fill
                  priority
                  quality={75}
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            </div>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.25em] text-teal-700">
              {id ? page.eyebrowId : page.eyebrowEn}
            </p>
            <h1 className="mt-3 text-slate-900">{id ? page.titleId : page.titleEn}</h1>
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              {id ? page.descId : page.descEn}
            </p>

            <Link
              href={page.backHref}
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900"
            >
              {id ? page.backId : page.backEn}<ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Penjelasan di kanan */}
          <div className="space-y-10 border-l-0 border-slate-200 pl-0 lg:border-l lg:pl-12">
            {page.sections.map((section, index) => {
              const copy = id ? section.id : section.en;
              return (
                <section key={copy.title} className="border-b border-slate-200 pb-10 last:border-0 last:pb-0">
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h2 className="mt-3 text-slate-900">{copy.title}</h2>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                    {copy.body}
                  </p>
                  {copy.bullets && copy.bullets.length > 0 && (
                    <ul className="mt-5 space-y-2">
                      {copy.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
