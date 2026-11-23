import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Keberlanjutan & CSR | PT BETAMI',
  description: 'Program keberlanjutan dan tanggung jawab sosial (CSR) PT BETAMI: bantuan sembako, perawatan jalan desa, dukungan pendidikan di Aceh Tamiang.',
  keywords: ['CSR PT BETAMI', 'keberlanjutan sawit', 'program sosial Aceh Tamiang'],
  alternates: {
    canonical: 'https://www.betami.co.id/keberlanjutan',
  },
  openGraph: {
    title: 'Keberlanjutan & CSR | PT BETAMI',
    description: 'Program keberlanjutan dan tanggung jawab sosial (CSR) PT BETAMI: bantuan sembako, perawatan jalan desa, dukungan pendidikan di Aceh Tamiang.',
    url: 'https://www.betami.co.id/keberlanjutan',
    siteName: 'PT Benih Tamiang (BETAMI)',
    images: [
      {
        url: '/images/kegiatan/csr-betami-juli-2026.jpeg',
        width: 1200,
        height: 630,
        alt: 'Keberlanjutan & CSR | PT BETAMI',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keberlanjutan & CSR | PT BETAMI',
    description: 'Program keberlanjutan dan tanggung jawab sosial (CSR) PT BETAMI: bantuan sembako, perawatan jalan desa, dukungan pendidikan di Aceh Tamiang.',
    images: ['/images/kegiatan/csr-betami-juli-2026.jpeg'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}