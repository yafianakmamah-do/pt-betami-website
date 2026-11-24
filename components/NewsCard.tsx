'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { formatNewsDate, type NewsPost } from '@/lib/news';

export default function NewsCard({ item, lang, categoryLabel }: { item: NewsPost; lang: 'id' | 'en'; categoryLabel: string }) {
  const id = lang === 'id';
  return (
    <Link href={`/berita/${item.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md shadow-slate-900/5 ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={item.cover_url || '/images/pks-factory-real.jpg'} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-110" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-teal-800 backdrop-blur">{categoryLabel}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500"><CalendarDays className="h-3.5 w-3.5" />{formatNewsDate(item.published_at, lang)}</span>
        <h3 className="mt-3 text-lg font-extrabold leading-snug text-slate-900 transition group-hover:text-teal-800">{id ? item.title_id : item.title_en || item.title_id}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{id ? item.excerpt_id : item.excerpt_en || item.excerpt_id}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-amber-600">{id ? 'Baca' : 'Read'}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
      </div>
    </Link>
  );
}
