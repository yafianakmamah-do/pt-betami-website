'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, Briefcase, FileText, GraduationCap, Users, Images,
  MessageSquare, Settings, LogOut, X, ExternalLink,
  ChevronDown, ChevronRight, SlidersHorizontal,
  Newspaper,
} from 'lucide-react';
import type { AdminTab } from './hooks';

type SidebarProps = {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  userEmail: string;
  /** Controlled oleh halaman admin; fallback ke state internal bila tidak diberikan. */
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
};

const menuItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { id: 'career', label: 'Lamaran Kerja & CV', icon: <FileText className="h-5 w-5" /> },
  { id: 'careerSettings', label: 'Pengaturan Karir', icon: <SlidersHorizontal className="h-5 w-5" /> },
  { id: 'jobs', label: 'Lowongan Pekerjaan', icon: <Briefcase className="h-5 w-5" /> },
  { id: 'internship', label: 'Pendaftaran Magang', icon: <GraduationCap className="h-5 w-5" /> },
  { id: 'interns', label: 'Peserta Magang', icon: <Users className="h-5 w-5" /> },
  { id: 'gallery', label: 'Galeri Foto', icon: <Images className="h-5 w-5" /> },
  { id: 'messages', label: 'Pesan Kontak', icon: <MessageSquare className="h-5 w-5" /> },
  { id: 'news', label: 'Berita', icon: <Newspaper className="h-5 w-5" /> },
  { id: 'content', label: 'Konten Website', icon: <FileText className="h-5 w-5" /> },
  { id: 'settings', label: 'Pengaturan', icon: <Settings className="h-5 w-5" /> },
];

export default function AdminSidebar({
  activeTab,
  onTabChange,
  onLogout,
  userEmail,
  mobileOpen: mobileOpenProp,
  onMobileOpenChange,
  collapsed: collapsedProp,
  onCollapsedChange,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const collapsed = collapsedProp ?? internalCollapsed;
  const mobileOpen = mobileOpenProp ?? internalMobileOpen;

  const setCollapsed = (value: boolean) => {
    setInternalCollapsed(value);
    onCollapsedChange?.(value);
  };
  const setMobileOpen = (value: boolean) => {
    setInternalMobileOpen(value);
    onMobileOpenChange?.(value);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-900 text-white transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-72'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
          {!collapsed && (
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white p-1">
                <img src="/images/logo-resmi-betami-cropped.png" alt="Logo resmi BETAMI" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">PT Betami Sawit</p>
                <p className="text-[10px] text-slate-400">Admin Dashboard</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-white p-1">
              <img src="/images/logo-resmi-betami-cropped.png" alt="Logo resmi BETAMI" className="h-full w-full object-contain" />
            </div>
          )}
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-2 rounded-md p-1 text-slate-400 hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toggle collapse (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden items-center justify-center border-b border-slate-700 py-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:flex"
          title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onTabChange(item.id);
                      setMobileOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    } ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-700 p-3">
          {!collapsed ? (
            <div className="space-y-2">
              <p className="truncate text-xs text-slate-400 px-2">{userEmail}</p>
              <Link
                href="/"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Lihat Website</span>
              </Link>
              <button
                onClick={onLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-rose-400 transition hover:bg-rose-950/50 hover:text-rose-300"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/"
                className="flex w-full justify-center rounded-lg p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
                title="Lihat Website"
              >
                <ExternalLink className="h-5 w-5" />
              </Link>
              <button
                onClick={onLogout}
                className="flex w-full justify-center rounded-lg p-2 text-rose-400 transition hover:bg-rose-950/50 hover:text-rose-300"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
