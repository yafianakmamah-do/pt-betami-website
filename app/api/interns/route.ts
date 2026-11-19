import { NextResponse } from 'next/server';
import { readInterns } from '@/lib/internsStorage';

export const dynamic = 'force-dynamic';

export async function GET() {
  const interns = readInterns();
  return NextResponse.json({
    ok: true,
    items: interns,
    interns: interns
  }, {
    headers: { 'Cache-Control': 'no-store' }
  });
}
