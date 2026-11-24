'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  ExternalLink,
  Handshake,
  User,
  Building2,
  Tag,
  MessageSquare,
  Send,
  ArrowRight,
  Lock,
  Navigation,
  BookUser,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { contactPageTranslations } from '@/lib/pageTranslations';
import AntiRobotVerification from '@/components/AntiRobotVerification';

const MAP_COORDS = '4.2843294,98.0998572';
const MAP_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(MAP_COORDS)}&z=15&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_COORDS)}`;
const MAP_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAP_COORDS)}`;

const ease = [0.22, 1, 0.36, 1] as const;
const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

const inputBase =
  'w-full rounded-[14px] border bg-[#f7f6f0] py-3 pl-11 pr-4 text-sm text-[#173b31] placeholder:text-[#68746f]/70 outline-none transition focus:bg-white focus:ring-4';
const inputOk = 'border-[#173b31]/10 focus:border-[#c9a052] focus:ring-[#c9a052]/15';
const inputErr = 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/15';

function Field({ label, icon: Icon, error, children, full }: { label: string; icon: React.ElementType; error?: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#173b31]">{label}</label>
      <div className="relative">
        <Icon aria-hidden="true" className="pointer-events-none absolute left-4 top-[14px] h-4 w-4 text-[#bd9145]" />
        {children}
      </div>
      {error && <p className="mt-1.5 text-[11px] font-semibold text-rose-600">{error}</p>}
    </div>
  );
}

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

  const id = lang === 'id';

  const infoCards = [
    {
      icon: MapPin,
      title: id ? 'Lokasi' : 'Location',
      strong: 'Aceh Tamiang',
      text: t.hqAddress,
    },
    {
      icon: Mail,
      title: 'Email',
      strong: id ? 'Email Perusahaan' : 'Company Email',
      text: id ? 'Untuk kebutuhan informasi dan komunikasi perusahaan.' : 'For company information and communication.',
      link: { href: `mailto:${t.hqEmail}`, label: t.hqEmail },
    },
    {
      icon: Handshake,
      title: id ? 'Kemitraan' : 'Partnership',
      strong: id ? 'Kerja Sama' : 'Collaboration',
      text: t.millAddress,
    },
  ];

  const directCards = [
    { icon: Mail, label: 'Email', strong: t.hqEmail, small: id ? 'Balasan melalui email' : 'Reply via email', href: `mailto:${t.hqEmail}` },
    { icon: Phone, label: id ? 'Telepon' : 'Phone', strong: t.hqPhone, small: t.hqHours },
    { icon: MapPin, label: id ? 'Alamat' : 'Address', strong: 'Aceh Tamiang', small: id ? 'Suka Rakyat, Kec. Rantau' : 'Suka Rakyat, Rantau District', href: MAP_LINK },
  ];

  return (
    <main className="contact-modern overflow-hidden bg-[#f5f4ee] text-[#173b31]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#002f23] via-[#003d2d] to-[#064c39] pb-24 pt-48 text-white sm:pb-28 sm:pt-52">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-[420px] w-[420px] rounded-full bg-[#ddb96d]/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/4 h-[360px] w-[360px] rounded-full bg-[#138064]/30 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '30px 30px' }} />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease }} className="mb-5 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-[#efd18f]">
              <span className="h-px w-10 bg-[#efd18f]" />
              {id ? 'Info Kontak' : 'Contact Info'}
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease }} className="text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              {id ? 'Mari Terhubung' : "Let's Connect"}
              <br />
              <span className="bg-gradient-to-r from-[#efd18f] via-[#ddb96d] to-[#bd9145] bg-clip-text text-transparent">{id ? 'Dengan BETAMI.' : 'With BETAMI.'}</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25, ease }} className="mt-6 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              {id
                ? 'Kami terbuka untuk komunikasi, peluang kerja sama, kebutuhan bisnis, serta pertanyaan mengenai PT BETAMI. Sampaikan kebutuhan Anda dan mari membangun hubungan yang baik bersama.'
                : 'We are open to communication, collaboration opportunities, business needs, and questions about PT BETAMI. Share your needs and let us build a good relationship together.'}
            </motion.p>
            <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 flex items-center gap-2 text-xs font-semibold text-white/60">
              <Link href="/" className="transition hover:text-[#efd18f]">{id ? 'Beranda' : 'Home'}</Link>
              <span>/</span>
              <span className="text-white">{id ? 'Kontak' : 'Contact'}</span>
            </motion.nav>
          </div>
          <motion.div initial={{ opacity: 0, rotate: -8, y: 20 }} animate={{ opacity: 1, rotate: -6, y: 0 }} transition={{ duration: 1, delay: 0.35, ease }} className="self-end font-serif text-2xl italic leading-tight text-white/90 sm:text-3xl">
            {id ? 'Bersama' : 'Growing'}
            <br />
            {id ? 'Tumbuh Lebih Baik' : 'Better Together'}
            <span className="mt-2 block h-[2px] w-full bg-gradient-to-r from-transparent via-[#ddb96d] to-[#ddb96d]" />
          </motion.div>
        </div>
      </section>

      <div className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-[40%] h-72 w-72 rounded-full bg-[#138064]/10 blur-3xl" />

        {/* INFO CARDS */}
        <section className="relative -mt-14 grid gap-5 md:grid-cols-3">
          {infoCards.map((card, i) => (
            <motion.article key={card.title} {...reveal} transition={{ duration: 0.7, delay: i * 0.1, ease }} className="group relative overflow-hidden rounded-[22px] border border-[#173b31]/10 bg-white p-6 shadow-[0_15px_45px_rgba(0,48,35,0.09)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_22px_55px_rgba(0,48,35,0.15)]">
              <div aria-hidden="true" className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-[#f7f6f0] transition-transform duration-700 group-hover:scale-150" />
              <div className="relative flex gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ddb96d] to-[#a9792d] text-white shadow-lg shadow-[#a9792d]/30 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
                  <card.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a9792d]">{card.title}</h3>
                  <strong className="mt-1 block text-lg font-extrabold text-[#003d2d]">{card.strong}</strong>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#68746f]">{card.text}</p>
                  {card.link && (
                    <a href={card.link.href} className="mt-3 inline-flex items-center gap-2 break-all text-xs font-bold text-[#075945] hover:text-[#a9792d]">
                      <Mail className="h-3.5 w-3.5" />{card.link.label}
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </section>

        {/* MAP + FORM */}
        <section className="relative mt-14 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <motion.div {...reveal} transition={{ duration: 0.8, ease }} className="group relative min-h-[600px] overflow-hidden rounded-[26px] bg-[#002f23] sm:min-h-[520px] shadow-[0_25px_60px_-20px_rgba(0,48,35,0.5)] lg:min-h-full">
            <iframe
              title={id ? 'Peta lokasi PT BETAMI di Suka Rakyat, Kecamatan Rantau' : 'Map of PT BETAMI in Suka Rakyat, Rantau District'}
              src={MAP_EMBED}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#002f23] via-[#002f23]/80 to-transparent" />
            <div className="pointer-events-none absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-[#002f23]/90 px-4 py-2 text-[11px] font-bold text-[#efd18f] shadow-lg backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#efd18f] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#efd18f]" />
              </span>
              PT BETAMI · Rantau
            </div>
            <div className="absolute inset-x-5 bottom-5 text-white sm:inset-x-7 sm:bottom-7">
              <h3 className="flex items-center gap-2 text-xl font-extrabold"><MapPin className="h-5 w-5 text-[#efd18f]" />PT Benih Tamiang (BETAMI)</h3>
              <p className="mt-2 max-w-md text-xs leading-relaxed text-white/75">{t.hqAddress}</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#efd18f]">{id ? 'Lokasi Operasional' : 'Operating Location'}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={MAP_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#efd18f] to-[#c9a052] px-5 py-2.5 text-xs font-bold text-[#002f23] shadow-lg transition hover:-translate-y-0.5">
                  <Send className="h-3.5 w-3.5" />{id ? 'Buka Google Maps' : 'Open Google Maps'}<ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a href={MAP_DIRECTIONS} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-xs font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-[#efd18f]">
                  <Navigation className="h-3.5 w-3.5" />{id ? 'Petunjuk Arah' : 'Directions'}
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div {...reveal} transition={{ duration: 0.8, delay: 0.1, ease }} className="relative overflow-hidden rounded-[26px] border border-[#173b31]/10 bg-white p-6 shadow-[0_15px_45px_rgba(0,48,35,0.09)] sm:p-9">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#efd18f]/40 to-transparent" />
            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-[#a9792d]">
                <span className="h-px w-8 bg-[#c9a052]" />{t.formTitle}
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#003d2d] sm:text-4xl">{id ? 'Hubungi Kami' : 'Contact Us'}</h2>
              <p className="mt-2 text-sm text-[#68746f]">{t.formSubtitle}</p>

              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 rounded-[20px] border border-[#138064]/20 bg-[#138064]/5 p-8 text-center">
                  <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-[#0b6d54]" />
                  <h4 className="text-lg font-bold text-[#003d2d]">{id ? 'Pesan Berhasil Dikirim' : 'Message Sent'}</h4>
                  <p className="mx-auto mt-1 max-w-sm text-sm text-[#68746f]">{t.successNotice}</p>
                  <button onClick={() => setSubmitted(false)} className="mt-5 rounded-full bg-[#075945] px-6 py-2.5 text-xs font-bold text-white transition hover:bg-[#003d2d]">
                    {id ? 'Kirim Pesan Lain' : 'Send Another'}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={`${t.fieldName} *`} icon={User} error={fieldErrors.name}>
                      <input type="text" placeholder={id ? 'Nama lengkap' : 'Full name'} value={formData.name}
                        onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' }); }}
                        className={`${inputBase} ${fieldErrors.name ? inputErr : inputOk}`} />
                    </Field>
                    <Field label={t.fieldCompany} icon={Building2}>
                      <input type="text" placeholder={id ? 'Nama perusahaan / instansi' : 'Company / organization'} value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className={`${inputBase} ${inputOk}`} />
                    </Field>
                    <Field label={`${t.fieldEmail} *`} icon={Mail} error={fieldErrors.email}>
                      <input type="email" placeholder="nama@gmail.com" value={formData.email}
                        onChange={(e) => { setFormData({ ...formData, email: e.target.value }); if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' }); }}
                        className={`${inputBase} ${fieldErrors.email ? inputErr : inputOk}`} />
                    </Field>
                    <Field label={`${t.fieldPhone} *`} icon={Phone} error={fieldErrors.phone}>
                      <input type="tel" placeholder="081234567890" value={formData.phone}
                        onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: '' }); }}
                        className={`${inputBase} ${fieldErrors.phone ? inputErr : inputOk}`} />
                    </Field>
                    <Field label={`${t.fieldTopic} *`} icon={Tag} full>
                      <select value={formData.topic} onChange={(e) => setFormData({ ...formData, topic: e.target.value })} className={`${inputBase} ${inputOk} appearance-none`}>
                        {t.topicOptions.map((opt: string, i: number) => (<option key={i} value={opt}>{opt}</option>))}
                      </select>
                    </Field>
                    <Field label={`${t.fieldMessage} *`} icon={MessageSquare} error={fieldErrors.message} full>
                      <textarea rows={5} placeholder={id ? 'Tuliskan pesan Anda...' : 'Write your message...'} value={formData.message}
                        onChange={(e) => { setFormData({ ...formData, message: e.target.value }); if (fieldErrors.message) setFieldErrors({ ...fieldErrors, message: '' }); }}
                        className={`${inputBase} ${fieldErrors.message ? inputErr : inputOk} resize-y`} />
                    </Field>
                  </div>

                  <AntiRobotVerification
                    isVerified={isRobotVerified}
                    onVerifyChange={(verified) => {
                      setIsRobotVerified(verified);
                      if (fieldErrors.antiRobot) setFieldErrors({ ...fieldErrors, antiRobot: '' });
                    }}
                    error={fieldErrors.antiRobot}
                    lang={lang}
                  />

                  {submitError && <p className="text-xs font-semibold text-rose-700" role="alert">{submitError}</p>}

                  <button type="submit" disabled={isSubmitting} className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#075945] to-[#003d2d] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#003d2d]/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60">
                    <Send className="h-4 w-4" />
                    {isSubmitting ? (id ? 'Mengirim...' : 'Sending...') : t.submitBtn}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <p className="flex items-center justify-center gap-2 text-[11px] text-[#68746f]">
                    <Lock className="h-3.5 w-3.5 text-[#bd9145]" />
                    {id ? 'Informasi yang dikirim digunakan hanya untuk keperluan komunikasi.' : 'Submitted information is used only for communication purposes.'}
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </section>

        {/* DIRECT CONTACT */}
        <section className="relative mt-16">
          <motion.h2 {...reveal} transition={{ duration: 0.7, ease }} className="flex items-center gap-3 text-2xl font-extrabold text-[#003d2d] sm:text-3xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#003d2d] text-[#efd18f]"><BookUser className="h-5 w-5" /></span>
            {id ? 'Kontak Langsung' : 'Direct Contact'}
          </motion.h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {directCards.map((card, i) => {
              const inner = (
                <>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#f7f6f0] text-[#a9792d] transition duration-500 group-hover:bg-gradient-to-br group-hover:from-[#ddb96d] group-hover:to-[#a9792d] group-hover:text-white">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#68746f]">{card.label}</span>
                    <strong className="mt-0.5 block break-words text-sm font-extrabold text-[#003d2d]">{card.strong}</strong>
                    <small className="mt-0.5 flex items-center gap-1 text-xs text-[#68746f]"><Clock className="h-3 w-3" />{card.small}</small>
                  </div>
                </>
              );
              const cls = 'group flex items-center gap-4 rounded-[20px] border border-[#173b31]/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,48,35,0.06)] transition duration-500 hover:-translate-y-1 hover:border-[#c9a052]/40 hover:shadow-[0_22px_55px_rgba(0,48,35,0.12)]';
              return (
                <motion.div key={card.label} {...reveal} transition={{ duration: 0.6, delay: i * 0.1, ease }}>
                  {card.href ? (
                    <a href={card.href} target={card.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className={cls}>{inner}</a>
                  ) : (
                    <div className={cls}>{inner}</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
