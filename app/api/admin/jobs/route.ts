import { requireAdmin } from '@/lib/supabase/admin';

const TYPES = ['Penuh waktu', 'Kontrak', 'Paruh waktu'];

export async function GET() {
  const access = await requireAdmin();
  if (access.response) return access.response;

  const { data, error } = await access.client
    .from('job_openings')
    .select('id,title,location,employment_type,description,is_published,created_at')
    .order('created_at', { ascending: false });

  if (error) {
    const missing = error.code === 'PGRST205' || error.message.includes('job_openings');
    return Response.json(
      { error: missing ? 'Tabel lowongan belum dibuat. Jalankan supabase/migration_admin_features.sql.' : 'Gagal memuat lowongan.', openings: [] },
      { status: missing ? 503 : 500 },
    );
  }

  return Response.json({ openings: data ?? [] }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  const access = await requireAdmin();
  if (access.response) return access.response;

  const body = await request.json().catch(() => null);
  const title = String(body?.title ?? '').trim();
  const location = String(body?.location ?? 'Aceh Tamiang').trim();
  const employmentType = String(body?.employment_type ?? 'Penuh waktu').trim();
  const description = String(body?.description ?? '').trim();
  const isPublished = body?.is_published !== false;

  if (title.length < 2 || title.length > 180) {
    return Response.json({ error: 'Judul lowongan harus 2-180 karakter.' }, { status: 400 });
  }
  if (location.length < 2 || location.length > 180) {
    return Response.json({ error: 'Lokasi harus 2-180 karakter.' }, { status: 400 });
  }
  if (!TYPES.includes(employmentType)) {
    return Response.json({ error: 'Jenis pekerjaan tidak valid.' }, { status: 400 });
  }
  if (description.length > 5000) {
    return Response.json({ error: 'Deskripsi terlalu panjang.' }, { status: 400 });
  }

  const { data, error } = await access.client
    .from('job_openings')
    .insert({
      title,
      location,
      employment_type: employmentType,
      description,
      is_published: isPublished,
    })
    .select('id,title,location,employment_type,description,is_published,created_at')
    .single();

  if (error) {
    console.error('Job opening insert failed:', error.message);
    return Response.json({ error: 'Lowongan belum tersimpan.' }, { status: 500 });
  }

  return Response.json({ opening: data });
}

export async function PATCH(request: Request) {
  const access = await requireAdmin();
  if (access.response) return access.response;

  const body = await request.json().catch(() => null);
  const id = String(body?.id ?? '');
  if (!id) return Response.json({ error: 'Lowongan tidak ditemukan.' }, { status: 400 });

  const patch: Record<string, string | boolean> = {};
  if (typeof body?.title === 'string') patch.title = body.title.trim();
  if (typeof body?.location === 'string') patch.location = body.location.trim();
  if (typeof body?.employment_type === 'string') patch.employment_type = body.employment_type.trim();
  if (typeof body?.description === 'string') patch.description = body.description.trim();
  if (typeof body?.is_published === 'boolean') patch.is_published = body.is_published;

  const { error } = await access.client.from('job_openings').update(patch).eq('id', id);
  if (error) {
    console.error('Job opening update failed:', error.message);
    return Response.json({ error: 'Lowongan belum diperbarui.' }, { status: 500 });
  }

  return Response.json({ success: true });
}

export async function DELETE(request: Request) {
  const access = await requireAdmin();
  if (access.response) return access.response;

  const id = new URL(request.url).searchParams.get('id') ?? '';
  if (!id) return Response.json({ error: 'Lowongan tidak ditemukan.' }, { status: 400 });

  const { error } = await access.client.from('job_openings').delete().eq('id', id);
  if (error) {
    console.error('Job opening delete failed:', error.message);
    return Response.json({ error: 'Lowongan belum dihapus.' }, { status: 500 });
  }

  return Response.json({ success: true });
}
