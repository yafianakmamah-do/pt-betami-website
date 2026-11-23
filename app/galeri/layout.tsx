import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Galeri | PT BETAMI — Dokumentasi PKS & Perkebunan Sawit',
  description: 'Koleksi foto fasilitas Pabrik Kelapa Sawit (PKS), perkebunan, Tandan Buah Segar (TBS), serta kegiatan sosial PT BETAMI di Aceh Tamiang.',
  keywords: ['galeri PT BETAMI', 'foto PKS sawit', 'dokumentasi perkebunan kelapa sawit'],
  alternates: {
    canonical: 'https://www.betami.co.id/galeri',
  },
  openGraph: {
    title: 'Galeri | PT BETAMI — Dokumentasi PKS & Perkebunan Sawit',
    description: 'Koleksi foto fasilitas Pabrik Kelapa Sawit (PKS), perkebunan, Tandan Buah Segar (TBS), serta kegiatan sosial PT BETAMI di Aceh Tamiang.',
    url: 'https://www.betami.co.id/galeri',
    siteName: 'PT Benih Tamiang (BETAMI)',
    images: [
      {
        url: '/images/pks-aerial-hd.jpg',
        width: 1200,
        height: 630,
        alt: 'Galeri | PT BETAMI — Dokumentasi PKS & Perkebunan Sawit',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Galeri | PT BETAMI — Dokumentasi PKS & Perkebunan Sawit',
    description: 'Koleksi foto fasilitas Pabrik Kelapa Sawit (PKS), perkebunan, Tandan Buah Segar (TBS), serta kegiatan sosial PT BETAMI di Aceh Tamiang.',
    images: ['/images/pks-aerial-hd.jpg'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}