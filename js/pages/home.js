import { getProducts, getCategories } from '../store.js';
import { navigate } from '../router.js';
import { renderProductCard, initProductCards } from '../components/productCard.js';

export function render(params) {
  const categories = getCategories();
  const products = getProducts();
  const trending = products.slice(0, 8);
  const featured = products.slice(8, 12);
  const dealProduct = products.length > 0 ? products[0] : null;

  return `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero relative bg-gradient-hero text-white overflow-hidden py-20 px-5">
        <div class="container mx-auto flex-col flex-center text-center relative z-10">
          <h1 class="hero__title text-5xl font-bold mb-4 animate-fade-in">Discover Premium Products</h1>
          <p class="hero__subtitle text-xl mb-8 animate-slide-up">Shop from thousands of products at the best prices</p>
          <div class="hero__cta flex flex-gap animate-slide-up" style="animation-delay: 0.2s">
            <button id="hero-shop-btn" class="btn btn-primary btn-lg">Shop Now</button>
            <button id="hero-explore-btn" class="btn btn-outline btn-lg text-white border-white">Explore Categories</button>
          </div>
        </div>
        <div class="hero-shapes absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
           <!-- Decorative CSS shapes can be added here -->
           <div class="absolute rounded-full bg-white" style="width:300px; height:300px; top:-100px; right:-100px; filter: blur(50px);"></div>
           <div class="absolute rounded-full bg-white" style="width:200px; height:200px; bottom:-50px; left:-50px; filter: blur(40px);"></div>
        </div>
      </section>

      <!-- Categories Section -->
      <section id="categories-section" class="py-10 bg-bg-secondary">
        <div class="container mx-auto px-5">
          <h2 class="section-title text-3xl font-bold mb-6">Explore Categories</h2>
          <div class="categories-grid flex flex-gap scroll-x pb-5">
            ${categories.map(cat => `
              <div class="category-card" data-name="${cat.name}" style="background-image: url('${cat.image}');">
                <span class="category-card__name">${cat.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Trending Products -->
      <section class="py-10">
        <div class="container mx-auto px-5">
          <h2 class="section-title text-3xl font-bold mb-6">Trending Products</h2>
          <div class="grid-4">
            ${trending.map(p => renderProductCard(p)).join('')}
          </div>
        </div>
      </section>

      <!-- Deal of the Day -->
      ${dealProduct ? `
      <section class="py-10 bg-primary-light text-white my-10">
        <div class="container mx-auto px-5 grid-2 items-center flex-gap">
          <div class="deal-image flex-center">
            <img src="${dealProduct.images[0]}" alt="${dealProduct.name}" class="rounded shadow-lg max-w-full h-auto object-cover" style="max-height: 400px;">
          </div>
          <div class="deal-info">
            <div class="badge bg-error text-white mb-4 inline-block px-3 py-1 rounded-full text-sm font-bold">DEAL OF THE DAY</div>
            <h2 class="text-4xl font-bold mb-4">${dealProduct.name}</h2>
            <p class="text-lg mb-6 opacity-90">${dealProduct.description}</p>
            <div class="flex items-end flex-gap mb-8">
              <span class="text-3xl font-bold">₹${dealProduct.price.toLocaleString('en-IN')}</span>
              <span class="text-xl line-through opacity-75">₹${dealProduct.originalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div class="countdown flex flex-gap mb-8">
              <div class="flex-col flex-center bg-white text-primary rounded p-3 min-w-[70px]">
                <span id="deal-hours" class="text-2xl font-bold">23</span>
                <span class="text-sm">Hours</span>
              </div>
              <div class="flex-col flex-center bg-white text-primary rounded p-3 min-w-[70px]">
                <span id="deal-minutes" class="text-2xl font-bold">59</span>
                <span class="text-sm">Mins</span>
              </div>
              <div class="flex-col flex-center bg-white text-primary rounded p-3 min-w-[70px]">
                <span id="deal-seconds" class="text-2xl font-bold">59</span>
                <span class="text-sm">Secs</span>
              </div>
            </div>
            <button id="deal-btn" class="btn bg-accent text-white btn-lg hover:bg-accent-dark" data-id="${dealProduct.id}">Grab Deal</button>
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Featured Products -->
      <section class="py-10 mb-10">
        <div class="container mx-auto px-5">
          <h2 class="section-title text-3xl font-bold mb-6">Featured Products</h2>
          <div class="grid-4">
            ${featured.map(p => renderProductCard(p)).join('')}
          </div>
        </div>
      </section>
    </div>
  `;
}

export function init(params) {
  // Hero buttons
  document.getElementById('hero-shop-btn')?.addEventListener('click', () => navigate('#/products'));
  document.getElementById('hero-explore-btn')?.addEventListener('click', () => {
    document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Category cards
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      navigate(`#/category/${card.dataset.name}`);
    });
  });

  // Deal button
  document.getElementById('deal-btn')?.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    navigate(`#/product/${id}`);
  });

  initProductCards();

  // Fake countdown
  const hoursEl = document.getElementById('deal-hours');
  const minsEl = document.getElementById('deal-minutes');
  const secsEl = document.getElementById('deal-seconds');
  
  if (hoursEl && minsEl && secsEl) {
    let h = 23, m = 59, s = 59;
    setInterval(() => {
      s--;
      if (s < 0) { s = 59; m--; }
      if (m < 0) { m = 59; h--; }
      if (h < 0) { h = 23; }
      hoursEl.textContent = h.toString().padStart(2, '0');
      minsEl.textContent = m.toString().padStart(2, '0');
      secsEl.textContent = s.toString().padStart(2, '0');
    }, 1000);
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}
