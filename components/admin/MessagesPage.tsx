'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { Mail, Loader2, RefreshCw, Search, Building2, User, Clock, Eye, CheckCircle, X, Reply, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  status: 'baru' | 'dibaca' | 'selesai';
  created_at: string;
}

function gmailReplyUrl(msg: ContactMessage) {
  const subject = `Re: ${msg.topic || 'Pesan Anda'} - PT Benih Tamiang (BETAMI)`;
  const quoted = msg.message.split('\n').map((line) => `> ${line}`).join('\n');
  const body = [
    `Yth. Bapak/Ibu ${msg.name}${msg.company ? ` (${msg.company})` : ''},`,
    '',
    'Terima kasih telah menghubungi kami. Kami dari PT Benih Tamiang (BETAMI) telah menerima pesan Anda mengenai "' + (msg.topic || '-') + '".',
    '',
    '[Tulis jawaban Anda di sini]',
    '',
    'Apabila ada hal lain yang ingin ditanyakan, silakan balas email ini.',
    '',
    'Hormat kami,',
    'PT Benih Tamiang (BETAMI)',
    'Pabrik Kelapa Sawit - Kec. Rantau, Aceh Tamiang',
    '',
    '--- Pesan Anda ---',
    quoted,
  ].join('\n');
  const params = new URLSearchParams({ view: 'cm', fs: '1', to: msg.email, su: subject, body });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

const statusLabels: Record<string, string> = {
  'baru': 'Baru',
  'dibaca': 'Dibaca',
  'selesai': 'Selesai',
};

export default function MessagesPage({ supabase: propSupabase }: { supabase: ReturnType<typeof createSupabaseBrowserClient> | null }) {
  const supabase = useMemo(() => propSupabase || (isSupabaseConfigured() ? createSupabaseBrowserClient() : null), [propSupabase]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setMessages(Array.isArray(json.messages) ? json.messages : []);
      }
    } catch { setError('Gagal memuat pesan.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    return messages.filter((msg) => {
      const matchStatus = statusFilter === 'all' || msg.status === statusFilter;
      const text = `${msg.name} ${msg.company} ${msg.email} ${msg.topic} ${msg.message}`.toLowerCase();
      const matchSearch = !search || text.includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [messages, statusFilter, search]);

  const updateStatus = async (msg: ContactMessage, newStatus: ContactMessage['status']) => {
    if (!supabase) return;
    setSaving(true); setError('');
    try {
      const { error: dbErr } = await supabase.from('contact_messages').update({ status: newStatus }).eq('id', msg.id);
      if (dbErr) throw dbErr;
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, status: newStatus } : m));
      if (selected?.id === msg.id) setSelected({ ...selected, status: newStatus });
      setNotice(`Status berhasil diubah ke "${statusLabels[newStatus]}".`);
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const deleteMessage = async (msg: ContactMessage) => {
    if (!supabase) return;
    if (!window.confirm(`Hapus pesan dari ${msg.name}? Tindakan ini tidak bisa dibatalkan.`)) return;
    setSaving(true); setError('');
    try {
      const { error: dbErr } = await supabase.from('contact_messages').delete().eq('id', msg.id);
      if (dbErr) throw dbErr;
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
      if (selected?.id === msg.id) setSelected(null);
      setNotice('Pesan berhasil dihapus.');
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const readMessages = useMemo(() => messages.filter((m) => m.status !== 'baru'), [messages]);

  const deleteAllRead = async () => {
    if (!supabase || readMessages.length === 0) return;
    if (!window.confirm(`Hapus ${readMessages.length} pesan yang sudah dibaca/selesai? Tindakan ini tidak bisa dibatalkan.`)) return;
    setSaving(true); setError('');
    try {
      const ids = readMessages.map((m) => m.id);
      const { error: dbErr } = await supabase.from('contact_messages').delete().in('id', ids);
      if (dbErr) throw dbErr;
      setMessages((prev) => prev.filter((m) => !ids.includes(m.id)));
      if (selected && ids.includes(selected.id)) setSelected(null);
      setNotice(`${ids.length} pesan berhasil dihapus.`);
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const replyUrl = (msg: ContactMessage) => gmailReplyUrl(msg);

  const handleReply = (msg: ContactMessage) => {
    window.open(replyUrl(msg), '_blank', 'noopener,noreferrer');
    if (msg.status !== 'selesai') void updateStatus(msg, 'selesai');
  };

  const formatDate = (v: string) => {
    if (!v) return '-';
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(v));
  };

  const statusBadge = (status: string) => {
    if (status === 'baru') return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-700"><Clock className="h-3 w-3" />Baru</span>;
    if (status === 'dibaca') return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700"><Eye className="h-3 w-3" />Dibaca</span>;
    return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700"><CheckCircle className="h-3 w-3" />Selesai</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Mail className="h-5 w-5" /></div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pesan Kontak</h2>
            <p className="text-xs text-slate-500">{messages.filter(m => m.status === 'baru').length} pesan belum dibaca</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => void deleteAllRead()} disabled={saving || readMessages.length === 0} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50">
            <Trash2 className="h-4 w-4" />Hapus yang sudah dibaca{readMessages.length > 0 ? ` (${readMessages.length})` : ''}
          </button>
          <button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <RefreshCw className="h-4 w-4" />Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama, perusahaan, atau topik..." className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pl-10 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 sm:w-auto">
            <option value="all">Semua Status</option>
            <option value="baru">Baru</option>
            <option value="dibaca">Dibaca</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-6 py-5 shadow-sm">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
            <span className="text-sm font-semibold text-slate-700">Memuat pesan...</span>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Mail className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">Tidak ada pesan yang ditemukan.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div key={msg.id} className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${msg.status === 'baru' ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200'}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{msg.name}</h3>
                    {statusBadge(msg.status)}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1"><Building2 className="h-3 w-3" />{msg.company || '-'}</span>
                    <span className="inline-flex items-center gap-1"><User className="h-3 w-3" />{msg.topic}</span>
                  </div>
                  <p className="mt-2 max-h-10 overflow-hidden text-ellipsis text-sm text-slate-600">{msg.message}</p>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-400">
                    <span>{msg.email}</span>
                    {msg.phone && <span>{msg.phone}</span>}
                    <span>{formatDate(msg.created_at)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {msg.status === 'baru' && (
                    <button onClick={() => void updateStatus(msg, 'dibaca')} className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50">Baca</button>
                  )}
                  {msg.status !== 'selesai' && (
                    <button onClick={() => void updateStatus(msg, 'selesai')} className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50">Selesai</button>
                  )}
                  <button onClick={() => setSelected(msg)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Detail</button>
                  <button onClick={() => handleReply(msg)} title="Balas lewat Gmail" className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"><Reply className="h-3.5 w-3.5" />Balas</button>
                  <button onClick={() => void deleteMessage(msg)} disabled={saving} title="Hapus pesan" aria-label="Hapus pesan" className="rounded-lg border border-rose-200 px-2.5 py-2 text-rose-600 hover:bg-rose-50 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" /></button>
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
              <h3 className="text-base font-bold text-slate-900">Detail Pesan</h3>
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
                  <p className="text-xs font-semibold text-slate-500">Perusahaan</p>
                  <p className="text-sm text-slate-900">{selected.company || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Topik</p>
                  <p className="text-sm text-slate-900">{selected.topic}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Tanggal</p>
                  <p className="text-sm text-slate-900">{formatDate(selected.created_at)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Pesan</p>
                <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="whitespace-pre-wrap text-sm text-slate-700">{selected.message}</p>
                </div>
              </div>
              <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-5 sm:flex-row">
                <button onClick={() => setSelected(null)} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Tutup</button>
                <div className="flex gap-2">
                  {selected.status === 'baru' && (
                    <button onClick={() => void updateStatus(selected, 'dibaca')} disabled={saving} className="rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-50 disabled:opacity-50">Tandai Dibaca</button>
                  )}
                  {selected.status !== 'selesai' && (
                    <button onClick={() => void updateStatus(selected, 'selesai')} disabled={saving} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-50">Tandai Selesai</button>
                  )}
                  <button onClick={() => void deleteMessage(selected)} disabled={saving} className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50 inline-flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />Hapus
                  </button>
                  <button onClick={() => handleReply(selected)} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-500 inline-flex items-center gap-2">
                    <Reply className="h-4 w-4" />Balas via Gmail
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
