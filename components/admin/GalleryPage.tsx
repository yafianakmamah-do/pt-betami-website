'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { Camera, Eye, EyeOff, ImagePlus, Images, Loader2, Pencil, RefreshCw, Save, Trash2, X, Search, Filter, CheckCircle, Clock } from 'lucide-react';
import { getBuiltInGalleryNumber } from '@/lib/gallery';
import type { GalleryRecord } from './hooks';

const categoryLabels: Record<string, string> = {
  aerial: 'Foto udara',
  mill: 'Pabrik / PKS',
  plantation: 'Perkebunan',
  product: 'Produk / TBS',
  csr: 'CSR & kegiatan',
};

export default function GalleryPage({ supabase: propSupabase }: { supabase: ReturnType<typeof createSupabaseBrowserClient> | null }) {
  const supabase = useMemo(() => propSupabase || (isSupabaseConfigured() ? createSupabaseBrowserClient() : null), [propSupabase]);
  const [gallery, setGallery] = useState<GalleryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [uploadTakenAt, setUploadTakenAt] = useState('');
  const [editing, setEditing] = useState<GalleryRecord | null>(null);
  const [replacementPhoto, setReplacementPhoto] = useState<File | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadPhoto, setUploadPhoto] = useState<File | null>(null);
  const [uploadTitleId, setUploadTitleId] = useState('');
  const [uploadTitleEn, setUploadTitleEn] = useState('');
  const [uploadDescId, setUploadDescId] = useState('');
  const [uploadDescEn, setUploadDescEn] = useState('');
  const [uploadCategory, setUploadCategory] = useState('mill');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setGallery(json.gallery || []);
      }
    } catch { setError('Gagal memuat galeri.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    return gallery.filter((item) => {
      const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
      const text = `${item.title_id} ${item.title_en} ${item.description_id} ${item.description_en}`.toLowerCase();
      const matchSearch = !search || text.includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [gallery, categoryFilter, search]);

  const isBuiltIn = (item: GalleryRecord) => getBuiltInGalleryNumber(item.id) !== null;

  const uploadPhotoHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !uploadPhoto) { setError('Pilih foto terlebih dahulu.'); return; }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(uploadPhoto.type) || uploadPhoto.size > 8 * 1024 * 1024) {
      setError('Gunakan JPG, PNG, atau WebP (maks 8 MB).'); return;
    }
    setSaving(true); setError('');
    const ext = uploadPhoto.type === 'image/png' ? 'png' : uploadPhoto.type === 'image/webp' ? 'webp' : 'jpg';
    const storagePath = `${crypto.randomUUID()}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from('betami-gallery').upload(storagePath, uploadPhoto, { contentType: uploadPhoto.type });
    if (uploadErr) { setSaving(false); setError(`Upload gagal: ${uploadErr.message}`); return; }
    const imageUrl = supabase.storage.from('betami-gallery').getPublicUrl(storagePath).data.publicUrl;
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl, storage_path: storagePath, category: uploadCategory, title_id: uploadTitleId, title_en: uploadTitleEn || uploadTitleId, description_id: uploadDescId, description_en: uploadDescEn || uploadDescId, ...(uploadTakenAt ? { taken_at: uploadTakenAt } : {}) }),
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || 'Gagal menyimpan.'); }
      setUploadPhoto(null); setUploadTitleId(''); setUploadTitleEn(''); setUploadDescId(''); setUploadDescEn(''); setUploadTakenAt('');
      setNotice('Foto berhasil ditambahkan!'); await load();
    } catch (err: any) {
      await supabase.storage.from('betami-gallery').remove([storagePath]);
      setError(err.message || 'Gagal menyimpan data foto.');
    } finally { setSaving(false); }
  };

  const openEditor = (item: GalleryRecord) => {
    setEditing({ ...item }); setReplacementPhoto(null); setError('');
  };

  const saveEditor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !editing) return;
    if (replacementPhoto && (!['image/jpeg', 'image/png', 'image/webp'].includes(replacementPhoto.type) || replacementPhoto.size > 8 * 1024 * 1024)) {
      setError('Gunakan JPG, PNG, atau WebP (maks 8 MB).'); return;
    }
    setSaving(true); setError('');
    let replacementPath: string | undefined;
    try {
      let replacement: Record<string, string> = {};
      if (replacementPhoto) {
        const ext = replacementPhoto.type === 'image/png' ? 'png' : replacementPhoto.type === 'image/webp' ? 'webp' : 'jpg';
        replacementPath = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('betami-gallery').upload(replacementPath, replacementPhoto, { contentType: replacementPhoto.type });
        if (uploadErr) throw new Error(`Upload gagal: ${uploadErr.message}`);
        replacement = { image_url: supabase.storage.from('betami-gallery').getPublicUrl(replacementPath).data.publicUrl, storage_path: replacementPath };
      }
      const res = await fetch('/api/admin/gallery', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing.id, category: editing.category, title_id: editing.title_id, title_en: editing.title_en || editing.title_id, description_id: editing.description_id, description_en: editing.description_en || editing.description_id, taken_at: editing.taken_at || null, ...replacement }),
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || 'Gagal menyimpan.'); }
      setGallery((prev) => prev.map((item) => item.id === editing.id ? { ...item, ...editing, ...replacement } : item));
      setNotice('Perubahan berhasil disimpan!'); setEditing(null); setReplacementPhoto(null);
    } catch (err: any) {
      if (replacementPath) await supabase.storage.from('betami-gallery').remove([replacementPath]);
      setError(err.message || 'Gagal menyimpan perubahan.');
    } finally { setSaving(false); }
  };

  const togglePublished = async (item: GalleryRecord) => {
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, is_published: !item.is_published }),
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || 'Gagal.'); }
      setGallery((prev) => prev.map((i) => i.id === item.id ? { ...i, is_published: !i.is_published } : i));
    } catch (err: any) { setError(err.message); }
  };

  const deletePhoto = async (item: GalleryRecord) => {
    if (!window.confirm(`Hapus foto "${item.title_id}"?`)) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${encodeURIComponent(item.id)}`, { method: 'DELETE' });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || 'Gagal.'); }
      setGallery((prev) => prev.filter((i) => i.id !== item.id));
      setNotice('Foto berhasil dihapus!');
    } catch (err: any) { setError(err.message); }
  };

  const formatDate = (v: string) => new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(v));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700"><Images className="h-5 w-5" /></div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Gallery Management</h2>
            <p className="text-xs text-slate-500">{gallery.length} foto tersimpan</p>
          </div>
        </div>
        <button onClick={() => setShowUpload(!showUpload)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500">
          <ImagePlus className="h-4 w-4" />Tambah Foto
        </button>
      </div>

      {/* Upload Form */}
      {showUpload && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Upload Foto Baru</h3>
            <button onClick={() => setShowUpload(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
          </div>
          <form onSubmit={uploadPhotoHandler} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Kategori</label>
                <select value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10">
                  {Object.entries(categoryLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">Judul Indonesia</label>
                <input required minLength={2} maxLength={120} value={uploadTitleId} onChange={(e) => setUploadTitleId(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">Judul Inggris</label>
                <input maxLength={120} value={uploadTitleEn} onChange={(e) => setUploadTitleEn(e.target.value)} placeholder="Opsional" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">Keterangan Indonesia</label>
                <textarea maxLength={500} rows={2} value={uploadDescId} onChange={(e) => setUploadDescId(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">Keterangan Inggris</label>
                <textarea maxLength={500} rows={2} value={uploadDescEn} onChange={(e) => setUploadDescEn(e.target.value)} placeholder="Opsional" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">Tanggal Foto</label>
                <input type="date" value={uploadTakenAt} onChange={(e) => setUploadTakenAt(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">File Foto</label>
                <div className="mt-1 flex min-h-[46px] cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center transition hover:border-emerald-500 hover:bg-emerald-50/50" onClick={() => document.getElementById('gallery-upload-input')?.click()}>
                  <input id="gallery-upload-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setUploadPhoto(e.target.files?.[0] ?? null)} className="sr-only" />
                  <span className="text-xs font-semibold text-slate-700">{uploadPhoto ? uploadPhoto.name : 'Pilih foto (JPG/PNG/WebP, maks 8 MB)'}</span>
                </div>
              </div>
            </div>
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowUpload(false)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Batal</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'Mengunggah...' : 'Simpan Foto'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari foto berdasarkan judul atau keterangan..." className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-8 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 sm:w-auto">
            <option value="all">Semua Kategori</option>
            {Object.entries(categoryLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <RefreshCw className="h-4 w-4" />Refresh
        </button>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-6 py-5 shadow-sm">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
            <span className="text-sm font-semibold text-slate-700">Memuat galeri...</span>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Images className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">Tidak ada foto yang ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => {
            const builtIn = isBuiltIn(item);
            return (
              <article key={item.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img src={item.image_url} alt={item.title_id} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-slate-950/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">{categoryLabels[item.category] || item.category}</span>
                  <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold ${builtIn ? 'bg-slate-950/55 text-white' : item.is_published ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'}`}>
                    {builtIn ? 'Bawaan' : item.is_published ? 'Tayang' : 'Sembunyikan'}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="truncate text-sm font-bold text-slate-900">{item.title_id}</h3>
                  <p className="mt-1 min-h-9 text-xs leading-5 text-slate-600">{item.description_id || 'Belum ada keterangan.'}</p>
                  <p className="mt-2 text-[10px] text-slate-400">{item.taken_at ? `Tanggal foto: ${new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(item.taken_at.slice(0, 10)))}` : builtIn ? 'Foto bawaan website' : `Ditambahkan ${formatDate(item.created_at)}`}</p>
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                    <button onClick={() => openEditor(item)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-800">
                      <Pencil className="h-3.5 w-3.5" />Ubah
                    </button>
                    {!builtIn && (
                      <>
                        <button onClick={() => void togglePublished(item)} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50">
                          {item.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button onClick={() => void deletePhoto(item)} className="grid h-9 w-9 place-items-center rounded-lg border border-rose-200 text-rose-600 transition hover:bg-rose-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Editor Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <h3 className="text-base font-bold text-slate-900">Edit Foto Galeri</h3>
              <button onClick={() => { setEditing(null); setReplacementPhoto(null); }} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={saveEditor} className="p-6">
              <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-800">Pratinjau foto</p>
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <img src={editing.image_url} alt={editing.title_id} className="aspect-[4/3] w-full object-cover" />
                  </div>
                  <label className="mt-4 block text-sm font-semibold text-slate-800">Ganti foto (opsional)
                    <div className="mt-2 flex min-h-[96px] cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center transition hover:border-emerald-500 hover:bg-emerald-50/50" onClick={() => document.getElementById('editor-photo-input')?.click()}>
                      <input id="editor-photo-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setReplacementPhoto(e.target.files?.[0] ?? null)} className="sr-only" />
                      <Camera className="h-5 w-5 text-emerald-700" />
                      <span className="mt-1 text-xs font-semibold text-slate-700">{replacementPhoto ? replacementPhoto.name : 'Pilih foto pengganti'}</span>
                    </div>
                  </label>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-slate-800">Kategori
                    <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as GalleryRecord['category'] })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10">
                      {Object.entries(categoryLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </label>
                  <label className="block text-sm font-semibold text-slate-800">Judul Indonesia
                    <input required minLength={2} maxLength={120} value={editing.title_id} onChange={(e) => setEditing({ ...editing, title_id: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
                  </label>
                  <label className="block text-sm font-semibold text-slate-800">Judul Inggris
                    <input maxLength={120} value={editing.title_en} onChange={(e) => setEditing({ ...editing, title_en: e.target.value })} placeholder="Opsional" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
                  </label>
                  <label className="block text-sm font-semibold text-slate-800">Keterangan Indonesia
                    <textarea maxLength={500} rows={3} value={editing.description_id} onChange={(e) => setEditing({ ...editing, description_id: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
                  </label>
                  <label className="block text-sm font-semibold text-slate-800">Keterangan Inggris
                    <textarea maxLength={500} rows={3} value={editing.description_en} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} placeholder="Opsional" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
                  </label>
                  <label className="block text-xs font-semibold text-slate-600">Tanggal Foto
                    <input type="date" value={editing.taken_at ? editing.taken_at.slice(0, 10) : ''} onChange={(e) => setEditing({ ...editing, taken_at: e.target.value || null })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
                  </label>
                </div>
              </div>
              <div className="mt-6 flex flex-col-reverse justify-end gap-2 border-t border-slate-200 pt-5 sm:flex-row">
                <button type="button" disabled={saving} onClick={() => { setEditing(null); setReplacementPhoto(null); }} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Batal</button>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-60">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
