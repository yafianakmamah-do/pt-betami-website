'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ChevronDown, Menu, X, Volume2, Play, Pause, Award, Building, ShieldCheck, HeartHandshake, Sprout, Factory, Leaf } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [businessDropdownOpen, setBusinessDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const aboutPanelRef = useRef<HTMLDivElement | null>(null);
  const businessRef = useRef<HTMLDivElement | null>(null);
  const businessPanelRef = useRef<HTMLDivElement | null>(null);
  const langRef = useRef<HTMLDivElement | null>(null);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechMessage, setSpeechMessage] = useState('');
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const speechActiveRef = useRef(false);
  const speechQueueRef = useRef<string[]>([]);
  const speechIndexRef = useRef(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) synthRef.current = window.speechSynthesis;
    return () => {
      speechActiveRef.current = false;
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false); setAboutDropdownOpen(false); setBusinessDropdownOpen(false); setLangDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      // Panel dropdown adalah elemen saudara (bukan anak), jadi ikut dicek —
      // tanpa ini panel tertutup sebelum klik link sempat terjadi.
      if (
        aboutRef.current &&
        !aboutRef.current.contains(el) &&
        !(aboutPanelRef.current && aboutPanelRef.current.contains(el))
      ) setAboutDropdownOpen(false);
      if (
        businessRef.current &&
        !businessRef.current.contains(el) &&
        !(businessPanelRef.current && businessPanelRef.current.contains(el))
      ) setBusinessDropdownOpen(false);
      if (langRef.current && !langRef.current.contains(el)) setLangDropdownOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase().trim();
    if (query.includes('karir') || query.includes('karier') || query.includes('career') || query.includes('lamaran kerja') || query.includes('lowongan')) router.push('/karir');
    else if (query.includes('magang') || query.includes('intern') || query.includes('pkl')) router.push('/magang');
    else if (query.includes('sustain') || query.includes('lestari') || query.includes('csr')) router.push('/keberlanjutan');
    else if (query.includes('bisnis') || query.includes('pks') || query.includes('cpo') || query.includes('kebun') || query.includes('pabrik')) router.push('/bisnis');
    else if (query.includes('tentang') || query.includes('visi') || query.includes('profil')) router.push('/tentang-kami');
    else if (query.includes('foto') || query.includes('galeri')) router.push('/galeri');
    else if (query.includes('kontak') || query.includes('alamat')) router.push('/kontak');
    else router.push(`/?search=${encodeURIComponent(searchQuery)}`);
  };

  const pickVoice = (language: 'id' | 'en') => {
    const voices = (synthRef.current?.getVoices() ?? []).slice();
    const prefix = language === 'id' ? 'id' : 'en';
    const matches = voices.filter((voice) => {
      const code = (voice.lang || '').toLowerCase().replace('_', '-');
      return code === prefix || code.startsWith(`${prefix}-`) || code.includes(`${prefix}`);
    });
    return (
      // Utamakan suara lokal (diinstal di Windows, kualitas lebih bagus)
      matches.find((voice) => voice.localService && voice.lang.toLowerCase().startsWith(prefix)) ||
      matches.find((voice) => voice.lang.toLowerCase().startsWith(prefix)) ||
      matches[0] ||
      null
    );
  };

  const stopSpeech = () => {
    speechActiveRef.current = false;
    speechQueueRef.current = [];
    speechIndexRef.current = 0;
    if (synthRef.current) {
      synthRef.current.cancel();
      synthRef.current.resume();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setSpeechMessage('');
  };

  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSpeechMessage(t.tts.speechNotSupported);
      return;
    }

    synthRef.current = window.speechSynthesis;
    const synth = synthRef.current;

    if (speechActiveRef.current && !isPaused) {
      synth.pause();
      setIsPaused(true);
      setSpeechMessage(t.tts.paused);
      return;
    }
    if (speechActiveRef.current && isPaused) {
      synth.resume();
      setIsPaused(false);
      setSpeechMessage(t.tts.playing);
      return;
    }

    stopSpeech();
    synthRef.current = window.speechSynthesis;
    const activeSynth = synthRef.current;
    const language = lang;

    const mainEl = document.querySelector('main');
    if (!mainEl) return;
    const textNodes: string[] = [];
    const seen = new Set<string>();
    mainEl.querySelectorAll('h1,h2,h3,h4,p,li,figcaption,label,legend,summary,img[alt]').forEach((el) => {
      if (el.closest('nav,footer,[aria-hidden="true"],.sr-only,template')) return;
      const htmlEl = el as HTMLElement;
      // Lewati elemen yang tersembunyi (display:none / visibility:hidden)
      if (htmlEl.hidden || htmlEl.getClientRects().length === 0) return;
      const text = el instanceof HTMLImageElement ? el.alt.trim() : el.textContent?.trim().replace(/\s+/g, ' ');
      if (text && text.length > 2 && !seen.has(text)) {
        seen.add(text);
        textNodes.push(text);
      }
    });
    if (!textNodes.length) return;

    const rawText = textNodes.join('. ');
    const chunks = rawText.match(/[\s\S]{1,180}(?:\s|$)/g) || [rawText];
    speechQueueRef.current = chunks;
    speechIndexRef.current = 0;
    speechActiveRef.current = true;
    setIsSpeaking(true);
    setIsPaused(false);
    setSpeechMessage(t.tts.playing);

    const speakNext = () => {
      if (!speechActiveRef.current) return;
      if (speechIndexRef.current >= chunks.length) {
        speechActiveRef.current = false;
        setIsSpeaking(false);
        setIsPaused(false);
        setSpeechMessage('');
        return;
      }

      const piece = chunks[speechIndexRef.current++];
      const utterance = new SpeechSynthesisUtterance(piece);
      utterance.lang = language === 'id' ? 'id-ID' : 'en-US';
      const voice = pickVoice(language);
      if (voice) utterance.voice = voice;
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onend = () => { if (speechActiveRef.current) speakNext(); };
      utterance.onerror = (event) => {
        const error = (event as SpeechSynthesisErrorEvent).error;
        if (error === 'interrupted' || error === 'canceled') return;
        speechActiveRef.current = false;
        setIsSpeaking(false);
        setIsPaused(false);
        setSpeechMessage(t.tts.speechFailed);
      };

      // Chrome/Edge sering membutuhkan resume() sebelum speak().
      activeSynth.resume();
      activeSynth.speak(utterance);
    };

    speakNext();
  };
  const isActive = (path: string) => path === '/' ? pathname === '/' : pathname.startsWith(path);
  const navClass = (path: string) => `h-full flex items-center px-3.5 text-sm font-semibold border-b-2 transition-colors ${isActive(path) ? 'border-teal-600 text-teal-800 font-bold' : 'border-transparent text-slate-700 hover:text-teal-700'}`;


  return (
    <div className="site-nav relative w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-teal-100 font-sans">
      <div className="bg-teal-800 text-white text-xs border-b border-teal-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4 text-teal-50 text-[11px] font-medium tracking-wide">
            <span>{lang === 'id' ? 'BETAMI • Pabrik Kelapa Sawit (PKS), Aceh Tamiang' : 'BETAMI • Palm Oil Mill (PKS), Aceh Tamiang'}</span>
          </div>
          <div className="flex items-center justify-end w-full md:w-auto gap-3 sm:gap-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input type="text" placeholder={lang === 'id' ? 'Cari...' : 'Search...'} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-teal-700 hover:bg-teal-600 focus:bg-white focus:text-slate-900 text-white placeholder-teal-200 text-xs rounded-full pl-3 pr-7 py-1 w-28 sm:w-44 transition-all outline-none" />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-teal-100 hover:text-white" aria-label="Cari"><Search className="w-3.5 h-3.5" /></button>
            </form>
            <span className="text-teal-600">|</span>
            <button onClick={toggleSpeech} title={lang === 'id' ? 'Dengarkan Halaman' : 'Read Page Aloud'} className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold transition ${isSpeaking ? 'bg-amber-400 text-slate-900' : 'text-teal-50 hover:text-white hover:bg-white/10'}`}>
              {isSpeaking ? (isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3 fill-current" />) : <Volume2 className="w-3 h-3" />}
              <span className="hidden sm:inline">{isSpeaking ? (isPaused ? (lang === 'id' ? 'Lanjut' : 'Resume') : (lang === 'id' ? 'Jeda' : 'Pause')) : (lang === 'id' ? 'Dengarkan' : 'Listen')}</span>
            </button>
            {isSpeaking && <button onClick={stopSpeech} className="text-[11px] text-rose-200 hover:text-white underline">{t.tts.stop}</button>}
            {speechMessage && (
              <span className="max-w-[200px] truncate text-[11px] font-semibold text-amber-200" role="status" aria-live="polite">
                {speechMessage}
              </span>
            )}
            <span className="text-teal-600">|</span>
            <Link href="/kontak" className="text-teal-50 hover:text-white text-[11px] font-semibold transition">{lang === 'id' ? 'Kontak' : 'Contact'}</Link>
            <span className="text-teal-600">|</span>
            <div ref={langRef} className="relative">
              <button type="button" onClick={() => setLangDropdownOpen(!langDropdownOpen)} aria-label="Pilih Bahasa / Choose Language" title={lang === 'id' ? 'Bahasa Indonesia' : 'English'} className="flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-white/10 transition">
                <Image src={lang === 'id' ? '/images/flag-id.svg' : '/images/flag-en.svg'} alt={lang === 'id' ? 'Bendera Indonesia' : 'United Kingdom flag'} width={24} height={16} className="h-4 w-6 rounded-[2px] object-cover ring-1 ring-white/50" />
                <ChevronDown className="w-3 h-3 text-white" />
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-slate-800 rounded-lg shadow-lg py-1 border border-slate-200 z-50">
                  <button onClick={() => { setLang('id'); setLangDropdownOpen(false); }} aria-label="Indonesia" className={`w-full flex items-center gap-2.5 text-left px-3 py-2 text-xs hover:bg-slate-100 font-medium ${lang === 'id' ? 'text-teal-700 font-bold bg-teal-50' : ''}`}><Image src="/images/flag-id.svg" alt="Bendera Indonesia" width={24} height={16} className="h-4 w-6 rounded-[2px] object-cover ring-1 ring-slate-200" /></button>
                  <button onClick={() => { setLang('en'); setLangDropdownOpen(false); }} aria-label="English" className={`w-full flex items-center gap-2.5 text-left px-3 py-2 text-xs hover:bg-slate-100 font-medium ${lang === 'en' ? 'text-teal-700 font-bold bg-teal-50' : ''}`}><Image src="/images/flag-en.svg" alt="United Kingdom flag" width={24} height={16} className="h-4 w-6 rounded-[2px] object-cover ring-1 ring-slate-200" /></button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="site-brand flex items-center gap-3">
            <Image
              src="/images/logo-resmi-betami-cropped.png"
              alt={lang === 'id' ? 'Logo resmi BETAMI' : 'Official BETAMI logo'}
              width={52}
              height={52}
              priority
              className="h-11 w-11 shrink-0 object-contain sm:h-12 sm:w-12"
            />
            <span className="flex flex-col leading-none">
              <span className="site-brand__name text-[18px] font-extrabold tracking-[0.035em] text-[#173c30] sm:text-[20px]">BETAMI</span>
              <span className="site-brand__tagline mt-1 text-[11px] font-semibold tracking-[0.1em] text-[#6b5317] sm:text-[12px]">
                PT BENIH TAMIANG
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center h-full">
            <Link href="/" className={navClass('/')}>{t.nav.home}</Link>
            <div ref={aboutRef} className="h-full relative">
              <div className={`${navClass('/tentang-kami')} gap-1`}>
                <Link href="/tentang-kami" className="flex h-full items-center">{t.nav.about}</Link>
                <button
                  type="button"
                  onClick={() => { setAboutDropdownOpen((v) => !v); setBusinessDropdownOpen(false); }}
                  aria-label="Buka menu Tentang Kami"
                  aria-expanded={aboutDropdownOpen}
                  className="flex h-8 w-6 items-center justify-center rounded hover:bg-slate-100"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
            <div ref={businessRef} className="h-full relative">
              <div className={`${navClass('/bisnis')} gap-1`}>
                <Link href="/bisnis" className="flex h-full items-center">{t.nav.business}</Link>
                <button
                  type="button"
                  onClick={() => { setBusinessDropdownOpen((v) => !v); setAboutDropdownOpen(false); }}
                  aria-label="Buka menu Bisnis"
                  aria-expanded={businessDropdownOpen}
                  className="flex h-8 w-6 items-center justify-center rounded hover:bg-slate-100"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${businessDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
            <Link href="/keberlanjutan" className={navClass('/keberlanjutan')}>{lang === 'id' ? 'Keberlanjutan' : 'Sustainability'}</Link>
            <Link href="/galeri" className={navClass('/galeri')}>{t.nav.gallery}</Link>
            <Link href="/karir" className={navClass('/karir')}>{lang === 'id' ? 'Karir' : 'Careers'}</Link>
            <Link href="/magang" className={navClass('/magang')}>{lang === 'id' ? 'Magang' : 'Internship'}</Link>
            <Link href="/kontak" className={navClass('/kontak')}>{t.nav.contact}</Link>
          </nav>

          <div className="flex lg:hidden items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mobile-menu-toggle p-2 text-slate-700 hover:text-teal-700" aria-label={mobileMenuOpen ? (lang === 'id' ? 'Tutup menu' : 'Close menu') : (lang === 'id' ? 'Buka menu' : 'Open menu')} aria-expanded={mobileMenuOpen} aria-controls="mobile-site-menu">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {aboutDropdownOpen && (
        <div ref={aboutPanelRef} className="hidden lg:block absolute left-0 right-0 top-full bg-slate-900/95 backdrop-blur-md text-white py-10 border-t border-slate-700 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-8 items-start">
            <div className="col-span-3 border-r border-slate-700 pr-6">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">{lang === 'id' ? 'Profil Perusahaan' : 'Company Profile'}</span>
              <h3 className="text-xl font-bold text-white mt-1">BETAMI</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{lang === 'id' ? 'PT Benih Tamiang (BETAMI), Pabrik Kelapa Sawit (PKS) di Kecamatan Rantau, Aceh Tamiang.' : 'PT Benih Tamiang (BETAMI), Palm Oil Mill (PKS) in Rantau District, Aceh Tamiang.'}</p>
              <Link href="/tentang-kami" className="inline-block mt-4 text-xs font-bold text-teal-300 hover:text-teal-200 underline">{lang === 'id' ? 'Lihat Halaman Lengkap →' : 'View Full Page →'}</Link>
            </div>
            <div className="col-span-4 space-y-6">
              <Link href="/info/profil-lokasi" className="flex items-start gap-3.5 group"><div className="w-10 h-10 rounded-full border border-slate-500 group-hover:border-amber-400 flex items-center justify-center shrink-0 text-slate-300 group-hover:text-amber-400"><ShieldCheck className="w-5 h-5" /></div><div><h4 className="text-sm font-bold text-white group-hover:text-amber-300">{lang === 'id' ? 'Profil & Lokasi' : 'Profile & Location'}</h4><p className="text-xs text-slate-400 mt-0.5">{lang === 'id' ? 'Operasional PKS di Kec. Rantau, Aceh Tamiang' : 'PKS operations in Rantau District, Aceh Tamiang'}</p></div></Link>
              <Link href="/keberlanjutan" className="flex items-start gap-3.5 group"><div className="w-10 h-10 rounded-full border border-slate-500 group-hover:border-amber-400 flex items-center justify-center shrink-0 text-slate-300 group-hover:text-amber-400"><Leaf className="w-5 h-5" /></div><div><h4 className="text-sm font-bold text-white group-hover:text-amber-300">{lang === 'id' ? 'CSR & Keberlanjutan' : 'CSR & Sustainability'}</h4><p className="text-xs text-slate-400 mt-0.5">{lang === 'id' ? 'Bantuan sosial, fasilitas, dan infrastruktur jalan' : 'Social aid, facilities, and road support'}</p></div></Link>
              <Link href="/info/kemitraan-desa" className="flex items-start gap-3.5 group"><div className="w-10 h-10 rounded-full border border-slate-500 group-hover:border-amber-400 flex items-center justify-center shrink-0 text-slate-300 group-hover:text-amber-400"><HeartHandshake className="w-5 h-5" /></div><div><h4 className="text-sm font-bold text-white group-hover:text-amber-300">{lang === 'id' ? 'Kegiatan & Kemitraan Desa' : 'Activities & Village Partnership'}</h4><p className="text-xs text-slate-400 mt-0.5">{lang === 'id' ? 'Desa Suka Jadi, Benua Raja, Durian' : 'Suka Jadi, Benua Raja, Durian villages'}</p></div></Link>
            </div>
            <div className="col-span-5 space-y-6 border-l border-slate-700 pl-8">
              <Link href="/info/pengalaman-operasional" className="flex items-start gap-3.5 group"><div className="w-10 h-10 rounded-full border border-slate-500 group-hover:border-amber-400 flex items-center justify-center shrink-0 text-slate-300 group-hover:text-amber-400"><Award className="w-5 h-5" /></div><div><h4 className="text-sm font-bold text-white group-hover:text-amber-300">{lang === 'id' ? 'Pengalaman Operasional' : 'Operational Experience'}</h4><p className="text-xs text-slate-400 mt-0.5">{lang === 'id' ? '20+ tahun pengalaman di sektor kelapa sawit' : '20+ years in the palm oil sector'}</p></div></Link>
              <Link href="/info/informasi-publik" className="flex items-start gap-3.5 group"><div className="w-10 h-10 rounded-full border border-slate-500 group-hover:border-amber-400 flex items-center justify-center shrink-0 text-slate-300 group-hover:text-amber-400"><Building className="w-5 h-5" /></div><div><h4 className="text-sm font-bold text-white group-hover:text-amber-300">{lang === 'id' ? 'Informasi Publik' : 'Public Information'}</h4><p className="text-xs text-slate-400 mt-1">{lang === 'id' ? 'Data dirangkum dari pemberitaan dan referensi publik yang tersedia.' : 'Summarized from available public news and references.'}</p></div></Link>
            </div>
          </div>
        </div>
      )}

      {businessDropdownOpen && (
        <div ref={businessPanelRef} className="hidden lg:block absolute left-0 right-0 top-full bg-slate-900/95 backdrop-blur-md text-white py-8 border-t border-slate-700 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-3 gap-6">
            <Link href="/info/pasokan-tbs" className="p-4 rounded-xl border border-slate-700 hover:border-amber-400 transition bg-white/5 group"><div className="w-8 h-8 rounded-full border border-teal-400 text-teal-300 flex items-center justify-center mb-3"><Sprout className="w-4 h-4" /></div><h4 className="text-sm font-bold text-white group-hover:text-amber-300">{lang === 'id' ? 'Pasokan & Penerimaan TBS' : 'FFB Supply & Receiving'}</h4><p className="text-xs text-slate-300 mt-1">{lang === 'id' ? 'Penerimaan dan penanganan TBS untuk pengolahan PKS.' : 'Receiving and handling FFB for mill processing.'}</p></Link>
            <Link href="/info/pabrik-kelapa-sawit" className="p-4 rounded-xl border border-slate-700 hover:border-amber-400 transition bg-white/5 group"><div className="w-8 h-8 rounded-full border border-amber-400 text-amber-400 flex items-center justify-center mb-3"><Factory className="w-4 h-4" /></div><h4 className="text-sm font-bold text-white group-hover:text-amber-300">{lang === 'id' ? 'Pabrik Kelapa Sawit (PKS)' : 'Palm Oil Mill (PKS)'}</h4><p className="text-xs text-slate-300 mt-1">{lang === 'id' ? 'Pengolahan TBS menjadi CPO di Kecamatan Rantau.' : 'Processing FFB into CPO in Rantau District.'}</p></Link>
            <Link href="/info/cpo-inti-sawit" className="p-4 rounded-xl border border-slate-700 hover:border-amber-400 transition bg-white/5 group"><div className="w-8 h-8 rounded-full border border-teal-400 text-teal-300 flex items-center justify-center mb-3"><Award className="w-4 h-4" /></div><h4 className="text-sm font-bold text-white group-hover:text-amber-300">{lang === 'id' ? 'CPO & Inti Sawit' : 'CPO & Palm Kernel'}</h4><p className="text-xs text-slate-300 mt-1">{lang === 'id' ? 'Produk utama hasil olahan kelapa sawit.' : 'Primary outputs of palm oil processing.'}</p></Link>
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div id="mobile-site-menu" className="mobile-site-menu lg:hidden" role="dialog" aria-modal="true" aria-label={lang === 'id' ? 'Navigasi utama' : 'Main navigation'}>
          <div className="mobile-site-menu__top">
            <span>{lang === 'id' ? 'JELAJAHI BETAMI' : 'EXPLORE BETAMI'}</span>
            <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label={lang === 'id' ? 'Tutup menu' : 'Close menu'}><X aria-hidden="true" /></button>
          </div>
          <nav aria-label={lang === 'id' ? 'Menu utama' : 'Main menu'}>
            {[
              { href: '/', label: t.nav.home },
              {
                href: '/tentang-kami',
                label: t.nav.about,
                children: [
                  { href: '/info/profil-lokasi', label: lang === 'id' ? 'Profil & Lokasi' : 'Profile & Location' },
                  { href: '/keberlanjutan', label: lang === 'id' ? 'CSR & Keberlanjutan' : 'CSR & Sustainability' },
                  { href: '/info/kemitraan-desa', label: lang === 'id' ? 'Kegiatan & Kemitraan Desa' : 'Activities & Village Partnership' },
                  { href: '/info/pengalaman-operasional', label: lang === 'id' ? 'Pengalaman Operasional' : 'Operational Experience' },
                  { href: '/info/informasi-publik', label: lang === 'id' ? 'Informasi Publik' : 'Public Information' },
                ],
              },
              {
                href: '/bisnis',
                label: t.nav.business,
                children: [
                  { href: '/info/pasokan-tbs', label: lang === 'id' ? 'Pasokan & Penerimaan TBS' : 'FFB Supply & Receiving' },
                  { href: '/info/pabrik-kelapa-sawit', label: lang === 'id' ? 'Pabrik Kelapa Sawit (PKS)' : 'Palm Oil Mill (PKS)' },
                  { href: '/info/cpo-inti-sawit', label: lang === 'id' ? 'CPO & Inti Sawit' : 'CPO & Palm Kernel' },
                ],
              },
              { href: '/keberlanjutan', label: lang === 'id' ? 'Keberlanjutan' : 'Sustainability' },
              { href: '/galeri', label: t.nav.gallery },
              { href: '/karir', label: lang === 'id' ? 'Karir' : 'Careers' },
              { href: '/magang', label: lang === 'id' ? 'Magang' : 'Internship' },
              { href: '/kontak', label: t.nav.contact },
            ].map((item, index) => (
              <div key={item.href}>
                <Link href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <span>0{index + 1}</span>{item.label}
                </Link>
                {item.children && (
                  <div className="mobile-site-menu__sub">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} onClick={() => setMobileMenuOpen(false)}>
                        • {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <p>PT BENIH TAMIANG · ACEH TAMIANG</p>
        </div>
      )}
    </div>
  );
}
