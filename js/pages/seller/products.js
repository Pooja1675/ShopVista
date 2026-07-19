import { getSellerProducts, deleteProduct } from '../../store.js';
import { showModal, hideModal } from '../../components/modal.js';
import { showToast } from '../../components/toast.js';
import { navigate } from '../../router.js';
import { renderSellerLayout } from './dashboard.js';

export function render(params) {
  const products = getSellerProducts();

  const content = `
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h1 class="text-3xl font-bold">My Products <span class="text-lg text-text-muted font-normal ml-2">(${products.length})</span></h1>
      <a href="#/seller/add-product" class="btn btn-primary shadow-sm"><i data-lucide="plus" class="w-4 h-4 mr-2"></i> Add New Product</a>
    </div>

    <div class="bg-bg-card rounded shadow-sm border border-border overflow-hidden">
      ${products.length === 0 ? `
        <div class="empty-state text-center py-16 px-5">
          <div class="w-20 h-20 bg-bg-secondary rounded-full flex-center mx-auto mb-6 text-primary opacity-50">
            <i data-lucide="package-search" class="w-10 h-10"></i>
          </div>
          <h2 class="text-xl font-bold mb-2">No products found</h2>
          <p class="text-text-muted mb-6">You haven't listed any products yet. Add your first product to start selling!</p>
          <a href="#/seller/add-product" class="btn btn-primary">Add Product</a>
        </div>
      ` : `
        <div class="overflow-x-auto">
          <table class="data-table w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr class="bg-bg-secondary text-text-muted text-sm uppercase tracking-wider">
                <th class="p-4 font-semibold">Product</th>
                <th class="p-4 font-semibold">Category</th>
                <th class="p-4 font-semibold">Price</th>
                <th class="p-4 font-semibold">Stock</th>
                <th class="p-4 font-semibold">Status</th>
                <th class="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              ${products.map(p => `
                <tr class="hover:bg-bg-secondary transition-colors">
                  <td class="p-4">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 rounded bg-white p-1 border border-border flex-center shrink-0">
                        <img src="${p.images[0]}" alt="" class="max-w-full max-h-full object-contain">
                      </div>
                      <div class="flex-1">
                        <a href="#/product/${p.id}" class="font-bold text-sm hover:text-primary transition-colors line-clamp-1" target="_blank">${p.name}</a>
                        <p class="text-xs text-text-muted mt-1">ID: ${p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td class="p-4 text-sm">
                    <span class="badge bg-bg-secondary border border-border text-text-primary px-2 py-1 rounded">${p.category}</span>
                  </td>
                  <td class="p-4 font-semibold text-sm">₹${p.price.toLocaleString('en-IN')}</td>
                  <td class="p-4 text-sm">
                    <span class="${p.stock === 0 ? 'text-error font-bold' : (p.stock < 10 ? 'text-warning font-bold' : 'text-text-primary')}">${p.stock} units</span>
                  </td>
                  <td class="p-4">
                    <span class="badge ${p.stock > 0 ? 'bg-success' : 'bg-error'} text-white px-2 py-1 rounded text-xs font-bold uppercase">
                      ${p.stock > 0 ? 'Active' : 'Out of Stock'}
                    </span>
                  </td>
                  <td class="p-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <a href="#/seller/edit-product/${p.id}" class="btn btn-outline btn-sm p-2 text-primary border-border hover:border-primary" title="Edit"><i data-lucide="edit" class="w-4 h-4"></i></a>
                      <button class="btn btn-outline btn-sm p-2 text-error border-border hover:border-error hover:bg-error hover:text-white btn-delete" data-id="${p.id}" title="Delete"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;

  return renderSellerLayout('products', content);
}

export function init(params) {
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      
      showModal('Delete Product', `
        <p class="mb-6 text-text-secondary">Are you sure you want to delete this product? This action cannot be undone.</p>
        <div class="flex justify-end gap-3">
          <button id="modal-btn-cancel" class="btn btn-ghost">Cancel</button>
          <button id="modal-btn-confirm" class="btn btn-danger">Delete Product</button>
        </div>
      `);
      
      document.getElementById('modal-btn-cancel')?.addEventListener('click', hideModal);
      document.getElementById('modal-btn-confirm')?.addEventListener('click', () => {
        deleteProduct(id);
        hideModal();
        showToast('Product deleted successfully');
        document.getElementById('app').innerHTML = render(params);
        init(params);
      });
    });
  });

  if (window.lucide) lucide.createIcons();
}
