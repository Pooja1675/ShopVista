const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'shopvista.db');
const db = new sqlite3.Database(dbPath);

function initDb() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users Table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT,
        avatar TEXT
      )`);

      // Products Table
      db.run(`CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT,
        description TEXT,
        features TEXT, -- JSON array
        specifications TEXT, -- JSON object
        images TEXT, -- JSON array
        price REAL,
        originalPrice REAL,
        discount INTEGER,
        rating REAL,
        reviewCount INTEGER,
        reviews TEXT, -- JSON array
        seller TEXT, -- JSON object {id, name}
        category TEXT,
        subcategory TEXT,
        brand TEXT,
        stock INTEGER,
        tags TEXT -- JSON array
      )`);

      // Orders Table
      db.run(`CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        userId TEXT,
        items TEXT, -- JSON array
        subtotal REAL,
        discount REAL,
        delivery REAL,
        total REAL,
        status TEXT,
        date TEXT,
        address TEXT, -- JSON object
        paymentMethod TEXT
      )`);

      // Addresses Table
      db.run(`CREATE TABLE IF NOT EXISTS addresses (
        id TEXT PRIMARY KEY,
        userId TEXT,
        name TEXT,
        phone TEXT,
        line1 TEXT,
        line2 TEXT,
        city TEXT,
        state TEXT,
        pincode TEXT,
        type TEXT,
        isDefault INTEGER
      )`);

      // Check if we need to seed
      db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
        if (err) return reject(err);
        if (row.count === 0) {
          seedDatabase().then(resolve).catch(reject);
        } else {
          resolve();
        }
      });
    });
  });
}

function seedDatabase() {
  return new Promise((resolve, reject) => {
    console.log('Seeding database...');
    
    // Hardcoded seed data (adapted from data.js)
    const users = [
      { id: 'customer1', name: 'Customer', email: 'customer@shopvista.com', password: 'password123', role: 'customer', avatar: '👤' },
      { id: 'seller1', name: 'ShopVista Store', email: 'seller@shopvista.com', password: 'seller123', role: 'seller', avatar: '🏪' }
    ];

    const products = [
      {
        id: 'p1', name: 'Sony WH-1000XM5 Wireless Headphones', description: 'Industry-leading noise canceling with two processors and eight microphones.', features: ['Auto Noise Canceling Optimizer', '30-hour battery life', 'Multi-point connection'], specifications: { 'Brand': 'Sony', 'Weight': '250g', 'Connectivity': 'Bluetooth 5.2' }, images: ['assets/images/img_f3v9fafn3.jpg'], price: 29990, originalPrice: 34990, discount: 14, rating: 4.8, reviewCount: 1234,
        reviews: [{ id: 'r1', userName: 'Rahul S.', rating: 5, title: 'Best ANC headphones', comment: 'The noise cancellation is unreal!', date: '2024-12-15', helpful: 42 }],
        seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Electronics', subcategory: 'Audio', brand: 'Sony', stock: 45, tags: ['wireless', 'headphones', 'sony']
      },
      {
        id: 'p2', name: 'Garmin Fenix 7 Sapphire Solar', description: 'Rugged multisport GPS watch with solar charging lens.', features: ['Built-in sports apps', 'Heart rate & Pulse Ox', 'Up to 22 days battery'], specifications: { 'Brand': 'Garmin', 'Screen': '1.3"', 'Water Rating': '10 ATM' }, images: ['assets/images/img_m7j0h97fm.jpg'], price: 74990, originalPrice: 89990, discount: 16, rating: 4.7, reviewCount: 456,
        reviews: [{ id: 'r2', userName: 'Amit K.', rating: 5, title: 'Beast of a watch', comment: 'Battery lasts forever.', date: '2024-11-20', helpful: 12 }],
        seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Electronics', subcategory: 'Wearables', brand: 'Garmin', stock: 120, tags: ['smartwatch', 'fitness', 'garmin']
      },
      {
        id: 'p6', name: 'Calvin Klein Crew Neck T-Shirt', description: 'Pure cotton classic fit crew neck tee.', features: ['100% Cotton', 'Classic Fit', 'Machine Washable'], specifications: { 'Brand': 'Calvin Klein', 'Color': 'White', 'Size': 'M, L, XL' }, images: ['assets/images/img_nrq64yyf1.jpg'], price: 1499, originalPrice: 2499, discount: 40, rating: 4.3, reviewCount: 560,
        reviews: [{ id: 'r6', userName: 'Neha', rating: 4, title: 'Good basic tee', comment: 'Soft and comfortable.', date: '2025-02-10', helpful: 5 }],
        seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Fashion', subcategory: 'Men', brand: 'Calvin Klein', stock: 200, tags: ['tshirt', 'clothing', 'men']
      },
      {
        id: 'p10', name: 'Ninja Professional Blender 1000W', description: 'Professional power with a sleek design.', features: ['1000 watts of power', '72 oz Total Crushing Pitcher', 'Ice crushing technology'], specifications: { 'Brand': 'Ninja', 'Capacity': '2.1L', 'Material': 'BPA-free plastic' }, images: ['assets/images/img_wv3v7akcv.jpg'], price: 8999, originalPrice: 12999, discount: 30, rating: 4.6, reviewCount: 4210,
        reviews: [{ id: 'r10', userName: 'Pooja', rating: 5, title: 'Amazing blender', comment: 'Makes perfect smoothies.', date: '2025-02-05', helpful: 31 }],
        seller: { id: 'seller1', name: 'ShopVista Store' }, category: 'Home & Kitchen', subcategory: 'Appliances', brand: 'Ninja', stock: 75, tags: ['blender', 'kitchen', 'ninja']
      }
    ];

    const stmtUser = db.prepare('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)');
    users.forEach(u => stmtUser.run(u.id, u.name, u.email, u.password, u.role, u.avatar));
    stmtUser.finalize();

    const stmtProd = db.prepare(`INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    products.forEach(p => {
      stmtProd.run(
        p.id, p.name, p.description, JSON.stringify(p.features), JSON.stringify(p.specifications), JSON.stringify(p.images),
        p.price, p.originalPrice, p.discount, p.rating, p.reviewCount, JSON.stringify(p.reviews),
        JSON.stringify(p.seller), p.category, p.subcategory, p.brand, p.stock, JSON.stringify(p.tags)
      );
    });
    stmtProd.finalize();

    resolve();
  });
}

// Database helper functions
const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err) {
    if (err) reject(err);
    else resolve(this);
  });
});

const get = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) reject(err);
    else resolve(row);
  });
});

const all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

module.exports = { db, initDb, run, get, all };
