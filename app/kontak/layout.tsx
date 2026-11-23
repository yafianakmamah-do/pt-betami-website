import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontak | PT Benih Tamiang (BETAMI) — Hubungi Kami',
  description: 'Hubungi PT BETAMI untuk kerjasama, pasokan TBS, atau informasi umum. Alamat PKS: Desa Kebun Rantau, Kecamatan Rantau, Kabupaten Aceh Tamiang.',
  keywords: ['kontak PT BETAMI', 'alamat PKS Aceh Tamiang', 'email PT Benih Tamiang'],
  alternates: {
    canonical: 'https://www.betami.co.id/kontak',
  },
  openGraph: {
    title: 'Kontak | PT Benih Tamiang (BETAMI) — Hubungi Kami',
    description: 'Hubungi PT BETAMI untuk kerjasama, pasokan TBS, atau informasi umum. Alamat PKS: Desa Kebun Rantau, Kecamatan Rantau, Kabupaten Aceh Tamiang.',
    url: 'https://www.betami.co.id/kontak',
    siteName: 'PT Benih Tamiang (BETAMI)',
    images: [
      {
        url: '/images/pks-mill-ramp.jpg',
        width: 1200,
        height: 630,
        alt: 'Kontak | PT Benih Tamiang (BETAMI) — Hubungi Kami',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kontak | PT Benih Tamiang (BETAMI) — Hubungi Kami',
    description: 'Hubungi PT BETAMI untuk kerjasama, pasokan TBS, atau informasi umum. Alamat PKS: Desa Kebun Rantau, Kecamatan Rantau, Kabupaten Aceh Tamiang.',
    images: ['/images/pks-mill-ramp.jpg'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}