import { requireAdmin } from '@/lib/supabase/admin';
import { SITE_CONTENT_FIELDS, SITE_CONTENT_PAGES } from '@/lib/siteContent';

const PAGES = new Set<string>(SITE_CONTENT_PAGES);
const FIELDS = new Set<string>(SITE_CONTENT_FIELDS);

export async function GET() {
  const access = await requireAdmin();
  if (access.response) return access.response;

  const { data, error } = await access.client
    .from('site_content')
    .select('page,field,value,updated_at');

  if (error) {
    const missing = error.code === 'PGRST205' || error.message.includes('site_content');
    return Response.json(
      { error: missing ? 'Tabel konten belum dibuat. Jalankan supabase/migration_admin_features.sql di SQL Editor Supabase.' : 'Konten belum dapat dimuat.', content: {} },
      { status: missing ? 503 : 500 },
    );
  }

  const content: Record<string, Record<string, string>> = {};
  const updatedAt: Record<string, Record<string, string>> = {};
  for (const row of data ?? []) {
    if (!content[row.page]) content[row.page] = {};
    content[row.page][row.field] = row.value ?? '';
    if (!updatedAt[row.page]) updatedAt[row.page] = {};
    updatedAt[row.page][row.field] = row.updated_at ?? '';
  }

  return Response.json(
    { content, updated_at: updatedAt },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function POST(request: Request) {
  const access = await requireAdmin();
  if (access.response) return access.response;

  const body = await request.json().catch(() => null);
  const incoming = body?.content;
  if (!incoming || typeof incoming !== 'object') {
    return Response.json({ error: 'Data konten tidak valid.' }, { status: 400 });
  }

  const rows: { page: string; field: string; value: string; updated_at: string }[] = [];
  for (const [page, fields] of Object.entries(incoming as Record<string, Record<string, string>>)) {
    if (!PAGES.has(page) || !fields || typeof fields !== 'object') continue;
    for (const [field, value] of Object.entries(fields)) {
      if (!FIELDS.has(field)) continue;
      const text = String(value ?? '');
      if (text.length > 8000) {
        return Response.json({ error: 'Salah satu teks melebihi 8000 karakter.' }, { status: 400 });
      }
      rows.push({ page, field, value: text, updated_at: new Date().toISOString() });
    }
  }

  if (!rows.length) {
    return Response.json({ error: 'Tidak ada konten untuk disimpan.' }, { status: 400 });
  }

  const { error } = await access.client.from('site_content').upsert(rows, { onConflict: 'page,field' });
  if (error) {
    console.error('Site content save failed:', error.message);
    const missing = error.code === 'PGRST205' || error.message.includes('site_content');
    return Response.json(
      { error: missing ? 'Tabel konten belum dibuat. Jalankan supabase/migration_admin_features.sql.' : 'Konten belum tersimpan.' },
      { status: missing ? 503 : 500 },
    );
  }

  return Response.json({ success: true });
}
