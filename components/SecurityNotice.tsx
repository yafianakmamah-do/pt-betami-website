'use client';

﻿import Link from 'next/link';
import { ShieldCheck, Lock, BadgeCheck } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function SecurityNotice() {
  const { lang } = useLanguage();

  return (
    <div className="site-security-notice border-t border-teal-100 bg-gradient-to-r from-teal-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-700">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="inline-flex items-center gap-1.5 font-semibold text-teal-800"><ShieldCheck className="w-4 h-4" />{lang === 'id' ? 'Keamanan Situs' : 'Website Security'}</span>
          <span className="inline-flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-teal-700" />{lang === 'id' ? 'Koneksi terenkripsi (HTTPS) & perlindungan data formulir' : 'Encrypted connection (HTTPS) & form data protection'}</span>
          <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5 text-teal-700" />{lang === 'id' ? 'Verifikasi anti-spam pada formulir kontak' : 'Anti-spam verification on contact forms'}</span>
        </div>
        <Link href="/kontak#keamanan" className="text-teal-700 hover:text-teal-900 font-semibold">{lang === 'id' ? 'Kebijakan & Keamanan →' : 'Privacy & Security →'}</Link>
      </div>
    </div>
  );
}
