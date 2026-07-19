import { seedData } from './data.js';

const API_URL = '/api';

// Simple event dispatcher for reactivity
function dispatch(event, detail = {}) {
  window.dispatchEvent(new CustomEvent(event, { detail }));
}

// Global state cache (since it's an SPA without React/Vue, we keep some state here)
export const state = {
  products: [],
  user: null,
  cart: [],
  wishlist: [],
  addresses: [],
  orders: [],
  sellerOrders: []
};

// --- Initialization ---
export async function initStore() {
  // Load initial session state
  const storedUser = localStorage.getItem('shopvista_currentUser');
  if (storedUser) {
    try { state.user = JSON.parse(storedUser); } catch(e){}
  }
  
  // Fetch initial data
  await fetchProducts();
  if (state.user) {
    await fetchAddresses();
    await fetchOrders();
    if (state.user.role === 'seller') {
      await fetchSellerOrders();
    }
    // In a real app we'd fetch user cart/wishlist from DB, but for now we'll rely on local storage for guest cart or simple DB for orders
    const storedCart = localStorage.getItem(`shopvista_cart_${state.user.id}`);
    if (storedCart) state.cart = JSON.parse(storedCart);
    const storedWishlist = localStorage.getItem(`shopvista_wishlist_${state.user.id}`);
    if (storedWishlist) state.wishlist = JSON.parse(storedWishlist);
  }
}

export function formatPrice(price) {
  return '₹' + Number(price).toLocaleString('en-IN');
}

// --- Products ---
export async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    state.products = await res.json();
    dispatch('products-updated');
    return state.products;
  } catch (err) {
    console.error('Failed to fetch products', err);
    return [];
  }
}

export function getProducts() {
  return state.products;
}

export function getProductById(id) {
  return state.products.find(p => p.id === id) || null;
}

export function getProductsByCategory(category) {
  return state.products.filter(p => p.category === category);
}

export function searchProducts(query) {
  if (!query) return [];
  const q = query.toLowerCase();
  return state.products.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.category.toLowerCase().includes(q) || 
    p.brand.toLowerCase().includes(q) || 
    p.description.toLowerCase().includes(q)
  );
}

export function getCategories() {
  return [
    {name: 'Electronics', icon: 'smartphone', image: 'assets/images/img_0pfhb140i.jpg'},
    {name: 'Fashion', icon: 'shirt', image: 'assets/images/img_6g79eaexm.jpg'},
    {name: 'Home & Kitchen', icon: 'home', image: 'assets/images/img_9wqnqsjyu.jpg'},
    {name: 'Books', icon: 'book-open', image: 'assets/images/img_akm06bo66.jpg'},
    {name: 'Sports', icon: 'dumbbell', image: 'assets/images/img_e39dcxgk8.jpg'},
    {name: 'Beauty', icon: 'sparkles', image: 'assets/images/img_g4featxs0.jpg'},
    {name: 'Toys', icon: 'gamepad-2', image: 'assets/images/img_wabzls6d8.jpg'},
    {name: 'Groceries', icon: 'apple', image: 'assets/images/img_z3l7b66rg.jpg'}
  ];
}

// --- Seller Product Management ---
export async function addProduct(product) {
  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    const newProduct = await res.json();
    await fetchProducts(); // refresh
    return newProduct;
  } catch(e) { console.error(e); }
}

export async function updateProduct(id, updates) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const updated = await res.json();
    await fetchProducts();
    return updated;
  } catch(e) { console.error(e); }
}

export async function deleteProduct(id) {
  try {
    await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    await fetchProducts();
  } catch(e) { console.error(e); }
}

export function getSellerProducts() {
  const user = getUser();
  if (!user || user.role !== 'seller') return [];
  return state.products.filter(p => p.seller && p.seller.id === user.id);
}

// --- Auth ---
export function getUser() {
  return state.user;
}

export async function login(email, password) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const user = await res.json();
      state.user = user;
      localStorage.setItem('shopvista_currentUser', JSON.stringify(user));
      await initStore(); // reload specific user data
      dispatch('auth-changed');
      return user;
    }
    return null;
  } catch(e) { console.error(e); return null; }
}

export async function signup(name, email, password, role) {
  try {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    if (res.ok) {
      const user = await res.json();
      state.user = user;
      localStorage.setItem('shopvista_currentUser', JSON.stringify(user));
      await initStore();
      dispatch('auth-changed');
      return user;
    }
    throw new Error('Signup failed');
  } catch(e) { throw e; }
}

export function logout() {
  state.user = null;
  state.cart = [];
  state.wishlist = [];
  state.addresses = [];
  localStorage.removeItem('shopvista_currentUser');
  dispatch('auth-changed');
}

export function isLoggedIn() {
  return !!state.user;
}

export function isSeller() {
  return state.user?.role === 'seller';
}

// --- Cart (Local Storage for simplicity) ---
function saveCart() {
  if (state.user) localStorage.setItem(`shopvista_cart_${state.user.id}`, JSON.stringify(state.cart));
}

export function getCart() {
  return state.cart.map(item => ({
    ...item,
    product: getProductById(item.productId)
  })).filter(item => item.product);
}

