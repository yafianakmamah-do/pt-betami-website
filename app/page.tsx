import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ProfileHighlight from '@/components/ProfileHighlight';
import BusinessSection from '@/components/BusinessSection';
import StatsSection from '@/components/StatsSection';
import GallerySection from '@/components/GallerySection';
import InternshipSection from '@/components/InternshipSection';
import CTASection from '@/components/CTASection';
import VideoSection from '@/components/VideoSection';
import SustainabilitySection from '@/components/SustainabilitySection';

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

      {/* 5. Video Sawit */}
      <VideoSection />

      <SustainabilitySection />

      {/* 6. Galeri */}
      <GallerySection isFullPage={false} />

      {/* 7. Magang PT BETAMI */}
      <InternshipSection />

      {/* 8. CTA Ajakan Kolaborasi */}
      <CTASection />
    </main>
  );
}
