'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, CalendarDays, Share2 } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import NewsCard from '@/components/NewsCard';
import { FALLBACK_NEWS, NEWS_CATEGORIES, formatNewsDate, type NewsPost } from '@/lib/news';

export default function BeritaDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguage();
  const id = lang === 'id';
  const reduceMotion = useReducedMotion();
  const fallback = FALLBACK_NEWS.find((n) => n.slug === slug) ?? null;
  const [item, setItem] = useState<NewsPost | null>(fallback);
  const [related, setRelated] = useState<NewsPost[]>(FALLBACK_NEWS.filter((n) => n.slug !== slug).slice(0, 3));
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing'>(fallback ? 'ready' : 'loading');

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/berita?slug=${encodeURIComponent(slug)}`, { signal: controller.signal })
      .then(async (r) => {
        const j = await r.json() as { item?: NewsPost; related?: NewsPost[] };
        if (!r.ok || !j.item) { if (!fallback) setStatus('missing'); return; }
        setItem(j.item); setRelated(j.related ?? []); setStatus('ready');
      })
      .catch(() => { if (!fallback) setStatus('missing'); });
    return () => controller.abort();
  }, [slug, fallback]);

  if (status !== 'ready' || !item) {
    return (
      <main className="cinematic-page flex min-h-[70vh] flex-col items-center justify-center bg-[#f7f6f2] px-4 pt-28 text-center text-slate-900">
        {status === 'loading' ? (
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-200 border-t-teal-700" />
        ) : (
          <>
            <h1 className="text-slate-900">{id ? 'Berita tidak ditemukan' : 'News not found'}</h1>
            <Link href="/berita" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900"><ArrowLeft className="h-4 w-4" />{id ? 'Kembali ke Berita' : 'Back to News'}</Link>
          </>
        )}
      </main>
    );
  }

  const title = id ? item.title_id : item.title_en || item.title_id;
  const body = (id ? item.body_id : item.body_en || item.body_id).split(/\n\s*\n/).filter(Boolean);
  const categoryLabel = (c: string) => NEWS_CATEGORIES[c]?.[lang] ?? c;
  const share = () => {
    if (navigator.share) void navigator.share({ title, url: window.location.href }).catch(() => {});
    else void navigator.clipboard?.writeText(window.location.href);
  };

  return (
    <main className="cinematic-page bg-[#f7f6f2] text-slate-900">
      <section className="relative isolate overflow-hidden bg-teal-950 pb-24 pt-36 text-white sm:pt-40">
        <Image src={item.cover_url || '/images/pks-factory-real.jpg'} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-35" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-teal-950/60 via-teal-950/80 to-teal-950" />
        <motion.div initial={reduceMotion ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link href="/berita" className="inline-flex items-center gap-2 text-sm font-bold text-teal-200 transition hover:text-white"><ArrowLeft className="h-4 w-4" />{id ? 'Semua Berita' : 'All News'}</Link>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold">
            <span className="rounded-full bg-amber-400 px-3 py-1 font-black uppercase tracking-widest text-teal-950">{categoryLabel(item.category)}</span>
            <span className="inline-flex items-center gap-1.5 text-teal-100"><CalendarDays className="h-3.5 w-3.5" />{formatNewsDate(item.published_at, lang)}</span>
          </div>
          <h1 className="mt-5 text-white">{title}</h1>
        </motion.div>
      </section>

      <article className="relative mx-auto -mt-14 max-w-4xl px-4 sm:px-6">
        <motion.div initial={reduceMotion ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200">
          <div className="relative aspect-[16/9]">
            <Image src={item.cover_url || '/images/pks-factory-real.jpg'} alt={title} fill sizes="(max-width: 896px) 100vw, 896px" className="object-cover" />
          </div>
          <div className="p-7 sm:p-12">
            <p className="border-l-4 border-amber-400 pl-5 text-lg font-semibold leading-relaxed text-teal-900">{id ? item.excerpt_id : item.excerpt_en || item.excerpt_id}</p>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-slate-700">
              {body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
              <p className="text-sm font-semibold text-slate-500">PT Benih Tamiang (BETAMI)</p>
              <button type="button" onClick={share} className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-teal-600 hover:text-teal-800"><Share2 className="h-4 w-4" />{id ? 'Bagikan' : 'Share'}</button>
            </div>
          </div>
        </motion.div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-8 bg-gradient-to-r from-teal-900 to-amber-600 bg-clip-text text-transparent">{id ? 'Berita Lainnya' : 'More News'}</h2>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((n) => <NewsCard key={n.id} item={n} lang={lang} categoryLabel={categoryLabel(n.category)} />)}
          </div>
        </section>
      )}
    </main>
  );
}