export function addToCart(productId, qty = 1) {
  if (!state.user) return;
  const existing = state.cart.find(i => i.productId === productId);
  if (existing) existing.quantity += qty;
  else state.cart.push({ productId, quantity: qty });
  saveCart();
  dispatch('cart-updated');
}

export function removeFromCart(productId) {
  if (!state.user) return;
  state.cart = state.cart.filter(i => i.productId !== productId);
  saveCart();
  dispatch('cart-updated');
}

export function updateCartQty(productId, qty) {
  if (!state.user) return;
  if (qty <= 0) {
    state.cart = state.cart.filter(i => i.productId !== productId);
  } else {
    const item = state.cart.find(i => i.productId === productId);
    if (item) item.quantity = qty;
  }
  saveCart();
  dispatch('cart-updated');
}

export function getCartCount() {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal() {
  let subtotal = 0, discount = 0;
  getCart().forEach(item => {
    subtotal += item.product.price * item.quantity;
    if (item.product.originalPrice > item.product.price) {
      discount += (item.product.originalPrice - item.product.price) * item.quantity;
    }
  });
  const delivery = subtotal > 500 ? 0 : 40;
  const total = subtotal + delivery;
  return { subtotal, discount, delivery, total };
}

export function clearCart() {
  if (!state.user) return;
  state.cart = [];
  saveCart();
  dispatch('cart-updated');
}

// --- Wishlist (Local Storage for simplicity) ---
function saveWishlist() {
  if (state.user) localStorage.setItem(`shopvista_wishlist_${state.user.id}`, JSON.stringify(state.wishlist));
}

export function getWishlist() {
  return state.wishlist.map(id => getProductById(id)).filter(Boolean);
}

export function toggleWishlist(productId) {
  if (!state.user) return false;
  const index = state.wishlist.indexOf(productId);
  let added = false;
  if (index !== -1) state.wishlist.splice(index, 1);
  else { state.wishlist.push(productId); added = true; }
  saveWishlist();
  dispatch('wishlist-updated');
  return added;
}

export function isInWishlist(productId) {
  return state.user ? state.wishlist.includes(productId) : false;
}

// --- Orders ---
export async function fetchOrders() {
  if (!state.user) return [];
  try {
    const res = await fetch(`${API_URL}/orders?userId=${state.user.id}`);
    state.orders = await res.json();
    return state.orders;
  } catch(e) { console.error(e); return []; }
}

export function getOrders() {
  return state.orders;
}

export async function fetchSellerOrders() {
  if (!state.user || state.user.role !== 'seller') return [];
  try {
    const res = await fetch(`${API_URL}/orders`);
    const allOrders = await res.json();
    state.sellerOrders = allOrders.filter(order => order.items.some(item => item.sellerId === state.user.id));
    return state.sellerOrders;
  } catch(e) { console.error(e); return []; }
}

export function getSellerOrders() {
  return state.sellerOrders;
}

export async function placeOrder(addressId, paymentMethod) {
  if (!state.user || state.cart.length === 0) return null;
  const address = state.addresses.find(a => a.id === addressId);
  const totals = getCartTotal();
  const items = getCart().map(item => ({
    productId: item.product.id, name: item.product.name, image: item.product.images[0],
    quantity: item.quantity, price: item.product.price, sellerId: item.product.seller.id
  }));

  const orderData = {
    userId: state.user.id, items,
    subtotal: totals.subtotal, discount: totals.discount, delivery: totals.delivery, total: totals.total,
    status: 'placed', date: new Date().toISOString(), address, paymentMethod
  };

  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const order = await res.json();
    clearCart();
    dispatch('order-placed', { order });
    return order;
  } catch(e) { console.error(e); return null; }
}

export async function updateOrderStatus(orderId, status) {
  try {
    await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  } catch(e) { console.error(e); }
}

// --- Addresses ---
export async function fetchAddresses() {
  if (!state.user) return [];
  try {
    const res = await fetch(`${API_URL}/addresses?userId=${state.user.id}`);
    state.addresses = await res.json();
    return state.addresses;
  } catch(e) { console.error(e); return []; }
}

export function getAddresses() {
  return state.addresses;
}

export async function addAddress(address) {
  if (!state.user) return null;
  try {
    const res = await fetch(`${API_URL}/addresses`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...address, userId: state.user.id, isDefault: state.addresses.length === 0 || address.isDefault })
    });
    await fetchAddresses();
    return await res.json();
  } catch(e) { console.error(e); return null; }
}

export function getDefaultAddress() {
  return state.addresses.find(a => a.isDefault) || state.addresses[0] || null;
}

// --- Theme ---
export function isDarkMode() {
  return localStorage.getItem('shopvista_darkMode') === 'true';
}

export function toggleDarkMode() {
  const next = !isDarkMode();
  localStorage.setItem('shopvista_darkMode', next);
  if (next) document.body.classList.add('dark-mode');
  else document.body.classList.remove('dark-mode');
  dispatch('theme-changed');
  return next;
}
export async function addReview(productId, review) { const p = getProductById(productId); if(p) { p.reviews = p.reviews || []; p.reviews.push(review); await updateProduct(productId, p); } }
export async function updateAddress(id, addr) { }
export async function deleteAddress(id) { }
export async function setDefaultAddress(id) { }
