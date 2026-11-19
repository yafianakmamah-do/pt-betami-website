// Next.js 15 route for contact form validation & simple anti‑bot
// Accepts POST { name, email, phone, message, botField }
// Returns { ok: true } or { ok: false, errors: string[] }

import { NextResponse } from 'next/server';

function isValidPhone(phone: string): boolean {
  // Allows optional leading + and 7‑15 digits
  return /^\+?\d{7,15}$/.test(phone.trim());
}

function isValidGmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim()) && email.trim().toLowerCase().endsWith('@gmail.com');
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, phone, message, botField } = data;
    const errors: string[] = [];

    // Simple honeypot anti‑bot: field must be empty
    if (botField && botField.trim().length > 0) {
      errors.push('Bot detected.');
    }

    if (!name || name.trim().length < 2) errors.push('Nama harus diisi.');
    if (!email || !isValidGmail(email)) errors.push('Alamat Gmail tidak valid.');
    if (!phone || !isValidPhone(phone)) errors.push('Nomor telepon tidak valid.');
    if (!message || message.trim().length < 10) errors.push('Pesan terlalu singkat.');

    if (errors.length) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    // In real project you would forward the data (e.g., send email).
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, errors: ['Server error'] }, { status: 500 });
  }
}
