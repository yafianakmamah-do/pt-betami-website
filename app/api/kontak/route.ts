import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();

  try {
    const body = await request.json();
    const { name, company, email, phone, topic, message } = body;

    if (!name || !email || !phone || !topic || !message) {
      return Response.json({ error: 'Semua field wajib diisi.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name,
        company: company || null,
        email,
        phone,
        topic,
        message,
        status: 'baru',
      });

    if (error) {
      console.error('Contact insert failed:', error.message);
      return Response.json({ error: 'Pesan belum terkirim.' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Contact POST error:', err);
    return Response.json({ error: 'Permintaan tidak valid.' }, { status: 400 });
  }
}