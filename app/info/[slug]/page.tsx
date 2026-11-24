'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { ScrollReveal } from '@/components/ScrollMotion';
import EditorialHero from '@/components/EditorialHero';
import { INFO_PAGES } from '@/lib/infoPages';

const GROUPS: Record<string, { id: string; en: string; slugs: string[] }> = {
  business: { id: 'Bisnis', en: 'Business', slugs: ['pasokan-tbs', 'pabrik-kelapa-sawit', 'cpo-inti-sawit'] },
  about: { id: 'Tentang Kami', en: 'About Us', slugs: ['profil-lokasi', 'kemitraan-desa', 'pengalaman-operasional', 'informasi-publik'] },
};

export default function InfoPage() {
  const params = useParams<{ slug: string }>();
  const { lang } = useLanguage();
  const id = lang === 'id';
  const reduceMotion = useReducedMotion();
  const slug = params?.slug || '';
  const page = INFO_PAGES[slug];

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

  const group = Object.values(GROUPS).find((g) => g.slugs.includes(slug)) ?? GROUPS.about;
  const siblings = group.slugs.filter((s) => INFO_PAGES[s]);
  const position = siblings.indexOf(slug);
  const next = siblings[(position + 1) % siblings.length];
  const nextPage = next && next !== slug ? INFO_PAGES[next] : null;

  return (
    <main className="cinematic-page bg-[#f7f6f2] text-slate-900">
      <EditorialHero
        image={page.image}
        eyebrow={`${id ? group.id : group.en} · ${id ? page.eyebrowId : page.eyebrowEn}`}
        title={id ? page.titleId : page.titleEn}
        description={id ? page.descId : page.descEn}
        actions={[{ href: page.backHref, label: id ? page.backId : page.backEn, variant: 'secondary' }]}
      />

      <nav aria-label={id ? group.id : group.en} className="relative z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {siblings.map((s, index) => {
            const active = s === slug;
            return (
              <Link key={s} href={`/info/${s}`} aria-current={active ? 'page' : undefined} className={`relative shrink-0 px-4 py-2 text-xs font-bold transition sm:text-sm ${active ? 'text-teal-900' : 'text-slate-500 hover:text-teal-800'}`}>
                <span className="mr-2 text-amber-600">{String(index + 1).padStart(2, '0')}</span>
                {id ? INFO_PAGES[s].titleId : INFO_PAGES[s].titleEn}
                {active && <motion.span layoutId="info-tab" className="absolute inset-x-2 -bottom-3 h-[3px] bg-gradient-to-r from-teal-700 to-amber-500" />}
              </Link>
            );
          })}
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
          <aside className="hidden lg:block">
            <div className="sticky top-36">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600">{id ? 'Di halaman ini' : 'On this page'}</p>
              <ol className="mt-5 space-y-1 border-l border-slate-200">
                {page.sections.map((section, index) => {
                  const copy = id ? section.id : section.en;
                  return (
                    <li key={copy.title}>
                      <a href={`#bagian-${index + 1}`} className="-ml-px block border-l-2 border-transparent py-2 pl-4 text-sm font-semibold text-slate-500 transition hover:border-amber-500 hover:text-teal-900">{copy.title}</a>
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>

          <div className="space-y-8">
            {page.sections.map((section, index) => {
              const copy = id ? section.id : section.en;
              return (
                <ScrollReveal key={copy.title} delay={0.05}>
                  <section id={`bagian-${index + 1}`} className="group relative scroll-mt-40 overflow-hidden bg-white p-7 shadow-sm ring-1 ring-slate-200 transition duration-500 hover:shadow-xl hover:ring-teal-200 sm:p-10">
                    <span className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-gradient-to-b from-teal-600 to-amber-500 transition duration-500 group-hover:scale-y-100" />
                    <span aria-hidden="true" className="pointer-events-none absolute -right-2 -top-6 select-none text-[120px] font-black leading-none text-slate-100 transition duration-500 group-hover:text-amber-50">{String(index + 1).padStart(2, '0')}</span>
                    <div className="relative">
                      <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600">{id ? 'Bagian' : 'Part'} {String(index + 1).padStart(2, '0')}</span>
                      <h2 className="mt-3 bg-gradient-to-r from-teal-950 via-teal-800 to-teal-600 bg-clip-text pb-1 text-transparent">{copy.title}</h2>
                      <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">{copy.body}</p>
                      {copy.bullets && copy.bullets.length > 0 && (
                        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                          {copy.bullets.map((bullet, bulletIndex) => (
                            <motion.li
                              key={bullet}
                              initial={reduceMotion ? false : { opacity: 0, x: -16 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, delay: 0.1 + bulletIndex * 0.07 }}
                              className="flex items-start gap-3 bg-[#f7f6f2] p-4 text-sm leading-relaxed text-slate-700"
                            >
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                              {bullet}
                            </motion.li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </section>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#0f2a22] text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8">
          <Link href={page.backHref} className="group flex items-center gap-4 text-teal-100 transition hover:text-white">
            <span className="flex h-12 w-12 items-center justify-center border border-teal-400/40 transition group-hover:border-amber-400 group-hover:bg-amber-400 group-hover:text-teal-950"><ArrowLeft className="h-5 w-5" /></span>
            <span className="text-sm font-bold">{id ? page.backId : page.backEn}</span>
          </Link>
          {nextPage && (
            <Link href={`/info/${next}`} className="group relative flex items-center justify-end gap-5 overflow-hidden text-right">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">{id ? 'Selanjutnya' : 'Next'}</p>
                <p className="mt-1 text-lg font-extrabold text-white transition group-hover:text-amber-300 sm:text-xl">{id ? nextPage.titleId : nextPage.titleEn}</p>
              </div>
              <span className="relative h-16 w-24 shrink-0 overflow-hidden">
                <Image src={nextPage.image} alt="" fill sizes="96px" className="object-cover transition duration-500 group-hover:scale-110" />
              </span>
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
