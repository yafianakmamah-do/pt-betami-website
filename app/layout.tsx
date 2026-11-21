import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import SiteMotion from "@/components/SiteMotion";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "PT Benih Tamiang (BETAMI) | Pabrik Kelapa Sawit Aceh Tamiang",
  description:
    "Profil resmi PT Benih Tamiang (BETAMI). Pabrik Kelapa Sawit (PKS) di Kecamatan Rantau, Kabupaten Aceh Tamiang, berkomitmen pada operasional berkelanjutan, kemitraan desa, dan program CSR.",
  keywords: [
    "PT BETAMI",
    "PT Benih Tamiang",
    "Pabrik Kelapa Sawit",
    "PKS Aceh Tamiang",
    "Kelapa Sawit Rantau",
    "CPO",
    "TBS",
    "CSR Aceh Tamiang",
    "Perkebunan Sawit"
  ],
  authors: [{ name: "PT Benih Tamiang (BETAMI)" }],
  icons: {
    icon: "/images/logo-resmi-betami-cropped.png",
  },
  openGraph: {
    title: "PT Benih Tamiang (BETAMI) | Pabrik Kelapa Sawit Aceh Tamiang",
    description:
      "PKS PT BETAMI beroperasi di Kecamatan Rantau, Aceh Tamiang dengan fokus pada keberlanjutan, penyerapan tenaga kerja, dan kontribusi sosial bagi desa sekitar.",
    type: "website",
    locale: "id_ID",
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
