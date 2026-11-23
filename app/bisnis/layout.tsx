import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bisnis Kami | PT BETAMI — PKS, CPO & TBS Aceh Tamiang',
  description: 'Kegiatan usaha PT BETAMI: Pabrik Kelapa Sawit (PKS), pengolahan Tandan Buah Segar (TBS) menjadi Crude Palm Oil (CPO) dan inti sawit di Aceh Tamiang.',
  keywords: ['bisnis PT BETAMI', 'CPO Aceh Tamiang', 'TBS kelapa sawit', 'pabrik kelapa sawit PKS'],
  alternates: {
    canonical: 'https://www.betami.co.id/bisnis',
  },
  openGraph: {
    title: 'Bisnis Kami | PT BETAMI — PKS, CPO & TBS Aceh Tamiang',
    description: 'Kegiatan usaha PT BETAMI: Pabrik Kelapa Sawit (PKS), pengolahan Tandan Buah Segar (TBS) menjadi Crude Palm Oil (CPO) dan inti sawit di Aceh Tamiang.',
    url: 'https://www.betami.co.id/bisnis',
    siteName: 'PT Benih Tamiang (BETAMI)',
    images: [
      {
        url: '/images/pks-factory-real.jpg',
        width: 1200,
        height: 630,
        alt: 'Bisnis Kami | PT BETAMI — PKS, CPO & TBS Aceh Tamiang',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bisnis Kami | PT BETAMI — PKS, CPO & TBS Aceh Tamiang',
    description: 'Kegiatan usaha PT BETAMI: Pabrik Kelapa Sawit (PKS), pengolahan Tandan Buah Segar (TBS) menjadi Crude Palm Oil (CPO) dan inti sawit di Aceh Tamiang.',
    images: ['/images/pks-factory-real.jpg'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}