'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, ExternalLink, Loader2, XCircle } from 'lucide-react';

interface AcceptanceToggleProps {
  page: 'career' | 'internship';
  title: string;
  description: string;
  previewHref: string;
  previewLabel?: string;
  /** Dipakai ContentPage agar state lokal ikut berubah setelah toggle disimpan. */
  onChange?: (accepting: boolean) => void;
}

export default function AcceptanceToggle({
  page,
  title,
  description,
  previewHref,
  previewLabel = 'Lihat halaman website',
  onChange,
}: AcceptanceToggleProps) {
  const [accepting, setAccepting] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/admin/content', { cache: 'no-store' })
      .then((res) => res.json().catch(() => ({})))
      .then((json) => {
        if (!active) return;
        const value = json?.content?.[page]?.accepting;
        setAccepting(value !== 'false');
      })
      .catch(() => { if (active) setAccepting(true); });
    return () => { active = false; };
  }, [page]);

  const handleToggle = async () => {
    if (accepting === null || saving) return;
    const next = !accepting;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: { [page]: { accepting: next ? 'true' : 'false' } } }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Status belum berhasil diperbarui.');
      setAccepting(next);
      onChange?.(next);
    } catch (err: any) {
      setError(err?.message || 'Status belum berhasil diperbarui.');
    } finally {
      setSaving(false);
    }
  };

  const isOpen = accepting === true;

  return (
    <div className={`rounded-2xl border p-5 transition-colors ${
      isOpen ? 'border-emerald-200 bg-emerald-50/70' : 'border-amber-200 bg-amber-50/70'
    }`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
              accepting === null
                ? 'bg-slate-100 text-slate-500'
                : isOpen
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
            }`}>
              {accepting === null
                ? 'Memuat...'
                : isOpen
                  ? <><CheckCircle2 className="h-3 w-3" />Dibuka</>
                  : <><XCircle className="h-3 w-3" />Ditutup</>}
            </span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{description}</p>
          <a
            href={previewHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            <ExternalLink className="h-3 w-3" />{previewLabel}
          </a>
          {error && <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p>}
        </div>

        <button
          type="button"
          onClick={() => void handleToggle()}
          disabled={accepting === null || saving}
          aria-pressed={!isOpen}
          className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-sm transition disabled:cursor-wait disabled:opacity-60 ${
            isOpen ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500'
          }`}
        >
          {saving
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : isOpen
              ? <XCircle className="h-4 w-4" />
              : <CheckCircle2 className="h-4 w-4" />}
          {saving ? 'Menyimpan...' : isOpen ? 'Tutup Penerimaan' : 'Buka Penerimaan'}
        </button>
      </div>
    </div>
  );
}
