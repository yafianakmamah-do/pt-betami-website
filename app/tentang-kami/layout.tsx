import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tentang Kami | PT Benih Tamiang (BETAMI)',
  description: 'Profil lengkap PT BETAMI — perusahaan Pabrik Kelapa Sawit (PKS) di Kecamatan Rantau, Aceh Tamiang. Visi, misi, sejarah, dan program CSR perusahaan.',
  keywords: ['tentang PT BETAMI', 'profil perusahaan sawit', 'PKS Aceh Tamiang', 'sejarah BETAMI'],
  alternates: {
    canonical: 'https://www.betami.co.id/tentang-kami',
  },
  openGraph: {
    title: 'Tentang Kami | PT Benih Tamiang (BETAMI)',
    description: 'Profil lengkap PT BETAMI — perusahaan Pabrik Kelapa Sawit (PKS) di Kecamatan Rantau, Aceh Tamiang. Visi, misi, sejarah, dan program CSR perusahaan.',
    url: 'https://www.betami.co.id/tentang-kami',
    siteName: 'PT Benih Tamiang (BETAMI)',
    images: [
      {
        url: '/images/aerial-palm-estate.jpg',
        width: 1200,
        height: 630,
        alt: 'Tentang Kami | PT Benih Tamiang (BETAMI)',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tentang Kami | PT Benih Tamiang (BETAMI)',
    description: 'Profil lengkap PT BETAMI — perusahaan Pabrik Kelapa Sawit (PKS) di Kecamatan Rantau, Aceh Tamiang. Visi, misi, sejarah, dan program CSR perusahaan.',
    images: ['/images/aerial-palm-estate.jpg'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}