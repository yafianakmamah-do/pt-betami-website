import fs from 'fs';
import { sendEmail } from '../../../lib/microsoftGraph';
import path from 'path';
import { NextResponse } from 'next/server';

type Application = {
  id: string;
  name: string;
  institution: string;
  major: string;
  email: string;
  phone: string;
  division: string;
  duration: string;
  message: string;
  submittedAt: string;
};

const dataFile = path.join(process.cwd(), 'data', 'internship-applications.json');

function readData(): Application[] {
  try {
    const raw = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(raw) as Application[];
  } catch {
    return [];
  }
}

function writeData(data: Application[]) {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * POST /api/magang
 * Expected payload (JSON) includes a hidden `botField` for honeypot.
 * Validation mirrors the front‑end anti‑robot captcha (handled client‑side).
 */
export async function POST(request: Request) {
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
    } = payload as any;

    const errors: string[] = [];
    // Honeypot – must be empty
    if (botField && botField.trim().length > 0) errors.push('Bot detected');
    if (!name || name.trim().length < 2) errors.push('Nama harus diisi.');
    if (!institution) errors.push('Instansi wajib diisi.');
    if (!major) errors.push('Jurusan wajib diisi.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Alamat email tidak valid.');
    if (!phone || !/^\+?\d{7,15}$/.test(phone)) errors.push('Nomor telepon tidak valid.');
    if (!division) errors.push('Divisi wajib dipilih.');
    if (!duration) errors.push('Durasi wajib dipilih.');
    if (!message || message.trim().length < 5) errors.push('Pesan wajib diisi.');

    if (errors.length) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    const newApp: Application = {
      id: crypto.randomUUID(),
      name: name.trim(),
      institution: institution.trim(),
      major: major.trim(),
      email: email.trim(),
      phone: phone.trim(),
      division,
      duration,
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };

    const data = readData();
    data.push(newApp);
    writeData(data);
    await sendEmail(process.env.GRAPH_RECIPIENT || "example@outlook.com", "New Internship Application", `A new application has been submitted:<br/>Name: ${newApp.name}<br/>Institution: ${newApp.institution}<br/>Email: ${newApp.email}<br/>Phone: ${newApp.phone}<br/>Division: ${newApp.division}<br/>Duration: ${newApp.duration}<br/>Message: ${newApp.message}`);
    return NextResponse.json({ ok: true, application: newApp });
  } catch (e) {
    return NextResponse.json({ ok: false, errors: ['Server error'] }, { status: 500 });
  }
}

/** Simple GET for admin preview (no auth for demo). */
export async function GET() {
  const apps = readData();
  return NextResponse.json(apps);
}
