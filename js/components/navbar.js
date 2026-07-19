import { getUser, isLoggedIn, isSeller, getCartCount, getWishlist, getCategories, isDarkMode, toggleDarkMode } from '../store.js';
import { navigate } from '../router.js';

export function renderNavbar() {
  const user = getUser();
  const cartCount = getCartCount();
  const wishlistCount = isLoggedIn() ? getWishlist().length : 0;
  const categories = getCategories();
  
  return `
    <nav class="navbar">
      <div class="navbar__container container flex-between">
        <a href="#/home" class="navbar__logo flex-center">
          <img src="assets/logo.png" alt="ShopVista" height="40" style="margin-right:10px; max-height:40px; width:auto; border-radius: 8px;">
          <h2 class="text-primary font-bold">ShopVista</h2>
        </a>
        
        <form id="nav-search-form" class="navbar__search flex desktop-only">
          <input type="text" id="nav-search-input" class="navbar__search-input" placeholder="Search for products, brands...">
          <button type="submit" class="navbar__search-btn btn btn-primary">
            <i data-lucide="search"></i>
          </button>
        </form>
        
        <div class="navbar__actions flex-center flex-gap">
          <button id="theme-toggle" class="navbar__action-btn btn-icon" title="Toggle Theme">
            <i data-lucide="${isDarkMode() ? 'sun' : 'moon'}"></i>
          </button>
          
          <a href="#/wishlist" class="navbar__action-btn btn-icon position-relative" title="Wishlist">
            <i data-lucide="heart"></i>
            <span class="navbar__badge badge badge-danger" id="nav-wishlist-badge" style="display: ${wishlistCount > 0 ? 'flex' : 'none'}">${wishlistCount}</span>
          </a>
          
          <a href="#/cart" class="navbar__action-btn btn-icon position-relative" title="Cart">
            <i data-lucide="shopping-cart"></i>
            <span class="navbar__badge navbar__cart-badge badge badge-primary" style="display: ${cartCount > 0 ? 'flex' : 'none'}">${cartCount}</span>
          </a>
          
          ${isLoggedIn() ? `
            <div class="navbar__user-menu position-relative">
              <button class="navbar__action-btn btn-icon" id="user-menu-btn">
                <i data-lucide="user"></i>
              </button>
              <div class="navbar__dropdown" id="user-dropdown">
                <div class="p-2 border-bottom">
                  <p class="font-bold">${user.name}</p>
                  <p class="text-sm text-muted truncate">${user.email}</p>
                </div>
                <div class="p-2">
                  ${isSeller() ? `<a href="#/seller" class="dropdown-item"><i data-lucide="layout-dashboard"></i> Seller Dashboard</a>` : ''}
                  <a href="#/orders" class="dropdown-item"><i data-lucide="package"></i> My Orders</a>
                  <a href="#/addresses" class="dropdown-item"><i data-lucide="map-pin"></i> My Addresses</a>
                  <a href="#/wishlist" class="dropdown-item"><i data-lucide="heart"></i> Wishlist</a>
                  <button id="nav-logout-btn" class="dropdown-item text-danger text-left w-full"><i data-lucide="log-out"></i> Logout</button>
                </div>
              </div>
            </div>
          ` : `
            <a href="#/login" class="btn btn-primary btn-sm">Login</a>
          `}
          
          <button class="navbar__mobile-toggle btn-icon mobile-only" id="mobile-menu-btn">
            <i data-lucide="menu"></i>
          </button>
        </div>
      </div>
      
      <!-- Mobile Search (Visible on small screens) -->
      <div class="container mobile-only p-2">
         <form id="mobile-search-form" class="navbar__search flex w-full">
          <input type="text" id="mobile-search-input" class="navbar__search-input w-full" placeholder="Search products...">
          <button type="submit" class="navbar__search-btn btn btn-primary">
            <i data-lucide="search"></i>
          </button>
        </form>
      </div>
      
      <div class="navbar__categories border-top desktop-only">
        <div class="container flex-center flex-gap scroll-x p-2">
          ${categories.map(c => `
            <a href="#/category/${encodeURIComponent(c.name)}" class="category-link flex-center flex-gap text-sm">
              ${c.name}
            </a>
          `).join('')}
        </div>
      </div>
    </nav>
  `;
}

export function initNavbar() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  const searchForm = document.getElementById('nav-search-form');
  const searchInput = document.getElementById('nav-search-input');
  
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = searchInput.value.trim();
      if (q) {
        navigate(`#/search?q=${encodeURIComponent(q)}`);
      }
    });
  }
  
  const mobileSearchForm = document.getElementById('mobile-search-form');
  const mobileSearchInput = document.getElementById('mobile-search-input');
  
  if (mobileSearchForm) {
    mobileSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = mobileSearchInput.value.trim();
      if (q) {
        navigate(`#/search?q=${encodeURIComponent(q)}`);
      }
    });
  }
  
  const userBtn = document.getElementById('user-menu-btn');
  const dropdown = document.getElementById('user-dropdown');
  
  if (userBtn && dropdown) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('navbar__dropdown--active');
    });
    
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && e.target !== userBtn) {
        dropdown.classList.remove('navbar__dropdown--active');
      }
    });
  }
  
  const logoutBtn = document.getElementById('nav-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      const { logout } = await import('../store.js');
      logout();
      navigate('#/home');
    });
  }
  
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = toggleDarkMode();
      themeToggle.innerHTML = `<i data-lucide="${next ? 'sun' : 'moon'}"></i>`;
      if (window.lucide) window.lucide.createIcons();
    });
  }
  
  // Listen for wishlist updates
  window.addEventListener('wishlist-updated', () => {
    const badge = document.getElementById('nav-wishlist-badge');
    if (badge && isLoggedIn()) {
      const count = getWishlist().length;
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  });
}
