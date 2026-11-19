'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Building2,
  Factory,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { contactPageTranslations } from '@/lib/pageTranslations';
import EditorialHero from '@/components/EditorialHero';
import AntiRobotVerification from '@/components/AntiRobotVerification';

export default function ContactPage() {
  const { lang } = useLanguage();
  const t = contactPageTranslations[lang];

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    topic: t.topicOptions[0],
    message: '',
  });

  const [isRobotVerified, setIsRobotVerified] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = lang === 'id' ? 'Nama lengkap wajib diisi.' : 'Full name is required.';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = lang === 'id' ? 'Alamat email wajib diisi.' : 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email =
          lang === 'id'
            ? 'Format email tidak valid. Pastikan contoh: nama@gmail.com'
            : 'Invalid email format. E.g. name@gmail.com';
      }
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = lang === 'id' ? 'Nomor telepon wajib diisi.' : 'Phone number is required.';
    } else {
      const cleanPhone = formData.phone.replace(/[\s-]/g, '');
      const phoneRegex = /^(\+62|62|08|0)[0-9]{8,13}$/;
      if (!phoneRegex.test(cleanPhone)) {
        errors.phone =
          lang === 'id'
            ? 'Nomor telepon tidak valid. Masukkan nomor yang benar (contoh: 081234567890).'
            : 'Invalid phone number (e.g. 081234567890).';
      }
    }

    if (!formData.message.trim()) {
      errors.message = lang === 'id' ? 'Pesan wajib diisi.' : 'Message is required.';
    }

    // Anti-robot verification check
    if (!isRobotVerified) {
      errors.antiRobot =
        lang === 'id'
          ? 'Harap selesaikan verifikasi anti-robot (centang kotak) terlebih dahulu.'
          : 'Please complete the anti-robot verification checkbox.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/kontak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Pesan belum berhasil dikirim.');

      setSubmitted(true);
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        topic: t.topicOptions[0],
        message: '',
      });
      setIsRobotVerified(false);
      setFieldErrors({});
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Pesan belum berhasil dikirim. Silakan coba lagi.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="cinematic-page cinematic-page--contact">
      <EditorialHero
        image="/images/estate-jambi.jpg"
        title={lang === 'id' ? 'Kontak Kami' : 'Contact Us'}
        description={
          lang === 'id'
            ? 'Informasi operasional PT Benih Tamiang (BETAMI), Kecamatan Rantau, Aceh Tamiang.'
            : 'Operational information for PT Benih Tamiang (BETAMI), Rantau District, Aceh Tamiang.'
        }
      />

      <div className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 font-medium">
          <Link href="/" className="hover:text-teal-700 transition">
            {lang === 'id' ? 'Beranda' : 'Home'}
          </Link>
          <span className="text-slate-400">&gt;</span>
          <span className="text-slate-900 font-bold">{lang === 'id' ? 'Kontak' : 'Contact'}</span>
        </div>
      </div>

      <section className="py-14 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Info Columns */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
                <div className="w-9 h-9 rounded-xl border border-teal-600 text-teal-700 flex items-center justify-center mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-3">{t.hqTitle}</h3>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                    <span>{t.hqAddress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span>{t.hqPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span>{t.hqEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span>{t.hqHours}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
                <div className="w-9 h-9 rounded-xl border border-amber-600 text-amber-700 flex items-center justify-center mb-3">
                  <Factory className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-3">{t.millTitle}</h3>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span>{t.millAddress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>{t.millPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>{t.millEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>{t.millHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Form with Smart Security */}
            <div className="lg:col-span-7">
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{t.formTitle}</h3>
                <p className="text-xs text-slate-600 mb-6">{t.formSubtitle}</p>

                {submitted ? (
                  <div className="p-8 bg-teal-50 border border-teal-200 rounded-2xl text-center">
                    <CheckCircle2 className="w-10 h-10 text-teal-700 mx-auto mb-3" />
                    <h4 className="text-base font-bold text-teal-900">
                      {lang === 'id' ? 'Pesan Berhasil Dikirim' : 'Message Sent'}
                    </h4>
                    <p className="text-xs text-teal-800 mt-1 max-w-sm mx-auto">{t.successNotice}</p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-5 px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-sm transition"
                    >
                      {lang === 'id' ? 'Kirim Pesan Lain' : 'Send Another'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          {t.fieldName} *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                          }}
                          className={`w-full px-3 py-2 border rounded-xl text-xs bg-white focus:outline-none transition ${
                            fieldErrors.name ? 'border-rose-400 ring-2 ring-rose-400/10' : 'border-slate-300 focus:border-teal-600'
                          }`}
                        />
                        {fieldErrors.name && (
                          <p className="text-[11px] font-semibold text-rose-600 mt-1">{fieldErrors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          {t.fieldCompany}
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:border-teal-600 transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          {t.fieldEmail} *
                        </label>
                        <input
                          type="email"
                          placeholder="contoh: nama@gmail.com"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                          }}
                          className={`w-full px-3 py-2 border rounded-xl text-xs bg-white focus:outline-none transition ${
                            fieldErrors.email ? 'border-rose-400 ring-2 ring-rose-400/10' : 'border-slate-300 focus:border-teal-600'
                          }`}
                        />
                        {fieldErrors.email && (
                          <p className="text-[11px] font-semibold text-rose-600 mt-1">{fieldErrors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          {t.fieldPhone} *
                        </label>
                        <input
                          type="tel"
                          placeholder="contoh: 081234567890"
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: '' });
                          }}
                          className={`w-full px-3 py-2 border rounded-xl text-xs bg-white focus:outline-none transition ${
                            fieldErrors.phone ? 'border-rose-400 ring-2 ring-rose-400/10' : 'border-slate-300 focus:border-teal-600'
                          }`}
                        />
                        {fieldErrors.phone && (
                          <p className="text-[11px] font-semibold text-rose-600 mt-1">{fieldErrors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        {t.fieldTopic} *
                      </label>
                      <select
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:border-teal-600 transition"
                      >
                        {t.topicOptions.map((opt: string, i: number) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        {t.fieldMessage} *
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => {
                          setFormData({ ...formData, message: e.target.value });
                          if (fieldErrors.message) setFieldErrors({ ...fieldErrors, message: '' });
                        }}
                        className={`w-full px-3 py-2 border rounded-xl text-xs bg-white focus:outline-none transition ${
                          fieldErrors.message ? 'border-rose-400 ring-2 ring-rose-400/10' : 'border-slate-300 focus:border-teal-600'
                        }`}
                      />
                      {fieldErrors.message && (
                        <p className="text-[11px] font-semibold text-rose-600 mt-1">{fieldErrors.message}</p>
                      )}
                    </div>

                    {/* Modern Anti-Robot Checkbox (No Math Addition) */}
                    <div className="pt-2">
                      <AntiRobotVerification
                        isVerified={isRobotVerified}
                        onVerifyChange={(verified) => {
                          setIsRobotVerified(verified);
                          if (fieldErrors.antiRobot) setFieldErrors({ ...fieldErrors, antiRobot: '' });
                        }}
                        error={fieldErrors.antiRobot}
                        lang={lang}
                      />
                    </div>

                    {submitError && (
                      <p className="text-xs font-semibold text-rose-700" role="alert">
                        {submitError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider transition shadow-md disabled:opacity-60"
                    >
                      {isSubmitting ? (lang === 'id' ? 'Mengirim...' : 'Sending...') : t.submitBtn}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Location Map */}
          <div className="contact-location mt-16">
            <div className="contact-location__heading">
              <div>
                <span className="editorial-kicker">{lang === 'id' ? 'TEMUKAN KAMI' : 'FIND US'}</span>
                <h2>{lang === 'id' ? 'Lokasi Operasional BETAMI' : 'BETAMI Operating Location'}</h2>
                <p>{t.hqAddress}</p>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=73PX%2BGQF%2C+Desa+Kebun+Rantau%2C+Aceh+Tamiang"
                target="_blank"
                rel="noreferrer"
                className="contact-location__link"
              >
                {lang === 'id' ? 'Buka di Google Maps' : 'Open in Google Maps'}
                <ExternalLink aria-hidden="true" />
              </a>
            </div>
            <div className="contact-location__map">
              <iframe
                title={
                  lang === 'id'
                    ? 'Peta lokasi operasional PT BETAMI di Desa Kebun Rantau'
                    : 'Map to PT BETAMI operations in Kebun Rantau Village'
                }
                src="https://maps.google.com/maps?q=73PX%2BGQF%2C%20Desa%20Kebun%20Rantau%2C%20Aceh%20Tamiang&z=15&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
