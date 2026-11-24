'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CalendarDays, Newspaper } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import EditorialHero from '@/components/EditorialHero';
import NewsCard from '@/components/NewsCard';
import { FALLBACK_NEWS, NEWS_CATEGORIES, formatNewsDate, type NewsPost } from '@/lib/news';

export default function BeritaPage() {
  const { lang } = useLanguage();
  const id = lang === 'id';
  const reduceMotion = useReducedMotion();
  const [news, setNews] = useState<NewsPost[]>(FALLBACK_NEWS);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/berita', { signal: controller.signal })
      .then((r) => r.json())
      .then((j: { items?: NewsPost[] }) => { if (j.items?.length) setNews(j.items); })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => category === 'all' ? news : news.filter((n) => n.category === category), [news, category]);
  const [featured, ...rest] = filtered;
  const categories = ['all', ...Object.keys(NEWS_CATEGORIES).filter((c) => news.some((n) => n.category === c))];
  const label = (c: string) => c === 'all' ? (id ? 'Semua' : 'All') : (NEWS_CATEGORIES[c]?.[lang] ?? c);

  return (
    <main className="cinematic-page bg-[#f7f6f2] text-slate-900">
      <EditorialHero
        image="/images/kegiatan/csr-betami-juli-2026.jpeg"
        eyebrow={id ? 'BERITA & KABAR TERBARU' : 'NEWS & UPDATES'}
        title={id ? 'Kabar dari BETAMI.' : 'News from BETAMI.'}
        description={id ? 'Informasi terbaru seputar kegiatan perusahaan, program sosial, dan operasional Pabrik Kelapa Sawit PT BETAMI di Aceh Tamiang.' : 'The latest on company activities, social programs, and PT BETAMI palm oil mill operations in Aceh Tamiang.'}
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600">{id ? 'Ruang Berita' : 'Newsroom'}</p>
            <h2 className="mt-2 bg-gradient-to-r from-teal-900 via-teal-700 to-amber-600 bg-clip-text text-transparent">{id ? 'Berita Terbaru' : 'Latest News'}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} type="button" onClick={() => setCategory(c)} className={`rounded-full px-4 py-2 text-xs font-bold transition ${category === c ? 'bg-teal-800 text-white shadow-md shadow-teal-900/20' : 'border border-slate-300 bg-white text-slate-600 hover:border-teal-600 hover:text-teal-800'}`}>{label(c)}</button>
            ))}
          </div>
        </div>

        {!featured ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
            <Newspaper className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3">{id ? 'Belum ada berita di kategori ini.' : 'No news in this category yet.'}</p>
          </div>
        ) : (
          <>
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <Link href={`/berita/${featured.slug}`} className="group grid overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 transition hover:shadow-2xl lg:grid-cols-[1.2fr_1fr]">
                <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[380px]">
                  <Image src={featured.cover_url || '/images/pks-factory-real.jpg'} alt="" fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-950/50 to-transparent" />
                  <span className="absolute left-5 top-5 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-teal-950">{id ? 'Sorotan' : 'Featured'}</span>
                </div>
                <div className="flex flex-col justify-center p-7 sm:p-10">
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                    <span className="rounded-full bg-teal-50 px-3 py-1 font-bold text-teal-800">{label(featured.category)}</span>
                    <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatNewsDate(featured.published_at, lang)}</span>
                  </div>
                  <h3 className="mt-4 text-2xl font-extrabold leading-tight text-slate-900 transition group-hover:text-teal-800 sm:text-3xl">{id ? featured.title_id : featured.title_en || featured.title_id}</h3>
                  <p className="mt-4 leading-relaxed text-slate-600">{id ? featured.excerpt_id : featured.excerpt_en || featured.excerpt_id}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-amber-600">{id ? 'Baca selengkapnya' : 'Read more'}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                </div>
              </Link>
            </motion.div>

            <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((item, index) => (
                <motion.div key={item.id} initial={reduceMotion ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}>
                  <NewsCard item={item} lang={lang} categoryLabel={label(item.category)} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
