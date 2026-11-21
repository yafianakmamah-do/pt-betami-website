'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, CheckCircle2, ClipboardList, Users } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { ScrollReveal } from '@/components/ScrollMotion';
import SmartInternCarousel from '@/components/SmartInternCarousel';
import {
  contentRaw,
  contentText,
  isAccepting,
  mergeSiteContent,
  type SiteContent,
} from '@/lib/siteContent';

export default function MagangPage() {
  const { lang } = useLanguage();
  const id = lang === 'id';
  const [siteContent, setSiteContent] = useState<SiteContent>(() => mergeSiteContent());

  useEffect(() => {
    let active = true;
    fetch('/api/content', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        if (active && json?.content) setSiteContent(mergeSiteContent(json.content));
      })
      .catch(() => { if (active) setSiteContent(mergeSiteContent()); });
    return () => { active = false; };
  }, []);

  const accepting = isAccepting(siteContent, 'internship');
  const heroTitle = contentText(siteContent, 'internship', 'hero_title', lang);
  const heroDesc = contentText(siteContent, 'internship', 'hero_desc', lang);
  const inviteTitle = contentText(siteContent, 'internship', 'invite_title', lang);
  const inviteDesc = contentText(siteContent, 'internship', 'invite_desc', lang);
  const requirements = contentText(siteContent, 'internship', 'requirements', lang);
  const closedNote = contentText(siteContent, 'internship', 'closed_note', lang);
  const ctaLabel = contentText(siteContent, 'internship', 'cta_label', lang);
  const waUrl = contentRaw(siteContent, 'internship', 'whatsapp_url');
  const waText = contentText(siteContent, 'internship', 'whatsapp_text', lang);
  const heroImage = encodeURI(contentRaw(siteContent, 'internship', 'hero_image_url') || '/images/internship.jpg');

  return (
    <main className="cinematic-page cinematic-page--internship bg-white text-slate-900 pb-20 font-sans">
      {/* Hero banner */}
      <section className="editorial-hero" style={{ height: 'min(60svh, 700px)', minHeight: '420px' }}>
        <div className="editorial-hero__photo" style={{ backgroundImage: `url('${heroImage}')` }} />
        <div className="editorial-hero__shade" />
        <motion.div
          className="editorial-hero__content"
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18 }}
        >
          <span className="editorial-hero__eyebrow">{id ? 'Peluang Magang' : 'Internship Opportunity'}</span>
          <h1 className="magang-hero-title">{heroTitle}</h1>
          <p className="magang-hero-desc">{heroDesc}</p>
          {accepting && (
            <div className="editorial-hero__actions">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-hero__action editorial-hero__action--primary"
              >
                {waText}
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          )}
          <span className="editorial-hero__index" aria-hidden="true">BETAMI / MAGANG</span>
        </motion.div>
      </section>

      {/* Galeri anak magang — foto, nama, dan pengalaman dari dashboard admin */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50 via-white to-white py-16 sm:py-24">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-10 text-center sm:mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-teal-700 shadow-sm">
              <Users className="h-3 w-3" />
              {id ? 'Anak Magang Periode Ini' : 'Interns This Period'}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {id ? 'Anak Magang di BETAMI' : 'Interns at BETAMI'}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              {id
                ? 'Foto dan cerita singkat mereka yang menjalani magang di BETAMI. Nama, kampus, dan pengalaman ditampilkan sesuai data yang dimasukkan admin.'
                : 'Photos and short stories from interns at BETAMI. Names, campuses, and experiences are shown from the data entered by the admin.'}
            </p>
          </ScrollReveal>

          <SmartInternCarousel lang={lang} variant="page" />

          <p className="mt-8 text-center text-[11px] text-slate-600">
            {id
              ? 'Foto dan cerita diperbarui admin melalui dashboard.'
              : 'Photos and stories are updated by the admin through the dashboard.'}
          </p>
        </div>
      </section>

      {/* Teks ajakan resmi — bisa diubah admin */}
      <div className="mx-auto max-w-5xl px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <ScrollReveal className="space-y-12">
          <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-teal-50/60 p-8 sm:p-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal-100/60 blur-3xl" />
            <div className="relative max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-teal-700 shadow-sm">
                <ClipboardList className="h-3.5 w-3.5" />
                {id ? 'Selama Magang Anda' : 'During Your Internship'}
              </span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {inviteTitle}
              </h2>
              <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-slate-600 sm:text-lg">
                {inviteDesc}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                {[
                  id ? 'Ditemani pembimbing lapangan' : 'Guided by a field mentor',
                  id ? 'Ikut alur kebun sampai pabrik' : 'Follow the plantation-to-mill flow',
                  id ? 'Bekal kerja setelah lulus' : 'Practical experience after graduation',
                ].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />{item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Kegiatan sehari-hari supaya halaman tidak terasa polos */}
          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
            <span className="inline-flex rounded-full border border-teal-100 bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-700">
              {id ? 'Kegiatan Sehari-hari' : 'Day-to-Day Activities'}
            </span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {id ? 'Yang Akan Anda Lakukan' : 'What You Will Do'}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                id
                  ? 'Melihat panen tandan buah segar dan cara tim menyiapkan kiriman ke pabrik.'
                  : 'See fresh fruit bunch harvesting and how the team prepares deliveries to the mill.',
                id
                  ? 'Mengikuti alur pengolahan di PKS bersama pembimbing lapangan.'
                  : 'Follow the milling process at the palm oil mill with a field mentor.',
                id
                  ? 'Belajar aturan keselamatan kerja sebelum masuk area operasional.'
                  : 'Learn workplace safety rules before entering the operational area.',
                id
                  ? 'Mencatat hal yang Anda lihat lalu mendiskusikannya dengan pembimbing.'
                  : 'Take notes on what you observe and discuss them with your mentor.',
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  <p className="text-sm leading-relaxed text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {!accepting ? (
            <section className="rounded-3xl border border-amber-200 bg-amber-50/70 p-8 text-center sm:p-14">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <AlertCircle className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {id ? 'Pendaftaran Magang Ditutup' : 'Internship Registration Is Closed'}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-slate-700 sm:text-base">
                {closedNote}
              </p>
              <Link
                href="/"
                className="mt-7 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                {id ? 'Kembali ke Beranda' : 'Back to Home'}<ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          ) : (
            <>
              {/* Syarat magang — bisa diubah admin */}
              <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                      {id ? 'Syarat Lamaran Magang' : 'Internship Application Requirements'}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      {id
                        ? 'Siapkan informasi berikut sebelum mengirimkan lamaran magang.'
                        : 'Please prepare the following information before applying.'}
                    </p>
                    <div className="mt-5 whitespace-pre-line rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-700">
                      {requirements}
                    </div>
                  </div>
                </div>
              </section>

              {/* Cara mengajukan */}
              <div className="text-center">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 text-xs font-bold uppercase tracking-wider">
                  {id ? 'Cara Mengajukan' : 'How to Apply'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-4">
                  {id ? 'Kirim Lamaran lewat WhatsApp' : 'Send Your Application via WhatsApp'}
                </h2>
                <p className="text-lg text-slate-600 mt-4 max-w-xl mx-auto leading-relaxed">
                  {id
                    ? 'Klik tautan WhatsApp di bawah, lalu kirim nama, sekolah/kampus, jurusan, dan periode magang Anda.'
                    : 'Open the WhatsApp link below, then send your name, school/university, major, and available internship period.'}
                </p>
              </div>

              <div className="text-center mt-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-slate-900 text-white font-black text-xl tracking-wide uppercase transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10 border border-slate-700"
                >
                  {ctaLabel}
                  <ArrowRight className="w-5 h-5" />
                </a>
                <p className="text-sm text-slate-500 mt-4">
                  {id ? 'Tautan membuka WhatsApp dengan pesan sudah disiapkan.' : 'The link opens WhatsApp with a prepared message.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4 border-t border-slate-200 pt-8">
                <div className="text-center p-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-3">
                    <span className="text-teal-700 font-bold text-sm">1</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{id ? 'Klik Tautan' : 'Click Link'}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{id ? 'Buka tautan WhatsApp di atas.' : 'Open the WhatsApp link above.'}</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-3">
                    <span className="text-teal-700 font-bold text-sm">2</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{id ? 'Kirim Data Diri' : 'Send Your Details'}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{id ? 'Tulis nama, sekolah, dan jurusan Anda.' : 'Write your name, school, and major.'}</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-3">
                    <span className="text-teal-700 font-bold text-sm">3</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{id ? 'Tunggu Konfirmasi' : 'Wait for Confirmation'}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{id ? 'Kami balas pesan Anda lewat WhatsApp.' : 'We will reply to your message on WhatsApp.'}</p>
                </div>
              </div>

              <div className="mt-4 p-6 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm mb-2">{id ? 'Catatan Penting' : 'Important Note'}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {id
                    ? 'Kuota magang mengikuti kebutuhan operasional BETAMI. Detail penempatan dan jadwal akan kami sampaikan lewat WhatsApp setelah pesan Anda diterima.'
                    : 'Internship slots follow BETAMI operational needs. Placement details and schedule will be shared via WhatsApp after we receive your message.'}
                </p>
              </div>
            </>
          )}
        </ScrollReveal>
      </div>
    </main>
  );
}
