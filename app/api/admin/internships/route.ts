import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || user.app_metadata.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('internship_applications')
    .select('id,name,institution,major,email,phone,division,duration,message,status,created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Admin internship applications fetch failed:', error.message);
    return Response.json({ error: 'Gagal memuat data.' }, { status: 500 });
  }

  return Response.json({ applications: data || [] }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PATCH(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || user.app_metadata.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return Response.json({ error: 'Parameter tidak lengkap.' }, { status: 400 });
    }

    const validStatuses = ['baru', 'ditinjau', 'diterima', 'ditolak'];
    if (!validStatuses.includes(status)) {
      return Response.json({ error: 'Status tidak valid.' }, { status: 400 });
    }

    const { error } = await supabase.from('internship_applications').update({ status }).eq('id', id);

    if (error) {
      console.error('Admin internship status update failed:', error.message);
      return Response.json({ error: 'Status belum diperbarui.' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Admin internship PATCH error:', err);
    return Response.json({ error: 'Permintaan tidak valid.' }, { status: 400 });
  }
}
