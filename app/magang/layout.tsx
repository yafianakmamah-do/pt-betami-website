import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Magang | PT BETAMI — Program Magang Kelapa Sawit',
  description: 'Program magang PT BETAMI untuk mahasiswa dan pelajar. Dapatkan pengalaman langsung di industri Pabrik Kelapa Sawit (PKS) di Aceh Tamiang.',
  keywords: ['magang PT BETAMI', 'program magang PKS', 'magang sawit Aceh Tamiang'],
  alternates: {
    canonical: 'https://www.betami.co.id/magang',
  },
  openGraph: {
    title: 'Magang | PT BETAMI — Program Magang Kelapa Sawit',
    description: 'Program magang PT BETAMI untuk mahasiswa dan pelajar. Dapatkan pengalaman langsung di industri Pabrik Kelapa Sawit (PKS) di Aceh Tamiang.',
    url: 'https://www.betami.co.id/magang',
    siteName: 'PT Benih Tamiang (BETAMI)',
    images: [
      {
        url: '/images/internship.jpg',
        width: 1200,
        height: 630,
        alt: 'Magang | PT BETAMI — Program Magang Kelapa Sawit',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Magang | PT BETAMI — Program Magang Kelapa Sawit',
    description: 'Program magang PT BETAMI untuk mahasiswa dan pelajar. Dapatkan pengalaman langsung di industri Pabrik Kelapa Sawit (PKS) di Aceh Tamiang.',
    images: ['/images/internship.jpg'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}