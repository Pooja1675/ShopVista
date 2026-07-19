export function renderFooter() {
  return `
    <footer class="footer bg-secondary text-white mt-5 pt-5 pb-2">
      <div class="container grid-4 flex-gap mb-4">
        <div class="footer__section">
          <div class="flex-center flex-gap mb-2" style="justify-content: flex-start;">
            <img src="assets/logo.png" alt="ShopVista" height="32" style="border-radius: 4px;">
            <h3 class="text-xl font-bold m-0">ShopVista</h3>
          </div>
          <p class="text-sm text-muted mt-2">
            Your premium destination for the best products across electronics, fashion, home, and more. 
            Quality guaranteed.
          </p>
        </div>
        
        <div class="footer__section">
          <h4 class="footer__title font-semibold mb-3">Quick Links</h4>
          <ul class="footer__links list-none p-0 m-0">
            <li class="mb-2"><a href="#/home" class="text-muted hover:text-white transition">Home</a></li>
            <li class="mb-2"><a href="#/products" class="text-muted hover:text-white transition">All Products</a></li>
            <li class="mb-2"><a href="#/categories" class="text-muted hover:text-white transition">Categories</a></li>
            <li class="mb-2"><a href="#/about" class="text-muted hover:text-white transition">About Us</a></li>
          </ul>
        </div>
        
        <div class="footer__section">
          <h4 class="footer__title font-semibold mb-3">Customer Service</h4>
          <ul class="footer__links list-none p-0 m-0">
            <li class="mb-2"><a href="#/account" class="text-muted hover:text-white transition">My Account</a></li>
            <li class="mb-2"><a href="#/orders" class="text-muted hover:text-white transition">Track Orders</a></li>
            <li class="mb-2"><a href="#/wishlist" class="text-muted hover:text-white transition">Wishlist</a></li>
            <li class="mb-2"><a href="#/returns" class="text-muted hover:text-white transition">Returns Policy</a></li>
          </ul>
        </div>
        
        <div class="footer__section">
          <h4 class="footer__title font-semibold mb-3">Contact Us</h4>
          <ul class="footer__links list-none p-0 m-0">
            <li class="mb-2 flex items-center flex-gap text-sm text-muted">
              <i data-lucide="mail" class="w-4 h-4"></i> support@shopvista.com
            </li>
            <li class="mb-2 flex items-center flex-gap text-sm text-muted">
              <i data-lucide="phone" class="w-4 h-4"></i> +91 98765 43210
            </li>
            <li class="mb-2 flex items-center flex-gap text-sm text-muted">
              <i data-lucide="map-pin" class="w-4 h-4"></i> Mumbai, Maharashtra, India
            </li>
          </ul>
          <div class="flex flex-gap mt-3">
            <a href="#" class="text-muted hover:text-white"><i data-lucide="facebook"></i></a>
            <a href="#" class="text-muted hover:text-white"><i data-lucide="twitter"></i></a>
            <a href="#" class="text-muted hover:text-white"><i data-lucide="instagram"></i></a>
          </div>
        </div>
      </div>
      
      <div class="container border-top pt-3 border-gray-700 flex-between flex-wrap text-sm text-muted">
        <p>&copy; ${new Date().getFullYear()} ShopVista. All rights reserved.</p>
        <div class="flex flex-gap items-center">
          <i data-lucide="credit-card"></i>
          <span>Secure Payments</span>
        </div>
      </div>
    </footer>
  `;
}
