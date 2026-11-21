'use client';

import { useEffect, useMemo, useState } from 'react';
import { Menu } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import {
  describeSupabaseError,
  getSupabaseConfigStatus,
  isSupabaseConfigured,
} from '@/lib/supabase/config';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardOverview from '@/components/admin/DashboardOverview';
import CareerPage from '@/components/admin/CareerPage';
import CareerSettingsPage from '@/components/admin/CareerSettingsPage';
import JobsPage from '@/components/admin/JobsPage';
import InternshipPage from '@/components/admin/InternshipPage';
import InternsPage from '@/components/admin/InternsPage';
import GalleryPage from '@/components/admin/GalleryPage';
import MessagesPage from '@/components/admin/MessagesPage';
import ContentPage from '@/components/admin/ContentPage';
import SettingsPage from '@/components/admin/SettingsPage';
import LoginPage from '@/components/admin/LoginPage';
import type { AdminTab } from '@/components/admin/hooks';

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [resetting, setResetting] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const supabase = useMemo(
    () => isSupabaseConfigured() ? createSupabaseBrowserClient() : null,
    [],
  );
  const configStatus = useMemo(() => getSupabaseConfigStatus(), []);

  // Validasi sesi ke server Supabase, bukan hanya membaca cookie/local storage.
  useEffect(() => {
    if (!supabase) {
      // Pesan konfigurasi sudah ditampilkan LoginPage lewat configMessage.
      setIsChecking(false);
      return;
    }

    let active = true;

    const applyUser = (user: { email?: string; app_metadata?: Record<string, unknown> } | null) => {
      if (!user) {
        setIsAuthenticated(false);
        setUserEmail('');
        return;
      }
      const isAdmin = user.app_metadata?.role === 'admin';
      setUserEmail(user.email ?? '');
      setIsAuthenticated(isAdmin);
      if (!isAdmin) setError('Akun ini belum diberi hak admin.');
    };

    void supabase.auth.getUser().then(async ({ data, error: sessionError }) => {
      if (!active) return;
      if (sessionError) {
        setError(describeSupabaseError(sessionError.message));
        setIsAuthenticated(false);
      } else {
        applyUser(data.user);
      }
      setIsChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      applyUser(session?.user ?? null);
      setIsChecking(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogin = async () => {
    if (!supabase) {
      setError('Perbaiki konfigurasi Supabase terlebih dahulu (lihat pesan di atas).');
      return;
    }
    if (!email.trim() || !password) {
      setError('Masukkan email dan kata sandi terlebih dahulu.');
      return;
    }
    setError('');
    setNotice('');

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(describeSupabaseError(signInError.message));
      return;
    }

    // Ambil ulang user agar app_metadata.role benar-benar berasal dari server.
    const { data: fresh, error: userError } = await supabase.auth.getUser();
    const user = fresh.user ?? data.user;
    if (userError || !user) {
      setError(describeSupabaseError(userError?.message ?? 'Sesi tidak dapat diverifikasi.'));
      await supabase.auth.signOut();
      return;
    }
    if (user.app_metadata?.role !== 'admin') {
      await supabase.auth.signOut();
      setError('Akun ini belum memiliki role admin. Hubungi administrator Supabase.');
      return;
    }

    setUserEmail(user.email ?? '');
    setIsAuthenticated(true);
    setPassword('');
    setNotice('Login berhasil. Selamat datang di dashboard admin.');
    setTimeout(() => setNotice(''), 3000);
  };

  const handleResetPassword = async () => {
    if (!supabase) {
      setError('Perbaiki konfigurasi Supabase terlebih dahulu.');
      return;
    }
    if (!email.trim()) {
      setError('Isi email admin terlebih dahulu, lalu klik kirim tautan reset.');
      return;
    }
    setError('');
    setNotice('');
    setResetting(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin`,
      });
      if (resetError) throw new Error(describeSupabaseError(resetError.message));
      setNotice('Tautan reset sandi dikirim. Buka email admin Anda untuk membuat sandi baru, lalu login kembali.');
    } catch (err: any) {
      setError(err?.message || 'Tautan reset belum berhasil dikirim.');
    } finally {
      setResetting(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserEmail('');
    setError('');
    setNotice('Anda telah keluar.');
    setTimeout(() => setNotice(''), 3000);
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-6 py-5 shadow-sm">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-600" />
          <span className="text-sm font-semibold text-slate-700">Memeriksa sesi...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginPage
        email={email} setEmail={setEmail}
        password={password} setPassword={setPassword}
        onLogin={handleLogin}
        onResetPassword={handleResetPassword}
        resetting={resetting}
        error={error} notice={notice}
        configMessage={configStatus.ok ? '' : configStatus.message}
      />
    );
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview data={null} loading={false} error="" />;
      case 'career': return <CareerPage supabase={supabase} />;
      case 'careerSettings': return <CareerSettingsPage />;
      case 'jobs': return <JobsPage />;
      case 'internship': return <InternshipPage supabase={supabase} />;
      case 'interns': return <InternsPage supabase={supabase} />;
      case 'gallery': return <GalleryPage supabase={supabase} />;
      case 'messages': return <MessagesPage supabase={supabase} />;
      case 'content': return <ContentPage supabase={supabase} />;
      case 'settings': return <SettingsPage supabase={supabase} userEmail={userEmail} />;
      default: return <DashboardOverview data={null} loading={false} error="" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        userEmail={userEmail}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-lg border border-slate-200 p-2 text-slate-700 lg:hidden"
                aria-label="Buka menu admin"
              >
                <Menu className="h-4 w-4" />
              </button>
              <img src="/images/logo-resmi-betami-cropped.png" alt="Logo resmi BETAMI" className="h-8 w-8 object-contain" />
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-900">Admin Dashboard</p>
                <p className="text-[10px] text-slate-500">PT Betami Sawit</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-slate-500 sm:inline">{userEmail}</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" title="Sesi admin aktif" />
            </div>
          </div>
        </header>

        {notice && (
          <div className="mx-6 mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {notice}
          </div>
        )}
        {error && (
          <div className="mx-6 mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
            {error}
          </div>
        )}

        <div className="p-6">{renderPage()}</div>
      </div>
    </div>
  );
}
