export function renderStars(rating, maxStars = 5) {
  let html = '<div class="flex text-accent">';
  for (let i = 1; i <= maxStars; i++) {
    if (rating >= i) {
      html += `<i data-lucide="star" fill="currentColor" class="w-4 h-4"></i>`;
    } else if (rating >= i - 0.5) {
      // Simple half star logic if lucide doesn't have a half star out of the box, we just use star but could style it
      html += `<i data-lucide="star" fill="currentColor" class="w-4 h-4 opacity-50"></i>`;
    } else {
      html += `<i data-lucide="star" class="w-4 h-4"></i>`;
    }
  }
  html += '</div>';
  return html;
}

export function renderInteractiveStars(name, value = 0) {
  return `
    <div class="interactive-stars flex text-accent cursor-pointer" data-name="${name}">
      <input type="hidden" name="${name}" value="${value}">
      ${[1, 2, 3, 4, 5].map(i => `
        <i data-lucide="star" data-value="${i}" class="w-6 h-6 star-icon ${i <= value ? 'fill-current' : ''}" style="${i <= value ? 'fill: currentColor;' : ''}"></i>
      `).join('')}
    </div>
  `;
}

export function initInteractiveStars(container = document) {
  const starContainers = container.querySelectorAll('.interactive-stars');
  
  starContainers.forEach(wrapper => {
    const stars = wrapper.querySelectorAll('.star-icon');
    const input = wrapper.querySelector('input');
    
    stars.forEach(star => {
      star.addEventListener('mouseover', (e) => {
        const val = parseInt(star.getAttribute('data-value'));
        stars.forEach(s => {
          if (parseInt(s.getAttribute('data-value')) <= val) {
            s.style.fill = 'currentColor';
          } else {
            s.style.fill = 'none';
          }
        });
      });
      
      star.addEventListener('mouseout', () => {
        const currentVal = parseInt(input.value);
        stars.forEach(s => {
          if (parseInt(s.getAttribute('data-value')) <= currentVal) {
            s.style.fill = 'currentColor';
          } else {
            s.style.fill = 'none';
          }
        });
      });
      
      star.addEventListener('click', () => {
        const val = parseInt(star.getAttribute('data-value'));
        input.value = val;
        stars.forEach(s => {
          if (parseInt(s.getAttribute('data-value')) <= val) {
            s.style.fill = 'currentColor';
          } else {
            s.style.fill = 'none';
          }
        });
      });
    });
  });
}
