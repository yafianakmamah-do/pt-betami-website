import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { readInterns, writeInterns } from '@/lib/internsStorage';

export const dynamic = 'force-dynamic';

export async function GET() {
  const interns = readInterns();
  return NextResponse.json({ ok: true, items: interns });
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let name = '';
    let experience = '';
    let photoUrl = '';

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      name = form.get('name')?.toString()?.trim() || '';
      experience = form.get('experience')?.toString()?.trim() || '';
      const photoFile = form.get('photo') as File | null;

      if (!name) {
        return NextResponse.json({ ok: false, error: 'Nama peserta wajib diisi.' }, { status: 400 });
      }
      if (!experience) {
        return NextResponse.json({ ok: false, error: 'Pengalaman magang wajib diisi.' }, { status: 400 });
      }

      if (photoFile && typeof photoFile.arrayBuffer === 'function' && photoFile.size > 0) {
        const ext = path.extname(photoFile.name) || '.jpg';
        const filename = `intern-${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'interns');
        fs.mkdirSync(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, filename);
        const buffer = Buffer.from(await photoFile.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        photoUrl = `/images/interns/${filename}`;
      } else {
        const photoUrlField = form.get('photoUrl')?.toString()?.trim();
        photoUrl = photoUrlField || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop&crop=face';
      }
    } else {
      const body = await request.json();
      name = body.name?.trim() || '';
      experience = body.experience?.trim() || '';
      photoUrl = body.photo_url || body.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop&crop=face';

      if (!name || !experience) {
        return NextResponse.json({ ok: false, error: 'Nama dan pengalaman wajib diisi.' }, { status: 400 });
      }
    }

    const newIntern = {
      id: randomUUID(),
      name,
      experience,
      photo_url: photoUrl,
      photoUrl: photoUrl,
      is_published: true,
      created_at: new Date().toISOString()
    };

    const interns = readInterns();
    interns.unshift(newIntern);
    writeInterns(interns);

    return NextResponse.json({ ok: true, intern: newIntern, items: interns });
  } catch (err: any) {
    console.error('Error adding intern:', err);
    return NextResponse.json({ ok: false, error: err?.message || 'Gagal menyimpan data anak magang.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ ok: false, error: 'ID tidak diberikan.' }, { status: 400 });
    }

    const interns = readInterns();
    const filtered = interns.filter((item: any) => item.id !== id);
    writeInterns(filtered);

    return NextResponse.json({ ok: true, items: filtered });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Gagal menghapus anak magang.' }, { status: 500 });
  }
}
