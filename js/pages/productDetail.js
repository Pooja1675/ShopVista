import { getProductById, getProductsByCategory, addToCart, toggleWishlist, isInWishlist, addReview, getUser } from '../store.js';
import { navigate } from '../router.js';
import { renderProductCard, initProductCards } from '../components/productCard.js';
import { renderStars, renderInteractiveStars, initInteractiveStars } from '../components/starRating.js';
import { showToast } from '../components/toast.js';
import { showModal } from '../components/modal.js';

export function render(params) {
  const product = getProductById(params.id);
  if (!product) {
    return `<div class="container mx-auto py-20 text-center"><h1 class="text-2xl font-bold">Product not found</h1><button class="btn btn-primary mt-4" onclick="window.location.hash='#/products'">Back to Products</button></div>`;
  }

  const related = getProductsByCategory(product.category).filter(p => p.id !== product.id).slice(0, 4);
  const inWishlist = isInWishlist(product.id);
  const user = getUser();
  const specs = Object.entries(product.specifications || {});

  const reviewStats = product.reviews?.length > 0 ? 
    product.reviews.reduce((acc, r) => { acc[r.rating] = (acc[r.rating] || 0) + 1; return acc; }, {1:0, 2:0, 3:0, 4:0, 5:0}) : 
    {1:0, 2:0, 3:0, 4:0, 5:0};

  return `
    <div class="container mx-auto px-5 py-8 product-detail">
      <!-- Breadcrumb -->
      <div class="breadcrumb text-sm text-text-muted mb-6">
        <a href="#/" class="hover:text-primary">Home</a> <i data-lucide="chevron-right" class="inline w-3 h-3"></i> 
        <a href="#/category/${product.category}" class="hover:text-primary">${product.category}</a> <i data-lucide="chevron-right" class="inline w-3 h-3"></i> 
        <span>${product.name}</span>
      </div>

      <!-- Top Section -->
      <div class="product-detail__top grid md:grid-cols-2 gap-10 mb-12">
        <!-- Gallery -->
        <div class="product-gallery flex flex-col gap-4">
          <div class="product-gallery__main bg-bg-card rounded shadow overflow-hidden relative flex-center p-4">
            <img id="main-image" src="${product.images[0]}" alt="${product.name}" class="w-full h-auto max-h-[400px] object-contain cursor-crosshair transition-transform duration-300">
          </div>
          <div class="product-gallery__thumbs flex gap-4 overflow-x-auto pb-2">
            ${product.images.map((img, i) => `
              <img src="${img}" alt="Thumbnail ${i}" class="gallery-thumb w-20 h-20 object-cover rounded cursor-pointer border-2 ${i === 0 ? 'border-primary' : 'border-transparent'} hover:border-primary-light" data-src="${img}">
            `).join('')}
          </div>
        </div>

        <!-- Info -->
        <div class="product-info flex flex-col gap-4">
          <h1 class="text-3xl font-bold">${product.name}</h1>
          
          <div class="flex items-center gap-4">
            <div class="flex items-center text-accent">
              ${renderStars(product.rating)}
              <span class="text-text-primary ml-2 font-semibold">${product.rating.toFixed(1)}</span>
            </div>
            <span class="text-text-muted">(${product.reviewCount} reviews)</span>
            <a href="#reviews-tab" class="text-primary hover:underline text-sm js-goto-reviews">Write a Review</a>
          </div>

          <div class="price-display flex items-end gap-3 mt-2">
            <span class="text-4xl font-bold text-text-primary">₹${product.price.toLocaleString('en-IN')}</span>
            ${product.originalPrice > product.price ? `
              <span class="text-xl line-through text-text-muted">₹${product.originalPrice.toLocaleString('en-IN')}</span>
              <span class="badge bg-success text-white px-2 py-1 rounded text-sm font-bold">${product.discount}% OFF</span>
            ` : ''}
          </div>

          <p class="text-text-secondary mt-2">${product.description}</p>

          ${product.features?.length ? `
          <ul class="features-list mt-4 flex flex-col gap-2">
            ${product.features.map(f => `
              <li class="flex items-start gap-2"><i data-lucide="check-circle" class="w-5 h-5 text-success shrink-0"></i> <span class="text-text-secondary">${f}</span></li>
            `).join('')}
          </ul>
          ` : ''}

          <div class="flex items-center gap-4 mt-6">
            <div class="qty-selector flex items-center border border-border rounded overflow-hidden">
              <button id="btn-minus" class="p-3 bg-bg-secondary hover:bg-border transition-colors"><i data-lucide="minus" class="w-4 h-4"></i></button>
              <input type="number" id="qty-input" value="1" min="1" max="${product.stock}" class="w-16 text-center border-none p-3 outline-none" readonly>
              <button id="btn-plus" class="p-3 bg-bg-secondary hover:bg-border transition-colors"><i data-lucide="plus" class="w-4 h-4"></i></button>
            </div>
            <span class="text-sm ${product.stock > 0 ? (product.stock < 10 ? 'text-warning' : 'text-success') : 'text-error'} font-semibold">
              ${product.stock > 0 ? (product.stock < 10 ? `Only ${product.stock} left in stock` : 'In Stock') : 'Out of Stock'}
            </span>
          </div>

          <div class="action-buttons flex gap-4 mt-6">
            <button id="btn-add-cart" class="btn btn-primary flex-1 py-3 text-lg flex-center gap-2" ${product.stock === 0 ? 'disabled' : ''} data-id="${product.id}">
              <i data-lucide="shopping-cart"></i> Add to Cart
            </button>
            <button id="btn-buy-now" class="btn btn-secondary flex-1 py-3 text-lg" ${product.stock === 0 ? 'disabled' : ''} data-id="${product.id}">Buy Now</button>
            <button id="btn-wishlist" class="btn btn-outline p-3 rounded" data-id="${product.id}">
              <i data-lucide="heart" class="${inWishlist ? 'fill-error text-error' : ''}"></i>
            </button>
          </div>

          <div class="seller-info mt-6 pt-6 border-t border-border flex items-center gap-3">
            <i data-lucide="store" class="text-text-muted"></i>
            <span class="text-text-secondary">Sold by <strong>${product.seller?.name || 'ShopVista'}</strong></span>
          </div>
        </div>
      </div>

      <!-- Tabs Section -->
      <div class="tabs-container mt-12 bg-bg-card rounded shadow">
        <div class="tabs-header flex border-b border-border">
          <button class="tab-btn flex-1 py-4 font-semibold text-center border-b-2 border-primary text-primary" data-target="tab-desc">Description</button>
          <button class="tab-btn flex-1 py-4 font-semibold text-center border-b-2 border-transparent text-text-muted hover:text-text-primary" data-target="tab-specs">Specifications</button>
          <button class="tab-btn flex-1 py-4 font-semibold text-center border-b-2 border-transparent text-text-muted hover:text-text-primary" data-target="tab-reviews" id="reviews-tab">Reviews</button>
        </div>
        <div class="tabs-content p-6">
          <div id="tab-desc" class="tab-pane block">
            <h3 class="text-xl font-bold mb-4">Product Description</h3>
            <p class="text-text-secondary whitespace-pre-line">${product.description}</p>
          </div>
          
          <div id="tab-specs" class="tab-pane hidden">
            <h3 class="text-xl font-bold mb-4">Specifications</h3>
            ${specs.length ? `
              <table class="w-full text-left border-collapse">
                <tbody>
                  ${specs.map(([key, val], i) => `
                    <tr class="${i % 2 === 0 ? 'bg-bg-secondary' : ''}">
                      <td class="p-3 font-semibold w-1/3 border border-border">${key}</td>
                      <td class="p-3 border border-border">${val}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : '<p>No specifications available.</p>'}
          </div>

          <div id="tab-reviews" class="tab-pane hidden">
            <div class="grid md:grid-cols-3 gap-8">
              <div class="review-stats">
                <h3 class="text-xl font-bold mb-4">Customer Reviews</h3>
                <div class="flex items-center gap-4 mb-4">
                  <span class="text-5xl font-bold">${product.rating.toFixed(1)}</span>
                  <div>
                    <div class="text-accent">${renderStars(product.rating)}</div>
                    <p class="text-sm text-text-muted mt-1">${product.reviewCount} global ratings</p>
                  </div>
                </div>
                <div class="rating-bars flex flex-col gap-2">
                  ${[5, 4, 3, 2, 1].map(star => {
                    const count = reviewStats[star] || 0;
                    const total = product.reviews?.length || 1;
                    const pct = Math.round((count / total) * 100);
                    return `
                      <div class="flex items-center gap-2 text-sm">
                        <span class="w-12">${star} star</span>
                        <div class="flex-1 h-3 bg-bg-secondary rounded overflow-hidden">
                          <div class="h-full bg-accent" style="width: ${pct}%"></div>
                        </div>
                        <span class="w-10 text-right">${pct}%</span>
                      </div>
                    `;
                  }).join('')}
                </div>
                <div class="mt-6">
                  <h4 class="font-bold mb-2">Review this product</h4>
                  <p class="text-sm text-text-muted mb-4">Share your thoughts with other customers</p>
                  <button id="btn-write-review" class="btn btn-outline w-full">Write a Review</button>
                </div>
              </div>
              
              <div class="review-list md:col-span-2">
                <!-- Review Form (Hidden initially) -->
                <div id="review-form-container" class="hidden bg-bg-secondary p-5 rounded mb-6">
                  <h4 class="font-bold mb-4">Write your review</h4>
                  <form id="review-form" class="flex flex-col gap-4">
                    <div class="form-group">
                      <label class="form-label block mb-1">Rating</label>
                      ${renderInteractiveStars('review-rating', 0)}
                    </div>
                    <div class="form-group">
                      <label class="form-label block mb-1">Title</label>
                      <input type="text" id="review-title" class="form-input w-full" placeholder="Summary of your review" required>
                    </div>
                    <div class="form-group">
                      <label class="form-label block mb-1">Comment</label>
                      <textarea id="review-comment" class="form-textarea w-full" rows="4" placeholder="What did you like or dislike?" required></textarea>
                    </div>
                    <div class="flex gap-4">
                      <button type="submit" class="btn btn-primary">Submit Review</button>
                      <button type="button" id="btn-cancel-review" class="btn btn-ghost">Cancel</button>
                    </div>
                  </form>
                </div>

                <h4 class="font-bold mb-4">Top Reviews</h4>
                ${product.reviews?.length ? product.reviews.map(r => `
                  <div class="review-card border-b border-border py-4 last:border-0">
                    <div class="flex items-center gap-2 mb-2">
                      <div class="w-8 h-8 rounded-full bg-primary text-white flex-center font-bold text-sm">${r.userName.charAt(0)}</div>
                      <span class="font-semibold">${r.userName}</span>
                    </div>
                    <div class="flex items-center gap-2 mb-2">
                      <div class="text-accent text-sm">${renderStars(r.rating)}</div>
                      <span class="font-bold text-sm">${r.title}</span>
                    </div>
                    <p class="text-xs text-text-muted mb-3">Reviewed on ${r.date}</p>
                    <p class="text-sm text-text-secondary mb-3">${r.comment}</p>
                    <button class="text-xs text-text-muted flex items-center gap-1 hover:text-primary"><i data-lucide="thumbs-up" class="w-3 h-3"></i> Helpful (${r.helpful || 0})</button>
                  </div>
                `).join('') : '<p class="text-text-muted">No reviews yet. Be the first to review!</p>'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      ${related.length ? `
      <div class="related-products mt-16">
        <h2 class="text-2xl font-bold mb-6">Related Products</h2>
        <div class="grid-4">
          ${related.map(p => renderProductCard(p)).join('')}
        </div>
      </div>
      ` : ''}
    </div>
  `;
}

export function init(params) {
  const product = getProductById(params.id);
  if (!product) return;

  // Gallery
  const mainImg = document.getElementById('main-image');
  const thumbs = document.querySelectorAll('.gallery-thumb');
  
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', (e) => {
      mainImg.src = e.target.dataset.src;
      thumbs.forEach(t => t.classList.replace('border-primary', 'border-transparent'));
      e.target.classList.replace('border-transparent', 'border-primary');
    });
  });

  if (mainImg) {
    mainImg.addEventListener('mousemove', (e) => {
      const rect = e.target.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width * 100;
      const y = (e.clientY - rect.top) / rect.height * 100;
      mainImg.style.transformOrigin = `${x}% ${y}%`;
      mainImg.style.transform = 'scale(2)';
    });
    mainImg.addEventListener('mouseleave', () => {
      mainImg.style.transformOrigin = 'center center';
      mainImg.style.transform = 'scale(1)';
    });
  }

  // Quantity
  const qtyInput = document.getElementById('qty-input');
  document.getElementById('btn-minus')?.addEventListener('click', () => {
    if (qtyInput.value > 1) qtyInput.value--;
  });
  document.getElementById('btn-plus')?.addEventListener('click', () => {
    if (parseInt(qtyInput.value) < product.stock) qtyInput.value++;
  });

  // Actions
  document.getElementById('btn-add-cart')?.addEventListener('click', () => {
    addToCart(product.id, parseInt(qtyInput.value));
    showToast('Added to cart!');
  });

  document.getElementById('btn-buy-now')?.addEventListener('click', () => {
    addToCart(product.id, parseInt(qtyInput.value));
    navigate('#/checkout');
  });

  document.getElementById('btn-wishlist')?.addEventListener('click', (e) => {
    const added = toggleWishlist(product.id);
    const icon = e.currentTarget.querySelector('i');
    if (added) {
      icon.classList.add('fill-error', 'text-error');
      showToast('Added to wishlist');
    } else {
      icon.classList.remove('fill-error', 'text-error');
      showToast('Removed from wishlist');
    }
  });

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tabBtns.forEach(b => {
        b.classList.remove('border-primary', 'text-primary');
        b.classList.add('border-transparent', 'text-text-muted');
      });
      e.target.classList.remove('border-transparent', 'text-text-muted');
      e.target.classList.add('border-primary', 'text-primary');
      
      tabPanes.forEach(p => p.classList.add('hidden'));
      document.getElementById(e.target.dataset.target).classList.remove('hidden');
    });
  });

  document.querySelector('.js-goto-reviews')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('reviews-tab').click();
    document.getElementById('reviews-tab').scrollIntoView({behavior: 'smooth'});
  });

  // Reviews
  const writeReviewBtn = document.getElementById('btn-write-review');
  const formContainer = document.getElementById('review-form-container');
  
  writeReviewBtn?.addEventListener('click', () => {
    if (!getUser()) {
      showToast('Please login to write a review', 'warning');
      navigate('#/login');
      return;
    }
    formContainer.classList.remove('hidden');
    writeReviewBtn.classList.add('hidden');
  });

  document.getElementById('btn-cancel-review')?.addEventListener('click', () => {
    formContainer.classList.add('hidden');
    writeReviewBtn.classList.remove('hidden');
  });

  initInteractiveStars(document.getElementById('review-form-container'));

  document.getElementById('review-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const ratingInput = document.querySelector('input[name="review-rating"]:checked');
    const rating = ratingInput ? parseInt(ratingInput.value) : 0;
    const title = document.getElementById('review-title').value;
    const comment = document.getElementById('review-comment').value;

    if (!rating) {
      showToast('Please select a rating', 'error');
      return;
    }

    addReview(product.id, { rating, title, comment, userName: getUser().name });
    showToast('Review submitted successfully!');
    // Re-render page to show new review
    setTimeout(() => { window.location.reload(); }, 1000);
  });

  initProductCards();
  if (window.lucide) lucide.createIcons();
}
