'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AlertCircle, ArrowLeft, ArrowRight, CheckCircle2,
  FileText, Loader2, UploadCloud,
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

export default function LamaranPage() {
  const { lang } = useLanguage();
  const id = lang === 'id';

  const [siteContent, setSiteContent] = useState<SiteContent>(() => mergeSiteContent());

  const [form, setForm] = useState({
    name: '', email: '', phone: '', position: '', coverLetter: '', botField: '',
  });
  const [cv, setCv] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;
    void fetch('/api/content', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        if (active && json?.content) setSiteContent(mergeSiteContent(json.content));
      })
      .catch(() => { if (active) setSiteContent(mergeSiteContent()); });
    return () => { active = false; };
  }, []);

  const accepting = isAccepting(siteContent, 'career');
  const closedNote = contentText(siteContent, 'career', 'closed_note', lang);
  const requirements = contentText(siteContent, 'career', 'requirements', lang);
  const heroImage = encodeURI(contentRaw(siteContent, 'career', 'lamaran_hero_image_url') || '/images/palm-canopy-sunset-hd.jpg');
  const sideImage = encodeURI(contentRaw(siteContent, 'career', 'lamaran_side_image_url') || '/images/tbs-harvest.jpg');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!cv) {
      setError(id ? 'Lampirkan CV Anda (PDF, DOC, atau DOCX, maksimal 5 MB).' : 'Please attach your CV.');
      return;
    }
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', form.name.trim());
      data.append('email', form.email.trim());
      data.append('phone', form.phone.trim());
      data.append('position', form.position.trim());
      data.append('coverLetter', form.coverLetter.trim());
      data.append('botField', form.botField);
      data.append('resume', cv);

      const res = await fetch('/api/karir', { method: 'POST', body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.error) throw new Error(json.error || 'Lamaran belum terkirim.');
      setSuccess(id ? 'Lamaran Anda berhasil dikirim.' : 'Your application has been sent.');
      setForm({ name: '', email: '', phone: '', position: '', coverLetter: '', botField: '' });
      setCv(null);
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10';
  const labelClass = 'block text-xs font-bold uppercase tracking-wider text-slate-600';

  const requirementLines = requirements
    ? requirements.split('\n').map((line) => line.trim()).filter(Boolean)
    : [];

  return (
    <main className="cinematic-page cinematic-page--career bg-[#f7f6f2] pb-24 text-slate-900">
      <section className="editorial-hero" style={{ height: 'min(52svh, 560px)', minHeight: '380px' }}>
        <div className="editorial-hero__photo" style={{ backgroundImage: `url('${heroImage}')` }} />
        <div className="editorial-hero__shade" />
        <motion.div
          className="editorial-hero__content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.16 }}
        >
          <span className="editorial-hero__eyebrow">CAREER / FORMULIR LAMARAN</span>
          <h1 className="magang-hero-title career-hero-title">
            {id ? 'Formulir Lamaran BETAMI' : 'BETAMI Application Form'}
          </h1>
          <p className="magang-hero-desc mt-6 max-w-3xl">
            {id
              ? 'Lengkapi formulir di bawah ini. Lamaran Anda langsung tersimpan di dashboard admin BETAMI dan ditinjau tim HR.'
              : 'Complete the form below. Your application is saved directly in the BETAMI admin dashboard and reviewed by our HR team.'}
          </p>
          <div className="mt-9 h-[3px] w-24 bg-amber-400" />
          <span className="editorial-hero__index" aria-hidden="true">BETAMI / LAMARAN</span>
        </motion.div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <ScrollReveal className="space-y-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/karir"
              className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900"
            >
              <ArrowLeft className="h-4 w-4" />
              {id ? 'Kembali ke Halaman Karir' : 'Back to Career Page'}
            </Link>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              {id ? 'PT BETAMI / Aceh Tamiang' : 'PT BETAMI / Aceh Tamiang'}
            </span>
          </div>

          {accepting ? (
            <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              {/* Kolom kiri: foto + syarat lamaran */}
              <div className="space-y-6 lg:sticky lg:top-28">
                <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
                  <img
                    src={sideImage}
                    alt={id ? 'Kegiatan operasional PT BETAMI' : 'PT BETAMI operational activity'}
                    className="h-56 w-full object-cover sm:h-64 lg:h-72"
                    loading="lazy"
                  />
                </div>

                <div className="border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <FileText className="mt-0.5 h-6 w-6 shrink-0 text-teal-700" />
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900">
                        {id ? 'Syarat Lamaran' : 'Application Requirements'}
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        {id
                          ? 'Pastikan data dan dokumen Anda sesuai sebelum mengirim.'
                          : 'Make sure your data and documents match before sending.'}
                      </p>
                    </div>
                  </div>
                  {requirementLines.length > 0 && (
                    <ul className="mt-4 space-y-2.5">
                      {requirementLines.map((line) => (
                        <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                          <span>{line.replace(/^•\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Kolom kanan: formulir lamaran */}
              <div className="border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-8 flex items-start gap-4">
                  <FileText className="mt-0.5 h-7 w-7 shrink-0 text-teal-700" />
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                      {id ? 'Isi Formulir Lamaran' : 'Fill in the Application Form'}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {id
                        ? 'Semua kolom bertanda * wajib diisi.'
                        : 'All fields marked * are required.'}
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="mb-6 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /><span>{success}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="hidden" aria-hidden="true">
                    <label>Leave this field empty<input tabIndex={-1} autoComplete="off" value={form.botField} onChange={(e) => setForm({ ...form, botField: e.target.value })} /></label>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>{id ? 'Nama Lengkap *' : 'Full Name *'}</label>
                      <input required minLength={2} maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Email *</label>
                      <input required type="email" maxLength={254} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>{id ? 'Telepon / WhatsApp *' : 'Phone / WhatsApp *'}</label>
                      <input required type="tel" minLength={5} maxLength={40} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>{id ? 'Posisi *' : 'Position *'}</label>
                      <input required minLength={2} maxLength={180} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>CV / Resume *</label>
                    <div className="mt-1.5 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center">
                      <UploadCloud className="h-7 w-7 text-teal-700" />
                      <label className="mt-3 cursor-pointer text-sm font-semibold text-teal-700 hover:underline">
                        {cv ? cv.name : (id ? 'Pilih file CV' : 'Choose CV file')}
                        <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => setCv(e.target.files?.[0] ?? null)} className="sr-only" />
                      </label>
                      <p className="mt-2 text-xs text-slate-500">PDF, DOC, atau DOCX · maksimal 5 MB</p>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>{id ? 'Surat Pengantar (opsional)' : 'Cover Letter (optional)'}</label>
                    <textarea rows={5} maxLength={5000} value={form.coverLetter} onChange={(e) => setForm({ ...form, coverLetter: e.target.value })} className={inputClass} />
                  </div>
                  <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-teal-800 disabled:opacity-60">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    {submitting ? 'Mengirim...' : (id ? 'Kirim Lamaran' : 'Submit Application')}
                  </button>
                </form>
              </div>
            </section>
          ) : (
            <section className="border border-amber-200 bg-amber-50/70 px-6 py-14 text-center sm:px-12 sm:py-20">
              <div className="mx-auto max-w-3xl">
                <AlertCircle className="mx-auto h-10 w-10 text-amber-600" />
                <h2 className="mt-6 whitespace-pre-line text-slate-900">{closedNote}</h2>
                <div className="mx-auto mt-8 h-[3px] w-20 bg-amber-500" />
                <Link
                  href="/karir"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {id ? 'Kembali ke Halaman Karir' : 'Back to Career Page'}
                </Link>
              </div>
            </section>
          )}
        </ScrollReveal>
      </div>
    </main>
  );
}
