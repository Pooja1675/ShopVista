import { login, signup, getUser, isSeller } from '../store.js';
import { navigate } from '../router.js';
import { showToast } from '../components/toast.js';

export function render(params) {
  return `
    <div class="login-page min-h-[80vh] flex-center py-12 px-5 bg-bg-secondary relative">
      <!-- Decorative background -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-0 right-0 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-secondary opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div class="login-card w-full max-w-md bg-bg-card p-8 rounded-lg shadow-lg relative z-10 animate-scale-in">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold mb-2">Welcome Back</h1>
          <p class="text-text-muted text-sm">Please login or sign up to continue</p>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-border mb-6">
          <button id="tab-login" class="flex-1 py-3 font-semibold text-primary border-b-2 border-primary transition-colors">Login</button>
          <button id="tab-signup" class="flex-1 py-3 font-semibold text-text-muted border-b-2 border-transparent hover:text-text-primary transition-colors">Sign Up</button>
        </div>

        <!-- Login Form -->
        <form id="form-login" class="flex flex-col gap-4">
          <div class="form-group">
            <label class="form-label block mb-1 text-sm font-medium">Email Address</label>
            <div class="relative">
              <i data-lucide="mail" class="absolute left-3 top-3 w-5 h-5 text-text-muted"></i>
              <input type="email" id="login-email" class="form-input w-full pl-10 py-2 border rounded focus:ring-2 focus:ring-primary outline-none" required placeholder="name@example.com">
            </div>
          </div>
          <div class="form-group mb-2">
            <div class="flex-between mb-1">
              <label class="form-label block text-sm font-medium">Password</label>
              <a href="#" class="text-xs text-primary hover:underline">Forgot password?</a>
            </div>
            <div class="relative">
              <i data-lucide="lock" class="absolute left-3 top-3 w-5 h-5 text-text-muted"></i>
              <input type="password" id="login-password" class="form-input w-full pl-10 py-2 border rounded focus:ring-2 focus:ring-primary outline-none" required placeholder="••••••••">
            </div>
          </div>
          <div class="flex items-center gap-2 mb-4">
            <input type="checkbox" id="remember-me" class="form-checkbox">
            <label for="remember-me" class="text-sm cursor-pointer">Remember me</label>
          </div>
          <button type="submit" class="btn btn-primary w-full py-2">Login</button>
        </form>

        <!-- Signup Form (Hidden initially) -->
        <form id="form-signup" class="flex flex-col gap-4 hidden">
          <div class="form-group">
            <label class="form-label block mb-1 text-sm font-medium">Full Name</label>
            <div class="relative">
              <i data-lucide="user" class="absolute left-3 top-3 w-5 h-5 text-text-muted"></i>
              <input type="text" id="signup-name" class="form-input w-full pl-10 py-2 border rounded focus:ring-2 focus:ring-primary outline-none" required placeholder="John Doe">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label block mb-1 text-sm font-medium">Email Address</label>
            <div class="relative">
              <i data-lucide="mail" class="absolute left-3 top-3 w-5 h-5 text-text-muted"></i>
              <input type="email" id="signup-email" class="form-input w-full pl-10 py-2 border rounded focus:ring-2 focus:ring-primary outline-none" required placeholder="name@example.com">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label block mb-1 text-sm font-medium">Password</label>
            <div class="relative">
              <i data-lucide="lock" class="absolute left-3 top-3 w-5 h-5 text-text-muted"></i>
              <input type="password" id="signup-password" class="form-input w-full pl-10 py-2 border rounded focus:ring-2 focus:ring-primary outline-none" required placeholder="••••••••">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label block mb-1 text-sm font-medium">Confirm Password</label>
            <div class="relative">
              <i data-lucide="lock" class="absolute left-3 top-3 w-5 h-5 text-text-muted"></i>
              <input type="password" id="signup-confirm" class="form-input w-full pl-10 py-2 border rounded focus:ring-2 focus:ring-primary outline-none" required placeholder="••••••••">
            </div>
          </div>
          <div class="form-group mt-2">
            <label class="form-label block mb-2 text-sm font-medium">Account Type</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="role" value="customer" class="form-radio text-primary" checked>
                <span class="text-sm">Customer</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="role" value="seller" class="form-radio text-primary">
                <span class="text-sm">Seller</span>
              </label>
            </div>
          </div>
          <button type="submit" class="btn btn-primary w-full py-2 mt-2">Create Account</button>
        </form>

        <div class="divider flex items-center my-6 text-text-muted before:flex-1 before:border-t before:border-border after:flex-1 after:border-t after:border-border">
          <span class="px-3 text-xs uppercase font-semibold">Or</span>
        </div>

        <div class="flex gap-4">
          <button type="button" class="btn btn-outline flex-1 py-2 flex-center gap-2 btn-social-demo"><i data-lucide="facebook" class="w-4 h-4 text-blue-600"></i> Facebook</button>
          <button type="button" class="btn btn-outline flex-1 py-2 flex-center gap-2 btn-social-demo">
            <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            Google
          </button>
        </div>

        <div class="mt-8 p-4 bg-info bg-opacity-10 rounded border border-info border-opacity-30">
          <h4 class="text-sm font-semibold text-info mb-2 flex items-center gap-2"><i data-lucide="info" class="w-4 h-4"></i> Demo Credentials</h4>
          <div class="text-xs text-text-secondary space-y-1">
            <p><strong>Customer:</strong> customer@shopvista.com / password123</p>
            <p><strong>Seller:</strong> seller@shopvista.com / seller123</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function init(params) {
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const formLogin = document.getElementById('form-login');
  const formSignup = document.getElementById('form-signup');
  const titleEl = document.querySelector('.login-card h1');
  const subtitleEl = document.querySelector('.login-card p');

  tabLogin.addEventListener('click', () => {
    tabLogin.classList.replace('text-text-muted', 'text-primary');
    tabLogin.classList.replace('border-transparent', 'border-primary');
    tabSignup.classList.replace('text-primary', 'text-text-muted');
    tabSignup.classList.replace('border-primary', 'border-transparent');
    formLogin.classList.remove('hidden');
    formSignup.classList.add('hidden');
    titleEl.textContent = 'Welcome Back';
    subtitleEl.textContent = 'Please login to continue';
  });

  tabSignup.addEventListener('click', () => {
    tabSignup.classList.replace('text-text-muted', 'text-primary');
    tabSignup.classList.replace('border-transparent', 'border-primary');
    tabLogin.classList.replace('text-primary', 'text-text-muted');
    tabLogin.classList.replace('border-primary', 'border-transparent');
    formSignup.classList.remove('hidden');
    formLogin.classList.add('hidden');
    titleEl.textContent = 'Create Account';
    subtitleEl.textContent = 'Join ShopVista today';
  });

  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    const user = login(email, pass);
    
    if (user) {
      showToast('Login successful!');
      if (user.role === 'seller') navigate('#/seller');
      else navigate('#/');
    } else {
      showToast('Invalid email or password', 'error');
    }
  });

  formSignup.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const pass = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const role = document.querySelector('input[name="role"]:checked').value;

    if (pass !== confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (pass.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    const user = signup(name, email, pass, role);
    if (user) {
      showToast('Account created successfully!');
      if (user.role === 'seller') navigate('#/seller');
      else navigate('#/');
    } else {
      showToast('Email already in use', 'error');
    }
  });

  document.querySelectorAll('.btn-social-demo').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Social login coming soon!', 'info');
    });
  });

  if (window.lucide) lucide.createIcons();
}
