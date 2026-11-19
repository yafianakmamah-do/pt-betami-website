import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function PATCH(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || user.app_metadata.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { kind, id, status } = body;

    if (!kind || !id || !status) {
      return Response.json({ error: 'Parameter tidak lengkap.' }, { status: 400 });
    }

    const table = kind === 'messages' ? 'contact_messages' : 'internship_applications';
    const validStatuses = kind === 'messages' 
      ? ['baru', 'dibaca', 'selesai'] 
      : ['baru', 'ditinjau', 'diterima', 'ditolak'];

    if (!validStatuses.includes(status)) {
      return Response.json({ error: 'Status tidak valid.' }, { status: 400 });
    }

    const { error } = await supabase.from(table).update({ status }).eq('id', id);

    if (error) {
      console.error(`Admin ${kind} status update failed:`, error.message);
      return Response.json({ error: 'Status belum diperbarui.' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Admin inbox PATCH error:', err);
    return Response.json({ error: 'Permintaan tidak valid.' }, { status: 400 });
  }
}