'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TopBar from '@/components/TopBar';
import SecurityNotice from '@/components/SecurityNotice';

/**
 * Header dan footer publik tidak ditampilkan di /admin,
 * termasuk halaman login admin.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');

  if (isAdmin) return <div className="flex-1">{children}</div>;

  return (
    <>
      {/* Dekorasi latar: motif daun sawit + logo BETAMI blur. Tidak bisa diklik dan tidak tampil di /admin. */}
      <div className="site-atmosphere" aria-hidden="true">
        <div className="site-atmosphere__palm site-atmosphere__palm--dark" />
        <div className="site-atmosphere__palm site-atmosphere__palm--light" />
        <div className="site-atmosphere__frond site-atmosphere__frond--one" />
        <div className="site-atmosphere__frond site-atmosphere__frond--two" />
        <div className="site-atmosphere__logo site-atmosphere__logo--dark" />
        <div className="site-atmosphere__logo site-atmosphere__logo--light" />
      </div>
      <header className="site-header fixed top-0 left-0 right-0 z-[70]">
        <TopBar />
        <Navbar />
      </header>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          className="flex-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <SecurityNotice />
      <Footer />
    </>
  );
}
