import { getProducts, getCategories, formatPrice } from '../store.js';
import { navigate } from '../router.js';
import { renderProductCard, initProductCards } from '../components/productCard.js';
import { renderStars } from '../components/starRating.js';

let state = {
  products: [],
  filteredProducts: [],
  page: 1,
  itemsPerPage: 8,
  filters: {
    categories: new Set(),
    brands: new Set(),
    minPrice: '',
    maxPrice: '',
    minRating: 0
  },
  sortBy: 'relevance',
  viewMode: 'grid'
};

export function render(params) {
  state.products = getProducts();
  state.filteredProducts = [...state.products];
  const categories = getCategories();
  const brands = [...new Set(state.products.map(p => p.brand))].filter(Boolean);

  return `
    <div class="container mx-auto px-5 py-8">
      <div class="page-header mb-8">
        <div class="breadcrumb text-sm text-text-muted mb-2">
          <a href="#/" class="hover:text-primary">Home</a> <i data-lucide="chevron-right" class="inline w-3 h-3"></i> <span>All Products</span>
        </div>
        <h1 class="text-3xl font-bold">All Products</h1>
      </div>

      <div class="product-list-page">
        <!-- Filter Sidebar -->
        <aside class="filter-sidebar">
          <div class="flex-between mb-4">
            <h2 class="font-bold text-lg">Filters</h2>
            <button id="clear-filters" class="text-sm text-primary">Clear All</button>
          </div>
          
          <div class="filter-group">
            <h3 class="filter-group__title">Categories</h3>
            ${categories.map(cat => `
              <label class="filter-option">
                <input type="checkbox" class="form-checkbox filter-category" value="${cat.name}">
                <span>${cat.name}</span>
              </label>
            `).join('')}
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
            <h3 class="filter-group__title">Rating</h3>
            ${[4, 3, 2, 1].map(rating => `
              <label class="filter-option">
                <input type="radio" name="rating-filter" class="form-radio filter-rating" value="${rating}">
                <span class="flex items-center text-sm">${renderStars(rating)} &amp; up</span>
              </label>
            `).join('')}
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
                <option value="newest">Newest Arrivals</option>
              </select>
              <div class="view-toggle">
                <button id="view-grid" class="active"><i data-lucide="grid" style="width:16px;height:16px"></i></button>
                <button id="view-list"><i data-lucide="list" style="width:16px;height:16px"></i></button>
              </div>
            </div>
          </div>

          <div id="products-container" class="grid-3">
            <!-- Products rendered here via JS -->
          </div>
          
          <div class="flex-center mt-10 gap-2">
            <button id="btn-prev" class="btn btn-outline btn-icon"><i data-lucide="chevron-left"></i></button>
            <span id="page-indicator" class="text-sm font-semibold mx-4">Page 1</span>
            <button id="btn-next" class="btn btn-outline btn-icon"><i data-lucide="chevron-right"></i></button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderProductGrid() {
  const container = document.getElementById('products-container');
  const countEl = document.getElementById('result-count');
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  const pageIndicator = document.getElementById('page-indicator');

  if (!container) return;

  // Apply filters
  let result = state.products.filter(p => {
    if (state.filters.categories.size > 0 && !state.filters.categories.has(p.category)) return false;
    if (state.filters.brands.size > 0 && !state.filters.brands.has(p.brand)) return false;
    if (state.filters.minPrice && p.price < Number(state.filters.minPrice)) return false;
    if (state.filters.maxPrice && p.price > Number(state.filters.maxPrice)) return false;
    if (state.filters.minRating && p.rating < state.filters.minRating) return false;
    return true;
  });

  // Apply sort
  result.sort((a, b) => {
    if (state.sortBy === 'price-asc') return a.price - b.price;
    if (state.sortBy === 'price-desc') return b.price - a.price;
    if (state.sortBy === 'rating') return b.rating - a.rating;
    if (state.sortBy === 'newest') return (b.id > a.id ? 1 : -1);
    return 0; // relevance
  });

  state.filteredProducts = result;
  countEl.textContent = result.length;

  // Paginate
  const totalPages = Math.ceil(result.length / state.itemsPerPage) || 1;
  if (state.page > totalPages) state.page = totalPages;
  if (state.page < 1) state.page = 1;

  const start = (state.page - 1) * state.itemsPerPage;
  const end = start + state.itemsPerPage;
  const paginated = result.slice(start, end);

  container.className = state.viewMode === 'grid' ? 'grid-3' : 'product-list-view';
  
  if (paginated.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-10 flex-col flex-center text-text-muted">
        <i data-lucide="search" class="w-12 h-12 mb-4 opacity-50"></i>
        <p>No products match your filters.</p>
      </div>`;
  } else {
    container.innerHTML = paginated.map(p => renderProductCard(p)).join('');
  }

  pageIndicator.textContent = `Page ${state.page} of ${totalPages}`;
  prevBtn.disabled = state.page === 1;
  nextBtn.disabled = state.page === totalPages;
  prevBtn.style.opacity = state.page === 1 ? '0.5' : '1';
  nextBtn.style.opacity = state.page === totalPages ? '0.5' : '1';

  initProductCards();
  if (window.lucide) lucide.createIcons();
}

export function init(params) {
  // Reset state on init
  state.filters = { categories: new Set(), brands: new Set(), minPrice: '', maxPrice: '', minRating: 0 };
  state.page = 1;

  // Bind filter events
  document.querySelectorAll('.filter-category').forEach(cb => {
    cb.addEventListener('change', (e) => {
      e.target.checked ? state.filters.categories.add(e.target.value) : state.filters.categories.delete(e.target.value);
      state.page = 1; renderProductGrid();
    });
  });

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
    state.filters = { categories: new Set(), brands: new Set(), minPrice: '', maxPrice: '', minRating: 0 };
    state.page = 1; renderProductGrid();
  });

  // Sort and view toggles
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

  // Pagination
  document.getElementById('btn-prev')?.addEventListener('click', () => {
    if (state.page > 1) { state.page--; renderProductGrid(); window.scrollTo({top: 0, behavior: 'smooth'}); }
  });
  document.getElementById('btn-next')?.addEventListener('click', () => {
    state.page++; renderProductGrid(); window.scrollTo({top: 0, behavior: 'smooth'});
  });

  // Initial render
  renderProductGrid();
}
