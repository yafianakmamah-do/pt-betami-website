'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Briefcase, Loader2, RefreshCw, Search, Plus, X, Pencil,
  Trash2, MapPin, Clock, Eye, EyeOff, CheckCircle, AlertCircle,
} from 'lucide-react';
import type { JobOpening } from './hooks';
import AcceptanceToggle from './AcceptanceToggle';

const EMPTY_FORM = {
  title: '',
  location: 'Aceh Tamiang',
  employment_type: 'Penuh waktu',
  description: '',
  is_published: true,
};

const EMPLOYMENT_TYPES = ['Penuh waktu', 'Kontrak', 'Paruh waktu'];

export default function JobsPage() {
  const [openings, setOpenings] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<JobOpening | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/jobs', { cache: 'no-store' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || 'Gagal memuat lowongan pekerjaan.');
        return;
      }
      setOpenings(Array.isArray(json.openings) ? json.openings : []);
      setError('');
    } catch {
      setError('Gagal memuat lowongan pekerjaan.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => {
    const text = search.trim().toLowerCase();
    if (!text) return openings;
    return openings.filter((item) =>
      `${item.title} ${item.location} ${item.employment_type}`.toLowerCase().includes(text),
    );
  }, [openings, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowForm(true);
  };

  const openEdit = (item: JobOpening) => {
    setEditing(item);
    setForm({
      title: item.title,
      location: item.location,
      employment_type: item.employment_type,
      description: item.description || '',
      is_published: item.is_published,
    });
    setError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/jobs', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing ? { id: editing.id, ...form } : form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Lowongan belum tersimpan.');
      setNotice(editing ? 'Lowongan berhasil diperbarui.' : 'Lowongan berhasil ditambahkan.');
      setTimeout(() => setNotice(''), 3000);
      closeForm();
      await load();
    } catch (err: any) {
      setError(err?.message || 'Lowongan belum tersimpan.');
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (item: JobOpening) => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, is_published: !item.is_published }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Status belum diperbarui.');
      await load();
    } catch (err: any) {
      setError(err?.message || 'Status belum diperbarui.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: JobOpening) => {
    if (!window.confirm(`Hapus lowongan "${item.title}"? Data lamaran yang sudah masuk tidak ikut terhapus.`)) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/jobs?id=${encodeURIComponent(item.id)}`, { method: 'DELETE' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Lowongan belum dihapus.');
      setNotice('Lowongan berhasil dihapus.');
      setTimeout(() => setNotice(''), 3000);
      await load();
    } catch (err: any) {
      setError(err?.message || 'Lowongan belum dihapus.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Lowongan Pekerjaan</h2>
            <p className="text-xs text-slate-500">
              {openings.filter((item) => item.is_published).length} dari {openings.length} lowongan tampil di website
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <RefreshCw className="h-4 w-4" />Refresh
          </button>
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500">
            <Plus className="h-4 w-4" />Tambah Lowongan
          </button>
        </div>
      </div>

      <AcceptanceToggle
        page="career"
        title="Status Penerimaan Karyawan"
        description="Jika ditutup, tombol lamaran dan formulir pada halaman /karir otomatis disembunyikan. Teks ajakan dan pengumuman tetap tampil."
        previewHref="/karir"
      />

      {notice && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle className="h-4 w-4" />{notice}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4" />{error}
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">{editing ? 'Ubah Lowongan' : 'Tambah Lowongan'}</h3>
            <button onClick={closeForm} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Tutup form">
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-slate-600">Judul Lowongan *</label>
                <input
                  required minLength={2} maxLength={180}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Contoh: Operator Pabrik Kelapa Sawit"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Lokasi *</label>
                <input
                  required minLength={2} maxLength={180}
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Jenis Pekerjaan *</label>
                <select
                  value={form.employment_type}
                  onChange={(e) => setForm({ ...form, employment_type: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
                >
                  {EMPLOYMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Deskripsi / Kualifikasi</label>
              <textarea
                rows={4} maxLength={5000}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Tuliskan deskripsi pekerjaan, kualifikasi, dan cara melamar..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                className="rounded border-slate-300"
              />
              Tampilkan lowongan ini di halaman Karir website
            </label>
            <div className="flex flex-wrap gap-2 pt-2">
              <button type="submit" disabled={saving} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-60">
                {saving ? 'Menyimpan...' : 'Simpan Lowongan'}
              </button>
              <button type="button" onClick={closeForm} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Batal</button>
            </div>
          </form>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari judul, lokasi, atau jenis pekerjaan..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-6 py-5 shadow-sm">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
            <span className="text-sm font-semibold text-slate-700">Memuat lowongan...</span>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">Belum ada lowongan yang ditemukan.</p>
          {error && <p className="mt-1 text-xs text-rose-500">Jalankan supabase/migration_admin_features.sql jika tabel lowongan belum ada.</p>}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {item.is_published ? 'Tayang' : 'Tersembunyi'}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{item.location}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{item.employment_type}</span>
                  </div>
                </div>
              </div>
              {item.description && (
                <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-xs leading-relaxed text-slate-500">{item.description}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <button
                  onClick={() => void togglePublished(item)}
                  disabled={saving}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  {item.is_published ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  {item.is_published ? 'Sembunyikan' : 'Tampilkan'}
                </button>
                <button onClick={() => openEdit(item)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                  <Pencil className="h-3 w-3" />Ubah
                </button>
                <button onClick={() => void handleDelete(item)} disabled={saving} className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50">
                  <Trash2 className="h-3 w-3" />Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
