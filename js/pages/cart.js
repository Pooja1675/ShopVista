import { getCart, updateCartQty, removeFromCart, getCartTotal, formatPrice } from '../store.js';
import { navigate } from '../router.js';
import { showToast } from '../components/toast.js';

export function render(params) {
  const cart = getCart();
  const totals = getCartTotal();

  if (cart.length === 0) {
    return `
      <div class="container mx-auto px-5 py-16 text-center">
        <div class="empty-state flex-col flex-center max-w-md mx-auto">
          <div class="w-24 h-24 bg-bg-secondary rounded-full flex-center mb-6 text-primary opacity-50">
            <i data-lucide="shopping-cart" class="w-12 h-12"></i>
          </div>
          <h2 class="empty-state__title text-2xl font-bold mb-2">Your cart is empty</h2>
          <p class="empty-state__text text-text-muted mb-8">Looks like you haven't added anything to your cart yet.</p>
          <button class="btn btn-primary btn-lg" onclick="window.location.hash='#/products'">Shop Now</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="container mx-auto px-5 py-8">
      <div class="page-header mb-8">
        <h1 class="text-3xl font-bold">Shopping Cart <span class="text-xl text-text-muted font-normal">(${cart.length} items)</span></h1>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 flex flex-col gap-4">
          ${cart.map(item => `
            <div class="cart-item bg-bg-card p-4 rounded shadow flex flex-col sm:flex-row gap-4 items-center sm:items-start relative">
              <a href="#/product/${item.product.id}" class="cart-item__image shrink-0 bg-bg-secondary rounded p-2 block w-32 h-32 flex-center">
                <img src="${item.product.images[0]}" alt="${item.product.name}" class="max-w-full max-h-full object-contain">
              </a>
              <div class="cart-item__info flex-1 w-full">
                <div class="flex-between items-start mb-1 gap-2">
                  <a href="#/product/${item.product.id}" class="text-lg font-bold hover:text-primary transition-colors line-clamp-2">${item.product.name}</a>
                  <span class="text-xl font-bold whitespace-nowrap">₹${(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
                <p class="text-sm text-text-secondary mb-3">Sold by: ${item.product.seller?.name || 'ShopVista'}</p>
                
                <div class="flex-between items-end mt-4">
                  <div class="cart-item__qty flex items-center border border-border rounded">
                    <button class="btn-qty-minus p-2 hover:bg-bg-secondary transition-colors" data-id="${item.product.id}"><i data-lucide="minus" class="w-4 h-4"></i></button>
                    <span class="w-10 text-center font-semibold text-sm">${item.quantity}</span>
                    <button class="btn-qty-plus p-2 hover:bg-bg-secondary transition-colors" data-id="${item.product.id}" ${item.quantity >= item.product.stock ? 'disabled' : ''}><i data-lucide="plus" class="w-4 h-4"></i></button>
                  </div>
                  <button class="btn-remove text-error hover:bg-error hover:bg-opacity-10 p-2 rounded transition-colors" data-id="${item.product.id}" title="Remove item">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Price Summary -->
        <div class="lg:col-span-1">
          <div class="price-summary bg-bg-card p-6 rounded shadow sticky top-24">
            <h3 class="text-lg font-bold mb-4 pb-4 border-b border-border">Price Details</h3>
            
            <div class="flex-between mb-3 text-text-secondary">
              <span>Price (${cart.length} items)</span>
              <span>₹${totals.subtotal.toLocaleString('en-IN')}</span>
            </div>
            
            <div class="flex-between mb-3 text-success">
              <span>Discount</span>
              <span>- ₹${totals.discount.toLocaleString('en-IN')}</span>
            </div>
            
            <div class="flex-between mb-4 text-text-secondary">
              <span>Delivery Charges</span>
              <span class="${totals.delivery === 0 ? 'text-success' : ''}">${totals.delivery === 0 ? 'FREE' : '₹' + totals.delivery}</span>
            </div>
            
            <div class="divider border-t border-border border-dashed my-4"></div>
            
            <div class="flex-between mb-2 text-xl font-bold">
              <span>Total Amount</span>
              <span>₹${totals.total.toLocaleString('en-IN')}</span>
            </div>
            
            <div class="text-success text-sm font-semibold mb-6">
              You will save ₹${(totals.discount + (totals.delivery === 0 && totals.subtotal < 500 ? 40 : 0)).toLocaleString('en-IN')} on this order
            </div>
            
            <button id="btn-checkout" class="btn btn-primary btn-block py-3 text-lg font-semibold shadow-md">Proceed to Checkout</button>

            <!-- Coupon section (UI only) -->
            <div class="mt-6 pt-6 border-t border-border">
              <p class="text-sm font-semibold mb-2 flex items-center gap-2"><i data-lucide="tag" class="w-4 h-4 text-text-muted"></i> Apply Coupon</p>
              <div class="flex gap-2">
                <input type="text" id="coupon-input" class="form-input flex-1 text-sm uppercase" placeholder="Enter code">
                <button id="btn-coupon" class="btn btn-outline btn-sm">Apply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function init(params) {
  const container = document.querySelector('.container');
  if (!container) return;

  // Quantity handlers
  document.querySelectorAll('.btn-qty-minus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const cart = getCart();
      const item = cart.find(c => c.product.id === id);
      if (item && item.quantity > 1) {
        updateCartQty(id, item.quantity - 1);
      } else {
        removeFromCart(id);
      }
    });
  });

  document.querySelectorAll('.btn-qty-plus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const cart = getCart();
      const item = cart.find(c => c.product.id === id);
      if (item && item.quantity < item.product.stock) {
        updateCartQty(id, item.quantity + 1);
      } else {
        showToast('Maximum stock reached', 'warning');
      }
    });
  });

  // Remove handler
  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      removeFromCart(id);
      showToast('Item removed from cart');
    });
  });

  // Checkout
  document.getElementById('btn-checkout')?.addEventListener('click', () => {
    navigate('#/checkout');
  });

  // Coupon (Fake)
  document.getElementById('btn-coupon')?.addEventListener('click', () => {
    const val = document.getElementById('coupon-input').value.trim();
    if (val) {
      showToast('Invalid coupon code', 'error');
    }
  });

  // The router re-renders the page when cart-updated event fires, 
  // but if we want to bind an event listener here we can.
  // Actually, router handles hash change, but for cart updates we can force a re-render.
  const handleCartUpdate = () => {
    const el = document.getElementById('app');
    if (el && window.location.hash === '#/cart') {
      el.innerHTML = render();
      init();
    }
  };
  
  // Clean up previous listeners if any to avoid memory leaks
  window.removeEventListener('cart-updated', window._cartUpdateHandler);
  window._cartUpdateHandler = handleCartUpdate;
  window.addEventListener('cart-updated', window._cartUpdateHandler);

  if (window.lucide) lucide.createIcons();
}
