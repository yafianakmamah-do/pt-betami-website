import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import SiteMotion from "@/components/SiteMotion";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "PT Benih Tamiang (BETAMI) | Pabrik Kelapa Sawit Aceh Tamiang",
  description:
    "Profil resmi PT Benih Tamiang (BETAMI). Pabrik Kelapa Sawit (PKS) di Kecamatan Rantau, Kabupaten Aceh Tamiang, Nanggroe Aceh Darussalam. Pengolahan TBS menjadi CPO berkualitas.",
  keywords: [
    "PT BETAMI",
    "PT Benih Tamiang",
    "Pabrik Kelapa Sawit",
    "PKS Aceh Tamiang",
    "Kelapa Sawit Rantau",
    "CPO Aceh Tamiang",
    "TBS Kelapa Sawit",
    "CSR Aceh Tamiang",
    "Perkebunan Sawit Indonesia",
    "Crude Palm Oil",
  ],
  authors: [{ name: "PT Benih Tamiang (BETAMI)" }],
  metadataBase: new URL("https://www.betami.co.id"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/images/logo-resmi-betami-cropped.png",
    apple: "/images/logo-resmi-betami-cropped.png",
  },
  openGraph: {
    title: "PT Benih Tamiang (BETAMI) | Pabrik Kelapa Sawit Aceh Tamiang",
    description:
      "PKS PT BETAMI beroperasi di Kecamatan Rantau, Aceh Tamiang. Pengolahan TBS menjadi CPO dan inti sawit dengan standar industri berkelanjutan.",
    url: "https://www.betami.co.id",
    siteName: "PT Benih Tamiang (BETAMI)",
    images: [
      {
        url: "/images/hero-palm.jpg",
        width: 1200,
        height: 630,
        alt: "PT Benih Tamiang (BETAMI) — Pabrik Kelapa Sawit Aceh Tamiang",
      },
    ],
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "PT Benih Tamiang (BETAMI) | Pabrik Kelapa Sawit Aceh Tamiang",
    description:
      "PKS PT BETAMI beroperasi di Kecamatan Rantau, Aceh Tamiang. Pengolahan TBS menjadi CPO dan inti sawit.",
    images: ["/images/hero-palm.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <LanguageProvider>
          <SiteMotion />
          <SiteChrome>{children}</SiteChrome>
        </LanguageProvider>
      </body>
    </html>
  );
}
