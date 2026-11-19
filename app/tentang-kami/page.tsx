'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import EditorialHero from '@/components/EditorialHero';

const CheckItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2">
    <span className="text-teal-700 font-bold mt-0.5">✓</span>
    <span className="text-gray-700">{children}</span>
  </li>
);

export default function AboutPage() {
  const { lang } = useLanguage();

  return (
    <main className="cinematic-page cinematic-page--about">
      <EditorialHero image="/images/pks-factory-real.jpg" title={lang === 'id' ? 'Tentang PT BETAMI' : 'About PT BETAMI'} description={lang === 'id' ? 'PT Benih Tamiang (BETAMI) — Pabrik Kelapa Sawit di Kecamatan Rantau, Kabupaten Aceh Tamiang.' : 'PT Benih Tamiang (BETAMI) — Palm Oil Mill in Rantau District, Aceh Tamiang Regency.'} />

      <div className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 font-medium">
          <Link href="/" className="hover:text-teal-700 transition">{lang === 'id' ? 'Beranda' : 'Home'}</Link><span className="text-slate-400">&gt;</span><span className="text-slate-900 font-bold">{lang === 'id' ? 'Tentang Kami' : 'About Us'}</span>
        </div>
      </div>

      <section id="profil" className="py-14 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900"><span className="text-teal-700">{lang === 'id' ? 'Profil' : 'Profile'}</span> {lang === 'id' ? 'Perusahaan' : 'Overview'}</h2>
            <div className="w-16 h-1 bg-teal-600 mt-2" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p><strong>PT Benih Tamiang (BETAMI)</strong> {lang === 'id' ? 'adalah perusahaan sektor kelapa sawit yang mengoperasikan Pabrik Kelapa Sawit (PKS) di wilayah Kecamatan Rantau, Kabupaten Aceh Tamiang, Nanggroe Aceh Darussalam.' : 'is a palm oil sector company operating a Palm Oil Mill (PKS) in Rantau District, Aceh Tamiang Regency, Nanggroe Aceh Darussalam.'}</p>
              <p>{lang === 'id' ? 'Kegiatan utama mencakup penerimaan dan pengolahan Tandan Buah Segar (TBS) menjadi Crude Palm Oil (CPO). Berdasarkan referensi publik, perusahaan disebut memiliki pengalaman lebih dari dua dekade di sektor sawit dan berinteraksi dengan masyarakat desa sekitar operasional.' : 'Core activities include receiving and processing Fresh Fruit Bunches (FFB) into Crude Palm Oil (CPO). Public references indicate over two decades of experience in the palm sector and engagement with nearby village communities.'}</p>
              <ul className="space-y-2 text-sm pt-2">
                <CheckItem>{lang === 'id' ? 'Lokasi operasional: Desa Kebun Rantau, Kec. Rantau, Aceh Tamiang (ref. 73PX+GQF)' : 'Operational location: Desa Kebun Rantau, Rantau District, Aceh Tamiang (ref. 73PX+GQF)'}</CheckItem>
                <CheckItem>{lang === 'id' ? 'Wilayah interaksi/desa sekitar: Suka Jadi, Benua Raja, Durian' : 'Nearby engagement villages: Suka Jadi, Benua Raja, Durian'}</CheckItem>
                <CheckItem>{lang === 'id' ? 'Fokus: pengolahan TBS, produk CPO/inti sawit, kontribusi ekonomi & sosial lokal' : 'Focus: FFB processing, CPO/palm kernel products, local economic & social contribution'}</CheckItem>
              </ul>
              <p className="text-xs text-slate-500 italic">{lang === 'id' ? 'Informasi dirangkum dari sumber publik/pemberitaan; detail resmi dapat dikonfirmasi langsung kepada perusahaan.' : 'Information summarized from public sources/reports; official details should be confirmed directly with the company.'}</p>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-md border border-slate-200">
                <Image src="/images/tbs-harvest.jpg" alt={lang === 'id' ? 'TBS kelapa sawit' : 'Oil palm fresh fruit bunches'} fill quality={75} sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover object-center" />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 italic">{lang === 'id' ? 'Tandan Buah Segar (TBS) sebagai bahan baku pengolahan CPO.' : 'Fresh Fruit Bunches (FFB) as raw material for CPO processing.'}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 bg-slate-50 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center max-w-3xl mx-auto">
            <span className="text-xs uppercase font-bold tracking-widest text-teal-700 block mb-1">{lang === 'id' ? 'CSR & Kontribusi' : 'CSR & Contribution'}</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{lang === 'id' ? 'Kepedulian Sosial dan Kemitraan Desa' : 'Social Care and Village Partnership'}</h2>
            <p className="text-sm text-slate-600 mt-2">{lang === 'id' ? 'Berdasarkan pemberitaan publik, PT BETAMI terlibat dalam berbagai kegiatan sosial di sekitar wilayah operasional.' : 'Based on public reports, PT BETAMI has been involved in social activities around its operational area.'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { t: lang === 'id' ? 'Bantuan & Kegiatan Sosial' : 'Aid & Social Activities', d: lang === 'id' ? 'Penyaluran bantuan sembako/logistik dan kegiatan sosial untuk warga desa sekitar.' : 'Distribution of food/logistic aid and social activities for nearby residents.' },
              { t: lang === 'id' ? 'Dukungan Fasilitas' : 'Facility Support', d: lang === 'id' ? 'Dukungan fasilitas/penyerahan lahan untuk kebutuhan masyarakat (mis. mushalla/lahan makam) sesuai pemberitaan.' : 'Support for facilities/land for community needs as reported publicly.' },
              { t: lang === 'id' ? 'Infrastruktur & Jalan' : 'Infrastructure & Roads', d: lang === 'id' ? 'Perawatan/perbaikan jalan operasional yang juga dimanfaatkan masyarakat sekitar.' : 'Maintenance/repair of operational roads also used by surrounding communities.' },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.t}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-slate-200"><Image src="/images/kegiatan/csr-betami-juli-2026.jpeg" alt={lang === 'id' ? 'Kegiatan sosial PT BETAMI' : 'PT BETAMI community initiative'} fill quality={75} className="object-cover" /></div>
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-slate-200"><Image src="/images/kegiatan/csr-sembako-betami.jpg" alt={lang === 'id' ? 'Penyaluran bantuan PT BETAMI' : 'PT BETAMI community aid distribution'} fill quality={75} className="object-cover" /></div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">{lang === 'id' ? 'Sumber foto: dokumentasi/pemberitaan publik terkait kegiatan PT BETAMI.' : 'Photo source: public documentation and reporting on PT BETAMI activities.'}</p>
        </div>
      </section>

      <section className="py-12 bg-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">{lang === 'id' ? 'Butuh informasi lebih lanjut?' : 'Need more information?'}</h3>
            <p className="text-sm text-teal-100 mt-1">{lang === 'id' ? 'Hubungi kami untuk pertanyaan terkait operasional, kemitraan, atau informasi magang.' : 'Contact us for operational, partnership, or internship inquiries.'}</p>
          </div>
          <Link href="/kontak" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition"><span>{lang === 'id' ? 'Hubungi PT BETAMI' : 'Contact PT BETAMI'}</span><ChevronRight className="w-4 h-4" /></Link>
        </div>
      </section>
    </main>
  );
}
