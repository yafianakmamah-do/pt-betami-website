'use client';

import { motion } from 'framer-motion';
import { ExternalLink, MapPin, Navigation, Crosshair } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { ScrollReveal } from '@/components/ScrollMotion';

const COORDS = '4.2843125,98.0998125';
const ADDRESS = '73MX+PWQ, Suka Rakyat, Kec. Rantau, Kabupaten Aceh Tamiang, Aceh 24453';
const MAP_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(COORDS)}&z=15&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COORDS)}`;
const DIRECTIONS_LINK = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(COORDS)}`;

export default function LocationSection() {
  const { lang } = useLanguage();
  const id = lang === 'id';

  const items = [
    { icon: MapPin, label: id ? 'Alamat' : 'Address', value: ADDRESS },
    { icon: Crosshair, label: id ? 'Koordinat' : 'Coordinates', value: '4.2843125, 98.0998125' },
  ];

  return (
    <section id="lokasi" className="relative overflow-hidden bg-[#03210f] py-20 text-white sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -40, scale: 0.97 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="group relative"
        >
          <div aria-hidden="true" className="absolute -inset-3 border border-amber-300/30 transition-transform duration-700 group-hover:translate-x-2 group-hover:translate-y-2" />
          <div className="relative h-[330px] overflow-hidden bg-gradient-to-br from-[#0a4326] to-[#021a0e] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.7)] sm:h-[430px]">
            <iframe
              title={id ? 'Peta lokasi PT BETAMI di Suka Rakyat, Kecamatan Rantau' : 'Map of PT BETAMI in Suka Rakyat, Rantau District'}
              src={MAP_EMBED}
              className="absolute inset-0 h-full w-full border-0 saturate-[.9]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 bg-[#03210f]/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-amber-300 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-300" />
              </span>
              Rantau • Aceh Tamiang
            </div>
          </div>
        </motion.div>

        <div>
          <ScrollReveal>
            <span className="mb-4 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-amber-300">
              <span className="h-px w-8 bg-amber-300" />
              {id ? 'Lokasi Estate / Perkebunan' : 'Estate / Plantation Location'}
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <h2 className="text-4xl font-extrabold leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl">
              Suka Rakyat,<br />
              <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">Rantau.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.16}>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-emerald-50/75 sm:text-base">
              {id
                ? `Lokasi yang ditetapkan untuk Estate / Perkebunan PT BETAMI berada di ${ADDRESS}.`
                : `The designated location of the PT BETAMI Estate / Plantation is ${ADDRESS}.`}
            </p>
          </ScrollReveal>

          <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {items.map((item, i) => (
              <ScrollReveal key={item.label} delay={0.22 + i * 0.08} y={18}>
                <div className="flex gap-4 py-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-amber-300/40 bg-amber-300/10 text-amber-300">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{item.label}</div>
                    <div className="mt-0.5 text-xs leading-relaxed text-emerald-50/65 sm:text-sm">{item.value}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.4}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={MAP_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-300 to-amber-500 px-6 py-3 text-sm font-bold text-[#03210f] shadow-lg shadow-amber-500/20 transition hover:-translate-y-0.5 hover:shadow-amber-500/40">
                {id ? 'Buka Google Maps' : 'Open Google Maps'}
                <ExternalLink className="h-4 w-4" />
              </a>
              <a href={DIRECTIONS_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-white/25 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-amber-300 hover:text-amber-200">
                <Navigation className="h-4 w-4" />
                {id ? 'Petunjuk Arah' : 'Get Directions'}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
