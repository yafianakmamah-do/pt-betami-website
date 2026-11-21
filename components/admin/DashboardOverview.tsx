'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { BarChart3, Mail, Users, Briefcase, Image, Clock, TrendingUp, AlertCircle } from 'lucide-react';

interface AdminData {
  messages: { id: string; name: string; email: string; topic: string; status: string; created_at: string }[];
  applications: { id: string; name: string; email: string; division: string; status: string; created_at: string }[];
  interns: { id: string; name: string; university: string; is_published: boolean; created_at: string }[];
  gallery: { id: string; category: string; is_published: boolean; created_at: string }[];
  jobs?: { id: string; name: string; position: string; status: string; created_at: string }[];
  jobsWarning?: string;
}

export default function DashboardOverview({ data: propData, loading: propLoading, error: propError }: { data: AdminData | null; loading: boolean; error: string }) {
  const [data, setData] = useState<AdminData | null>(propData);
  const [loading, setLoading] = useState(propLoading);
  const [error, setError] = useState(propError);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setError('Gagal memuat data dashboard.');
      }
    } catch {
      setError('Gagal memuat data dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const stats = useMemo(() => {
    if (!data) return null;
    const newMessages = data.messages.filter(m => m.status === 'baru').length;
    const newApplications = data.applications.filter(a => a.status === 'baru').length;
    const publishedInterns = data.interns.filter(i => i.is_published).length;
    const publishedGallery = data.gallery.filter(g => g.is_published).length;
    const jobs = Array.isArray(data.jobs) ? data.jobs : [];
    return {
      totalMessages: data.messages.length,
      newMessages,
      totalApplications: data.applications.length,
      newApplications,
      totalInterns: data.interns.length,
      publishedInterns,
      totalGallery: data.gallery.length,
      publishedGallery,
      totalJobs: jobs.length,
      newJobs: jobs.filter(j => j.status === 'baru').length,
    };
  }, [data]);

  const recentMessages = useMemo(() => data?.messages.slice(0, 5) || [], [data]);
  const recentApplications = useMemo(() => data?.applications.slice(0, 5) || [], [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-6 py-5 shadow-sm">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-600" />
          <span className="text-sm font-semibold text-slate-700">Memuat dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 shadow-sm">
          <AlertCircle className="h-5 w-5 text-rose-500" />
          <span className="text-sm font-semibold text-rose-700">{error}</span>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-sm text-slate-500">Ringkasan aktivitas PT Betami Sawit</p>
        </div>
        <button onClick={load} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          icon={<Mail className="h-5 w-5" />}
          label="Pesan Kontak"
          value={stats.totalMessages}
          sub={`${stats.newMessages} belum dibaca`}
          color="emerald"
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Lamaran Magang"
          value={stats.totalApplications}
          sub={`${stats.newApplications} baru`}
          color="blue"
        />
        <StatCard
          icon={<Briefcase className="h-5 w-5" />}
          label="Lamaran Kerja"
          value={stats.totalJobs}
          sub={`${stats.newJobs} belum ditinjau`}
          color="rose"
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Peserta Magang"
          value={stats.publishedInterns}
          sub={`dari ${stats.totalInterns} total`}
          color="violet"
        />
        <StatCard
          icon={<Image className="h-5 w-5" />}
          label="Galeri Foto"
          value={stats.publishedGallery}
          sub={`dari ${stats.totalGallery} total`}
          color="amber"
        />
      </div>

      {/* Summary Panels */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Messages */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Pesan Terbaru</h3>
            <span className="text-xs text-slate-500">{stats.totalMessages} total</span>
          </div>
          {recentMessages.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">Belum ada pesan masuk.</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{msg.name}</p>
                    <p className="truncate text-xs text-slate-500">{msg.topic}</p>
                  </div>
                  <span className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    msg.status === 'baru' ? 'bg-amber-100 text-amber-700' :
                    msg.status === 'dibaca' ? 'bg-blue-100 text-blue-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {msg.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Lamaran Magang Terbaru</h3>
            <span className="text-xs text-slate-500">{stats.totalApplications} total</span>
          </div>
          {recentApplications.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">Belum ada lamaran magang.</p>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{app.name}</p>
                    <p className="truncate text-xs text-slate-500">{app.division}</p>
                  </div>
                  <span className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    app.status === 'baru' ? 'bg-amber-100 text-amber-700' :
                    app.status === 'ditinjau' ? 'bg-blue-100 text-blue-700' :
                    app.status === 'diterima' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.newMessages}</p>
              <p className="text-xs text-slate-500">Pesan Baru</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.newApplications}</p>
              <p className="text-xs text-slate-500">Lamaran Baru</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stats.publishedInterns}</p>
              <p className="text-xs text-slate-500">Intern Aktif</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: number; sub: string; color: string }) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600' },
  };
  const c = colorMap[color] || colorMap.emerald;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.bg} ${c.text}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-black text-slate-900">{value}</p>
          <p className="text-xs text-slate-500">{label}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-400">{sub}</p>
    </div>
  );
}
