import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import SecurityNotice from "@/components/SecurityNotice";
import SiteMotion from "@/components/SiteMotion";

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
          {/* Header lengket: TopBar + Navbar menempel di atas saat halaman digulir */}
          <header className="site-header fixed top-0 left-0 right-0 z-[60]">
            <TopBar />
            <Navbar />
          </header>
          <div className="flex-1">{children}</div>
          <SecurityNotice />
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
