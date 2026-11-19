'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building2, CalendarClock, MapPin, Mail, Users, HeartHandshake } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { ScrollParallax, ScrollReveal } from '@/components/ScrollMotion';

/**
 * ProfileHighlight — blok "wajah perusahaan" dengan penjelasan di sisi kiri
 * dan foto HD (hamparan kebun sawit dari atas, PKS, dan bibit) di sisi kanan.
 */
export default function ProfileHighlight() {
  const { lang } = useLanguage();

  const facts = [
    { icon: Building2, label: lang === 'id' ? 'Bidang Usaha' : 'Business Field', value: lang === 'id' ? 'Perkebunan sawit & Pabrik Kelapa Sawit (PKS)' : 'Oil palm plantation & Palm Oil Mill (PKS)' },
    { icon: MapPin, label: lang === 'id' ? 'Lokasi Operasional' : 'Operations', value: 'Desa Kebun Rantau, Kec. Rantau, Aceh Tamiang' },
    { icon: CalendarClock, label: lang === 'id' ? 'Pengalaman' : 'Experience', value: lang === 'id' ? 'Lebih dari 20 tahun' : 'Over 20 years' },
    { icon: Users, label: lang === 'id' ? 'Karyawan' : 'Employees', value: lang === 'id' ? '201–500 orang' : '201–500 people' },
    { icon: Mail, label: 'Email', value: 'pt.betami@gmail.com' },
    { icon: HeartHandshake, label: lang === 'id' ? 'Program Sosial' : 'Social Program', value: lang === 'id' ? 'Sembako, jalan desa, anak yatim, hibah lahan' : 'Food aid, village roads, orphans, land grant' },
  ];

  return (
    <section id="profil-hd" className="py-16 sm:py-20 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Baris 1: penjelasan kiri, foto HD kanan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <ScrollReveal className="lg:col-span-5 space-y-5">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold uppercase tracking-wider">
              {lang === 'id' ? 'Mengenal BETAMI' : 'Meet BETAMI'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
              {lang === 'id' ? 'Hamparan Kebun Sawit yang Menghidupi Banyak Keluarga' : 'Palm Estates That Support Many Families'}
            </h2>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              {lang === 'id'
                ? 'PT Benih Tamiang (BETAMI) mengelola perkebunan kelapa sawit dan Pabrik Kelapa Sawit (PKS) di Kecamatan Rantau, Kabupaten Aceh Tamiang. Setiap hari, Tandan Buah Segar (TBS) dari kebun sekitar diolah menjadi Crude Palm Oil (CPO) di pabrik kami.'
                : 'PT Benih Tamiang (BETAMI) manages oil palm estates and a Palm Oil Mill (PKS) in Rantau District, Aceh Tamiang Regency. Every day, Fresh Fruit Bunches (FFB) from surrounding estates are processed into Crude Palm Oil (CPO) at our mill.'}
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {lang === 'id'
                ? 'Sesuai pemberitaan publik, perusahaan telah beroperasi lebih dari dua dekade, menyerap ratusan tenaga kerja lokal, serta secara rutin menjalankan program tanggung jawab sosial bagi desa di sekitar wilayah operasional.'
                : 'According to public reporting, the company has operated for over two decades, employs hundreds of local workers, and routinely runs social responsibility programs for villages around its operational area.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {facts.map((f) => (
                <div key={f.label} className="flex items-start gap-2.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
                  <f.icon className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="text-[10.5px] uppercase tracking-wider font-bold text-slate-500">{f.label}</div>
                    <div className="text-[12.5px] font-semibold text-slate-800 leading-snug">{f.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link href="/tentang-kami" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm transition shadow-sm">
                {lang === 'id' ? 'Profil Lengkap' : 'Full Profile'} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/galeri" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-teal-800 font-semibold text-sm transition border border-teal-200">
                {lang === 'id' ? 'Lihat Galeri HD' : 'View HD Gallery'}
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-7" delay={0.12}>
            <div className="relative">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-xl border border-slate-200">
                <ScrollParallax className="absolute inset-0 scale-[1.08]" distance={22}>
                  <Image src="/images/tbs-harvest.jpg" alt={lang === 'id' ? 'Tandan buah segar di area operasional BETAMI' : 'Fresh fruit bunches in BETAMI operations'} fill quality={75} sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
                </ScrollParallax>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-[11px] text-white/90 bg-black/35 backdrop-blur px-2.5 py-1 rounded-md border border-white/10">
                  {lang === 'id' ? 'Tandan buah segar hasil panen' : 'Harvested fresh fruit bunches'}
                </div>
              </div>
              <div className="absolute -bottom-6 -left-4 sm:-left-6 w-36 sm:w-44 aspect-[4/3] rounded-xl overflow-hidden shadow-lg border-4 border-white">
                <ScrollParallax className="absolute inset-0 scale-[1.08]" distance={-18}>
                  <Image src="/images/kegiatan/csr-betami-juli-2026.jpeg" alt={lang === 'id' ? 'Kegiatan sosial bersama warga' : 'Community social activity'} fill quality={75} sizes="200px" className="object-cover" />
                </ScrollParallax>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Baris 2: penjelasan kiri, foto HD kanan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mt-20">
          <ScrollReveal className="lg:col-span-5 space-y-5">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold uppercase tracking-wider">
              {lang === 'id' ? 'Dari Kebun ke Pabrik' : 'From Estate to Mill'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {lang === 'id' ? 'Jalan Operasional & Infrastruktur Kebun' : 'Operational Roads & Estate Infrastructure'}
            </h2>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              {lang === 'id'
                ? 'Jaringan jalan kebun menghubungkan blok-blok tanaman menuju titik pengumpulan TBS dan PKS. Perawatan jalan ini tidak hanya menopang operasional perusahaan, tetapi juga dimanfaatkan warga desa sekitar — salah satu bentuk kontribusi yang rutin dilakukan.'
                : 'The estate road network connects planting blocks to FFB collection points and the mill. Maintaining these roads supports company operations and is also used by nearby villagers — a routine form of contribution.'}
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              {(lang === 'id'
                ? ['Penerimaan dan penanganan TBS sebelum diolah', 'Pengolahan TBS menjadi CPO & inti sawit', 'Penyerapan tenaga kerja lokal di sekitar kebun', 'Dukungan perawatan jalan untuk masyarakat']
                : ['FFB receiving and handling before processing', 'FFB processing into CPO & palm kernel', 'Local employment around the estate', 'Road maintenance support for the community']
              ).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-teal-700 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/bisnis" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm transition shadow-sm">
              {lang === 'id' ? 'Detail Kegiatan Usaha' : 'Business Details'} <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-7" delay={0.12}>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-slate-200 col-span-1">
                <ScrollParallax className="absolute inset-0 scale-[1.08]" distance={18}>
                  <Image src="/images/palm-fruit-bunch.jpg" alt={lang === 'id' ? 'Pohon kelapa sawit di area kebun' : 'Oil palm tree in the estate'} fill quality={75} sizes="(max-width: 1024px) 50vw, 28vw" className="object-cover" />
                </ScrollParallax>
              </div>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-slate-200 col-span-1">
                <ScrollParallax className="absolute inset-0 scale-[1.08]" distance={-18}>
                  <Image src="/images/pks-mill-ramp.jpg" alt={lang === 'id' ? 'Truk TBS di area penerimaan PKS BETAMI' : 'FFB trucks at the BETAMI mill receiving area'} fill quality={75} sizes="(max-width: 1024px) 50vw, 28vw" className="object-cover" />
                </ScrollParallax>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 italic">
              {lang === 'id'
                ? 'Dokumentasi: pohon kelapa sawit dan area penerimaan TBS di PKS. Data perusahaan dirangkum dari pemberitaan publik.'
                : 'Photos: an oil palm tree and the mill FFB receiving area. Company data summarized from public reporting.'}
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
