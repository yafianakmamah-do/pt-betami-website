import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ProfileHighlight from '@/components/ProfileHighlight';
import BusinessSection from '@/components/BusinessSection';
import StatsSection from '@/components/StatsSection';
import GallerySection from '@/components/GallerySection';
import CTASection from '@/components/CTASection';
import VideoSection from '@/components/VideoSection';
import ProsesSawitSection from '@/components/ProsesSawitSection';
import SustainabilitySection from '@/components/SustainabilitySection';
import LocationSection from '@/components/LocationSection';

export default function HomePage() {
  return (
    <main className="cinematic-home">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Tentang PT BETAMI */}
      <AboutSection />

      {/* 2b. Sorotan Profil & Foto HD (penjelasan kiri, foto kanan) */}
      <ProfileHighlight />

      {/* 3. Bisnis Kami */}
      <BusinessSection />

      {/* 4. Statistik Perusahaan */}
      <StatsSection />

      {/* 5. Video Sawit (YouTube) */}
      <VideoSection />

      {/* 5b. Proses Pengolahan Kelapa Sawit - video lokal */}
      <ProsesSawitSection />

      <SustainabilitySection />

      {/* 6. Galeri */}
      <GallerySection isFullPage={false} />

      {/* 6b. Lokasi & Google Maps */}
      <LocationSection />

      {/* 7. CTA Ajakan Kolaborasi */}
      <CTASection />
    </main>
  );
}