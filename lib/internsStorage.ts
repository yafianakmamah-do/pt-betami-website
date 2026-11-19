import fs from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'interns.json');

export const defaultInterns = [
  {
    id: 'intern-1',
    name: 'Andi Pratama',
    experience: 'Selama menjalani magang di unit Pabrik Kelapa Sawit (PKS) BETAMI, saya dibimbing langsung oleh teknisi senior dalam memahami proses penerimaan TBS hingga pengolahan CPO. Pengalaman praktik lapangan dan pemahaman standar K3 di sini memberi bekal nyata yang sangat berharga bagi kesiapan karier saya.',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face',
    is_published: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'intern-2',
    name: 'Siti Nurhaliza',
    experience: 'Pengalaman magang di laboratorium kendali mutu (QC) BETAMI sangat membuka wawasan saya mengenai pengujian parameter asam lemak bebas (FFA), kadar air, dan standar mutu CPO. Lingkungan kerja profesional dan bimbingan yang terstruktur membuat proses belajar menjadi sangat terarah.',
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop&crop=face',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop&crop=face',
    is_published: true,
    created_at: new Date().toISOString()
  }
];

export function readInterns() {
  try {
    if (!fs.existsSync(dataFile)) {
      fs.mkdirSync(path.dirname(dataFile), { recursive: true });
      fs.writeFileSync(dataFile, JSON.stringify(defaultInterns, null, 2), 'utf-8');
      return defaultInterns;
    }
    const raw = fs.readFileSync(dataFile, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      fs.writeFileSync(dataFile, JSON.stringify(defaultInterns, null, 2), 'utf-8');
      return defaultInterns;
    }
    return parsed.map((item: any) => ({
      ...item,
      photo_url: item.photo_url || item.photoUrl,
      photoUrl: item.photoUrl || item.photo_url,
      is_published: item.is_published ?? true
    }));
  } catch {
    return defaultInterns;
  }
}

export function writeInterns(data: any[]) {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8');
}
