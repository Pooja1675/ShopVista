import { getProductsByCategory, getCategories } from '../store.js';
import { renderProductCard, initProductCards } from '../components/productCard.js';
import { renderStars } from '../components/starRating.js';

let state = {
  products: [],
  filteredProducts: [],
  categoryName: '',
  page: 1,
  itemsPerPage: 8,
  filters: {
    brands: new Set(),
    minPrice: '',
    maxPrice: '',
    minRating: 0
  },
  sortBy: 'relevance',
  viewMode: 'grid'
};

export function render(params) {
  const catName = params.name ? decodeURIComponent(params.name) : '';
  
  if (catName !== state.categoryName) {
    state.categoryName = catName;
    state.products = getProductsByCategory(catName);
    state.filteredProducts = [...state.products];
    state.page = 1;
    state.filters = { brands: new Set(), minPrice: '', maxPrice: '', minRating: 0 };
    state.sortBy = 'relevance';
  }

  const category = getCategories().find(c => c.name.toLowerCase() === catName.toLowerCase());
  const brands = [...new Set(state.products.map(p => p.brand))].filter(Boolean);

  return `
    <div class="category-page">
      <!-- Category Header -->
      <div class="category-header" style="position:relative; overflow:hidden; background: var(--gradient-primary); padding: 3.5rem 1.5rem;">
        <div style="position:absolute; inset:0; background-image: url('${category ? category.image : ''}'); background-size:cover; background-position:center; opacity:0.35;"></div>
        <div style="position:absolute; inset:0; background: linear-gradient(135deg, rgba(37,99,235,0.85) 0%, rgba(124,58,237,0.85) 100%);"></div>
        <div class="container" style="position:relative; z-index:1; text-align:center; color:white;">
          ${category ? `<i data-lucide="${category.icon}" style="width:3rem; height:3rem; margin:0 auto 1rem; display:block;"></i>` : ''}
          <h1 class="category-header__title" style="color:white;">${catName}</h1>
          <p class="category-header__count" style="color:rgba(255,255,255,0.9); font-size:1.1rem;">${state.products.length} products available</p>
        </div>
      </div>

      <div class="container mx-auto px-5 pb-12">
        <div class="breadcrumb text-sm text-text-muted mb-6">
          <a href="#/" class="hover:text-primary">Home</a> <i data-lucide="chevron-right" class="inline w-3 h-3"></i> 
          <a href="#/products" class="hover:text-primary">Products</a> <i data-lucide="chevron-right" class="inline w-3 h-3"></i> 
          <span class="text-text-primary font-semibold">${catName}</span>
        </div>

        <div class="product-list-page">
          <!-- Filters -->
          <aside class="filter-sidebar">
            <div class="flex-between mb-4">
              <h2 class="font-bold text-lg">Filters</h2>
              <button id="clear-filters" class="text-sm text-primary">Clear All</button>
            </div>
            
            <div class="filter-group">
              <h3 class="filter-group__title">Price Range</h3>
              <div class="flex items-center flex-gap mb-3">
                <input type="number" id="filter-min-price" placeholder="Min" class="form-input text-sm">
                <span>-</span>
                <input type="number" id="filter-max-price" placeholder="Max" class="form-input text-sm">
              </div>
              <button id="apply-price" class="btn btn-outline btn-sm" style="width:100%">Apply Price</button>
            </div>

            <div class="filter-group">
              <h3 class="filter-group__title">Brands</h3>
              ${brands.map(brand => `
                <label class="filter-option">
                  <input type="checkbox" class="form-checkbox filter-brand" value="${brand}">
                  <span>${brand}</span>
                </label>
              `).join('')}
            </div>

            <div class="filter-group">
              <h3 class="filter-group__title">Rating</h3>
              ${[4, 3, 2, 1].map(rating => `
                <label class="filter-option">
                  <input type="radio" name="rating-filter" class="form-radio filter-rating" value="${rating}">
                  <span class="flex items-center text-sm">${renderStars(rating)} &amp; up</span>
                </label>
              `).join('')}
            </div>
          </aside>

          <!-- Product Area -->
          <div class="products-area">
            <div class="products-toolbar">
              <div class="text-sm" style="color:var(--text-muted)">
                Showing <span id="result-count">0</span> results
              </div>
              <div class="flex items-center" style="gap:var(--space-3)">
                <select id="sort-select" class="form-select text-sm" style="border:none; background:transparent; cursor:pointer;">
                  <option value="relevance">Sort by: Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">New Arrivals</option>
                </select>
                <div class="view-toggle">
                  <button id="view-grid" class="${state.viewMode === 'grid' ? 'active' : ''}"><i data-lucide="grid" style="width:16px;height:16px"></i></button>
                  <button id="view-list" class="${state.viewMode === 'list' ? 'active' : ''}"><i data-lucide="list" style="width:16px;height:16px"></i></button>
                </div>
              </div>
            </div>

            <div id="products-container" class="grid-3"></div>
            
            <div class="flex-center mt-10 gap-2">
              <button id="btn-prev" class="btn btn-outline btn-icon"><i data-lucide="chevron-left"></i></button>
              <span id="page-indicator" class="text-sm font-semibold mx-4">Page 1</span>
              <button id="btn-next" class="btn btn-outline btn-icon"><i data-lucide="chevron-right"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderProductGrid() {
  const container = document.getElementById('products-container');
  if (!container) return;

  const countEl = document.getElementById('result-count');
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  const pageIndicator = document.getElementById('page-indicator');

  let result = state.products.filter(p => {
    if (state.filters.brands.size > 0 && !state.filters.brands.has(p.brand)) return false;
    if (state.filters.minPrice && p.price < Number(state.filters.minPrice)) return false;
    if (state.filters.maxPrice && p.price > Number(state.filters.maxPrice)) return false;
    if (state.filters.minRating && p.rating < state.filters.minRating) return false;
    return true;
  });

  result.sort((a, b) => {
    if (state.sortBy === 'price-asc') return a.price - b.price;
    if (state.sortBy === 'price-desc') return b.price - a.price;
    if (state.sortBy === 'rating') return b.rating - a.rating;
    if (state.sortBy === 'newest') return (b.id > a.id ? 1 : -1);
    return 0;
  });

  state.filteredProducts = result;
  if (countEl) countEl.textContent = result.length;

  const totalPages = Math.ceil(result.length / state.itemsPerPage) || 1;
  if (state.page > totalPages) state.page = totalPages;
  
  const start = (state.page - 1) * state.itemsPerPage;
  const paginated = result.slice(start, start + state.itemsPerPage);

  container.className = state.viewMode === 'grid' ? 'grid-3' : 'product-list-view';
  
  if (paginated.length === 0) {
    container.innerHTML = `<div class="col-span-full py-12 text-center text-text-muted">No products match the selected filters.</div>`;
  } else {
    container.innerHTML = paginated.map(p => renderProductCard(p)).join('');
  }

  if (pageIndicator) {
    pageIndicator.textContent = `Page ${state.page} of ${totalPages}`;
    prevBtn.disabled = state.page === 1;
    nextBtn.disabled = state.page === totalPages;
    prevBtn.style.opacity = state.page === 1 ? '0.5' : '1';
    nextBtn.style.opacity = state.page === totalPages ? '0.5' : '1';
  }

  initProductCards();
  if (window.lucide) lucide.createIcons();
}

export function init(params) {
  document.querySelectorAll('.filter-brand').forEach(cb => {
    cb.addEventListener('change', (e) => {
      e.target.checked ? state.filters.brands.add(e.target.value) : state.filters.brands.delete(e.target.value);
      state.page = 1; renderProductGrid();
    });
  });

  document.querySelectorAll('.filter-rating').forEach(rb => {
    rb.addEventListener('change', (e) => {
      state.filters.minRating = Number(e.target.value);
      state.page = 1; renderProductGrid();
    });
  });

  document.getElementById('apply-price')?.addEventListener('click', () => {
    state.filters.minPrice = document.getElementById('filter-min-price').value;
    state.filters.maxPrice = document.getElementById('filter-max-price').value;
    state.page = 1; renderProductGrid();
  });

  document.getElementById('clear-filters')?.addEventListener('click', () => {
    document.querySelectorAll('.form-checkbox, .form-radio').forEach(el => el.checked = false);
    document.getElementById('filter-min-price').value = '';
    document.getElementById('filter-max-price').value = '';
    state.filters = { brands: new Set(), minPrice: '', maxPrice: '', minRating: 0 };
    state.page = 1; renderProductGrid();
  });

  document.getElementById('sort-select')?.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    state.page = 1; renderProductGrid();
  });

  const viewGridBtn = document.getElementById('view-grid');
  const viewListBtn = document.getElementById('view-list');
  viewGridBtn?.addEventListener('click', () => {
    state.viewMode = 'grid';
    viewGridBtn.classList.add('active'); viewListBtn.classList.remove('active');
    renderProductGrid();
  });
  viewListBtn?.addEventListener('click', () => {
    state.viewMode = 'list';
    viewListBtn.classList.add('active'); viewGridBtn.classList.remove('active');
    renderProductGrid();
  });

  document.getElementById('btn-prev')?.addEventListener('click', () => {
    if (state.page > 1) { state.page--; renderProductGrid(); window.scrollTo(0,0); }
  });
  document.getElementById('btn-next')?.addEventListener('click', () => {
    state.page++; renderProductGrid(); window.scrollTo(0,0);
  });

  renderProductGrid();
}
