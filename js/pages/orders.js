import { getOrders, updateOrderStatus } from '../store.js';
import { showModal, hideModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

export function render(params) {
  const orders = getOrders().sort((a, b) => new Date(b.date) - new Date(a.date));

  if (orders.length === 0) {
    return `
      <div class="container mx-auto px-5 py-16 text-center">
        <div class="empty-state flex-col flex-center max-w-md mx-auto">
          <div class="w-24 h-24 bg-bg-secondary rounded-full flex-center mb-6 text-primary opacity-50">
            <i data-lucide="package" class="w-12 h-12"></i>
          </div>
          <h2 class="empty-state__title text-2xl font-bold mb-2">No orders yet</h2>
          <p class="empty-state__text text-text-muted mb-8">You haven't placed any orders. Start shopping to see your orders here.</p>
          <a href="#/products" class="btn btn-primary btn-lg">Start Shopping</a>
        </div>
      </div>
    `;
  }

  const getStatusColor = (status) => {
    const colors = {
      'placed': 'bg-info',
      'confirmed': 'bg-primary',
      'shipped': 'bg-warning',
      'out_for_delivery': 'bg-warning text-gray-900',
      'delivered': 'bg-success',
      'cancelled': 'bg-error'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusText = (status) => status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return `
    <div class="container mx-auto px-5 py-8 max-w-4xl">
      <div class="page-header mb-8">
        <h1 class="text-3xl font-bold">My Orders</h1>
      </div>

      <div class="flex flex-col gap-6">
        ${orders.map(order => {
          const date = new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
          const isCancellable = order.status === 'placed' || order.status === 'confirmed';
          
          return `
            <div class="order-card bg-bg-card rounded shadow overflow-hidden border border-border">
              <div class="order-header bg-bg-secondary p-4 flex flex-wrap justify-between items-center gap-4 border-b border-border">
                <div class="flex flex-wrap gap-6 text-sm">
                  <div>
                    <span class="text-text-muted block text-xs uppercase font-bold tracking-wider mb-1">Order Placed</span>
                    <span class="font-semibold">${date}</span>
                  </div>
                  <div>
                    <span class="text-text-muted block text-xs uppercase font-bold tracking-wider mb-1">Total</span>
                    <span class="font-semibold">₹${order.total.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span class="text-text-muted block text-xs uppercase font-bold tracking-wider mb-1">Ship To</span>
                    <span class="font-semibold text-primary cursor-help" title="${order.address.line1}, ${order.address.city}">${order.address.name}</span>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-text-muted block text-xs uppercase font-bold tracking-wider mb-1">Order ID</span>
                  <span class="font-semibold text-sm">#${order.id}</span>
                </div>
              </div>

              <div class="p-5 flex flex-col md:flex-row gap-6 items-start">
                <div class="order-items flex-1 w-full">
                  <div class="flex items-center gap-3 mb-4">
                    <h3 class="font-bold text-lg">Status: </h3>
                    <span class="badge ${getStatusColor(order.status)} text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm">${getStatusText(order.status)}</span>
                  </div>
                  
                  <div class="flex flex-col gap-4">
                    ${order.items.map(item => `
                      <div class="flex items-center gap-4">
                        <a href="#/product/${item.productId}" class="w-16 h-16 bg-bg-secondary rounded p-1 shrink-0 flex-center">
                          <img src="${item.image}" alt="${item.name}" class="max-w-full max-h-full object-contain">
                        </a>
                        <div class="flex-1">
                          <a href="#/product/${item.productId}" class="font-semibold hover:text-primary transition-colors line-clamp-1">${item.name}</a>
                          <div class="text-sm text-text-muted mt-1">Qty: ${item.quantity} | ₹${item.price.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <div class="order-actions w-full md:w-48 flex flex-col gap-2 shrink-0 md:border-l md:border-border md:pl-6">
                  <button class="btn btn-outline w-full btn-track" data-id="${order.id}">Track Order</button>
                  ${isCancellable ? `<button class="btn btn-ghost text-error hover:bg-error hover:bg-opacity-10 w-full btn-cancel" data-id="${order.id}">Cancel Order</button>` : ''}
                  <a href="#/product/${order.items[0].productId}" class="btn btn-ghost w-full">Write a Review</a>
                </div>
              </div>

              <!-- Timeline (Hidden initially) -->
              <div id="timeline-${order.id}" class="order-timeline hidden bg-bg-secondary p-6 border-t border-border">
                ${renderTimeline(order.status)}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderTimeline(currentStatus) {
  const steps = ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'];
  const labels = ['Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
  
  if (currentStatus === 'cancelled') {
    return `
      <div class="flex-center py-4 text-error flex-col gap-2">
        <i data-lucide="x-circle" class="w-10 h-10"></i>
        <span class="font-bold">This order was cancelled.</span>
      </div>
    `;
  }

  const currentIndex = steps.indexOf(currentStatus);
  
  return `
    <div class="relative flex justify-between items-center max-w-2xl mx-auto w-full">
      <!-- Background Line -->
      <div class="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 z-0"></div>
      
      <!-- Active Progress Line -->
      <div class="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500" style="width: ${currentIndex === -1 ? 0 : (currentIndex / (steps.length - 1)) * 100}%"></div>

      ${steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const isPending = index > currentIndex;
        
        let circleClass = 'bg-bg-card border-2 border-border text-text-muted';
        let iconHtml = `<span class="w-3 h-3 rounded-full bg-border"></span>`;
        
        if (isCompleted) {
          circleClass = 'bg-primary border-2 border-primary text-white';
          iconHtml = `<i data-lucide="check" class="w-5 h-5"></i>`;
        } else if (isActive) {
          circleClass = 'bg-bg-card border-4 border-primary text-primary shadow-[0_0_0_4px_rgba(37,99,235,0.2)]';
          iconHtml = `<span class="w-3 h-3 rounded-full bg-primary animate-pulse"></span>`;
        }

        return `
          <div class="timeline-step flex flex-col items-center relative z-10 w-20">
            <div class="w-10 h-10 rounded-full flex-center transition-colors duration-300 ${circleClass} mb-2 bg-bg-card">
              ${iconHtml}
            </div>
            <span class="text-xs font-semibold text-center ${isActive ? 'text-primary' : (isCompleted ? 'text-text-primary' : 'text-text-muted')}">${labels[index]}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

export function init(params) {
  document.querySelectorAll('.btn-track').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      const timeline = document.getElementById(`timeline-${id}`);
      timeline.classList.toggle('hidden');
    });
  });

  document.querySelectorAll('.btn-cancel').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      
      showModal('Cancel Order', `
        <p class="mb-6 text-text-secondary">Are you sure you want to cancel order #${id}? This action cannot be undone.</p>
        <div class="flex justify-end gap-3">
          <button id="modal-btn-no" class="btn btn-ghost">No, Keep It</button>
          <button id="modal-btn-yes" class="btn btn-danger">Yes, Cancel Order</button>
        </div>
      `);

      document.getElementById('modal-btn-no')?.addEventListener('click', hideModal);
      document.getElementById('modal-btn-yes')?.addEventListener('click', () => {
        updateOrderStatus(id, 'cancelled');
        hideModal();
        showToast('Order cancelled successfully', 'info');
        // re-render
        document.getElementById('app').innerHTML = render(params);
        init(params);
      });
    });
  });

  if (window.lucide) lucide.createIcons();
}
