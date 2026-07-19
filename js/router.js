import { isLoggedIn, isSeller } from './store.js';

let routes = {};
let currentParams = {};

export function registerRoutes(routeMap) { 
  routes = routeMap; 
}

export function navigate(hash) { 
  window.location.hash = hash; 
}

export function getParams() { 
  return currentParams; 
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute(); // initial route
}

async function handleRoute() {
  const hash = window.location.hash || '#/';
  // Parse hash: split by '?' for query params
  const [path, queryString] = hash.split('?');
  const queryParams = queryString ? Object.fromEntries(new URLSearchParams(queryString)) : {};
  
  // Match route patterns
  let matchedRoute = null;
  let params = { ...queryParams };
  
  for (const [pattern, handler] of Object.entries(routes)) {
    const match = matchPattern(pattern, path);
    if (match) {
      matchedRoute = handler;
      params = { ...params, ...match };
      break;
    }
  }
  
  if (!matchedRoute) matchedRoute = routes['#/'] || routes['#/home'];
  
  currentParams = params;
  await renderPage(matchedRoute, params);
}

function matchPattern(pattern, path) {
  const patternParts = pattern.split('/');
  const pathParts = path.split('/');
  if (patternParts.length !== pathParts.length) return null;
  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

async function renderPage(route, params) {
  const app = document.getElementById('app');
  if (!app) return;
  // Add page transition
  app.classList.add('page-transition');
  // Small delay for transition
  await new Promise(r => setTimeout(r, 150));
  
  // Auth guard check
  if (route.requiresAuth) {
    if (!isLoggedIn()) {
      navigate('#/login');
      return;
    }
  }
  if (route.requiresSeller) {
    if (!isSeller()) {
      navigate('#/login');
      return;
    }
  }
  
  try {
    const html = route.render(params);
    app.innerHTML = html;
  } catch (e) {
    console.error('Error rendering page:', e);
    app.innerHTML = `<div class="container empty-state"><h2>Error Loading Page</h2><p>${e.message}</p></div>`;
  }
  app.classList.remove('page-transition');
  
  // Scroll to top
  window.scrollTo(0, 0);
  
  // Call init after render
  if (route.init) {
    try {
      route.init(params);
    } catch(e) {
      console.error('Error initializing page:', e);
    }
  }
}
