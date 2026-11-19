'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeartHandshake, ShieldCheck, TreePine, Users } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import EditorialHero from '@/components/EditorialHero';

export default function SustainabilityPage() {
  const { lang } = useLanguage();

  const items = [
    { icon: HeartHandshake, title: lang === 'id' ? 'Kepedulian Sosial (CSR)' : 'Social Care (CSR)', desc: lang === 'id' ? 'Bantuan sembako/logistik, dukungan kegiatan masyarakat, dan perhatian terhadap kebutuhan warga desa sekitar operasional.' : 'Food/logistic aid, community activity support, and attention to the needs of residents near operations.' },
    { icon: Users, title: lang === 'id' ? 'Kemitraan Desa Sekitar' : 'Nearby Village Partnership', desc: lang === 'id' ? 'Interaksi dengan desa seperti Suka Jadi, Benua Raja, dan Durian di Kecamatan Rantau, Aceh Tamiang.' : 'Engagement with villages such as Suka Jadi, Benua Raja, and Durian in Rantau District, Aceh Tamiang.' },
    { icon: TreePine, title: lang === 'id' ? 'Dukungan Infrastruktur' : 'Infrastructure Support', desc: lang === 'id' ? 'Perawatan/perbaikan jalan operasional yang turut dimanfaatkan masyarakat, serta dukungan fasilitas sesuai kebutuhan lokal yang diberitakan.' : 'Maintenance/repair of operational roads also used by communities, and facility support based on reported local needs.' },
    { icon: ShieldCheck, title: lang === 'id' ? 'Operasional Bertanggung Jawab' : 'Responsible Operations', desc: lang === 'id' ? 'Komitmen menjalankan operasional PKS secara bertanggung jawab dan menjaga hubungan baik dengan lingkungan sosial sekitar.' : 'Commitment to responsible PKS operations and maintaining good relations with the surrounding social environment.' },
  ];

  return (
    <main className="cinematic-page cinematic-page--sustainability">
      <EditorialHero image="/images/kegiatan/csr-betami-juli-2026.jpeg" title={lang === 'id' ? 'Keberlanjutan & CSR' : 'Sustainability & CSR'} description={lang === 'id' ? 'Kepedulian sosial, kemitraan desa, dan komitmen operasional bertanggung jawab PT BETAMI.' : 'Social care, village partnership, and responsible operational commitment of PT BETAMI.'} />

      <div className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 font-medium"><Link href="/" className="hover:text-teal-700 transition">{lang === 'id' ? 'Beranda' : 'Home'}</Link><span className="text-slate-400">&gt;</span><span className="text-slate-900 font-bold">{lang === 'id' ? 'Keberlanjutan' : 'Sustainability'}</span></div>
      </div>

      <section className="py-14 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{lang === 'id' ? 'Kontribusi untuk Masyarakat Sekitar' : 'Contribution to Surrounding Communities'}</h2>
            <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed">{lang === 'id' ? 'Berdasarkan berbagai pemberitaan publik, PT BETAMI menunjukkan kepedulian sosial melalui bantuan, dukungan fasilitas, dan perawatan infrastruktur di wilayah sekitar operasional Pabrik Kelapa Sawit (PKS) Kecamatan Rantau, Aceh Tamiang.' : 'Based on various public reports, PT BETAMI has demonstrated social care through aid, facility support, and infrastructure maintenance around its Palm Oil Mill (PKS) operations in Rantau District, Aceh Tamiang.'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item, i) => { const Icon = item.icon; return (
              <div key={i} className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center mb-3"><Icon className="w-5 h-5" /></div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ); })}
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200"><Image src="/images/kegiatan/csr-betami-juli-2026.jpeg" alt={lang === 'id' ? 'Kegiatan CSR PT BETAMI' : 'PT BETAMI CSR activity'} fill quality={75} className="object-cover" /></div>
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200"><Image src="/images/kegiatan/csr-sembako-betami.jpg" alt={lang === 'id' ? 'Bantuan sembako PT BETAMI' : 'PT BETAMI food aid distribution'} fill quality={75} className="object-cover" /></div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 italic">{lang === 'id' ? 'Dokumentasi bersumber dari pemberitaan publik kegiatan sosial PT BETAMI. Klaim keberlanjutan bersertifikat (mis. ISPO/RSPO) tidak dicantumkan tanpa verifikasi resmi.' : 'Documentation sourced from public reports of PT BETAMI social activities. Certified sustainability claims (e.g. ISPO/RSPO) are not stated without official verification.'}</p>
        </div>
      </section>
    </main>
  );
}
