import { getCart, getCartTotal, getAddresses, placeOrder } from '../store.js';
import { navigate } from '../router.js';
import { showToast } from '../components/toast.js';

let state = {
  step: 1,
  addressId: null,
  paymentMethod: null
};

export function render(params) {
  const cart = getCart();
  if (cart.length === 0 && state.step !== 3) {
    navigate('#/cart');
    return '';
  }

  const totals = getCartTotal();
  const addresses = getAddresses();

  return `
    <div class="container mx-auto px-5 py-8 bg-bg-secondary min-h-screen">
      <div class="max-w-5xl mx-auto">
        
        <!-- Checkout Steps -->
        <div class="checkout-steps flex items-center justify-between mb-10 relative">
          <div class="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 z-0"></div>
          
          <div class="flex-1 absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-300" style="width: ${state.step === 1 ? '0%' : state.step === 2 ? '50%' : '100%'}"></div>
          
          <div class="checkout-step flex flex-col items-center relative z-10 w-24">
            <div class="w-10 h-10 rounded-full flex-center font-bold text-lg mb-2 transition-colors ${state.step >= 1 ? 'bg-primary text-white' : 'bg-bg-card border-2 border-border text-text-muted'}">1</div>
            <span class="text-sm font-semibold ${state.step >= 1 ? 'text-primary' : 'text-text-muted'}">Address</span>
          </div>
          
          <div class="checkout-step flex flex-col items-center relative z-10 w-24">
            <div class="w-10 h-10 rounded-full flex-center font-bold text-lg mb-2 transition-colors ${state.step >= 2 ? 'bg-primary text-white' : 'bg-bg-card border-2 border-border text-text-muted'}">2</div>
            <span class="text-sm font-semibold ${state.step >= 2 ? 'text-primary' : 'text-text-muted'}">Payment</span>
          </div>
          
          <div class="checkout-step flex flex-col items-center relative z-10 w-24">
            <div class="w-10 h-10 rounded-full flex-center font-bold text-lg mb-2 transition-colors ${state.step >= 3 ? 'bg-primary text-white' : 'bg-bg-card border-2 border-border text-text-muted'}">3</div>
            <span class="text-sm font-semibold ${state.step >= 3 ? 'text-primary' : 'text-text-muted'}">Confirm</span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Main Content Area -->
          <div class="lg:col-span-2">
            
            <!-- Step 1: Address -->
            ${state.step === 1 ? `
              <div class="bg-bg-card p-6 rounded shadow animate-fade-in">
                <h2 class="text-2xl font-bold mb-6">Select Delivery Address</h2>
                
                ${addresses.length === 0 ? `
                  <div class="text-center py-8">
                    <p class="mb-4 text-text-muted">You don't have any saved addresses.</p>
                    <a href="#/addresses" class="btn btn-outline">Add New Address</a>
                  </div>
                ` : `
                  <div class="flex flex-col gap-4 mb-6">
                    ${addresses.map(addr => `
                      <label class="flex items-start gap-4 p-4 border rounded cursor-pointer transition-colors hover:border-primary ${state.addressId === addr.id ? 'border-primary bg-primary bg-opacity-5' : 'border-border'}">
                        <input type="radio" name="address_id" value="${addr.id}" class="mt-1" ${state.addressId === addr.id || (addr.isDefault && !state.addressId) ? 'checked' : ''}>
                        <div class="flex-1">
                          <div class="flex items-center gap-2 mb-1">
                            <span class="font-bold">${addr.name}</span>
                            <span class="badge bg-bg-secondary text-xs uppercase px-2 py-0.5 rounded">${addr.type}</span>
                          </div>
                          <p class="text-sm text-text-secondary">${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}</p>
                          <p class="text-sm text-text-secondary">${addr.city}, ${addr.state} - ${addr.pincode}</p>
                          <p class="text-sm text-text-muted mt-1">Phone: ${addr.phone}</p>
                        </div>
                      </label>
                    `).join('')}
                  </div>
                  
                  <div class="flex justify-between items-center pt-4 border-t border-border">
                    <a href="#/addresses" class="text-primary hover:underline text-sm font-semibold">+ Add New Address</a>
                    <button id="btn-step-1" class="btn btn-primary px-8 py-2">Continue to Payment</button>
                  </div>
                `}
              </div>
            ` : ''}

            <!-- Step 2: Payment -->
            ${state.step === 2 ? `
              <div class="bg-bg-card p-6 rounded shadow animate-fade-in">
                <h2 class="text-2xl font-bold mb-6">Select Payment Method</h2>
                
                <div class="flex flex-col gap-4 mb-8">
                  <label class="payment-method flex items-center gap-4 p-4 border rounded cursor-pointer transition-colors hover:border-primary ${state.paymentMethod === 'card' ? 'border-primary bg-primary bg-opacity-5' : 'border-border'}">
                    <input type="radio" name="payment_method" value="card" ${state.paymentMethod === 'card' ? 'checked' : ''}>
                    <i data-lucide="credit-card" class="w-6 h-6 text-primary"></i>
                    <span class="font-semibold flex-1">Credit / Debit Card</span>
                  </label>
                  
                  <!-- Card Form (Fake) -->
                  <div id="card-form" class="${state.paymentMethod === 'card' ? 'block' : 'hidden'} px-4 pb-4 animate-slide-down">
                    <div class="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Card Number" class="form-input col-span-2">
                      <input type="text" placeholder="Name on Card" class="form-input col-span-2">
                      <input type="text" placeholder="MM/YY" class="form-input">
                      <input type="text" placeholder="CVV" class="form-input">
                    </div>
                  </div>

                  <label class="payment-method flex items-center gap-4 p-4 border rounded cursor-pointer transition-colors hover:border-primary ${state.paymentMethod === 'upi' ? 'border-primary bg-primary bg-opacity-5' : 'border-border'}">
                    <input type="radio" name="payment_method" value="upi" ${state.paymentMethod === 'upi' ? 'checked' : ''}>
                    <i data-lucide="smartphone" class="w-6 h-6 text-success"></i>
                    <span class="font-semibold flex-1">UPI</span>
                  </label>

                  <!-- UPI Form (Fake) -->
                  <div id="upi-form" class="${state.paymentMethod === 'upi' ? 'block' : 'hidden'} px-4 pb-4 animate-slide-down">
                    <input type="text" placeholder="Enter UPI ID (e.g., user@upi)" class="form-input w-full">
                  </div>

                  <label class="payment-method flex items-center gap-4 p-4 border rounded cursor-pointer transition-colors hover:border-primary ${state.paymentMethod === 'netbanking' ? 'border-primary bg-primary bg-opacity-5' : 'border-border'}">
                    <input type="radio" name="payment_method" value="netbanking" ${state.paymentMethod === 'netbanking' ? 'checked' : ''}>
                    <i data-lucide="landmark" class="w-6 h-6 text-warning"></i>
                    <span class="font-semibold flex-1">Net Banking</span>
                  </label>

                  <label class="payment-method flex items-center gap-4 p-4 border rounded cursor-pointer transition-colors hover:border-primary ${state.paymentMethod === 'cod' ? 'border-primary bg-primary bg-opacity-5' : 'border-border'}">
                    <input type="radio" name="payment_method" value="cod" ${state.paymentMethod === 'cod' ? 'checked' : ''}>
                    <i data-lucide="banknote" class="w-6 h-6 text-accent"></i>
                    <span class="font-semibold flex-1">Cash on Delivery</span>
                  </label>
                </div>
                
                <div class="flex justify-between items-center pt-4 border-t border-border">
                  <button id="btn-back-1" class="btn btn-ghost px-6">Back</button>
                  <button id="btn-place-order" class="btn btn-primary px-8 py-3 text-lg shadow-md" ${!state.paymentMethod ? 'disabled' : ''}>Place Order</button>
                </div>
              </div>
            ` : ''}

            <!-- Step 3: Confirmation -->
            ${state.step === 3 ? `
              <div class="bg-bg-card p-10 rounded shadow text-center animate-scale-in">
                <div class="w-24 h-24 bg-success text-white rounded-full flex-center mx-auto mb-6 shadow-lg shadow-success/30">
                  <i data-lucide="check" class="w-12 h-12"></i>
                </div>
                <h2 class="text-3xl font-bold mb-2">Order Placed Successfully!</h2>
                <p class="text-text-secondary mb-8">Thank you for shopping with ShopVista. Your order is being processed.</p>
                
                <div class="flex-center gap-4">
                  <a href="#/orders" class="btn btn-primary">View Orders</a>
                  <a href="#/" class="btn btn-outline">Continue Shopping</a>
                </div>
              </div>
            ` : ''}

          </div>

          <!-- Order Summary Sidebar -->
          ${state.step < 3 ? `
            <div class="lg:col-span-1">
              <div class="bg-bg-card p-6 rounded shadow sticky top-24">
                <h3 class="font-bold text-lg mb-4 pb-4 border-b border-border">Order Summary</h3>
                
                <div class="flex flex-col gap-3 mb-6 max-h-64 overflow-y-auto pr-2 scroll-x">
                  ${cart.map(item => `
                    <div class="flex gap-3">
                      <img src="${item.product.images[0]}" alt="" class="w-12 h-12 object-cover rounded bg-bg-secondary p-1">
                      <div class="flex-1 text-sm">
                        <p class="font-semibold line-clamp-1">${item.product.name}</p>
                        <p class="text-text-muted">Qty: ${item.quantity}</p>
                      </div>
                      <span class="font-bold text-sm">₹${(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  `).join('')}
                </div>
                
                <div class="border-t border-border pt-4">
                  <div class="flex-between mb-2 text-sm text-text-secondary">
                    <span>Subtotal</span>
                    <span>₹${totals.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div class="flex-between mb-2 text-sm text-success">
                    <span>Discount</span>
                    <span>- ₹${totals.discount.toLocaleString('en-IN')}</span>
                  </div>
                  <div class="flex-between mb-4 text-sm text-text-secondary">
                    <span>Delivery</span>
                    <span class="${totals.delivery === 0 ? 'text-success' : ''}">${totals.delivery === 0 ? 'FREE' : '₹' + totals.delivery}</span>
                  </div>
                  <div class="flex-between text-xl font-bold border-t border-border pt-4">
                    <span>Total</span>
                    <span>₹${totals.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          ` : ''}

        </div>
      </div>
    </div>
  `;
}

export function init(params) {
  const reRender = () => {
    document.getElementById('app').innerHTML = render(params);
    init(params);
  };

  // Step 1 Events
  const step1Btn = document.getElementById('btn-step-1');
  if (step1Btn) {
    // Initial check for default selected radio
    const selectedRadio = document.querySelector('input[name="address_id"]:checked');
    if (selectedRadio) {
      state.addressId = selectedRadio.value;
    }

    document.querySelectorAll('input[name="address_id"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.addressId = e.target.value;
        reRender(); // Just to update styling if needed, or we can do it via DOM directly. 
        // For simplicity, reRender works.
      });
    });

    step1Btn.addEventListener('click', () => {
      if (!state.addressId) {
        showToast('Please select a delivery address', 'warning');
        return;
      }
      state.step = 2;
      reRender();
    });
  }

  // Step 2 Events
  const back1Btn = document.getElementById('btn-back-1');
  if (back1Btn) {
    document.querySelectorAll('input[name="payment_method"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.paymentMethod = e.target.value;
        reRender();
      });
    });

    back1Btn.addEventListener('click', () => {
      state.step = 1;
      reRender();
    });

    const placeOrderBtn = document.getElementById('btn-place-order');
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', () => {
        if (!state.paymentMethod) return;
        
        // Mock validation
        if (state.paymentMethod === 'card') {
           const inputs = document.querySelectorAll('#card-form input');
           let valid = true;
           inputs.forEach(i => { if(!i.value) valid = false; });
           if (!valid) { showToast('Please fill all card details', 'error'); return; }
        }
        
        const success = placeOrder(state.addressId, state.paymentMethod);
        if (success) {
          state.step = 3;
          reRender();
        } else {
          showToast('Failed to place order', 'error');
        }
      });
    }
  }

  // Reset state if we navigated away and back
  // A simple hack is to clear state when component unmounts, but since it's a module level var, it persists.
  // We should ideally reset on initial load if route params changed, but for this demo, it's fine.

  if (window.lucide) lucide.createIcons();
}
