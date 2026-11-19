import fs from 'fs';
import path from 'path';
import https from 'https';

const images = [
  {
    name: 'hero-palm.jpg',
    // Vast lush palm plantation aerial canopy with morning light
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&q=85&auto=format&fit=crop'
  },
  {
    name: 'about-palm.jpg',
    // Mature oil palm trees landscape
    url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1600&q=85&auto=format&fit=crop'
  },
  {
    name: 'plantation-1.jpg',
    // Lush green palm plantation rows
    url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1200&q=85&auto=format&fit=crop'
  },
  {
    name: 'plantation-2.jpg',
    // Sustainable agricultural estate and trees
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=85&auto=format&fit=crop'
  },
  {
    name: 'palm-fruit.jpg',
    // Vibrant tropical agricultural harvest / golden amber palm fruit harvest
    url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=1200&q=85&auto=format&fit=crop'
  },
  {
    name: 'factory.jpg',
    // Modern agro-industrial processing plant & tanks
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1400&q=85&auto=format&fit=crop'
  },
  {
    name: 'internship.jpg',
    // Young professionals / engineering & agronomy students in field with tablets & hardhats
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=85&auto=format&fit=crop'
  },
  {
    name: 'gallery-1.jpg',
    // Palm estate aerial
    url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1000&q=85&auto=format&fit=crop'
  },
  {
    name: 'gallery-2.jpg',
    // Harvesting and fresh crop
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=1000&q=85&auto=format&fit=crop'
  },
  {
    name: 'gallery-3.jpg',
    // Industrial processing & mill machinery
    url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=1000&q=85&auto=format&fit=crop'
  },
  {
    name: 'gallery-4.jpg',
    // Plant nursery & seedlings
    url: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1000&q=85&auto=format&fit=crop'
  },
  {
    name: 'gallery-5.jpg',
    // Laboratory testing & quality control
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1000&q=85&auto=format&fit=crop'
  },
  {
    name: 'gallery-6.jpg',
    // Conservation forest & sustainable flora
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1000&q=85&auto=format&fit=crop'
  },
  {
    name: 'cpo-product.jpg',
    // Golden amber refined crude palm oil
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1000&q=85&auto=format&fit=crop'
  },
  {
    name: 'palm-kernel.jpg',
    // Palm kernels & sustainable biomass
    url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1000&q=85&auto=format&fit=crop'
  }
];

const targetDir = path.resolve('public/images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`Failed to download ${url}: status code ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading high quality images into public/images/...');
  for (const item of images) {
    const dest = path.join(targetDir, item.name);
    try {
      console.log(`Downloading ${item.name}...`);
      await download(item.url, dest);
      console.log(`Saved ${item.name}`);
    } catch (err) {
      console.error(`Error downloading ${item.name}:`, err.message);
    }
  }
  console.log('Finished downloading images!');
}

run();

