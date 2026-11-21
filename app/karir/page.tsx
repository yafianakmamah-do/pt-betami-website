'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle, ArrowRight, Briefcase, CheckCircle2,
  Loader2, MapPin, Clock,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { ScrollReveal } from '@/components/ScrollMotion';
import {
  contentRaw,
  contentText,
  isAccepting,
  mergeSiteContent,
  type SiteContent,
} from '@/lib/siteContent';

interface Opening {
  id: string;
  title: string;
  location: string;
  employment_type: string;
  description: string;
}

export default function KarirPage() {
  const { lang } = useLanguage();
  const id = lang === 'id';

  const [openings, setOpenings] = useState<Opening[]>([]);
  const [loadingOpenings, setLoadingOpenings] = useState(true);
  const [siteContent, setSiteContent] = useState<SiteContent>(() => mergeSiteContent());

  useEffect(() => {
    let active = true;

    void fetch('/api/karir', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        if (active) setOpenings(Array.isArray(json.openings) ? json.openings : []);
      })
      .catch(() => { if (active) setOpenings([]); })
      .finally(() => { if (active) setLoadingOpenings(false); });

    void fetch('/api/content', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        if (active && json?.content) setSiteContent(mergeSiteContent(json.content));
      })
      .catch(() => { if (active) setSiteContent(mergeSiteContent()); });

    return () => { active = false; };
  }, []);

  const accepting = isAccepting(siteContent, 'career');
  const heroTitle = contentText(siteContent, 'career', 'hero_title', lang);
  const heroDesc = contentText(siteContent, 'career', 'hero_desc', lang);
  const inviteTitle = contentText(siteContent, 'career', 'invite_title', lang);
  const inviteDesc = contentText(siteContent, 'career', 'invite_desc', lang);
  const applyTitle = contentText(siteContent, 'career', 'apply_title', lang);
  const applyDesc = contentText(siteContent, 'career', 'apply_desc', lang);
  const closedNote = contentText(siteContent, 'career', 'closed_note', lang);
  const heroImage = encodeURI(contentRaw(siteContent, 'career', 'hero_image_url') || '/images/pks-factory-real.jpg');

  const values = [
    {
      title: id ? 'Integritas kerja' : 'Work integrity',
      desc: id ? 'Mengikuti prosedur dan menjaga keselamatan tim.' : 'Follow procedures and keep the team safe.',
    },
    {
      title: id ? 'Belajar terus' : 'Continuous learning',
      desc: id ? 'Belajar langsung dari pembimbing di lapangan.' : 'Learn directly from field mentors.',
    },
    {
      title: id ? 'Tumbuh bersama' : 'Grow together',
      desc: id ? 'Berkontribusi pada pertumbuhan perusahaan.' : 'Contribute to the company’s growth.',
    },
  ];

  const steps = [
    { no: '01', title: id ? 'Pilih peluang' : 'Choose an opportunity', desc: id ? 'Temukan posisi yang sesuai di portal rekrutmen.' : 'Find a suitable role on the recruitment portal.' },
    { no: '02', title: id ? 'Kirim lamaran' : 'Apply', desc: id ? 'Unggah CV dan lengkapi data yang diminta.' : 'Upload your CV and complete the required details.' },
    { no: '03', title: id ? 'Proses & bergabung' : 'Process & join', desc: id ? 'Ikuti proses seleksi dan bergabung dengan tim.' : 'Complete the selection process and join the team.' },
  ];

  return (
    <main className="cinematic-page cinematic-page--career bg-[#f7f6f2] pb-24 text-slate-900">
      <section className="editorial-hero" style={{ height: 'min(66svh, 720px)', minHeight: '440px' }}>
        <div className="editorial-hero__photo" style={{ backgroundImage: `url('${heroImage}')` }} />
        <div className="editorial-hero__shade" />
        <motion.div
          className="editorial-hero__content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.16 }}
        >
          <span className="editorial-hero__eyebrow">CAREER / RECRUITMENT</span>
          <h1 className="magang-hero-title career-hero-title">{heroTitle}</h1>
          <p className="magang-hero-desc mt-6 max-w-3xl">{heroDesc}</p>
          <div className="mt-9 h-[3px] w-24 bg-amber-400" />
          <span className="editorial-hero__index" aria-hidden="true">BETAMI / KARIR</span>
        </motion.div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <ScrollReveal className="space-y-16 sm:space-y-20">
          {/* Nilai kerja ringkas */}
          <section className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-700">
                {id ? 'Mengapa BETAMI' : 'Why BETAMI'}
              </p>
              <h2 className="mt-4 max-w-xl text-slate-900">{inviteTitle}</h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                {inviteDesc}
              </p>
            </div>
            <div className="grid gap-3">
              {values.map((item) => (
                <div key={item.title} className="flex gap-4 border border-slate-200 bg-white p-5 shadow-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Proses rekrutmen */}
          <section className="border-y border-slate-200 bg-white px-2 py-14 sm:px-8 sm:py-16">
            <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-teal-700">
              {id ? 'Proses Rekrutmen' : 'Recruitment Process'}
            </p>
            <h2 className="mt-3 text-center text-slate-900">
              {id ? 'Langkah menuju tim BETAMI' : 'Your path to the BETAMI team'}
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.no} className="relative border-t border-slate-900 pt-5">
                  <span className="text-xs font-black tracking-[0.2em] text-amber-600">{step.no}</span>
                  <h3 className="mt-3 text-lg font-extrabold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Lowongan */}
          <section id="lowongan" className="scroll-mt-28">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-700">
                  {id ? 'Lowongan' : 'Openings'}
                </p>
                <h2 className="mt-3 text-slate-900">
                  {id ? 'Peluang karier saat ini' : 'Current opportunities'}
                </h2>
              </div>
              {accepting && (
                <a href="/karir/lamaran" className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900">
                  {id ? 'Lihat cara melamar' : 'How to apply'} <ArrowRight className="h-4 w-4" />
                </a>
              )}
            </div>

            {loadingOpenings ? (
              <p className="mt-8 inline-flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-teal-700" />
                {id ? 'Memuat lowongan...' : 'Loading openings...'}
              </p>
            ) : openings.length === 0 ? (
              <div className="mt-8 border border-dashed border-slate-300 bg-white p-10 text-center">
                <Briefcase className="mx-auto h-9 w-9 text-slate-300" />
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {id
                    ? 'Belum ada lowongan yang dipublikasikan. Anda tetap dapat mengajukan minat melalui portal rekrutmen.'
                    : 'No openings are published yet. You may still apply through the recruitment portal.'}
                </p>
              </div>
            ) : (
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {openings.map((item) => (
                  <article key={item.id} className="border border-slate-200 bg-white p-6 transition hover:border-teal-300 hover:shadow-md">
                    <div className="flex items-start gap-3">
                      <Briefcase className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
                      <h3 className="text-lg font-extrabold text-slate-900">{item.title}</h3>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{item.location}</span>
                      <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{item.employment_type}</span>
                    </div>
                    {item.description && (
                      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                        {item.description}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Ajakan utama / status */}
          {accepting ? (
            <section id="lamar" className="scroll-mt-28 bg-slate-950 px-6 py-14 text-white sm:px-12 sm:py-20">
              <div className="mx-auto max-w-4xl">
                <div className="h-[3px] w-20 bg-amber-400" />
                <p className="mt-7 text-xs font-bold uppercase tracking-[0.28em] text-amber-300">
                  {id ? 'Peluang Karier' : 'Career Opportunity'}
                </p>
                <h2 className="mt-4 text-white">{applyTitle}</h2>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
                  {applyDesc}
                </p>

                <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <a
                    href="/karir/lamaran"
                    className="inline-flex items-center gap-1.5 text-sm font-black text-amber-300 underline underline-offset-4 hover:text-amber-200"
                  >
                    {id ? 'Klik di sini untuk melamar' : 'Click here to apply'}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <p className="text-xs leading-relaxed text-slate-300 sm:max-w-xs">
                    {id
                      ? 'Formulir lamaran tersedia di halaman khusus. Lamaran Anda langsung masuk ke tim HR BETAMI.'
                      : 'The application form is on its own page. Your application goes straight to the BETAMI HR team.'}
                  </p>
                </div>
              </div>
            </section>
          ) : (
            <section className="border border-amber-200 bg-amber-50/70 px-6 py-14 text-center sm:px-12 sm:py-20">
              <div className="mx-auto max-w-3xl">
                <AlertCircle className="mx-auto h-10 w-10 text-amber-600" />
                <h2 className="mt-6 whitespace-pre-line text-slate-900">{closedNote}</h2>
                <div className="mx-auto mt-8 h-[3px] w-20 bg-amber-500" />
              </div>
            </section>
          )}
        </ScrollReveal>
      </div>
    </main>
  );
}
