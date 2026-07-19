const fs = require('fs');
const path = require('path');
const https = require('https');
const { initDb, run, all } = require('./db.js');

const products = [
  // 1-4 (Existing but expanded)
  {
    id: 'p1', name: 'Sony WH-1000XM5 Wireless Headphones', description: 'Industry-leading noise canceling.',
    category: 'Electronics', subcategory: 'Audio', brand: 'Sony', price: 29990, originalPrice: 34990, stock: 45,
    keyword: 'headphones'
  },
  {
    id: 'p2', name: 'Garmin Fenix 7 Sapphire Solar', description: 'Rugged multisport GPS watch.',
    category: 'Electronics', subcategory: 'Wearables', brand: 'Garmin', price: 74990, originalPrice: 89990, stock: 120,
    keyword: 'smartwatch'
  },
  {
    id: 'p6', name: 'Calvin Klein Crew Neck T-Shirt', description: 'Pure cotton classic fit crew neck tee.',
    category: 'Fashion', subcategory: 'Men', brand: 'Calvin Klein', price: 1499, originalPrice: 2499, stock: 200,
    keyword: 'tshirt'
  },
  {
    id: 'p10', name: 'Ninja Professional Blender 1000W', description: 'Professional power with a sleek design.',
    category: 'Home & Kitchen', subcategory: 'Appliances', brand: 'Ninja', price: 8999, originalPrice: 12999, stock: 75,
    keyword: 'blender'
  },
  // Electronics
  { id: 'p11', name: 'Apple iPhone 15 Pro', description: 'Titanium design. A17 Pro chip.', category: 'Electronics', subcategory: 'Phones', brand: 'Apple', price: 134900, originalPrice: 134900, stock: 30, keyword: 'iphone' },
  { id: 'p12', name: 'Dell XPS 15 Laptop', description: 'Premium 15-inch laptop with OLED display.', category: 'Electronics', subcategory: 'Laptops', brand: 'Dell', price: 185000, originalPrice: 195000, stock: 15, keyword: 'laptop' },
  { id: 'p13', name: 'Logitech MX Master 3S', description: 'Advanced wireless mouse.', category: 'Electronics', subcategory: 'Accessories', brand: 'Logitech', price: 9999, originalPrice: 10999, stock: 150, keyword: 'mouse' },
  // Fashion
  { id: 'p14', name: 'Levi\'s 501 Original Jeans', description: 'Classic straight fit jeans.', category: 'Fashion', subcategory: 'Men', brand: 'Levi\'s', price: 3299, originalPrice: 4299, stock: 80, keyword: 'jeans' },
  { id: 'p15', name: 'Nike Air Force 1', description: 'Iconic sneakers for everyday wear.', category: 'Fashion', subcategory: 'Shoes', brand: 'Nike', price: 7495, originalPrice: 7495, stock: 65, keyword: 'sneakers' },
  { id: 'p16', name: 'Zara Floral Summer Dress', description: 'Lightweight floral dress for summer.', category: 'Fashion', subcategory: 'Women', brand: 'Zara', price: 2990, originalPrice: 3990, stock: 40, keyword: 'dress' },
  { id: 'p17', name: 'Ray-Ban Aviator Sunglasses', description: 'Classic aviator design.', category: 'Fashion', subcategory: 'Accessories', brand: 'Ray-Ban', price: 8500, originalPrice: 9500, stock: 110, keyword: 'sunglasses' },
  // Home & Kitchen
  { id: 'p18', name: 'IKEA Poäng Armchair', description: 'Comfortable and stylish armchair.', category: 'Home & Kitchen', subcategory: 'Furniture', brand: 'IKEA', price: 12500, originalPrice: 14000, stock: 25, keyword: 'armchair' },
  { id: 'p19', name: 'Philips Hue Smart Bulb Starter Kit', description: 'Color-changing smart LED bulbs.', category: 'Home & Kitchen', subcategory: 'Decor', brand: 'Philips', price: 14999, originalPrice: 16999, stock: 55, keyword: 'lightbulb' },
  { id: 'p20', name: 'Dyson V15 Detect Vacuum', description: 'Powerful cordless vacuum cleaner.', category: 'Home & Kitchen', subcategory: 'Appliances', brand: 'Dyson', price: 65900, originalPrice: 69900, stock: 12, keyword: 'vacuum' },
  // Sports & Outdoors
  { id: 'p21', name: 'Decathlon Quechua 2-Person Tent', description: 'Easy setup camping tent.', category: 'Sports & Outdoors', subcategory: 'Camping', brand: 'Quechua', price: 3499, originalPrice: 3999, stock: 85, keyword: 'tent' },
  { id: 'p22', name: 'Yonex Astrox 99 Badminton Racket', description: 'Professional badminton racket.', category: 'Sports & Outdoors', subcategory: 'Fitness', brand: 'Yonex', price: 15990, originalPrice: 18500, stock: 35, keyword: 'badminton' },
  { id: 'p23', name: 'Hydro Flask Water Bottle 32oz', description: 'Insulated stainless steel bottle.', category: 'Sports & Outdoors', subcategory: 'Accessories', brand: 'Hydro Flask', price: 4200, originalPrice: 4500, stock: 200, keyword: 'waterbottle' },
  // Beauty & Health
  { id: 'p24', name: 'L\'Oreal Paris Revitalift Serum', description: 'Anti-aging face serum.', category: 'Beauty & Health', subcategory: 'Skincare', brand: 'L\'Oreal', price: 999, originalPrice: 1299, stock: 140, keyword: 'serum' },
  { id: 'p25', name: 'MAC Ruby Woo Lipstick', description: 'Classic red matte lipstick.', category: 'Beauty & Health', subcategory: 'Makeup', brand: 'MAC', price: 1950, originalPrice: 1950, stock: 90, keyword: 'lipstick' },
  // Books
  { id: 'p26', name: 'Atomic Habits by James Clear', description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.', category: 'Books', subcategory: 'Non-Fiction', brand: 'Penguin', price: 550, originalPrice: 799, stock: 300, keyword: 'book' },
  { id: 'p27', name: 'The Midnight Library by Matt Haig', description: 'A novel about all the choices that go into a life well lived.', category: 'Books', subcategory: 'Fiction', brand: 'Canongate', price: 450, originalPrice: 599, stock: 150, keyword: 'library' },
  // Toys & Games
  { id: 'p28', name: 'LEGO Star Wars Millennium Falcon', description: 'Detailed LEGO set of the iconic ship.', category: 'Toys & Games', subcategory: 'Building Toys', brand: 'LEGO', price: 14999, originalPrice: 16999, stock: 20, keyword: 'lego' },
  { id: 'p29', name: 'Catan Board Game', description: 'Trade, build, and settle the island of Catan.', category: 'Toys & Games', subcategory: 'Board Games', brand: 'Catan Studio', price: 4500, originalPrice: 4999, stock: 60, keyword: 'boardgame' },
  // Additional mixed
  { id: 'p30', name: 'Sony PlayStation 5 Console', description: 'Next-gen gaming console.', category: 'Electronics', subcategory: 'Gaming', brand: 'Sony', price: 49990, originalPrice: 54990, stock: 40, keyword: 'playstation' },
  { id: 'p31', name: 'Nespresso Vertuo Next Coffee Machine', description: 'Brews a wide range of coffees at the touch of a button.', category: 'Home & Kitchen', subcategory: 'Appliances', brand: 'Nespresso', price: 15999, originalPrice: 18999, stock: 25, keyword: 'coffee' }
];

async function downloadImage(keyword, id) {
  const imgDir = path.join(__dirname, '..', 'assets', 'images');
  if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
  
  const imgPath = path.join(imgDir, `img_${id}.jpg`);
  
  // Use loremflickr for keyword based images
  const url = `https://loremflickr.com/500/500/${keyword}?random=${id}`;
  
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      // Handle redirects (loremflickr redirects to the actual image URL)
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        let location = response.headers.location;
        if (location.startsWith('/')) {
          location = 'https://loremflickr.com' + location;
        }
        https.get(location, (res) => {
          const file = fs.createWriteStream(imgPath);
          res.pipe(file);
          file.on('finish', () => { file.close(); resolve(`assets/images/img_${id}.jpg`); });
        }).on('error', (err) => { fs.unlink(imgPath, ()=>{}); reject(err); });
      } else {
        const file = fs.createWriteStream(imgPath);
        response.pipe(file);
        file.on('finish', () => { file.close(); resolve(`assets/images/img_${id}.jpg`); });
      }
    }).on('error', (err) => {
      fs.unlink(imgPath, ()=>{});
      reject(err);
    });
  });
}

async function seed() {
  await initDb();
  
  // Clear existing products
  await run('DELETE FROM products');
  
  console.log('Downloading images and seeding products...');
  for (const p of products) {
    try {
      console.log(`Processing ${p.name}...`);
      const imgPath = await downloadImage(p.keyword, p.id);
      
      const discount = p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
      const seller = { id: 'seller1', name: 'ShopVista Store' };
      
      await run(`INSERT INTO products (id, name, description, features, specifications, images, price, originalPrice, discount, rating, reviewCount, reviews, seller, category, subcategory, brand, stock, tags) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
        [p.id, p.name, p.description, JSON.stringify([]), JSON.stringify({ Brand: p.brand }), JSON.stringify([imgPath]),
        p.price, p.originalPrice, discount, 4.5, Math.floor(Math.random() * 1000) + 10, JSON.stringify([]),
        JSON.stringify(seller), p.category, p.subcategory, p.brand, p.stock, JSON.stringify([p.keyword, p.category.toLowerCase()])]
      );
    } catch (e) {
      console.error(`Failed to process ${p.name}:`, e.message);
    }
  }
  console.log('Done seeding 25 products.');
}

seed().catch(console.error);
