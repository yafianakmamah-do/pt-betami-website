import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Berita | PT BETAMI — Kabar Terbaru Perusahaan',
  description: 'Berita dan kabar terbaru PT Benih Tamiang (BETAMI): kegiatan perusahaan, CSR, dan operasional PKS di Aceh Tamiang.',
  keywords: ['berita PT BETAMI', 'kabar PKS Aceh Tamiang', 'CSR PT BETAMI'],
  alternates: {
    canonical: 'https://www.betami.co.id/berita',
  },
  openGraph: {
    title: 'Berita | PT BETAMI — Kabar Terbaru Perusahaan',
    description: 'Berita dan kabar terbaru PT Benih Tamiang (BETAMI): kegiatan perusahaan, CSR, dan operasional PKS di Aceh Tamiang.',
    url: 'https://www.betami.co.id/berita',
    siteName: 'PT Benih Tamiang (BETAMI)',
    images: [
      {
        url: '/images/pks-aerial-hd.jpg',
        width: 1200,
        height: 630,
        alt: 'Berita | PT BETAMI — Kabar Terbaru Perusahaan',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Berita | PT BETAMI — Kabar Terbaru Perusahaan',
    description: 'Berita dan kabar terbaru PT Benih Tamiang (BETAMI): kegiatan perusahaan, CSR, dan operasional PKS di Aceh Tamiang.',
    images: ['/images/pks-aerial-hd.jpg'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}