import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { NextResponse } from 'next/server';

/**
 * POST /api/magang — kirim lamaran magang ke Supabase (tabel internship_applications).
 * Honeypot `botField` untuk anti-bot sederhana.
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, errors: ['Penyimpanan belum tersambung. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local.'] },
      { status: 503 },
    );
  }

  try {
    const payload = await request.json();
    const {
      name,
      institution,
      major,
      email,
      phone,
      division,
      duration,
      message,
      botField,
    } = payload as Record<string, unknown>;

    const errors: string[] = [];
    // Honeypot – must be empty
    if (typeof botField === 'string' && botField.trim().length > 0) errors.push('Bot detected');

    const clean = (v: unknown) => String(v ?? '').trim();
    const cName = clean(name);
    const cInstitution = clean(institution);
    const cMajor = clean(major);
    const cEmail = clean(email);
    const cPhone = clean(phone);
    const cDivision = clean(division);
    const cDuration = clean(duration);
    const cMessage = clean(message);

    if (cName.length < 2 || cName.length > 120) errors.push('Nama harus 2-120 karakter.');
    if (cInstitution.length < 2 || cInstitution.length > 180) errors.push('Instansi wajib diisi (2-180 karakter).');
    if (cMajor.length < 2 || cMajor.length > 120) errors.push('Jurusan wajib diisi (2-120 karakter).');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cEmail)) errors.push('Alamat email tidak valid.');
    if (cPhone.length < 5 || cPhone.length > 40 || !/^[+\d][\d\s-]{4,39}$/.test(cPhone)) errors.push('Nomor telepon tidak valid.');
    if (cDivision.length < 2 || cDivision.length > 120) errors.push('Divisi wajib dipilih.');
    if (cDuration.length < 2 || cDuration.length > 40) errors.push('Durasi wajib dipilih.');
    if (cMessage.length < 5 || cMessage.length > 3000) errors.push('Pesan harus 5-3000 karakter.');

    if (errors.length) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from('internship_applications')
      .insert({
        name: cName,
        institution: cInstitution,
        major: cMajor,
        email: cEmail,
        phone: cPhone,
        division: cDivision,
        duration: cDuration,
        message: cMessage,
        status: 'baru',
      });

    if (error) {
      console.error('Internship insert failed:', error.message);
      return NextResponse.json({ ok: false, errors: ['Lamaran belum terkirim. Coba lagi nanti.'] }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Magang POST error:', e);
    return NextResponse.json({ ok: false, errors: ['Permintaan tidak valid.'] }, { status: 400 });
  }
}
