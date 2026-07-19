import { getUser, getSellerProducts, getSellerOrders } from '../../store.js';
import { navigate } from '../../router.js';

export function renderSellerLayout(activeLink, content) {
  return `
    <div class="seller-layout" style="display: flex; min-height: calc(100vh - 140px); background: var(--bg-secondary);">
      <aside class="seller-sidebar" style="width: 280px; background: var(--bg-card); border-right: 1px solid var(--border); display: flex; flex-direction: column; box-shadow: var(--shadow-sm); z-index: 10;">
        <div style="padding: var(--space-6); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: var(--space-3); background: var(--gradient-primary); color: white;">
          <div style="width: 45px; height: 45px; border-radius: 50%; background: rgba(255,255,255,0.2); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: var(--text-xl);">
            <i data-lucide="store" style="color: white;"></i>
          </div>
          <div>
            <h3 style="font-weight: 700; font-size: var(--text-lg); line-height: 1.2;">Seller Central</h3>
            <p style="font-size: var(--text-xs); opacity: 0.9;">Management Dashboard</p>
          </div>
        </div>
        <nav style="flex: 1; padding: var(--space-4) var(--space-3); display: flex; flex-direction: column; gap: var(--space-2);">
          <a href="#/seller" style="padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); display: flex; align-items: center; gap: var(--space-3); font-weight: 600; text-decoration: none; transition: all 0.2s; ${activeLink === 'dashboard' ? 'background: var(--primary); color: white; box-shadow: var(--shadow-sm);' : 'color: var(--text-secondary);'}" onmouseover="if('${activeLink}' !== 'dashboard'){this.style.background='var(--bg-secondary)'; this.style.color='var(--primary)'}" onmouseout="if('${activeLink}' !== 'dashboard'){this.style.background='transparent'; this.style.color='var(--text-secondary)'}">
            <i data-lucide="layout-dashboard"></i> Dashboard
          </a>
          <a href="#/seller/products" style="padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); display: flex; align-items: center; gap: var(--space-3); font-weight: 600; text-decoration: none; transition: all 0.2s; ${activeLink === 'products' ? 'background: var(--primary); color: white; box-shadow: var(--shadow-sm);' : 'color: var(--text-secondary);'}" onmouseover="if('${activeLink}' !== 'products'){this.style.background='var(--bg-secondary)'; this.style.color='var(--primary)'}" onmouseout="if('${activeLink}' !== 'products'){this.style.background='transparent'; this.style.color='var(--text-secondary)'}">
            <i data-lucide="package"></i> My Products
          </a>
          <a href="#/seller/add-product" style="padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); display: flex; align-items: center; gap: var(--space-3); font-weight: 600; text-decoration: none; transition: all 0.2s; ${activeLink === 'add-product' ? 'background: var(--primary); color: white; box-shadow: var(--shadow-sm);' : 'color: var(--text-secondary);'}" onmouseover="if('${activeLink}' !== 'add-product'){this.style.background='var(--bg-secondary)'; this.style.color='var(--primary)'}" onmouseout="if('${activeLink}' !== 'add-product'){this.style.background='transparent'; this.style.color='var(--text-secondary)'}">
            <i data-lucide="plus-circle"></i> Add Product
          </a>
          <a href="#/seller/orders" style="padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); display: flex; align-items: center; gap: var(--space-3); font-weight: 600; text-decoration: none; transition: all 0.2s; ${activeLink === 'orders' ? 'background: var(--primary); color: white; box-shadow: var(--shadow-sm);' : 'color: var(--text-secondary);'}" onmouseover="if('${activeLink}' !== 'orders'){this.style.background='var(--bg-secondary)'; this.style.color='var(--primary)'}" onmouseout="if('${activeLink}' !== 'orders'){this.style.background='transparent'; this.style.color='var(--text-secondary)'}">
            <i data-lucide="shopping-bag"></i> Orders
          </a>
        </nav>
      </aside>
      
      <main style="flex: 1; padding: var(--space-6) var(--space-8); overflow-y: auto;">
        ${content}
      </main>
    </div>
  `;
}

