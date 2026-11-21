import { requireAdmin } from '@/lib/supabase/admin';

const VALID_STATUSES = ['baru', 'ditinjau', 'diterima', 'ditolak'];
const SIGNED_URL_SECONDS = 60 * 60;

export async function GET() {
  const access = await requireAdmin();
  if (access.response) return access.response;

  const { data, error } = await access.client
    .from('job_applications')
    .select('id,name,email,phone,position,resume_url,cover_letter,status,created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Admin job applications fetch failed:', error.message);
    const missing = error.code === 'PGRST205' || /job_applications/i.test(error.message);
    return Response.json(
      { error: missing ? 'Tabel lamaran kerja belum dibuat. Jalankan supabase/migration_admin_features.sql.' : 'Gagal memuat data.' },
      { status: missing ? 503 : 500 },
    );
  }

  // Bucket CV bersifat privat. Berikan tautan bertanda tangan yang dibuat di server,
  // jangan pernah menaruh Secret/Service Role Key di browser.
  const applications = await Promise.all((data ?? []).map(async (row) => {
    if (!row.resume_url) return { ...row, resume_signed_url: '' };
    const { data: signed, error: signError } = await access.client.storage
      .from('betami-documents')
      .createSignedUrl(row.resume_url, SIGNED_URL_SECONDS);
    if (signError) console.warn('CV signed URL failed:', signError.message);
    return { ...row, resume_signed_url: signError ? '' : (signed?.signedUrl ?? '') };
  }));

  return Response.json(
    { applications },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function PATCH(request: Request) {
  const access = await requireAdmin();
  if (access.response) return access.response;

  try {
    const body = await request.json();
    const { id, status } = body ?? {};

    if (!id || !status) {
      return Response.json({ error: 'Parameter tidak lengkap.' }, { status: 400 });
    }
    if (!VALID_STATUSES.includes(status)) {
      return Response.json({ error: 'Status tidak valid.' }, { status: 400 });
    }

    const { error } = await access.client.from('job_applications').update({ status }).eq('id', id);
    if (error) {
      console.error('Admin job application status update failed:', error.message);
      return Response.json({ error: 'Status belum diperbarui.' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Admin career PATCH error:', err);
    return Response.json({ error: 'Permintaan tidak valid.' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const access = await requireAdmin();
  if (access.response) return access.response;

  const id = new URL(request.url).searchParams.get('id');
  if (!id) return Response.json({ error: 'ID lamaran tidak diberikan.' }, { status: 400 });

  const { data: current, error: lookupError } = await access.client
    .from('job_applications')
    .select('resume_url')
    .eq('id', id)
    .maybeSingle();

  if (lookupError) {
    console.error('Job application lookup failed:', lookupError.message);
    return Response.json({ error: 'Lamaran tidak dapat ditemukan.' }, { status: 500 });
  }
  if (!current) return Response.json({ error: 'Lamaran tidak ditemukan.' }, { status: 404 });

  const { error } = await access.client.from('job_applications').delete().eq('id', id);
  if (error) {
    console.error('Job application delete failed:', error.message);
    return Response.json({ error: 'Lamaran belum dihapus.' }, { status: 500 });
  }

  if (current.resume_url) {
    const { error: storageError } = await access.client.storage
      .from('betami-documents')
      .remove([current.resume_url]);
    if (storageError) console.warn('Failed to delete CV from storage:', storageError.message);
  }

  return Response.json({ success: true });
}
