'use client';

import { useState } from 'react';
import {
  Settings as SettingsIcon, Loader2, Save, User, Bell,
  Shield, Palette, Globe, AlertCircle, CheckCircle2, KeyRound,
} from 'lucide-react';

type SettingsPageProps = {
  supabase: any;
  userEmail?: string;
};

export default function SettingsPage({ supabase, userEmail = '' }: SettingsPageProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  const tabs = [
    { key: 'profile', label: 'Profil Admin', icon: <User className="h-4 w-4" /> },
    { key: 'notifications', label: 'Notifikasi', icon: <Bell className="h-4 w-4" /> },
    { key: 'security', label: 'Keamanan', icon: <Shield className="h-4 w-4" /> },
    { key: 'appearance', label: 'Tampilan', icon: <Palette className="h-4 w-4" /> },
    { key: 'language', label: 'Bahasa', icon: <Globe className="h-4 w-4" /> },
  ];

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    if (!supabase) {
      setError('Supabase belum terhubung.');
      return;
    }
    if (passwords.next.length < 6) {
      setError('Kata sandi baru minimal 6 karakter.');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setSaving(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: passwords.next });
      if (updateError) throw updateError;
      setPasswords({ current: '', next: '', confirm: '' });
      setNotice('Kata sandi berhasil diperbarui melalui Supabase Auth.');
    } catch (err: any) {
      setError(err?.message || 'Kata sandi belum berhasil diperbarui.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><SettingsIcon className="h-5 w-5" /></div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Pengaturan</h2>
          <p className="text-xs text-slate-500">Informasi akun dan keamanan admin</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setError(''); setNotice(''); }}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === tab.key
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />{error}
          </div>
        )}
        {notice && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />{notice}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Profil Admin</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Email yang sedang login</label>
              <input readOnly value={userEmail} className="mt-1 w-full cursor-default rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Hak akses</label>
              <input readOnly value="Admin (role: admin)" className="mt-1 w-full cursor-default rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none" />
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Identitas dan hak akses dikelola di Supabase → Authentication → Users. Perubahan role memerlukan login ulang.
            </p>
          </div>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Ubah Kata Sandi</h3>
            <p className="text-xs text-slate-500">Perubahan langsung diterapkan ke akun Supabase Auth Anda.</p>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Kata Sandi Saat Ini</label>
              <input type="password" autoComplete="current-password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} placeholder="Masukkan kata sandi saat ini..." className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Kata Sandi Baru</label>
                <input type="password" autoComplete="new-password" minLength={6} value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} placeholder="Minimal 6 karakter" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">Konfirmasi Kata Sandi Baru</label>
                <input type="password" autoComplete="new-password" minLength={6} value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} placeholder="Ulangi kata sandi baru..." className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
              </div>
            </div>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              {saving ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
            </button>
          </form>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Notifikasi</h3>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
              Pesan kontak, lamaran kerja, dan pendaftaran magang masuk otomatis ke dashboard ini. Pengiriman notifikasi email memerlukan layanan email tambahan dan belum diaktifkan.
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Tampilan</h3>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
              Tema dan warna dashboard mengikuti desain bawaan PT BETAMI. Perubahan identitas visual website publik dilakukan pada kode dan aset website, bukan di pengaturan ini.
            </div>
          </div>
        )}

        {activeTab === 'language' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Bahasa</h3>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
              Website publik menggunakan Bahasa Indonesia dan Inggris. Teks galeri dan lowongan dapat dikelola melalui menu Galeri Foto dan Lowongan Pekerjaan.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
