'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { CalendarDays, Eye, EyeOff, ImagePlus, Newspaper, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { NEWS_CATEGORIES, slugify } from '@/lib/news';

interface NewsRecord {
  id: string;
  slug: string;
  title_id: string;
  title_en: string;
  excerpt_id: string;
  excerpt_en: string;
  body_id: string;
  body_en: string;
  cover_url: string;
  cover_storage_path: string;
  category: string;
  published_at: string;
  is_published: boolean;
  created_at: string;
}

type NewsForm = Omit<NewsRecord, 'id' | 'created_at'> & { id?: string };

const today = () => new Date().toISOString().slice(0, 10);
const emptyForm = (): NewsForm => ({
  slug: '', title_id: '', title_en: '', excerpt_id: '', excerpt_en: '', body_id: '', body_en: '',
  cover_url: '', cover_storage_path: '', category: 'perusahaan', published_at: today(), is_published: true,
});
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
const inputCls = 'mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10';

export default function NewsPage({ supabase: propSupabase }: { supabase: ReturnType<typeof createSupabaseBrowserClient> | null }) {
  const supabase = useMemo(() => propSupabase || (isSupabaseConfigured() ? createSupabaseBrowserClient() : null), [propSupabase]);
  const [news, setNews] = useState<NewsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<NewsForm | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [cover, setCover] = useState<File | null>(null);

  const load = useCallback(async () => {
    if (!supabase) { setLoading(false); return; }
    setLoading(true); setError('');
    const { data, error: dbErr } = await supabase.from('news_posts').select('*').order('published_at', { ascending: false });
    if (dbErr) setError(`Tabel berita belum siap. Jalankan file supabase/migration_news_gallery_dates.sql di Supabase SQL Editor. (${dbErr.message})`);
    else setNews(data as NewsRecord[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { void load(); }, [load]);

  const filtered = news.filter((n) => `${n.title_id} ${n.title_en} ${n.excerpt_id}`.toLowerCase().includes(search.toLowerCase()));

  const openNew = () => { setForm(emptyForm()); setSlugTouched(false); setCover(null); setError(''); };
  const openEdit = (n: NewsRecord) => { setForm({ ...n, published_at: n.published_at.slice(0, 10) }); setSlugTouched(true); setCover(null); setError(''); };
  const close = () => { setForm(null); setCover(null); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !form) return;
    const slug = slugify(form.slug || form.title_id);
    if (!slug) { setError('Slug tidak valid.'); return; }
    if (cover && (!ALLOWED.includes(cover.type) || cover.size > 8 * 1024 * 1024)) { setError('Gunakan JPG, PNG, atau WebP (maks 8 MB).'); return; }
    setSaving(true); setError('');
    let uploadedPath = '';
    try {
      const payload: Record<string, unknown> = {
        slug, title_id: form.title_id.trim(), title_en: form.title_en.trim(), excerpt_id: form.excerpt_id.trim(), excerpt_en: form.excerpt_en.trim(),
        body_id: form.body_id.trim(), body_en: form.body_en.trim(), category: form.category, published_at: form.published_at || today(), is_published: form.is_published,
      };
      if (cover) {
        const ext = cover.type === 'image/png' ? 'png' : cover.type === 'image/webp' ? 'webp' : 'jpg';
        uploadedPath = `news/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('betami-gallery').upload(uploadedPath, cover, { contentType: cover.type });
        if (upErr) throw new Error(`Upload gagal: ${upErr.message}`);
        payload.cover_storage_path = uploadedPath;
        payload.cover_url = supabase.storage.from('betami-gallery').getPublicUrl(uploadedPath).data.publicUrl;
      }
      const query = form.id
        ? supabase.from('news_posts').update(payload).eq('id', form.id).select().single()
        : supabase.from('news_posts').insert(payload).select().single();
      const { data, error: dbErr } = await query;
      if (dbErr) throw new Error(dbErr.code === '23505' ? 'Slug sudah dipakai berita lain.' : dbErr.message);
      if (uploadedPath && form.cover_storage_path) await supabase.storage.from('betami-gallery').remove([form.cover_storage_path]);
      const saved = data as NewsRecord;
      setNews((prev) => form.id ? prev.map((n) => n.id === saved.id ? saved : n) : [saved, ...prev]);
      setNotice(form.id ? 'Berita berhasil diperbarui.' : 'Berita berhasil ditambahkan.');
      close();
    } catch (err: any) {
      if (uploadedPath) await supabase.storage.from('betami-gallery').remove([uploadedPath]);
      setError(err.message || 'Gagal menyimpan berita.');
    } finally { setSaving(false); }
  };

  const remove = async (n: NewsRecord) => {
    if (!supabase || !window.confirm(`Hapus berita "${n.title_id}"?`)) return;
    setSaving(true); setError('');
    const { error: dbErr } = await supabase.from('news_posts').delete().eq('id', n.id);
    if (dbErr) setError(dbErr.message);
    else {
      if (n.cover_storage_path) await supabase.storage.from('betami-gallery').remove([n.cover_storage_path]);
      setNews((prev) => prev.filter((x) => x.id !== n.id)); setNotice('Berita dihapus.');
    }
    setSaving(false);
  };

  const togglePublished = async (n: NewsRecord) => {
    if (!supabase) return;
    const { error: dbErr } = await supabase.from('news_posts').update({ is_published: !n.is_published }).eq('id', n.id);
    if (dbErr) setError(dbErr.message);
    else setNews((prev) => prev.map((x) => x.id === n.id ? { ...x, is_published: !x.is_published } : x));
  };

  const fmt = (v: string) => new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date(v));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Berita</h2>
          <p className="text-sm text-slate-500">Kelola berita yang tampil di menu Berita website.</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-600"><Plus className="h-4 w-4" />Tambah Berita</button>
      </div>

      {notice && <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}<button onClick={() => setNotice('')}><X className="h-4 w-4" /></button></div>}
      {error && !form && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari berita..." className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-slate-500">Memuat berita...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-slate-500">
          <Newspaper className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm">Belum ada berita. Klik &quot;Tambah Berita&quot; untuk membuat yang pertama.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((n) => (
            <div key={n.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-[16/9] bg-slate-100">
                {n.cover_url ? <img src={n.cover_url} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-300"><ImagePlus className="h-10 w-10" /></div>}
                <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold ${n.is_published ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-white'}`}>{n.is_published ? 'Tayang' : 'Draf'}</span>
              </div>
              <div className="p-4">
                <p className="inline-flex items-center gap-1.5 text-xs text-slate-500"><CalendarDays className="h-3.5 w-3.5" />{fmt(n.published_at)} · {NEWS_CATEGORIES[n.category]?.id ?? n.category}</p>
                <h3 className="mt-1 line-clamp-2 font-bold text-slate-900">{n.title_id}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{n.excerpt_id}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => openEdit(n)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"><Pencil className="h-3.5 w-3.5" />Edit</button>
                  <button onClick={() => void togglePublished(n)} title={n.is_published ? 'Sembunyikan' : 'Tayangkan'} className="rounded-lg border border-slate-200 px-2.5 py-2 text-slate-600 hover:bg-slate-50">{n.is_published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</button>
                  <button onClick={() => void remove(n)} disabled={saving} title="Hapus" className="rounded-lg border border-rose-200 px-2.5 py-2 text-rose-600 hover:bg-rose-50 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {form && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4">
          <form onSubmit={save} className="my-8 w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-lg font-black text-slate-900">{form.id ? 'Edit Berita' : 'Tambah Berita'}</h3>
              <button type="button" onClick={close} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-2">
              {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 md:col-span-2">{error}</div>}
              <label className="text-xs font-semibold text-slate-700 md:col-span-2">Judul (Indonesia) *
                <input required minLength={3} maxLength={200} value={form.title_id} onChange={(e) => setForm({ ...form, title_id: e.target.value, slug: slugTouched ? form.slug : slugify(e.target.value) })} className={inputCls} />
              </label>
              <label className="text-xs font-semibold text-slate-700 md:col-span-2">Judul (Inggris)
                <input maxLength={200} value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} placeholder="Opsional" className={inputCls} />
              </label>
              <label className="text-xs font-semibold text-slate-700">Alamat URL (slug)
                <input value={form.slug} onChange={(e) => { setSlugTouched(true); setForm({ ...form, slug: slugify(e.target.value) }); }} className={inputCls} />
                <span className="mt-1 block text-[11px] font-normal text-slate-400">/berita/{form.slug || '...'}</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-semibold text-slate-700">Kategori
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                    {Object.entries(NEWS_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.id}</option>)}
                  </select>
                </label>
                <label className="text-xs font-semibold text-slate-700">Tanggal
                  <input type="date" required value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} className={inputCls} />
                </label>
              </div>
              <label className="text-xs font-semibold text-slate-700">Ringkasan (Indonesia)
                <textarea rows={3} maxLength={400} value={form.excerpt_id} onChange={(e) => setForm({ ...form, excerpt_id: e.target.value })} className={inputCls} />
              </label>
              <label className="text-xs font-semibold text-slate-700">Ringkasan (Inggris)
                <textarea rows={3} maxLength={400} value={form.excerpt_en} onChange={(e) => setForm({ ...form, excerpt_en: e.target.value })} placeholder="Opsional" className={inputCls} />
              </label>
              <label className="text-xs font-semibold text-slate-700">Isi Berita (Indonesia)
                <textarea rows={9} maxLength={20000} value={form.body_id} onChange={(e) => setForm({ ...form, body_id: e.target.value })} placeholder="Pisahkan paragraf dengan baris kosong." className={inputCls} />
              </label>
              <label className="text-xs font-semibold text-slate-700">Isi Berita (Inggris)
                <textarea rows={9} maxLength={20000} value={form.body_en} onChange={(e) => setForm({ ...form, body_en: e.target.value })} placeholder="Opsional" className={inputCls} />
              </label>
              <div className="text-xs font-semibold text-slate-700">Foto Sampul
                <label className="mt-1 flex min-h-[46px] cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center hover:border-emerald-500">
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setCover(e.target.files?.[0] ?? null)} className="sr-only" />
                  <span>{cover ? cover.name : form.cover_url ? 'Ganti foto sampul' : 'Pilih foto (maks 8 MB)'}</span>
                </label>
              </div>
              <label className="flex items-center gap-3 self-end rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="h-4 w-4 accent-emerald-600" />
                Tayangkan di website
              </label>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <button type="button" onClick={close} disabled={saving} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Batal</button>
              <button type="submit" disabled={saving} className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-60">{saving ? 'Menyimpan...' : 'Simpan Berita'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
