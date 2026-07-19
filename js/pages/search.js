import { searchProducts } from '../store.js';
import { renderProductCard, initProductCards } from '../components/productCard.js';
import { renderStars } from '../components/starRating.js';

let state = {
  products: [],
  filteredProducts: [],
  query: '',
  page: 1,
  itemsPerPage: 8,
  filters: {
    minPrice: '',
    maxPrice: '',
    minRating: 0
  },
  sortBy: 'relevance',
  viewMode: 'grid'
};

export function render(params) {
  // Get query from params or hash
  const hash = window.location.hash;
  const qStr = hash.includes('?') ? hash.split('?')[1] : '';
  const searchParams = new URLSearchParams(qStr);
  const query = searchParams.get('q') || '';
  
  if (query !== state.query) {
    state.query = query;
    state.products = searchProducts(query);
    state.filteredProducts = [...state.products];
    state.page = 1;
    // reset filters on new search
    state.filters = { minPrice: '', maxPrice: '', minRating: 0 };
    state.sortBy = 'relevance';
  }

  const hasResults = state.products.length > 0;
  const suggestions = ['Laptops', 'Headphones', 'Smartphones', 'Watches', 'Shoes'];

  return `
    <div class="container mx-auto px-5 py-8">
      <div class="page-header mb-8">
        <h1 class="text-3xl font-bold mb-2">Search Results</h1>
        <p class="text-text-secondary">Showing results for <span class="font-bold text-text-primary">"${state.query}"</span> (${state.products.length} found)</p>
      </div>

      ${!hasResults ? `
        <div class="empty-state py-16 text-center max-w-lg mx-auto bg-bg-card rounded shadow">
          <i data-lucide="search" class="w-16 h-16 mx-auto mb-6 text-primary opacity-50"></i>
          <h2 class="text-2xl font-bold mb-4">No results found for "${state.query}"</h2>
          <p class="text-text-muted mb-6">Try checking your spelling or use more general terms.</p>
          <div class="text-left bg-bg-secondary p-4 rounded">
            <h4 class="font-semibold mb-3">Popular searches:</h4>
            <div class="flex flex-wrap gap-2">
              ${suggestions.map(s => `<a href="#/search?q=${s.toLowerCase()}" class="badge bg-white border border-border text-text-secondary hover:text-primary hover:border-primary px-3 py-1.5 cursor-pointer">${s}</a>`).join('')}
            </div>
          </div>
        </div>
      ` : `
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Filters (Simplified for search) -->
          <aside class="filter-sidebar bg-bg-card p-5 rounded shadow h-fit">
            <div class="flex-between mb-4">
              <h2 class="font-bold text-lg">Filters</h2>
              <button id="clear-filters" class="text-sm text-primary hover:underline">Clear All</button>
            </div>
            
            <div class="filter-group mb-6">
              <h3 class="filter-group__title font-semibold mb-3">Price Range</h3>
              <div class="flex items-center flex-gap mb-3">
                <input type="number" id="filter-min-price" placeholder="Min" class="form-input w-full text-sm" value="${state.filters.minPrice}">
                <span>-</span>
                <input type="number" id="filter-max-price" placeholder="Max" class="form-input w-full text-sm" value="${state.filters.maxPrice}">
              </div>
              <button id="apply-price" class="btn btn-outline btn-sm w-full">Apply Price</button>
            </div>

            <div class="filter-group mb-6">
              <h3 class="filter-group__title font-semibold mb-3">Rating</h3>
              ${[4, 3, 2, 1].map(rating => `
                <label class="flex items-center flex-gap mb-2 cursor-pointer">
                  <input type="radio" name="rating-filter" class="form-radio filter-rating" value="${rating}" ${state.filters.minRating === rating ? 'checked' : ''}>
                  <span class="flex items-center text-sm">${renderStars(rating)} &amp; up</span>
                </label>
              `).join('')}
            </div>
          </aside>

          <!-- Products -->
          <main class="md:col-span-3">
            <div class="flex-between mb-6 bg-bg-card p-3 rounded shadow">
              <div class="text-sm text-text-muted">
                Showing <span id="result-count">${state.filteredProducts.length}</span> results
              </div>
              <div class="flex items-center flex-gap">
                <select id="sort-select" class="form-select text-sm border-none bg-transparent cursor-pointer">
                  <option value="relevance" ${state.sortBy === 'relevance' ? 'selected' : ''}>Sort by: Relevance</option>
                  <option value="price-asc" ${state.sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
                  <option value="price-desc" ${state.sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
                  <option value="rating" ${state.sortBy === 'rating' ? 'selected' : ''}>Top Rated</option>
                </select>
                <div class="flex border border-border rounded overflow-hidden">
                  <button id="view-grid" class="p-2 ${state.viewMode === 'grid' ? 'bg-bg-secondary' : 'bg-transparent'} hover:bg-border transition-colors"><i data-lucide="grid" class="w-4 h-4"></i></button>
                  <button id="view-list" class="p-2 ${state.viewMode === 'list' ? 'bg-bg-secondary' : 'bg-transparent'} hover:bg-border transition-colors"><i data-lucide="list" class="w-4 h-4"></i></button>
                </div>
              </div>
            </div>

            <div id="products-container" class="${state.viewMode === 'grid' ? 'grid-3' : 'flex flex-col gap-4'}">
              <!-- Rendered via JS -->
            </div>
            
            <div class="flex-center mt-10 gap-2" id="pagination-container">
              <button id="btn-prev" class="btn btn-outline btn-icon"><i data-lucide="chevron-left"></i></button>
              <span id="page-indicator" class="text-sm font-semibold mx-4">Page 1</span>
              <button id="btn-next" class="btn btn-outline btn-icon"><i data-lucide="chevron-right"></i></button>
            </div>
          </main>
        </div>
      `}
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
    if (state.filters.minPrice && p.price < Number(state.filters.minPrice)) return false;
    if (state.filters.maxPrice && p.price > Number(state.filters.maxPrice)) return false;
    if (state.filters.minRating && p.rating < state.filters.minRating) return false;
    return true;
  });

  result.sort((a, b) => {
    if (state.sortBy === 'price-asc') return a.price - b.price;
    if (state.sortBy === 'price-desc') return b.price - a.price;
    if (state.sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  state.filteredProducts = result;
  if (countEl) countEl.textContent = result.length;

  const totalPages = Math.ceil(result.length / state.itemsPerPage) || 1;
  if (state.page > totalPages) state.page = totalPages;
  
  const start = (state.page - 1) * state.itemsPerPage;
  const paginated = result.slice(start, start + state.itemsPerPage);

  container.className = state.viewMode === 'grid' ? 'grid-3' : 'flex flex-col gap-4';
  
  if (paginated.length === 0) {
    container.innerHTML = `<p class="col-span-full text-center py-10 text-text-muted">No products match your filters.</p>`;
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
  if (state.products.length === 0) {
    if (window.lucide) lucide.createIcons();
    return;
  }

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
    document.querySelectorAll('.form-radio').forEach(el => el.checked = false);
    document.getElementById('filter-min-price').value = '';
    document.getElementById('filter-max-price').value = '';
    state.filters = { minPrice: '', maxPrice: '', minRating: 0 };
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
    viewGridBtn.classList.add('bg-bg-secondary'); viewGridBtn.classList.remove('bg-transparent');
    viewListBtn.classList.add('bg-transparent'); viewListBtn.classList.remove('bg-bg-secondary');
    renderProductGrid();
  });
  viewListBtn?.addEventListener('click', () => {
    state.viewMode = 'list';
    viewListBtn.classList.add('bg-bg-secondary'); viewListBtn.classList.remove('bg-transparent');
    viewGridBtn.classList.add('bg-transparent'); viewGridBtn.classList.remove('bg-bg-secondary');
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
