import { addToCart, isInWishlist, toggleWishlist, formatPrice, isLoggedIn } from '../store.js';
import { showToast } from './toast.js';
import { navigate } from '../router.js';

export function renderProductCard(product) {
  const inWishlist = isInWishlist(product.id);
  const heartIcon = inWishlist ? `<i data-lucide="heart" fill="currentColor" class="text-danger"></i>` : `<i data-lucide="heart"></i>`;
  
  return `
    <div class="card product-card card-hover position-relative" data-product-id="${product.id}">
      <div class="product-card__image w-full cursor-pointer">
        <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
        
        ${product.discount > 0 ? `<span class="badge badge-danger position-absolute top-2 left-2 z-10 product-card__badge">-${product.discount}%</span>` : ''}
        
        <button class="btn-icon position-absolute top-2 right-2 z-10 bg-white shadow product-card__wishlist" style="border-radius: 50%;">
          ${heartIcon}
        </button>
      </div>
      
      <div class="card-body p-3 flex flex-col justify-between" style="flex-grow: 1;">
        <div class="cursor-pointer mb-2">
          <span class="text-xs text-muted font-semibold uppercase tracking-wider product-card__category">${product.category}</span>
          <h3 class="text-sm font-semibold mt-1 mb-1 product-card__title truncate" title="${product.name}">${product.name}</h3>
          
          <div class="flex items-center flex-gap text-sm product-card__rating">
            <div class="flex text-accent items-center">
              <i data-lucide="star" fill="currentColor" class="w-3 h-3"></i>
              <span class="ml-1 font-semibold">${product.rating.toFixed(1)}</span>
            </div>
            <span class="text-muted">(${product.reviewCount})</span>
          </div>
        </div>
        
        <div class="flex-between items-center mt-3 product-card__actions">
          <div>
            <span class="text-lg font-bold product-card__current-price">${formatPrice(product.price)}</span>
            ${product.originalPrice > product.price ? `<span class="text-xs text-muted line-through ml-1 product-card__original-price">${formatPrice(product.originalPrice)}</span>` : ''}
          </div>
          
          <button class="btn btn-primary btn-icon product-card__add-cart" style="border-radius: 50%;" title="Add to Cart">
            <i data-lucide="shopping-cart" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function initProductCards() {
  document.addEventListener('click', (e) => {
    // Event delegation for Wishlist button
    const wishlistBtn = e.target.closest('.product-card__wishlist');
    if (wishlistBtn) {
      e.stopPropagation(); // prevent navigation
      if (!isLoggedIn()) {
        navigate('#/login');
        return;
      }
      const card = wishlistBtn.closest('.product-card');
      const productId = card.getAttribute('data-product-id');
      const added = toggleWishlist(productId);
      
      if (added) {
        wishlistBtn.innerHTML = `<i data-lucide="heart" fill="currentColor" class="text-danger"></i>`;
        showToast('Added to wishlist', 'success');
      } else {
        wishlistBtn.innerHTML = `<i data-lucide="heart"></i>`;
        showToast('Removed from wishlist', 'info');
      }
      if (window.lucide) window.lucide.createIcons({root: wishlistBtn});
      return;
    }
    
    // Event delegation for Add to Cart button
    const addCartBtn = e.target.closest('.product-card__add-cart');
    if (addCartBtn) {
      e.stopPropagation(); // prevent navigation
      if (!isLoggedIn()) {
        navigate('#/login');
        return;
      }
      const card = addCartBtn.closest('.product-card');
      const productId = card.getAttribute('data-product-id');
      addToCart(productId, 1);
      showToast('Added to cart', 'success');
      return;
    }
    
    // Event delegation for navigating to product details
    const productCard = e.target.closest('.product-card');
    if (productCard) {
      const productId = productCard.getAttribute('data-product-id');
      navigate(`#/product/${productId}`);
    }
  });
}
