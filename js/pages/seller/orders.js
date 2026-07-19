import { getSellerOrders, updateOrderStatus } from '../../store.js';
import { showToast } from '../../components/toast.js';
import { renderSellerLayout } from './dashboard.js';

let state = {
  activeTab: 'all'
};

export function render(params) {
  const allOrders = getSellerOrders().sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const filteredOrders = state.activeTab === 'all' 
    ? allOrders 
    : allOrders.filter(o => o.status === state.activeTab);

  const tabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'placed', label: 'New' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'placed': 'bg-info text-white',
      'confirmed': 'bg-primary text-white',
      'shipped': 'bg-warning text-white',
      'out_for_delivery': 'bg-warning text-gray-900',
      'delivered': 'bg-success text-white',
      'cancelled': 'bg-error text-white'
    };
    return colors[status] || 'bg-gray-500 text-white';
  };

  const content = `
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h1 class="text-3xl font-bold">Manage Orders <span class="text-lg text-text-muted font-normal ml-2">(${allOrders.length})</span></h1>
    </div>

    <!-- Filter Tabs -->
    <div class="flex overflow-x-auto border-b border-border mb-6 gap-2 no-scrollbar">
      ${tabs.map(tab => `
        <button class="filter-tab px-4 py-3 font-semibold text-sm whitespace-nowrap transition-colors border-b-2 ${state.activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}" data-id="${tab.id}">
          ${tab.label} 
          <span class="ml-1 bg-bg-secondary text-text-secondary px-1.5 py-0.5 rounded text-xs">${tab.id === 'all' ? allOrders.length : allOrders.filter(o=>o.status===tab.id).length}</span>
        </button>
      `).join('')}
    </div>

    <!-- Orders Table -->
    <div class="bg-bg-card rounded shadow-sm border border-border overflow-hidden">
      ${filteredOrders.length === 0 ? `
        <div class="empty-state text-center py-16 px-5">
          <div class="w-20 h-20 bg-bg-secondary rounded-full flex-center mx-auto mb-6 text-primary opacity-50">
            <i data-lucide="shopping-cart" class="w-10 h-10"></i>
          </div>
          <h2 class="text-xl font-bold mb-2">No orders found</h2>
          <p class="text-text-muted mb-6">You have no ${state.activeTab !== 'all' ? state.activeTab : ''} orders at the moment.</p>
        </div>
      ` : `
        <div class="overflow-x-auto">
          <table class="data-table w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr class="bg-bg-secondary text-text-muted text-sm uppercase tracking-wider">
                <th class="p-4 font-semibold w-24">Order ID</th>
                <th class="p-4 font-semibold w-48">Customer</th>
                <th class="p-4 font-semibold w-64">Items</th>
                <th class="p-4 font-semibold w-24">Date</th>
                <th class="p-4 font-semibold w-24">Total</th>
                <th class="p-4 font-semibold w-40">Status Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              ${filteredOrders.map(o => `
                <tr class="hover:bg-bg-secondary transition-colors align-top">
                  <td class="p-4 font-medium text-sm">#${o.id}</td>
                  <td class="p-4 text-sm">
                    <p class="font-bold mb-1">${o.address.name}</p>
                    <p class="text-text-muted text-xs">${o.address.city}, ${o.address.state}</p>
                    <p class="text-text-muted text-xs mt-1"><i data-lucide="phone" class="w-3 h-3 inline"></i> ${o.address.phone}</p>
                  </td>
                  <td class="p-4">
                    <div class="flex flex-col gap-2">
                      ${o.items.map(item => `
                        <div class="flex gap-2 items-start text-sm">
                          <img src="${item.image}" class="w-8 h-8 rounded object-cover border border-border shrink-0">
                          <div>
                            <p class="font-semibold line-clamp-1 leading-tight">${item.name}</p>
                            <p class="text-xs text-text-muted">Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  </td>
                  <td class="p-4 text-sm text-text-secondary whitespace-nowrap">${new Date(o.date).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'})}</td>
                  <td class="p-4 font-bold text-sm text-text-primary">₹${o.total.toLocaleString('en-IN')}</td>
                  <td class="p-4">
                    ${o.status === 'delivered' || o.status === 'cancelled' ? `
                      <span class="badge ${getStatusColor(o.status)} px-3 py-1 rounded text-xs font-bold uppercase w-full inline-block text-center shadow-sm">${o.status.replace(/_/g, ' ')}</span>
                    ` : `
                      <select class="form-select text-sm font-semibold w-full bg-white status-dropdown" data-id="${o.id}">
                        <option value="placed" ${o.status === 'placed' ? 'selected' : ''}>Placed</option>
                        <option value="confirmed" ${o.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="out_for_delivery" ${o.status === 'out_for_delivery' ? 'selected' : ''}>Out for Delivery</option>
                        <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                      </select>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;

  return renderSellerLayout('orders', content);
}

export function init(params) {
  // Handle tab clicks
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      state.activeTab = e.currentTarget.dataset.id;
      document.getElementById('app').innerHTML = render(params);
      init(params);
    });
  });

  // Handle status updates
  document.querySelectorAll('.status-dropdown').forEach(select => {
    select.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      const newStatus = e.target.value;
      updateOrderStatus(id, newStatus);
      showToast(`Order status updated to ${newStatus.replace(/_/g, ' ')}`, 'success');
      
      // small delay for UX, then re-render
      setTimeout(() => {
        document.getElementById('app').innerHTML = render(params);
        init(params);
      }, 500);
    });
  });

  if (window.lucide) lucide.createIcons();
}