export function render(params) {
  const user = getUser();
  const products = getSellerProducts();
  const orders = getSellerOrders();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgRating = products.length > 0 ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1) : '0.0';
  const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const getStatusBadge = (status) => {
    const colors = {
      'placed': 'var(--info)',
      'confirmed': 'var(--primary)',
      'shipped': 'var(--warning)',
      'out_for_delivery': 'var(--warning)',
      'delivered': 'var(--success)',
      'cancelled': 'var(--error)'
    };
    return `<span style="background: ${colors[status] || 'gray'}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">${status.replace(/_/g, ' ')}</span>`;
  };

  const content = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-8);">
      <div>
        <h1 style="font-size: var(--text-4xl); font-family: var(--font-heading); font-weight: 800; margin-bottom: var(--space-1); background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Dashboard Overview</h1>
        <p style="color: var(--text-secondary); font-size: var(--text-lg);">Welcome back, <strong>${user?.name || 'Seller'}</strong>! Here's what's happening with your store today.</p>
      </div>
      <div>
        <a href="#/seller/add-product" class="btn btn-primary" style="border-radius: 50px; padding: 12px 24px; box-shadow: 0 4px 15px rgba(37,99,235,0.3);"><i data-lucide="plus" style="margin-right: 8px;"></i> Add New Product</a>
      </div>
    </div>

    <!-- Premium Stats Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--space-6); margin-bottom: var(--space-8);">
      <div style="background: var(--bg-card); padding: var(--space-6); border-radius: var(--radius-xl); border: 1px solid var(--border); box-shadow: var(--shadow-sm); position: relative; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; background: var(--primary); opacity: 0.05; border-radius: 50%;"></div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
          <div style="width: 50px; height: 50px; border-radius: 14px; background: rgba(37,99,235,0.1); color: var(--primary); display: flex; justify-content: center; align-items: center;">
            <i data-lucide="package"></i>
          </div>
          <span style="color: var(--success); font-size: var(--text-sm); font-weight: 700; display: flex; align-items: center; background: rgba(16,185,129,0.1); padding: 4px 8px; border-radius: 8px;"><i data-lucide="trending-up" style="width: 14px; margin-right: 4px;"></i> +12%</span>
        </div>
        <div style="font-size: 2.5rem; font-weight: 800; font-family: var(--font-heading); line-height: 1; margin-bottom: 8px;">${products.length}</div>
        <div style="color: var(--text-muted); font-size: var(--text-sm); font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Total Products</div>
      </div>
      
      <div style="background: var(--bg-card); padding: var(--space-6); border-radius: var(--radius-xl); border: 1px solid var(--border); box-shadow: var(--shadow-sm); position: relative; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; background: var(--accent); opacity: 0.05; border-radius: 50%;"></div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
          <div style="width: 50px; height: 50px; border-radius: 14px; background: rgba(139,92,246,0.1); color: var(--accent); display: flex; justify-content: center; align-items: center;">
            <i data-lucide="shopping-bag"></i>
          </div>
          <span style="color: var(--success); font-size: var(--text-sm); font-weight: 700; display: flex; align-items: center; background: rgba(16,185,129,0.1); padding: 4px 8px; border-radius: 8px;"><i data-lucide="trending-up" style="width: 14px; margin-right: 4px;"></i> +5%</span>
        </div>
        <div style="font-size: 2.5rem; font-weight: 800; font-family: var(--font-heading); line-height: 1; margin-bottom: 8px;">${orders.length}</div>
        <div style="color: var(--text-muted); font-size: var(--text-sm); font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Total Orders</div>
      </div>

      <div style="background: var(--bg-card); padding: var(--space-6); border-radius: var(--radius-xl); border: 1px solid var(--border); box-shadow: var(--shadow-sm); position: relative; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; background: var(--success); opacity: 0.05; border-radius: 50%;"></div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
          <div style="width: 50px; height: 50px; border-radius: 14px; background: rgba(16,185,129,0.1); color: var(--success); display: flex; justify-content: center; align-items: center;">
            <i data-lucide="indian-rupee"></i>
          </div>
          <span style="color: var(--success); font-size: var(--text-sm); font-weight: 700; display: flex; align-items: center; background: rgba(16,185,129,0.1); padding: 4px 8px; border-radius: 8px;"><i data-lucide="trending-up" style="width: 14px; margin-right: 4px;"></i> +24%</span>
        </div>
        <div style="font-size: 2.5rem; font-weight: 800; font-family: var(--font-heading); line-height: 1; margin-bottom: 8px;">₹${totalRevenue.toLocaleString('en-IN')}</div>
        <div style="color: var(--text-muted); font-size: var(--text-sm); font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Total Revenue</div>
      </div>

      <div style="background: var(--bg-card); padding: var(--space-6); border-radius: var(--radius-xl); border: 1px solid var(--border); box-shadow: var(--shadow-sm); position: relative; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; background: var(--warning); opacity: 0.05; border-radius: 50%;"></div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
          <div style="width: 50px; height: 50px; border-radius: 14px; background: rgba(245,158,11,0.1); color: var(--warning); display: flex; justify-content: center; align-items: center;">
            <i data-lucide="star"></i>
          </div>
          <span style="color: var(--text-muted); font-size: var(--text-sm); font-weight: 700;">Overall</span>
        </div>
        <div style="font-size: 2.5rem; font-weight: 800; font-family: var(--font-heading); line-height: 1; margin-bottom: 8px;">${avgRating}</div>
        <div style="color: var(--text-muted); font-size: var(--text-sm); font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Average Rating</div>
      </div>
    </div>

    <!-- Main Content Area Grid -->
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-6);">
      
      <!-- Recent Orders Table -->
      <div style="background: var(--bg-card); border-radius: var(--radius-xl); border: 1px solid var(--border); box-shadow: var(--shadow-sm); overflow: hidden;">
        <div style="padding: var(--space-5) var(--space-6); border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
          <h2 style="font-weight: 700; font-size: var(--text-xl);">Recent Orders</h2>
          <a href="#/seller/orders" style="color: var(--primary); font-weight: 600; font-size: var(--text-sm); text-decoration: none;">View All &rarr;</a>
        </div>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="background: var(--bg-secondary); border-bottom: 1px solid var(--border);">
                <th style="padding: var(--space-4) var(--space-6); font-size: var(--text-xs); text-transform: uppercase; color: var(--text-muted); font-weight: 700; letter-spacing: 1px;">Order ID</th>
                <th style="padding: var(--space-4); font-size: var(--text-xs); text-transform: uppercase; color: var(--text-muted); font-weight: 700; letter-spacing: 1px;">Customer</th>
                <th style="padding: var(--space-4); font-size: var(--text-xs); text-transform: uppercase; color: var(--text-muted); font-weight: 700; letter-spacing: 1px;">Date</th>
                <th style="padding: var(--space-4); font-size: var(--text-xs); text-transform: uppercase; color: var(--text-muted); font-weight: 700; letter-spacing: 1px;">Total</th>
                <th style="padding: var(--space-4) var(--space-6); font-size: var(--text-xs); text-transform: uppercase; color: var(--text-muted); font-weight: 700; letter-spacing: 1px;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${recentOrders.length > 0 ? recentOrders.map(o => `
                <tr style="border-bottom: 1px solid var(--border); transition: background 0.2s;" onmouseover="this.style.background='var(--bg-secondary)'" onmouseout="this.style.background='transparent'">
                  <td style="padding: var(--space-4) var(--space-6); font-weight: 600; font-size: var(--text-sm);">#${o.id.substring(0, 12)}...</td>
                  <td style="padding: var(--space-4); font-size: var(--text-sm); color: var(--text-secondary);">${o.address.name}</td>
                  <td style="padding: var(--space-4); font-size: var(--text-sm); color: var(--text-secondary);">${new Date(o.date).toLocaleDateString('en-IN')}</td>
                  <td style="padding: var(--space-4); font-size: var(--text-sm); font-weight: 700;">₹${o.total.toLocaleString('en-IN')}</td>
                  <td style="padding: var(--space-4) var(--space-6);">${getStatusBadge(o.status)}</td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="5" style="padding: var(--space-8); text-align: center; color: var(--text-muted);">No recent orders found.</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Actions & Beautiful Chart Placeholder -->
      <div style="display: flex; flex-direction: column; gap: var(--space-6);">
        <div style="background: var(--bg-card); border-radius: var(--radius-xl); border: 1px solid var(--border); box-shadow: var(--shadow-sm); padding: var(--space-6); background-image: var(--gradient-hero); color: white;">
           <h2 style="font-weight: 700; font-size: var(--text-xl); margin-bottom: var(--space-2);">Weekly Sales</h2>
           <p style="font-size: var(--text-sm); opacity: 0.9; margin-bottom: var(--space-5);">Revenue up by 12% this week</p>
           <div style="height: 120px; display: flex; align-items: flex-end; justify-content: space-between; gap: 8px;">
             ${[40, 65, 45, 80, 55, 90, 75].map((val, i) => `
               <div style="width: 100%; background: rgba(255,255,255,0.3); border-radius: 4px; border-top-left-radius: 6px; border-top-right-radius: 6px; height: ${val}%; position: relative; cursor: pointer; transition: background 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.8)'" onmouseout="this.style.background='rgba(255,255,255,0.3)'"></div>
             `).join('')}
           </div>
        </div>

        <div style="background: var(--bg-card); border-radius: var(--radius-xl); border: 1px solid var(--border); box-shadow: var(--shadow-sm); padding: var(--space-6);">
          <h2 style="font-weight: 700; font-size: var(--text-lg); margin-bottom: var(--space-4);">Quick Links</h2>
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            <a href="#/seller/products" style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-4); background: var(--bg-secondary); border-radius: var(--radius-md); text-decoration: none; color: var(--text-primary); transition: all 0.2s;" onmouseover="this.style.background='rgba(37,99,235,0.05)'; this.style.color='var(--primary)';" onmouseout="this.style.background='var(--bg-secondary)'; this.style.color='var(--text-primary)';">
              <div style="display: flex; align-items: center; gap: var(--space-3);">
                <i data-lucide="package" style="color: var(--text-muted);"></i>
                <span style="font-weight: 600;">View All Products</span>
              </div>
              <i data-lucide="chevron-right" style="width: 16px;"></i>
            </a>
            <a href="#/seller/orders" style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-4); background: var(--bg-secondary); border-radius: var(--radius-md); text-decoration: none; color: var(--text-primary); transition: all 0.2s;" onmouseover="this.style.background='rgba(139,92,246,0.05)'; this.style.color='var(--accent)';" onmouseout="this.style.background='var(--bg-secondary)'; this.style.color='var(--text-primary)';">
              <div style="display: flex; align-items: center; gap: var(--space-3);">
                <i data-lucide="shopping-bag" style="color: var(--text-muted);"></i>
                <span style="font-weight: 600;">Manage Orders</span>
              </div>
              <i data-lucide="chevron-right" style="width: 16px;"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  return renderSellerLayout('dashboard', content);
}

export function init(params) {
  if (window.lucide) lucide.createIcons();
}
