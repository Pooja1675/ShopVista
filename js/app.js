import { initStore, isDarkMode, getCartCount } from './store.js';
import { initRouter, registerRoutes } from './router.js';
import { renderNavbar, initNavbar } from './components/navbar.js';
import { renderFooter } from './components/footer.js';

// Import all pages (assuming they exist or will exist)
import { render as renderHome, init as initHome } from './pages/home.js';
import { render as renderProducts, init as initProducts } from './pages/productList.js';
import { render as renderProductDetail, init as initProductDetail } from './pages/productDetail.js';
import { render as renderLogin, init as initLogin } from './pages/login.js';
import { render as renderCart, init as initCart } from './pages/cart.js';
import { render as renderWishlist, init as initWishlist } from './pages/wishlist.js';
import { render as renderOrders, init as initOrders } from './pages/orders.js';
import { render as renderAddresses, init as initAddresses } from './pages/addresses.js';
import { render as renderCheckout, init as initCheckout } from './pages/checkout.js';
import { render as renderSearch, init as initSearch } from './pages/search.js';
import { render as renderCategory, init as initCategory } from './pages/category.js';
import { render as renderSellerDashboard, init as initSellerDashboard } from './pages/seller/dashboard.js';
import { render as renderSellerProducts, init as initSellerProducts } from './pages/seller/products.js';
import { render as renderAddProduct, init as initAddProduct } from './pages/seller/addProduct.js';
import { render as renderSellerOrders, init as initSellerOrders } from './pages/seller/orders.js';

async function init() {
  // Initialize store (seeds data if first run)
  await initStore();
  
  // Apply dark mode if saved
  if (isDarkMode()) document.body.classList.add('dark-mode');
  
  // Render navbar and footer
  const navContainer = document.getElementById('navbar-container');
  const footerContainer = document.getElementById('footer-container');
  if (navContainer) navContainer.innerHTML = renderNavbar();
  if (footerContainer) footerContainer.innerHTML = renderFooter();
  if (navContainer) initNavbar();
  
  // Register routes
  registerRoutes({
    '#/': { render: renderHome, init: initHome },
    '#/home': { render: renderHome, init: initHome },
    '#/products': { render: renderProducts, init: initProducts },
    '#/product/:id': { render: renderProductDetail, init: initProductDetail },
    '#/login': { render: renderLogin, init: initLogin },
    '#/cart': { render: renderCart, init: initCart, requiresAuth: true },
    '#/wishlist': { render: renderWishlist, init: initWishlist, requiresAuth: true },
    '#/orders': { render: renderOrders, init: initOrders, requiresAuth: true },
    '#/addresses': { render: renderAddresses, init: initAddresses, requiresAuth: true },
    '#/checkout': { render: renderCheckout, init: initCheckout, requiresAuth: true },
    '#/search': { render: renderSearch, init: initSearch },
    '#/category/:name': { render: renderCategory, init: initCategory },
    '#/seller': { render: renderSellerDashboard, init: initSellerDashboard, requiresAuth: true, requiresSeller: true },
    '#/seller/products': { render: renderSellerProducts, init: initSellerProducts, requiresAuth: true, requiresSeller: true },
    '#/seller/add-product': { render: renderAddProduct, init: initAddProduct, requiresAuth: true, requiresSeller: true },
    '#/seller/edit-product/:id': { render: renderAddProduct, init: initAddProduct, requiresAuth: true, requiresSeller: true },
    '#/seller/orders': { render: renderSellerOrders, init: initSellerOrders, requiresAuth: true, requiresSeller: true },
  });
  
  // Initialize router (handles initial route)
  initRouter();
  
  // Listen for auth changes to update navbar
  window.addEventListener('auth-changed', () => {
    if (navContainer) {
      navContainer.innerHTML = renderNavbar();
      initNavbar();
    }
  });
  window.addEventListener('cart-updated', () => {
    // Update cart badge in navbar
    const badge = document.querySelector('.navbar__cart-badge');
    if (badge) {
      const count = getCartCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  });
}

// Start the app
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
