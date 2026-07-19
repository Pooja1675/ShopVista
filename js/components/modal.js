export function showModal(title, contentHTML, options = {}) {
  let container = document.getElementById('modal-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'modal-container';
    document.body.appendChild(container);
  }

  const {
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm = null,
    onCancel = null,
    showFooter = true
  } = options;

  container.innerHTML = `
    <div class="fixed inset-0 z-50 flex-center bg-black bg-opacity-50 transition-opacity animate-fade-in modal-overlay" style="background: rgba(0,0,0,0.5);">
      <div class="bg-card rounded shadow-lg max-w-lg w-full m-4 animate-scale-in flex flex-col" style="max-height: 90vh;">
        <div class="p-4 border-bottom flex-between items-center">
          <h2 class="text-xl font-bold m-0">${title}</h2>
          <button class="btn-icon modal-close-btn text-muted hover:text-primary">
            <i data-lucide="x"></i>
          </button>
        </div>
        
        <div class="p-4 overflow-y-auto" style="flex-grow: 1;">
          ${contentHTML}
        </div>
        
        ${showFooter ? `
          <div class="p-4 border-top flex justify-end flex-gap">
            <button class="btn btn-outline modal-cancel-btn">${cancelText}</button>
            <button class="btn btn-primary modal-confirm-btn">${confirmText}</button>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons({ root: container });
  }

  const overlay = container.querySelector('.modal-overlay');
  const closeBtn = container.querySelector('.modal-close-btn');
  const cancelBtn = container.querySelector('.modal-cancel-btn');
  const confirmBtn = container.querySelector('.modal-confirm-btn');

  const close = () => {
    overlay.classList.remove('animate-fade-in');
    overlay.classList.add('opacity-0');
    setTimeout(() => {
      container.innerHTML = '';
    }, 200);
  };

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (cancelBtn) cancelBtn.addEventListener('click', () => {
    if (onCancel) onCancel();
    close();
  });
  if (confirmBtn) confirmBtn.addEventListener('click', () => {
    if (onConfirm) onConfirm();
    close();
  });
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      if (onCancel) onCancel();
      close();
    }
  });

  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      if (onCancel) onCancel();
      close();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}

export function hideModal() {
  const container = document.getElementById('modal-container');
  if (container) {
    container.innerHTML = '';
  }
}
