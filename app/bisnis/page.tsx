'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Factory, Droplets, Sprout } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import EditorialHero from '@/components/EditorialHero';

export default function BusinessPage() {
  const { lang } = useLanguage();

  const pillars = [
    { id: 'perkebunan', icon: Sprout, title: lang === 'id' ? 'Pasokan & Penerimaan TBS' : 'FFB Supply & Receiving', img: '/images/tbs-harvest.jpg', desc: lang === 'id' ? 'Tandan Buah Segar (TBS) dari area pasokan diterima dan ditangani di fasilitas pabrik untuk menjaga kesegaran sebelum proses pengolahan.' : 'Fresh Fruit Bunches (FFB) from supply areas are received and handled at the mill facility to maintain freshness before processing.', points: lang === 'id' ? ['Penerimaan TBS di area PKS', 'Penanganan buah segar', 'Koordinasi pasokan wilayah sekitar'] : ['FFB receiving at PKS', 'Fresh fruit handling', 'Local supply coordination'] },
    { id: 'pengolahan', icon: Factory, title: lang === 'id' ? 'Pabrik Kelapa Sawit (PKS)' : 'Palm Oil Mill (PKS)', img: '/images/pks-factory-real.jpg', desc: lang === 'id' ? 'PT BETAMI mengoperasikan Pabrik Kelapa Sawit (PKS) di Kecamatan Rantau, Aceh Tamiang, untuk mengolah TBS menjadi Crude Palm Oil (CPO) dan produk inti sawit.' : 'PT BETAMI operates a Palm Oil Mill (PKS) in Rantau District, Aceh Tamiang, processing FFB into Crude Palm Oil (CPO) and palm kernel products.', points: lang === 'id' ? ['Pengolahan TBS menjadi CPO', 'Fasilitas PKS di Aceh Tamiang', 'Operasional pengolahan kelapa sawit'] : ['FFB to CPO processing', 'PKS facility in Aceh Tamiang', 'Palm oil processing operations'] },
    { id: 'produk', icon: Droplets, title: lang === 'id' ? 'Produk: CPO & Inti Sawit' : 'Products: CPO & Palm Kernel', img: '/images/fruit-oil-palm-real.jpg', desc: lang === 'id' ? 'Hasil olahan utama berupa Crude Palm Oil (CPO) dan inti sawit (palm kernel) yang menjadi bagian dari rantai pasok industri kelapa sawit.' : 'Primary outputs are Crude Palm Oil (CPO) and palm kernel, forming part of the palm oil industry supply chain.', points: lang === 'id' ? ['Crude Palm Oil (CPO)', 'Inti sawit (Palm Kernel)', 'Kontribusi pada rantai pasok sawit'] : ['Crude Palm Oil (CPO)', 'Palm Kernel', 'Contribution to palm supply chain'] },
  ];

  return (
    <main className="cinematic-page cinematic-page--business">
      <EditorialHero image="/images/pks-factory-real.jpg" title={lang === 'id' ? 'Kegiatan usaha' : 'Our operations'} description={lang === 'id' ? 'Fokus operasional PT BETAMI dalam pengolahan TBS di Pabrik Kelapa Sawit (PKS) Aceh Tamiang.' : 'PT BETAMI operational focus in FFB processing at its Palm Oil Mill (PKS) in Aceh Tamiang.'} />

      <div className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 font-medium"><Link href="/" className="hover:text-teal-700 transition">{lang === 'id' ? 'Beranda' : 'Home'}</Link><span className="text-slate-400">&gt;</span><span className="text-slate-900 font-bold">{lang === 'id' ? 'Bisnis' : 'Business'}</span></div>
      </div>

      <section className="py-14 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={p.id} id={p.id} className={`business-chapter grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-40 ${i % 2 === 1 ? '' : ''}`}>
                <div className={`lg:col-span-6 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-md border border-slate-200"><Image src={p.img} alt={p.title} fill quality={75} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div>
                </div>
                <div className={`lg:col-span-6 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="w-11 h-11 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3 border border-teal-100"><Icon className="w-5 h-5" /></div>
                  <h2 className="text-2xl font-extrabold text-slate-900">{p.title}</h2>
                  <p className="mt-3 text-sm text-slate-700 leading-relaxed">{p.desc}</p>
                  <ul className="mt-4 space-y-2">
                    {p.points.map((pt, idx) => (<li key={idx} className="flex items-start gap-2 text-sm text-slate-700"><span className="text-teal-700 font-bold mt-0.5">✓</span><span>{pt}</span></li>))}
                  </ul>
                </div>
              </div>
            );
          })}
          <p className="text-xs text-slate-500 italic border-t border-slate-200 pt-6">{lang === 'id' ? 'Catatan: rincian teknis kapasitas/volume spesifik tidak ditampilkan karena tidak tersedia dari sumber publik yang terverifikasi; informasi difokuskan pada kegiatan operasional yang dapat dirujuk secara publik.' : 'Note: Specific technical capacity/volume figures are not shown as they are not available from verified public sources; information focuses on publicly referable operational activities.'}</p>
        </div>
      </section>
    </main>
  );
}
