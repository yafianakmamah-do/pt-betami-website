'use client';

import { useState } from 'react';
import { LogIn, Loader2, AlertCircle, Mail } from 'lucide-react';

type LoginPageProps = {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  onLogin: () => Promise<void>;
  onResetPassword: () => Promise<void>;
  resetting: boolean;
  error: string;
  notice: string;
  configMessage?: string;
};

export default function LoginPage({ email, setEmail, password, setPassword, onLogin, onResetPassword, resetting, error, notice, configMessage }: LoginPageProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onLogin();
    setLoading(false);
  };

  return (
    <div className="admin-login-shell flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-3 shadow-2xl shadow-emerald-900/50">
            <img src="/images/logo-resmi-betami-cropped.png" alt="Logo resmi BETAMI" className="h-full w-full object-contain" />
          </div>
          <h1 className="mt-4 text-2xl font-black text-white">PT Betami Sawit</h1>
          <p className="mt-1 text-sm text-slate-400">Admin Dashboard Portal</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h2 className="mb-6 text-center text-lg font-bold text-white">Masuk ke Dashboard</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@betami.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Kata Sandi</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500 focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {configMessage && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-left text-xs leading-relaxed text-amber-200">
                <p className="mb-1 font-bold uppercase tracking-wider">Konfigurasi Supabase belum siap</p>
                {configMessage}
                <p className="mt-2 text-amber-300/80">Setelah mengubah .env.local, jalankan ulang <code>npm run dev</code> atau redeploy.</p>
              </div>
            )}
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {notice && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {notice}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-500 disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              {loading ? 'Memproses...' : 'Masuk'}
            </button>

            <button
              type="button"
              onClick={() => void onResetPassword()}
              disabled={resetting || loading || !email.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resetting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
              {resetting ? 'Mengirim...' : 'Lupa sandi? Kirim tautan reset'}
            </button>
          </form>

          <p className="mt-6 text-center text-[10px] leading-relaxed text-slate-500">
            Halaman ini hanya dapat diakses oleh admin PT Betami Sawit.<br />
            Sistem autentikasi diamankan melalui Supabase Auth.
          </p>
        </div>
      </div>
    </div>
  );
}
