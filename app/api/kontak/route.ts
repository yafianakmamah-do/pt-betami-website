import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return Response.json({ error: 'Penyimpanan belum tersambung. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local.' }, { status: 503 });
  }

  const supabase = await createSupabaseServerClient();

  try {
    const body = await request.json();
    const { name, company, email, phone, topic, message } = body;

    if (!name || !email || !phone || !topic || !message) {
      return Response.json({ error: 'Semua field wajib diisi.' }, { status: 400 });
    }

    const clean = (v: unknown) => String(v ?? '').trim();
    const cName = clean(name);
    const cEmail = clean(email);
    const cPhone = clean(phone);
    const cTopic = clean(topic);
    const cMessage = clean(message);

    if (cName.length < 2 || cName.length > 120) {
      return Response.json({ error: 'Nama harus 2-120 karakter.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cEmail)) {
      return Response.json({ error: 'Alamat email tidak valid.' }, { status: 400 });
    }
    if (cPhone.length < 5 || cPhone.length > 40 || !/^[+\d][\d\s-]{4,39}$/.test(cPhone)) {
      return Response.json({ error: 'Nomor telepon tidak valid.' }, { status: 400 });
    }
    if (cTopic.length < 2 || cTopic.length > 120) {
      return Response.json({ error: 'Topik wajib diisi.' }, { status: 400 });
    }
    if (cMessage.length < 5 || cMessage.length > 5000) {
      return Response.json({ error: 'Pesan harus 5-5000 karakter.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name: cName,
        company: company ? String(company).trim().slice(0, 160) : '',
        email: cEmail,
        phone: cPhone,
        topic: cTopic,
        message: cMessage,
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