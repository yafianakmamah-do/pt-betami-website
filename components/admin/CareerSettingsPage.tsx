'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle, CheckCircle2, ExternalLink, Loader2, Save, XCircle,
} from 'lucide-react';
import { mergeSiteContent } from '@/lib/siteContent';

const PAGE = 'career';

const FORM_FIELDS: { key: string; label: string; hint?: string; rows?: number; url?: boolean }[] = [
  { key: 'hero_title_id', label: 'Judul Halaman Karir (Indonesia)' },
  { key: 'hero_title_en', label: 'Judul Halaman Karir (English)' },
  { key: 'hero_desc_id', label: 'Deskripsi Halaman Karir (Indonesia)', rows: 4 },
  { key: 'hero_desc_en', label: 'Deskripsi Halaman Karir (English)', rows: 4 },
  { key: 'apply_title_id', label: 'Judul Ajakan Melamar (Indonesia)' },
  { key: 'apply_title_en', label: 'Judul Ajakan Melamar (English)' },
  { key: 'apply_desc_id', label: 'Deskripsi Ajakan Melamar (Indonesia)', rows: 3 },
  { key: 'apply_desc_en', label: 'Deskripsi Ajakan Melamar (English)', rows: 3 },
  { key: 'cta_label_id', label: 'Label Tombol Lamaran (Indonesia)' },
  { key: 'cta_label_en', label: 'Label Tombol Lamaran (English)' },
  { key: 'closed_note_id', label: 'Pesan Saat Nonaktif (Indonesia)', rows: 6 },
  { key: 'closed_note_en', label: 'Pesan Saat Nonaktif (English)', rows: 6 },
];

const INPUT_CLASS =
  'mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10';

function pickLatestSaved(json: any): string {
  const rows = json?.updated_at?.[PAGE] || {};
  const times = Object.values(rows).filter((value): value is string => typeof value === 'string' && value.length > 0);
  if (!times.length) return '';
  return times.sort()[times.length - 1];
}

function formatSaved(value: string): string {
  if (!value) return 'Belum ada perubahan yang disimpan.';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Waktu penyimpanan tidak dikenali.';
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CareerSettingsPage() {
  const [form, setForm] = useState<Record<string, string>>(
    () => ({ ...(mergeSiteContent().career || {}) }),
  );
  const [accepting, setAccepting] = useState(true);
  const [lastSaved, setLastSaved] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/content', { cache: 'no-store' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Pengaturan belum dapat dimuat.');
      const career = json?.content?.career || {};
      setForm({ ...(mergeSiteContent().career || {}), ...career });
      setAccepting(career.accepting !== 'false');
      setLastSaved(pickLatestSaved(json));
    } catch (err: any) {
      setError(err?.message || 'Pengaturan belum dapat dimuat.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const updateField = (key: string, value: string) => {
    setNotice('');
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveAll = async () => {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: {
            [PAGE]: { ...form, accepting: accepting ? 'true' : 'false' },
          },
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Perubahan belum berhasil disimpan.');
      const savedAt = new Date().toISOString();
      setLastSaved(savedAt);
      setForm((prev) => ({ ...prev, accepting: accepting ? 'true' : 'false' }));
      setNotice('Perubahan berhasil disimpan dan langsung tampil di halaman Karir.');
    } catch (err: any) {
      setError(err?.message || 'Perubahan belum berhasil disimpan.');
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (next: boolean) => {
    if (statusSaving || accepting === next) return;
    setStatusSaving(true);
    setError('');
    setNotice('');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: { [PAGE]: { accepting: next ? 'true' : 'false' } } }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Status belum berhasil diperbarui.');
      setAccepting(next);
      setForm((prev) => ({ ...prev, accepting: next ? 'true' : 'false' }));
      const savedAt = new Date().toISOString();
      setLastSaved(savedAt);
      setNotice(next ? 'Penerimaan lamaran diaktifkan.' : 'Penerimaan lamaran dinonaktifkan.');
    } catch (err: any) {
      setError(err?.message || 'Status belum berhasil diperbarui.');
    } finally {
      setStatusSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Recruitment</p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            PENGATURAN KARIR
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
            Atur status penerimaan dan teks halaman Karir. Lamaran masuk langsung ke dashboard admin.
          </p>
        </div>
        <a
          href="/karir"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <ExternalLink className="h-4 w-4" />Lihat Halaman Karir
        </a>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span>
        </div>
      )}
      {notice && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /><span>{notice}</span>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Status Penerimaan Lamaran</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              AKTIF menampilkan tombol dan formulir lamaran BETAMI. NONAKTIF menyembunyikannya dan menampilkan pesan penutup.
            </p>
          </div>
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => void changeStatus(true)}
              disabled={statusSaving || loading}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition disabled:opacity-60 ${
                accepting ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />AKTIF
            </button>
            <button
              type="button"
              onClick={() => void changeStatus(false)}
              disabled={statusSaving || loading}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition disabled:opacity-60 ${
                !accepting ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-white'
              }`}
            >
              <XCircle className="h-4 w-4" />NONAKTIF
            </button>
          </div>
        </div>
        {statusSaving && (
          <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />Menyimpan status...
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900">Konten Halaman Karir</h3>
        <p className="mt-1 text-xs text-slate-500">
          Perubahan di bawah disimpan bersamaan ketika menekan SIMPAN PERUBAHAN.
        </p>

        {loading ? (
          <p className="mt-6 inline-flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />Memuat pengaturan...
          </p>
        ) : (
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {FORM_FIELDS.map((field) => (
              <div key={field.key} className={field.url || field.rows ? 'sm:col-span-2' : ''}>
                <label className="block text-xs font-semibold text-slate-700">{field.label}</label>
                {field.rows ? (
                  <textarea
                    value={form[field.key] || ''}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    rows={field.rows}
                    className={INPUT_CLASS}
                  />
                ) : (
                  <input
                    type={field.url ? 'url' : 'text'}
                    value={form[field.key] || ''}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.url ? 'https://career.astra.co.id/' : ''}
                    className={INPUT_CLASS}
                  />
                )}
                {field.hint && <p className="mt-1 text-xs leading-relaxed text-slate-500">{field.hint}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Status tersimpan terakhir: <span className="font-semibold text-slate-700">{formatSaved(lastSaved)}</span>
        </p>
        <button
          type="button"
          onClick={() => void saveAll()}
          disabled={saving || loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-wait disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Menyimpan...' : 'SIMPAN PERUBAHAN'}
        </button>
      </div>
    </div>
  );
}
