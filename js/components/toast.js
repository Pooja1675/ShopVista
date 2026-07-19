export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'position-fixed bottom-4 right-4 z-50 flex flex-col flex-gap';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast flex items-center p-3 rounded shadow-lg bg-card border-l-4 animate-slide-up transition-all`;
  
  let icon = 'check-circle';
  let colorClass = 'text-success';
  if (type === 'error') {
    icon = 'x-circle';
    colorClass = 'text-danger border-error';
    toast.style.borderLeftColor = 'var(--error)';
  } else if (type === 'warning') {
    icon = 'alert-triangle';
    colorClass = 'text-warning border-warning';
    toast.style.borderLeftColor = 'var(--warning)';
  } else if (type === 'info') {
    icon = 'info';
    colorClass = 'text-info border-info';
    toast.style.borderLeftColor = 'var(--info)';
  } else {
    toast.style.borderLeftColor = 'var(--success)';
  }

  toast.innerHTML = `
    <i data-lucide="${icon}" class="${colorClass} mr-2"></i>
    <span class="font-medium flex-1">${message}</span>
    <button class="btn-icon ml-3 text-muted hover:text-primary toast-close-btn">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  `;

  container.appendChild(toast);

  if (window.lucide) {
    window.lucide.createIcons({ root: toast });
  }

  const closeBtn = toast.querySelector('.toast-close-btn');
  const removeToast = () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  };

  closeBtn.addEventListener('click', removeToast);

  setTimeout(removeToast, 3000);
}
