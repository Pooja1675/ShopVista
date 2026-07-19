import { getWishlist, toggleWishlist, addToCart } from '../store.js';
import { renderProductCard, initProductCards } from '../components/productCard.js';
import { showToast } from '../components/toast.js';

export function render(params) {
  const wishlist = getWishlist();

  if (wishlist.length === 0) {
    return `
      <div class="container mx-auto px-5 py-16 text-center">
        <div class="empty-state flex-col flex-center max-w-md mx-auto">
          <div class="w-24 h-24 bg-bg-secondary rounded-full flex-center mb-6 text-error opacity-50">
            <i data-lucide="heart" class="w-12 h-12"></i>
          </div>
          <h2 class="empty-state__title text-2xl font-bold mb-2">Your wishlist is empty</h2>
          <p class="empty-state__text text-text-muted mb-8">Save items you love to your wishlist. Review them anytime and easily move them to your cart.</p>
          <a href="#/products" class="btn btn-primary btn-lg">Explore Products</a>
        </div>
      </div>
    `;
  }

  return `
    <div class="container mx-auto px-5 py-8">
      <div class="page-header mb-8 flex-between items-center">
        <h1 class="text-3xl font-bold">My Wishlist <span class="text-xl text-text-muted font-normal">(${wishlist.length} items)</span></h1>
      </div>

      <div class="grid-4">
        ${wishlist.map(product => {
          // Add extra action buttons for wishlist items
          const cardHtml = renderProductCard(product);
          // We can inject the move to cart and remove buttons by replacing the actions div or appending to it.
          // Since renderProductCard outputs a complete card, let's just render the card and we'll add overlay buttons in CSS/JS or modify the string.
          // To keep it simple, we use string replacement to add our custom wishlist buttons.
          const customActions = `
            <div class="flex gap-2 mt-3 w-full">
              <button class="btn btn-primary flex-1 btn-sm btn-move-cart text-xs" data-id="${product.id}"><i data-lucide="shopping-cart" class="w-3 h-3 mr-1"></i> Move to Cart</button>
              <button class="btn btn-outline flex-1 btn-sm btn-remove-wishlist text-xs text-error border-error hover:bg-error hover:text-white" data-id="${product.id}"><i data-lucide="trash-2" class="w-3 h-3 mr-1"></i> Remove</button>
            </div>
          `;
          return cardHtml.replace('</div>\n    </div>', `${customActions}</div>\n    </div>`);
        }).join('')}
      </div>
    </div>
  `;
}

export function init(params) {
  initProductCards();

  document.querySelectorAll('.btn-move-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const id = e.currentTarget.dataset.id;
      addToCart(id, 1);
      toggleWishlist(id); // remove from wishlist
      showToast('Item moved to cart');
    });
  });

  document.querySelectorAll('.btn-remove-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const id = e.currentTarget.dataset.id;
      toggleWishlist(id);
      showToast('Item removed from wishlist');
    });
  });

  const handleWishlistUpdate = () => {
    const el = document.getElementById('app');
    if (el && window.location.hash === '#/wishlist') {
      el.innerHTML = render();
      init();
    }
  };
  
  window.removeEventListener('wishlist-updated', window._wishlistUpdateHandler);
  window._wishlistUpdateHandler = handleWishlistUpdate;
  window.addEventListener('wishlist-updated', window._wishlistUpdateHandler);

  if (window.lucide) lucide.createIcons();
}
