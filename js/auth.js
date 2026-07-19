import { getUser, login, signup, logout, isLoggedIn, isSeller } from './store.js';
import { navigate } from './router.js';

export function requireAuth() {
  if (!isLoggedIn()) {
    navigate('#/login');
    return false;
  }
  return true;
}

export function requireSeller() {
  if (!isSeller()) {
    navigate('#/login');
    return false;
  }
  return true;
}

export { getUser, login, signup, logout, isLoggedIn, isSeller };
