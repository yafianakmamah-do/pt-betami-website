import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Karir | PT BETAMI — Bergabung dengan Tim Kami',
  description: 'Lowongan dan peluang karir di PT Benih Tamiang (BETAMI). Bergabunglah dengan perusahaan Pabrik Kelapa Sawit berpengalaman di Aceh Tamiang.',
  keywords: ['karir PT BETAMI', 'lowongan kerja sawit Aceh Tamiang', 'rekrutmen BETAMI'],
  alternates: {
    canonical: 'https://www.betami.co.id/karir',
  },
  openGraph: {
    title: 'Karir | PT BETAMI — Bergabung dengan Tim Kami',
    description: 'Lowongan dan peluang karir di PT Benih Tamiang (BETAMI). Bergabunglah dengan perusahaan Pabrik Kelapa Sawit berpengalaman di Aceh Tamiang.',
    url: 'https://www.betami.co.id/karir',
    siteName: 'PT Benih Tamiang (BETAMI)',
    images: [
      {
        url: '/images/pks-factory-real.jpg',
        width: 1200,
        height: 630,
        alt: 'Karir | PT BETAMI — Bergabung dengan Tim Kami',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Karir | PT BETAMI — Bergabung dengan Tim Kami',
    description: 'Lowongan dan peluang karir di PT Benih Tamiang (BETAMI). Bergabunglah dengan perusahaan Pabrik Kelapa Sawit berpengalaman di Aceh Tamiang.',
    images: ['/images/pks-factory-real.jpg'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}