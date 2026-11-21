'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { Briefcase, Loader2, RefreshCw, Search, Mail, Phone, FileText, CheckCircle, Clock, X, Eye, Trash2 } from 'lucide-react';

interface JobApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  resume_url: string;
  resume_signed_url?: string;
  cover_letter: string;
  status: 'baru' | 'ditinjau' | 'diterima' | 'ditolak';
  created_at: string;
}

const statusLabels: Record<string, string> = {
  'baru': 'Baru',
  'ditinjau': 'Ditinjau',
  'diterima': 'Diterima',
  'ditolak': 'Ditolak',
};

export default function CareerPage({ supabase: propSupabase }: { supabase: ReturnType<typeof createSupabaseBrowserClient> | null }) {
  const supabase = useMemo(() => propSupabase || (isSupabaseConfigured() ? createSupabaseBrowserClient() : null), [propSupabase]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<JobApplication | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/careers', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setApplications(Array.isArray(json.applications) ? json.applications : []);
      }
    } catch { setError('Gagal memuat data lamaran pekerjaan.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const matchStatus = statusFilter === 'all' || app.status === statusFilter;
      const text = `${app.name} ${app.email} ${app.position}`.toLowerCase();
      const matchSearch = !search || text.includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [applications, statusFilter, search]);

  const updateStatus = async (app: JobApplication, newStatus: JobApplication['status']) => {
    setSaving(true); setError('');
    try {
      const res = await fetch('/api/admin/careers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: app.id, status: newStatus }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Status belum diperbarui.');
      setApplications((prev) => prev.map((a) => a.id === app.id ? { ...a, status: newStatus } : a));
      if (selected?.id === app.id) setSelected({ ...selected, status: newStatus });
      setNotice(`Status berhasil diubah ke "${statusLabels[newStatus]}".`);
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const deleteApplication = async (app: JobApplication) => {
    if (!window.confirm(`Hapus lamaran dari ${app.name}? CV yang tersimpan juga akan dihapus.`)) return;
    setSaving(true); setError('');
    try {
      const res = await fetch(`/api/admin/careers?id=${encodeURIComponent(app.id)}`, { method: 'DELETE' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Lamaran belum dihapus.');
      setApplications((prev) => prev.filter((a) => a.id !== app.id));
      if (selected?.id === app.id) setSelected(null);
      setNotice('Lamaran dan CV berhasil dihapus.');
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const formatDate = (v: string) => {
    if (!v) return '-';
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(v));
  };

  const statusBadge = (status: string) => {
    if (status === 'baru') return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-700"><Clock className="h-3 w-3" />Baru</span>;
    if (status === 'ditinjau') return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700"><Eye className="h-3 w-3" />Ditinjau</span>;
    if (status === 'diterima') return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700"><CheckCircle className="h-3 w-3" />Diterima</span>;
    return <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-700"><X className="h-3 w-3" />Ditolak</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Briefcase className="h-5 w-5" /></div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Lamaran Pekerjaan</h2>
            <p className="text-xs text-slate-500">{applications.length} lamaran diterima</p>
          </div>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <RefreshCw className="h-4 w-4" />Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau posisi..." className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pl-10 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 sm:w-auto">
            <option value="all">Semua Status</option>
            <option value="baru">Baru</option>
            <option value="ditinjau">Ditinjau</option>
            <option value="diterima">Diterima</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-6 py-5 shadow-sm">
            <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
            <span className="text-sm font-semibold text-slate-700">Memuat data lamaran...</span>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">Tidak ada lamaran pekerjaan yang ditemukan.</p>
          <p className="mt-1 text-xs text-slate-400">Pastikan tabel job_applications sudah dibuat di Supabase.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <div key={app.id} className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${app.status === 'baru' ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200'}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{app.name}</h3>
                    {statusBadge(app.status)}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1"><FileText className="h-3 w-3" />{app.position}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{app.email}</span>
                    {app.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{app.phone}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  {app.status === 'baru' && (
                    <button onClick={() => void updateStatus(app, 'ditinjau')} className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50">Tinjau</button>
                  )}
                  {app.status !== 'diterima' && app.status !== 'ditolak' && (
                    <>
                      <button onClick={() => void updateStatus(app, 'diterima')} className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50">Terima</button>
                      <button onClick={() => void updateStatus(app, 'ditolak')} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50">Tolak</button>
                    </>
                  )}
                  <button onClick={() => setSelected(app)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Detail</button>
                  <button onClick={() => void deleteApplication(app)} disabled={saving} className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50">
                    <Trash2 className="h-3 w-3" />Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <h3 className="text-base font-bold text-slate-900">Detail Lamaran Pekerjaan</h3>
              <button onClick={() => setSelected(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-bold text-slate-900">{selected.name}</span>
                {statusBadge(selected.status)}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Email</p>
                  <p className="text-sm text-slate-900">{selected.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Telepon</p>
                  <p className="text-sm text-slate-900">{selected.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Posisi</p>
                  <p className="text-sm text-slate-900">{selected.position}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Tanggal Lamaran</p>
                  <p className="text-sm text-slate-900">{formatDate(selected.created_at)}</p>
                </div>
              </div>
              {selected.resume_url && (
                <div>
                  <p className="text-xs font-semibold text-slate-500">CV / Resume</p>
                  {selected.resume_signed_url ? (
                    <a href={selected.resume_signed_url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-emerald-700 hover:bg-slate-100">
                      <FileText className="h-4 w-4" />Lihat CV (tautan berlaku 1 jam)
                    </a>
                  ) : (
                    <p className="mt-1 text-xs text-amber-600">File CV tersimpan, tetapi tautan sementara belum dapat dibuat. Periksa bucket privat betami-documents dan izin admin.</p>
                  )}
                </div>
              )}
              {selected.cover_letter && (
                <div>
                  <p className="text-xs font-semibold text-slate-500">Surat Pengantar</p>
                  <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="whitespace-pre-wrap text-sm text-slate-700">{selected.cover_letter}</p>
                  </div>
                </div>
              )}
              <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-5 sm:flex-row">
                <button onClick={() => setSelected(null)} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Tutup</button>
                <div className="flex gap-2">
                  {selected.status === 'baru' && (
                    <button onClick={() => void updateStatus(selected, 'ditinjau')} disabled={saving} className="rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-50 disabled:opacity-50">Tinjau</button>
                  )}
                  {selected.status !== 'diterima' && selected.status !== 'ditolak' && (
                    <>
                      <button onClick={() => void updateStatus(selected, 'diterima')} disabled={saving} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-50">Terima</button>
                      <button onClick={() => void updateStatus(selected, 'ditolak')} disabled={saving} className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50">Tolak</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
