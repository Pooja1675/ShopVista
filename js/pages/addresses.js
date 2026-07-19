import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '../store.js';
import { showModal, hideModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

export function render(params) {
  const addresses = getAddresses();

  return `
    <div class="container mx-auto px-5 py-8">
      <div class="page-header mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 class="text-3xl font-bold">Saved Addresses</h1>
        <button id="btn-add-new" class="btn btn-primary flex items-center gap-2">
          <i data-lucide="plus"></i> Add New Address
        </button>
      </div>

      ${addresses.length === 0 ? `
        <div class="empty-state flex-col flex-center max-w-md mx-auto py-16 text-center">
          <div class="w-24 h-24 bg-bg-secondary rounded-full flex-center mb-6 text-primary opacity-50">
            <i data-lucide="map-pin" class="w-12 h-12"></i>
          </div>
          <h2 class="empty-state__title text-2xl font-bold mb-2">No saved addresses</h2>
          <p class="empty-state__text text-text-muted mb-8">Add an address so you can checkout faster next time.</p>
        </div>
      ` : `
        <div class="grid-3 gap-6">
          ${addresses.map(addr => `
            <div class="address-card bg-bg-card p-6 rounded shadow border-2 ${addr.isDefault ? 'border-primary' : 'border-transparent'} relative flex flex-col">
              ${addr.isDefault ? `<span class="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr">Default</span>` : ''}
              
              <div class="flex items-center gap-2 mb-3">
                <span class="badge bg-bg-secondary text-text-primary px-2 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <i data-lucide="${addr.type === 'home' ? 'home' : 'briefcase'}" class="w-3 h-3"></i> ${addr.type}
                </span>
              </div>
              
              <h3 class="font-bold text-lg mb-1">${addr.name}</h3>
              <p class="text-text-secondary text-sm mb-1">${addr.line1}</p>
              ${addr.line2 ? `<p class="text-text-secondary text-sm mb-1">${addr.line2}</p>` : ''}
              <p class="text-text-secondary text-sm mb-3">${addr.city}, ${addr.state} - ${addr.pincode}</p>
              <p class="text-text-primary text-sm font-semibold mb-6 flex items-center gap-2">
                <i data-lucide="phone" class="w-4 h-4 text-text-muted"></i> ${addr.phone}
              </p>
              
              <div class="address-card__actions mt-auto flex flex-wrap gap-2 pt-4 border-t border-border">
                <button class="btn btn-outline btn-sm flex-1 btn-edit" data-id="${addr.id}">Edit</button>
                <button class="btn btn-outline btn-sm text-error border-border hover:bg-error hover:text-white hover:border-error px-3 btn-delete" data-id="${addr.id}" title="Delete"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                ${!addr.isDefault ? `<button class="btn btn-ghost btn-sm w-full text-xs mt-1 btn-set-default" data-id="${addr.id}">Set as Default</button>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

function getAddressFormHtml(address = null) {
  return `
    <form id="address-form" class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label block mb-1 text-sm font-medium">Full Name</label>
          <input type="text" id="addr-name" class="form-input w-full" required value="${address ? address.name : ''}">
        </div>
        <div class="form-group">
          <label class="form-label block mb-1 text-sm font-medium">Phone Number</label>
          <input type="tel" id="addr-phone" class="form-input w-full" required pattern="[0-9]{10}" placeholder="10-digit number" value="${address ? address.phone : ''}">
        </div>
      </div>
      
      <div class="form-group">
        <label class="form-label block mb-1 text-sm font-medium">Address Line 1</label>
        <input type="text" id="addr-line1" class="form-input w-full" required placeholder="House No, Building, Street" value="${address ? address.line1 : ''}">
      </div>
      
      <div class="form-group">
        <label class="form-label block mb-1 text-sm font-medium">Address Line 2 (Optional)</label>
        <input type="text" id="addr-line2" class="form-input w-full" placeholder="Area, Landmark" value="${address ? (address.line2 || '') : ''}">
      </div>
      
      <div class="grid grid-cols-3 gap-4">
        <div class="form-group">
          <label class="form-label block mb-1 text-sm font-medium">City</label>
          <input type="text" id="addr-city" class="form-input w-full" required value="${address ? address.city : ''}">
        </div>
        <div class="form-group">
          <label class="form-label block mb-1 text-sm font-medium">State</label>
          <input type="text" id="addr-state" class="form-input w-full" required value="${address ? address.state : ''}">
        </div>
        <div class="form-group">
          <label class="form-label block mb-1 text-sm font-medium">PIN Code</label>
          <input type="text" id="addr-pincode" class="form-input w-full" required pattern="[0-9]{6}" placeholder="6 digits" value="${address ? address.pincode : ''}">
        </div>
      </div>
      
      <div class="form-group mt-2">
        <label class="form-label block mb-2 text-sm font-medium">Address Type</label>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="addr-type" value="home" class="form-radio text-primary" ${!address || address.type === 'home' ? 'checked' : ''}>
            <span class="text-sm flex items-center gap-1"><i data-lucide="home" class="w-4 h-4 text-text-muted"></i> Home</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="addr-type" value="work" class="form-radio text-primary" ${address && address.type === 'work' ? 'checked' : ''}>
            <span class="text-sm flex items-center gap-1"><i data-lucide="briefcase" class="w-4 h-4 text-text-muted"></i> Work</span>
          </label>
        </div>
      </div>
      
      <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
        <button type="button" class="btn btn-ghost" onclick="document.querySelector('#modal-container .btn-close').click()">Cancel</button>
        <button type="submit" class="btn btn-primary">${address ? 'Update Address' : 'Save Address'}</button>
      </div>
    </form>
  `;
}

export function init(params) {
  const renderPage = () => {
    const el = document.getElementById('app');
    el.innerHTML = render(params);
    init(params);
  };

  document.getElementById('btn-add-new')?.addEventListener('click', () => {
    showModal('Add New Address', getAddressFormHtml());
    lucide.createIcons();
    bindFormSubmit(null, renderPage);
  });

  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const addr = getAddresses().find(a => a.id === id);
      if (addr) {
        showModal('Edit Address', getAddressFormHtml(addr));
        lucide.createIcons();
        bindFormSubmit(id, renderPage);
      }
    });
  });

  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      showModal('Delete Address', `
        <p class="mb-6 text-text-secondary">Are you sure you want to delete this address?</p>
        <div class="flex justify-end gap-3">
          <button id="modal-btn-cancel" class="btn btn-ghost">Cancel</button>
          <button id="modal-btn-confirm" class="btn btn-danger">Delete</button>
        </div>
      `);
      document.getElementById('modal-btn-cancel')?.addEventListener('click', hideModal);
      document.getElementById('modal-btn-confirm')?.addEventListener('click', () => {
        deleteAddress(id);
        hideModal();
        showToast('Address deleted');
        renderPage();
      });
    });
  });

  document.querySelectorAll('.btn-set-default').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      setDefaultAddress(id);
      showToast('Default address updated');
      renderPage();
    });
  });

  if (window.lucide) lucide.createIcons();
}

function bindFormSubmit(editId, onSuccess) {
  document.getElementById('address-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById('addr-name').value,
      phone: document.getElementById('addr-phone').value,
      line1: document.getElementById('addr-line1').value,
      line2: document.getElementById('addr-line2').value,
      city: document.getElementById('addr-city').value,
      state: document.getElementById('addr-state').value,
      pincode: document.getElementById('addr-pincode').value,
      type: document.querySelector('input[name="addr-type"]:checked').value
    };

    if (editId) {
      updateAddress(editId, data);
      showToast('Address updated successfully');
    } else {
      addAddress(data);
      showToast('Address added successfully');
    }
    
    hideModal();
    onSuccess();
  });
}
