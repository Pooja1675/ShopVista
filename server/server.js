const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb, get, all, run } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend static files from the project root
app.use(express.static(path.join(__dirname, '..')));

// Utility to parse JSON fields from DB
const parseProduct = (p) => ({
  ...p,
  features: JSON.parse(p.features || '[]'),
  specifications: JSON.parse(p.specifications || '{}'),
  images: JSON.parse(p.images || '[]'),
  reviews: JSON.parse(p.reviews || '[]'),
  seller: JSON.parse(p.seller || '{}'),
  tags: JSON.parse(p.tags || '[]')
});

// Products API
app.get('/api/products', async (req, res) => {
  try {
    const products = await all('SELECT * FROM products');
    res.json(products.map(parseProduct));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  const p = req.body;
  const id = 'p_' + Date.now();
  try {
    await run(`INSERT INTO products (id, name, description, features, specifications, images, price, originalPrice, discount, rating, reviewCount, reviews, seller, category, subcategory, brand, stock, tags) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [id, p.name, p.description, JSON.stringify(p.features||[]), JSON.stringify(p.specifications||{}), JSON.stringify(p.images||[]),
      p.price, p.originalPrice, p.discount, p.rating||0, p.reviewCount||0, JSON.stringify(p.reviews||[]),
      JSON.stringify(p.seller), p.category, p.subcategory, p.brand, p.stock, JSON.stringify(p.tags||[])]
    );
    res.json({ id, ...p });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const p = req.body;
  try {
    await run(`UPDATE products SET name=?, description=?, features=?, specifications=?, images=?, price=?, originalPrice=?, discount=?, category=?, subcategory=?, brand=?, stock=?, tags=? WHERE id=?`, 
      [p.name, p.description, JSON.stringify(p.features||[]), JSON.stringify(p.specifications||{}), JSON.stringify(p.images||[]),
      p.price, p.originalPrice, p.discount, p.category, p.subcategory, p.brand, p.stock, JSON.stringify(p.tags||[]), id]
    );
    res.json({ id, ...p });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await run('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth API
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  const id = 'u_' + Date.now();
  const avatar = role === 'seller' ? '🏪' : '👤';
  try {
    await run('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)', [id, name, email, password, role, avatar]);
    res.json({ id, name, email, role, avatar });
  } catch (err) {
    res.status(500).json({ error: 'Email already exists or error occurred' });
  }
});

// Orders API
app.get('/api/orders', async (req, res) => {
  const { userId } = req.query;
  try {
    const query = userId ? 'SELECT * FROM orders WHERE userId = ?' : 'SELECT * FROM orders';
    const params = userId ? [userId] : [];
    const orders = await all(query, params);
    res.json(orders.map(o => ({
      ...o,
      items: JSON.parse(o.items || '[]'),
      address: JSON.parse(o.address || '{}')
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  const o = req.body;
  const id = 'ORD-' + Date.now();
  try {
    await run(`INSERT INTO orders VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [id, o.userId, JSON.stringify(o.items||[]), o.subtotal, o.discount, o.delivery, o.total, o.status, o.date, JSON.stringify(o.address||{}), o.paymentMethod]
    );
    res.json({ id, ...o });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    await run('UPDATE orders SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Addresses API
app.get('/api/addresses', async (req, res) => {
  try {
    const addresses = await all('SELECT * FROM addresses WHERE userId = ?', [req.query.userId]);
    res.json(addresses.map(a => ({...a, isDefault: !!a.isDefault})));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/addresses', async (req, res) => {
  const a = req.body;
  const id = 'a_' + Date.now();
  try {
    if (a.isDefault) {
      await run('UPDATE addresses SET isDefault = 0 WHERE userId = ?', [a.userId]);
    }
    await run(`INSERT INTO addresses VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [id, a.userId, a.name, a.phone, a.line1, a.line2, a.city, a.state, a.pincode, a.type, a.isDefault ? 1 : 0]
    );
    res.json({ id, ...a });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SPA catch-all: serve index.html for any non-API route
app.get('{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 3000;
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`ShopVista running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize DB:', err);
});
