const fs = require('fs');
const https = require('https');
const path = require('path');

const dataFile = path.join(__dirname, 'js', 'data.js');
const storeFile = path.join(__dirname, 'js', 'store.js');
const assetsDir = path.join(__dirname, 'assets', 'images');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        // Handle redirect
        https.get(res.headers.location, (redirectRes) => {
          const fileStream = fs.createWriteStream(filepath);
          redirectRes.pipe(fileStream);
          fileStream.on('finish', () => { fileStream.close(); resolve(); });
        }).on('error', reject);
      } else {
        const fileStream = fs.createWriteStream(filepath);
        res.pipe(fileStream);
        fileStream.on('finish', () => { fileStream.close(); resolve(); });
      }
    }).on('error', reject);
  });
}

async function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const regex = /https:\/\/images\.unsplash\.com\/[^'"\s]+/g;
  const urls = [...new Set(content.match(regex) || [])];
  
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    // Create a filename based on a hash or simple index, but let's use a unique name
    const ext = url.includes('?') ? '.jpg' : path.extname(url.split('?')[0]) || '.jpg';
    const filename = `img_${Math.random().toString(36).substr(2, 9)}${ext}`;
    const localPath = `assets/images/${filename}`;
    const fullPath = path.join(assetsDir, filename);
    
    console.log(`Downloading ${url} -> ${fullPath}`);
    await downloadImage(url, fullPath);
    
    // Replace in content
    content = content.split(url).join(localPath);
  }
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${filePath}`);
}

async function run() {
  await processFile(dataFile);
  await processFile(storeFile);
  console.log('Done downloading images.');
}

run().catch(console.error);
