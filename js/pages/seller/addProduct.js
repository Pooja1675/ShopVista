import { getProductById, addProduct, updateProduct, getCategories } from '../../store.js';
import { navigate } from '../../router.js';
import { showToast } from '../../components/toast.js';
import { renderSellerLayout } from './dashboard.js';

export function render(params) {
  const isEdit = !!params.id;
  let p = null;
  if (isEdit) {
    p = getProductById(params.id);
    if (!p) {
      return renderSellerLayout('edit', `<div class="p-10 text-center text-error font-bold text-xl">Product not found</div>`);
    }
  }

  const categories = getCategories();

  // Helper to escape quotes in html
  const esc = (str) => (str ? str.toString().replace(/"/g, '&quot;') : '');

  const content = `
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-3xl font-bold">${isEdit ? 'Edit Product' : 'Add New Product'}</h1>
      <a href="#/seller/products" class="btn btn-outline btn-sm">Cancel</a>
    </div>

    <form id="product-form" class="seller-product-form bg-bg-card rounded shadow-sm border border-border p-6 max-w-4xl">
      <input type="hidden" id="prod-id" value="${isEdit ? p.id : ''}">
      
      <!-- Basic Info -->
      <h2 class="text-lg font-bold mb-4 pb-2 border-b border-border">Basic Information</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="form-group md:col-span-2">
          <label class="form-label block mb-1 text-sm font-semibold">Product Name <span class="text-error">*</span></label>
          <input type="text" id="prod-name" class="form-input w-full" required placeholder="e.g. Sony WH-1000XM4 Wireless Headphones" value="${esc(p?.name)}">
        </div>
        
        <div class="form-group">
          <label class="form-label block mb-1 text-sm font-semibold">Category <span class="text-error">*</span></label>
          <select id="prod-category" class="form-select w-full" required>
            <option value="">Select Category</option>
            ${categories.map(c => `<option value="${c.name}" ${p?.category === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label block mb-1 text-sm font-semibold">Brand <span class="text-error">*</span></label>
          <input type="text" id="prod-brand" class="form-input w-full" required placeholder="e.g. Sony" value="${esc(p?.brand)}">
        </div>
      </div>

      <!-- Pricing & Inventory -->
      <h2 class="text-lg font-bold mb-4 pb-2 border-b border-border">Pricing & Inventory</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="form-group">
          <label class="form-label block mb-1 text-sm font-semibold">Selling Price (₹) <span class="text-error">*</span></label>
          <input type="number" id="prod-price" class="form-input w-full" required min="1" placeholder="Current Price" value="${p?.price || ''}">
        </div>
        
        <div class="form-group">
          <label class="form-label block mb-1 text-sm font-semibold">Original Price (₹)</label>
          <input type="number" id="prod-original-price" class="form-input w-full" min="1" placeholder="MRP" value="${p?.originalPrice || ''}">
        </div>
        
        <div class="form-group">
          <label class="form-label block mb-1 text-sm font-semibold">Stock Quantity <span class="text-error">*</span></label>
          <input type="number" id="prod-stock" class="form-input w-full" required min="0" placeholder="Available stock" value="${p?.stock ?? 10}">
        </div>
      </div>

      <!-- Details -->
      <h2 class="text-lg font-bold mb-4 pb-2 border-b border-border">Details</h2>
      <div class="form-group mb-6">
        <label class="form-label block mb-1 text-sm font-semibold">Description <span class="text-error">*</span></label>
        <textarea id="prod-desc" class="form-textarea w-full" rows="4" required placeholder="Detailed product description...">${esc(p?.description)}</textarea>
      </div>

      <div class="form-group mb-6">
        <label class="form-label block mb-1 text-sm font-semibold">Features (One per line)</label>
        <textarea id="prod-features" class="form-textarea w-full" rows="4" placeholder="e.g. Active Noise Cancellation\n30-hour battery life">${p?.features ? p.features.join('\n') : ''}</textarea>
      </div>

      <div class="form-group mb-8">
        <label class="form-label block mb-1 text-sm font-semibold">Tags (Comma separated)</label>
        <input type="text" id="prod-tags" class="form-input w-full" placeholder="e.g. wireless, headphones, audio" value="${p?.tags ? p.tags.join(', ') : ''}">
      </div>

      <!-- Images -->
      <h2 class="text-lg font-bold mb-4 pb-2 border-b border-border flex items-center justify-between">
        <span>Images (URLs) <span class="text-error">*</span></span>
        <button type="button" id="btn-add-image" class="btn btn-outline btn-sm"><i data-lucide="plus" class="w-4 h-4 mr-1"></i> Add URL</button>
      </h2>
      <div id="images-container" class="flex flex-col gap-3 mb-8">
        ${p?.images ? p.images.map(img => getImageInputHtml(img)).join('') : getImageInputHtml('')}
      </div>

      <!-- Specifications -->
      <h2 class="text-lg font-bold mb-4 pb-2 border-b border-border flex items-center justify-between">
        Specifications
        <button type="button" id="btn-add-spec" class="btn btn-outline btn-sm"><i data-lucide="plus" class="w-4 h-4 mr-1"></i> Add Spec</button>
      </h2>
      <div id="specs-container" class="flex flex-col gap-3 mb-8">
        ${p?.specifications && Object.keys(p.specifications).length > 0 ? 
          Object.entries(p.specifications).map(([k, v]) => getSpecInputHtml(k, v)).join('') : 
          getSpecInputHtml('', '')}
      </div>

      <div class="flex justify-end gap-4 pt-6 border-t border-border">
        <button type="button" class="btn btn-ghost" onclick="window.history.back()">Cancel</button>
        <button type="submit" class="btn btn-primary px-8">${isEdit ? 'Update Product' : 'Save Product'}</button>
      </div>
    </form>
  `;

  return renderSellerLayout(isEdit ? 'edit' : 'add-product', content);
}

function getImageInputHtml(val) {
  return `
    <div class="flex items-center gap-3 image-row">
      <input type="url" class="form-input flex-1 img-url" placeholder="https://example.com/image.jpg" required value="${val}">
      <div class="w-10 h-10 border border-border rounded bg-bg-secondary flex-center shrink-0 overflow-hidden">
        ${val ? `<img src="${val}" class="w-full h-full object-cover">` : `<i data-lucide="image" class="w-4 h-4 text-text-muted"></i>`}
      </div>
      <button type="button" class="btn btn-outline btn-icon text-error border-transparent hover:border-error hover:bg-error hover:bg-opacity-10 btn-remove-row"><i data-lucide="trash-2"></i></button>
    </div>
  `;
}

function getSpecInputHtml(key, val) {
  return `
    <div class="flex items-center gap-3 spec-row">
      <input type="text" class="form-input flex-1 spec-key" placeholder="Key (e.g. Weight)" value="${key}">
      <input type="text" class="form-input flex-1 spec-val" placeholder="Value (e.g. 250g)" value="${val}">
      <button type="button" class="btn btn-outline btn-icon text-error border-transparent hover:border-error hover:bg-error hover:bg-opacity-10 btn-remove-row"><i data-lucide="trash-2"></i></button>
    </div>
  `;
}

export function init(params) {
  // Add image row
  document.getElementById('btn-add-image')?.addEventListener('click', () => {
    const container = document.getElementById('images-container');
    container.insertAdjacentHTML('beforeend', getImageInputHtml(''));
    if (window.lucide) lucide.createIcons();
    bindRemoveButtons();
    bindImagePreviews();
  });

  // Add spec row
  document.getElementById('btn-add-spec')?.addEventListener('click', () => {
    const container = document.getElementById('specs-container');
    container.insertAdjacentHTML('beforeend', getSpecInputHtml('', ''));
    if (window.lucide) lucide.createIcons();
    bindRemoveButtons();
  });

  function bindRemoveButtons() {
    document.querySelectorAll('.btn-remove-row').forEach(btn => {
      // Avoid multiple bindings by removing old ones
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener('click', (e) => {
        const row = e.currentTarget.closest('.image-row, .spec-row');
        if (row.parentNode.children.length > 1) {
          row.remove();
        } else {
          // just clear it if it's the last one
          row.querySelectorAll('input').forEach(i => i.value = '');
          const img = row.querySelector('img');
          if (img) img.outerHTML = `<i data-lucide="image" class="w-4 h-4 text-text-muted"></i>`;
          if (window.lucide) lucide.createIcons();
        }
      });
    });
  }

  function bindImagePreviews() {
    document.querySelectorAll('.img-url').forEach(input => {
      input.addEventListener('input', (e) => {
        const val = e.target.value;
        const previewDiv = e.target.nextElementSibling;
        if (val && val.match(/^https?:\/\//)) {
          previewDiv.innerHTML = `<img src="${val}" class="w-full h-full object-cover" onerror="this.outerHTML='<i data-lucide=\\'alert-circle\\' class=\\'w-4 h-4 text-error\\'></i>'">`;
        } else {
          previewDiv.innerHTML = `<i data-lucide="image" class="w-4 h-4 text-text-muted"></i>`;
        }
        if (window.lucide) lucide.createIcons();
      });
    });
  }

  bindRemoveButtons();
  bindImagePreviews();

  // Form submit
  document.getElementById('product-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const price = parseInt(document.getElementById('prod-price').value);
    const originalPrice = parseInt(document.getElementById('prod-original-price').value || price);
    if (price <= 0) { showToast('Price must be greater than 0', 'error'); return; }

    const images = Array.from(document.querySelectorAll('.img-url')).map(i => i.value.trim()).filter(Boolean);
    if (images.length === 0) { showToast('At least one image URL is required', 'error'); return; }

    const specs = {};
    document.querySelectorAll('.spec-row').forEach(row => {
      const k = row.querySelector('.spec-key').value.trim();
      const v = row.querySelector('.spec-val').value.trim();
      if (k && v) specs[k] = v;
    });

    const featuresRaw = document.getElementById('prod-features').value.trim();
    const features = featuresRaw ? featuresRaw.split('\n').map(f => f.trim()).filter(Boolean) : [];
    
    const tagsRaw = document.getElementById('prod-tags').value.trim();
    const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : [];

    const productData = {
      name: document.getElementById('prod-name').value.trim(),
      category: document.getElementById('prod-category').value,
      brand: document.getElementById('prod-brand').value.trim(),
      price,
      originalPrice,
      discount: originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
      stock: parseInt(document.getElementById('prod-stock').value),
      description: document.getElementById('prod-desc').value.trim(),
      features,
      specifications: specs,
      images,
      tags
    };

    const editId = document.getElementById('prod-id').value;
    if (editId) {
      updateProduct(editId, productData);
      showToast('Product updated successfully!');
    } else {
      addProduct(productData);
      showToast('Product added successfully!');
    }

    setTimeout(() => { navigate('#/seller/products'); }, 1000);
  });

  if (window.lucide) lucide.createIcons();
}
