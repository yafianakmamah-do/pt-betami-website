'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { ScrollReveal } from '@/components/ScrollMotion';

export default function MagangPage() {
  const { lang, t } = useLanguage();

  return (
    <main className="cinematic-page cinematic-page--internship bg-white text-slate-900 pb-20 font-sans">
      {/* Hero banner ringan */}
      <section className="editorial-hero" style={{ height: 'min(60svh, 700px)', minHeight: '420px' }}>
        <div className="editorial-hero__shade" />
        <motion.div
          className="editorial-hero__content"
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18 }}
        >
          <span className="editorial-hero__eyebrow">{lang === 'id' ? 'Peluang Magang' : 'Internship Opportunity'}</span>
          <h1 className="magang-hero-title">
            {lang === 'id' ? 'Magang di PT BETAMI' : 'Intern at PT BETAMI'}
          </h1>
          <p className="magang-hero-desc">
            {lang === 'id'
              ? 'Kesempatan belajar mengenal operasional Pabrik Kelapa Sawit (PKS) dan lingkungan agribisnis di Aceh Tamiang.'
              : 'Learn about Palm Oil Mill (PKS) operations and the agribusiness environment in Aceh Tamiang.'}
          </p>
          <div className="editorial-hero__actions">
            <a
              href="https://wa.me/6281234567890?text=Halo%20PT%20BETAMI,%20saya%20tertarik%20magang."
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-hero__action editorial-hero__action--primary"
            >
              {lang === 'id' ? 'Hubungi via WhatsApp' : 'Contact via WhatsApp'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          <span className="editorial-hero__index" aria-hidden="true">BETAMI / MAGANG</span>
        </motion.div>
      </section>

      {/* Konten utama: hanya link magang, tanpa formulir kontak */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24">
        <ScrollReveal className="space-y-12">
          <div className="text-center">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 text-xs font-bold uppercase tracking-wider">
              {lang === 'id' ? 'Cara Mengajukan' : 'How to Apply'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-4">
              {lang === 'id' ? 'Kirim Lamaran Magang melalui Link Ini' : 'Send Your Internship Application via This Link'}
            </h2>
            <p className="text-lg text-slate-600 mt-4 max-w-xl mx-auto leading-relaxed">
              {lang === 'id'
                ? 'Klik tautan di bawah ini untuk mengajukan minat magang di PT BETAMI. Tim kami akan segera menghubungi Anda melalui kontak yang Anda berikan.'
                : 'Click the link below to submit your internship interest at PT BETAMI. Our team will contact you shortly via the contact details you provide.'}
            </p>
          </div>

          {/* Link magang besar, hitam tebal, mengajak */}
          <div className="text-center mt-8 sm:mt-12">
            <a
              href="https://wa.me/6281234567890?text=Halo%20PT%20BETAMI,%20saya%20tertarik%20magang%20di%20perusahaan%20Anda.%20Mohon%20informasi%20lebih%20lanjut."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-slate-900 text-white font-black text-xl tracking-wide uppercase transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10 border border-slate-700"
            >
              {lang === 'id' ? 'KIRIM LAMARAN MAGANG DISINI' : 'SEND INTERNSHIP APPLICATION HERE'}
              <ArrowRight className="w-5 h-5" />
            </a>
            <p className="text-sm text-slate-500 mt-4">
              {lang === 'id' ? 'Tautan akan membuka WhatsApp untuk mengajukan lamaran magang Anda.' : 'The link will open WhatsApp to submit your internship application.'}
            </p>
          </div>

          {/* Panduan singkat */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 sm:mt-16 border-t border-slate-200 pt-8">
            <div className="text-center p-4">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-3">
                <span className="text-teal-700 font-bold text-sm">1</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{lang === 'id' ? 'Klik Tautan' : 'Click Link'}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{lang === 'id' ? 'Buka tautan WhatsApp di atas.' : 'Open the WhatsApp link above.'}</p>
            </div>
            <div className="text-center p-4">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-3">
                <span className="text-teal-700 font-bold text-sm">2</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{lang === 'id' ? 'Kirim Data Diri' : 'Send Your Details'}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{lang === 'id' ? 'Tulis nama, sekolah, dan jurusan Anda.' : 'Write your name, school, and major.'}</p>
            </div>
            <div className="text-center p-4">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-3">
                <span className="text-teal-700 font-bold text-sm">3</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{lang === 'id' ? 'Tunggu Konfirmasi' : 'Wait for Confirmation'}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{lang === 'id' ? 'Tim HR BETAMI akan menanggapi Anda.' : 'BETAMI HR team will respond to you.'}</p>
            </div>
          </div>

          {/* Catatan */}
          <div className="mt-12 sm:mt-16 p-6 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-2">{lang === 'id' ? 'Catatan Penting' : 'Important Note'}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {lang === 'id'
                ? 'Penempatan magang tersedia sesuai kuota dan kebutuhan operasional PT BETAMI. Informasi lebih lanjut akan disampaikan tim kami setelah Anda mengirimkan lamaran melalui tautan di atas.'
                : 'Internship placement is available subject to quota and PT BETAMI operational needs. Further information will be provided by our team after you submit your application via the link above.'}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
