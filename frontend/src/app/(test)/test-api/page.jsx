'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import axiosInstance from '@/config/axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
const LS_KEY = 'access_token';

// ─── Endpoint definitions ─────────────────────────────────────────────────────
const ENDPOINTS = [
  // AUTH
  { group: 'Auth', label: 'Register', method: 'POST', path: '/auth/register', auth: false, body: { email: 'test@example.com', password: 'Test@1234', full_name: 'Test User' } },
  { group: 'Auth', label: 'Login', method: 'POST', path: '/auth/login', auth: false, body: { email: "24520040@gm.uit.edu.vn", password: "B24520040@gm.uit.edu.vn" } },
  { group: 'Auth', label: 'Logout', method: 'POST', path: '/auth/logout', auth: false, body: null },
  { group: 'Auth', label: 'Refresh Token', method: 'POST', path: '/auth/refresh', auth: false, body: null },
  { group: 'Auth', label: 'Get Me', method: 'GET', path: '/auth/me', auth: true, body: null },
  { group: 'Auth', label: 'Update Profile', method: 'PATCH', path: '/auth/me/profile', auth: true, body: { full_name: 'Updated Name', phone: '0901234567' } },
  { group: 'Auth', label: 'Change Password', method: 'POST', path: '/auth/change-password', auth: true, body: { current_password: 'Admin@1234', new_password: 'NewPass@1234', confirm_password: 'NewPass@1234' } },

  // SHIPPING PROFILES
  { group: 'Shipping Profiles', label: 'List Profiles', method: 'GET', path: '/auth/shipping-profiles', auth: true, body: null },
  { group: 'Shipping Profiles', label: 'Get Profile by ID', method: 'GET', path: '/auth/shipping-profiles/1', auth: true, body: null },
  { group: 'Shipping Profiles', label: 'Create Profile', method: 'POST', path: '/auth/shipping-profiles', auth: true, body: { full_name: 'Nguyen Van A', phone: '0901234567', address: '123 Nguyen Hue', city: 'Ho Chi Minh', district: 'Quan 1', ward: 'Phuong Ben Nghe', is_default: true } },
  { group: 'Shipping Profiles', label: 'Update Profile', method: 'PUT', path: '/auth/shipping-profiles/1', auth: true, body: { full_name: 'Nguyen Van B', phone: '0907654321', address: '456 Le Loi', city: 'Ho Chi Minh', district: 'Quan 3', ward: 'Phuong 10' } },
  { group: 'Shipping Profiles', label: 'Delete Profile', method: 'DELETE', path: '/auth/shipping-profiles/1', auth: true, body: null },
  { group: 'Shipping Profiles', label: 'Set Default', method: 'PATCH', path: '/auth/shipping-profiles/1/default', auth: true, body: null },

  // PRODUCTS
  { group: 'Products', label: 'List Products', method: 'GET', path: '/products?page=1&limit=10', auth: false, body: null },
  { group: 'Products', label: 'Search Products', method: 'GET', path: '/products/search?q=shirt', auth: false, body: null },
  { group: 'Products', label: 'New Arrivals', method: 'GET', path: '/products/new-arrivals', auth: false, body: null },
  { group: 'Products', label: 'Best Sellers', method: 'GET', path: '/products/best-sellers', auth: false, body: null },
  { group: 'Products', label: 'Hot Products', method: 'GET', path: '/products/hot', auth: false, body: null },
  { group: 'Products', label: 'Product by ID', method: 'GET', path: '/products/1', auth: false, body: null },
  { group: 'Products', label: 'Product by Slug', method: 'GET', path: '/products/slug/ao-thun-basic', auth: false, body: null },
  { group: 'Products', label: 'Related Products', method: 'GET', path: '/products/1/related', auth: false, body: null },

  // CATEGORIES
  { group: 'Categories', label: 'List Categories', method: 'GET', path: '/categories', auth: false, body: null },
  { group: 'Categories', label: 'Products by Category Slug', method: 'GET', path: '/categories/ao-thun', auth: false, body: null },

  // BRANDS
  { group: 'Brands', label: 'List Brands', method: 'GET', path: '/brands', auth: false, body: null },
  { group: 'Brands', label: 'Products by Brand', method: 'GET', path: '/brands/1/products', auth: false, body: null },

  // CART
  { group: 'Cart', label: 'Get Cart', method: 'GET', path: '/cart', auth: true, body: null },
  { group: 'Cart', label: 'Add to Cart', method: 'POST', path: '/cart', auth: true, body: { product_variant_id: 1, quantity: 2 } },
  { group: 'Cart', label: 'Update Cart Item', method: 'PUT', path: '/cart/1', auth: true, body: { quantity: 3 } },
  { group: 'Cart', label: 'Update Variant', method: 'PATCH', path: '/cart/1/variant', auth: true, body: { product_variant_id: 2 } },
  { group: 'Cart', label: 'Remove Cart Item', method: 'DELETE', path: '/cart/1', auth: true, body: null },
  { group: 'Cart', label: 'Clear Cart', method: 'DELETE', path: '/cart', auth: true, body: null },

  // ORDERS
  { group: 'Orders', label: 'My Orders', method: 'GET', path: '/orders?page=1&limit=10', auth: true, body: null },
  { group: 'Orders', label: 'Order Detail', method: 'GET', path: '/orders/1', auth: true, body: null },
  { group: 'Orders', label: 'Checkout Preview', method: 'POST', path: '/orders/checkout/preview', auth: true, body: { voucher_code: null } },
  { group: 'Orders', label: 'Place Order', method: 'POST', path: '/orders/checkout', auth: true, body: { shipping_profile_id: 1, voucher_code: null, note: '' } },
  { group: 'Orders', label: 'Cancel Order', method: 'POST', path: '/orders/1/cancel', auth: true, body: null },

  // VOUCHERS
  { group: 'Vouchers', label: 'Active Vouchers', method: 'GET', path: '/vouchers/active', auth: false, body: null },
  { group: 'Vouchers', label: 'Apply Voucher', method: 'POST', path: '/vouchers/apply', auth: true, body: { code: 'SALE10', order_total: 500000 } },

  // CAMPAIGNS
  { group: 'Campaigns', label: 'Active Campaigns', method: 'GET', path: '/campaigns/active', auth: false, body: null },
  { group: 'Campaigns', label: 'Discounted Products', method: 'GET', path: '/campaigns/discounted-products', auth: false, body: null },
  { group: 'Campaigns', label: 'Campaign Detail', method: 'GET', path: '/campaigns/1', auth: false, body: null },

  // ADMIN - DASHBOARD
  { group: 'Admin / Dashboard', label: 'Summary', method: 'GET', path: '/admin/dashboard/summary', auth: true, body: null },
  { group: 'Admin / Dashboard', label: 'Revenue', method: 'GET', path: '/admin/dashboard/revenue?period=month', auth: true, body: null },
  { group: 'Admin / Dashboard', label: 'Top Products', method: 'GET', path: '/admin/dashboard/top-products', auth: true, body: null },

  // ADMIN - PRODUCTS
  { group: 'Admin / Products', label: 'List Products', method: 'GET', path: '/admin/products?page=1&limit=10', auth: true, body: null },
  { group: 'Admin / Products', label: 'Product Detail', method: 'GET', path: '/admin/products/1', auth: true, body: null },
  { group: 'Admin / Products', label: 'Create Product', method: 'POST', path: '/admin/products', auth: true, body: { name: 'Áo Thun Basic', description: 'Áo thun cơ bản', price: 199000, category_id: 1, brand_id: 1, status: 'ACTIVE', variants: [{ size: 'M', color: 'Trắng', stock: 10, sku: 'AT-M-TR' }] } },
  { group: 'Admin / Products', label: 'Update Product', method: 'PUT', path: '/admin/products/1', auth: true, body: { name: 'Áo Thun Basic Updated', price: 229000 } },
  { group: 'Admin / Products', label: 'Update Status', method: 'PATCH', path: '/admin/products/1/status', auth: true, body: { status: 'INACTIVE' } },
  { group: 'Admin / Products', label: 'Add Variant', method: 'POST', path: '/admin/products/1/variants', auth: true, body: { size: 'L', color: 'Đen', stock: 5, sku: 'AT-L-DEN' } },
  { group: 'Admin / Products', label: 'Update Variant', method: 'PUT', path: '/admin/products/variants/1', auth: true, body: { size: 'XL', color: 'Đen', stock: 8, sku: 'AT-XL-DEN' } },
  { group: 'Admin / Products', label: 'Delete Variant', method: 'DELETE', path: '/admin/products/variants/1', auth: true, body: null },
  { group: 'Admin / Products', label: 'Generate Description', method: 'POST', path: '/admin/products/generate-description', auth: true, body: { name: 'Áo Thun Basic', category: 'Áo', brand: 'Local' } },

  // ADMIN - CATEGORIES
  { group: 'Admin / Categories', label: 'Category Detail', method: 'GET', path: '/admin/categories/1', auth: true, body: null },
  { group: 'Admin / Categories', label: 'Create Category', method: 'POST', path: '/admin/categories', auth: true, body: { name: 'Quần Jean', slug: 'quan-jean', description: 'Danh mục quần jean' } },
  { group: 'Admin / Categories', label: 'Update Category', method: 'PUT', path: '/admin/categories/1', auth: true, body: { name: 'Quần Jean Updated', description: 'Updated description' } },
  { group: 'Admin / Categories', label: 'Delete Category', method: 'DELETE', path: '/admin/categories/1', auth: true, body: null },

  // ADMIN - BRANDS
  { group: 'Admin / Brands', label: 'Brand Detail', method: 'GET', path: '/admin/brands/1', auth: true, body: null },
  { group: 'Admin / Brands', label: 'Create Brand', method: 'POST', path: '/admin/brands', auth: true, body: { name: 'Nike', description: 'Nike brand', logo_url: '' } },
  { group: 'Admin / Brands', label: 'Update Brand', method: 'PUT', path: '/admin/brands/1', auth: true, body: { name: 'Nike Updated', description: 'Updated' } },
  { group: 'Admin / Brands', label: 'Delete Brand', method: 'DELETE', path: '/admin/brands/1', auth: true, body: null },

  // ADMIN - VOUCHERS
  { group: 'Admin / Vouchers', label: 'List Vouchers', method: 'GET', path: '/admin/vouchers?page=1&limit=10', auth: true, body: null },
  { group: 'Admin / Vouchers', label: 'Voucher Detail', method: 'GET', path: '/admin/vouchers/1', auth: true, body: null },
  { group: 'Admin / Vouchers', label: 'Create Voucher', method: 'POST', path: '/admin/vouchers', auth: true, body: { code: 'SALE20', discount_type: 'percentage', discount_value: 20, min_order_value: 200000, max_discount: 100000, start_date: '2026-06-01', end_date: '2026-12-31', usage_limit: 100 } },
  { group: 'Admin / Vouchers', label: 'Update Voucher', method: 'PUT', path: '/admin/vouchers/1', auth: true, body: { discount_value: 25, usage_limit: 50 } },
  { group: 'Admin / Vouchers', label: 'Delete Voucher', method: 'DELETE', path: '/admin/vouchers/1', auth: true, body: null },

  // ADMIN - ORDERS
  { group: 'Admin / Orders', label: 'List Orders', method: 'GET', path: '/admin/orders?page=1&limit=10', auth: true, body: null },
  { group: 'Admin / Orders', label: 'Order Detail', method: 'GET', path: '/admin/orders/1', auth: true, body: null },
  { group: 'Admin / Orders', label: 'Update Order Status', method: 'PATCH', path: '/admin/orders/1/status', auth: true, body: { status: 'confirmed' } },
  { group: 'Admin / Orders', label: 'Bulk Update Status', method: 'PATCH', path: '/admin/orders/bulk-status', auth: true, body: { order_ids: [1, 2, 3], status: 'confirmed' } },

  // ADMIN - CAMPAIGNS
  { group: 'Admin / Campaigns', label: 'List Campaigns', method: 'GET', path: '/admin/campaigns?page=1&limit=10', auth: true, body: null },
  { group: 'Admin / Campaigns', label: 'Campaign Detail', method: 'GET', path: '/admin/campaigns/1', auth: true, body: null },
  { group: 'Admin / Campaigns', label: 'Create Campaign', method: 'POST', path: '/admin/campaigns', auth: true, body: { name: 'Sale Hè 2026', description: 'Campaign mùa hè', discount_type: 'percentage', discount_value: 15, start_date: '2026-06-01', end_date: '2026-08-31', product_ids: [1, 2] } },
  { group: 'Admin / Campaigns', label: 'Update Campaign', method: 'PUT', path: '/admin/campaigns/1', auth: true, body: { name: 'Sale Hè Updated', discount_value: 20 } },
  { group: 'Admin / Campaigns', label: 'Update Status', method: 'PATCH', path: '/admin/campaigns/1/status', auth: true, body: { status: 'active' } },
  { group: 'Admin / Campaigns', label: 'Delete Campaign', method: 'DELETE', path: '/admin/campaigns/1', auth: true, body: null },
  { group: 'Admin / Campaigns', label: 'Generate Description', method: 'POST', path: '/admin/campaigns/generate-description', auth: true, body: { name: 'Sale Hè 2026', discount_value: 15, discount_type: 'percentage' } },
];

const METHOD_COLORS = {
  GET: '#22c55e',
  POST: '#3b82f6',
  PUT: '#f59e0b',
  PATCH: '#8b5cf6',
  DELETE: '#ef4444',
};

const GROUPS = [...new Set(ENDPOINTS.map((e) => e.group))];

export default function TestApiPage() {
  const [activeGroup, setActiveGroup] = useState(GROUPS[0]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [token, setToken] = useState('');
  const [editableBodies, setEditableBodies] = useState({});

  // Sync token from localStorage on mount & whenever it changes elsewhere
  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY) || '';
    setToken(stored);
  }, []);

  const updateToken = (val) => {
    if (val) localStorage.setItem(LS_KEY, val);
    else localStorage.removeItem(LS_KEY);
    setToken(val);
  };

  const getKey = (ep) => `${ep.method}:${ep.path}`;

  const getBody = (ep) => {
    const key = getKey(ep);
    if (editableBodies[key] !== undefined) return editableBodies[key];
    return ep.body ? JSON.stringify(ep.body, null, 2) : '';
  };

  const handleRequest = async (ep) => {
    const key = getKey(ep);
    setLoading((p) => ({ ...p, [key]: true }));
    setResults((p) => ({ ...p, [key]: null }));

    // Parse body JSON nếu có
    let parsedBody = undefined;
    const bodyStr = getBody(ep);
    if (bodyStr && ep.method !== 'GET' && ep.method !== 'DELETE') {
      try { parsedBody = JSON.parse(bodyStr); } catch { parsedBody = null; }
    }

    const start = Date.now();
    try {
      // Dùng axiosInstance thay vì fetch:
      //   - Request interceptor tự inject Bearer token từ localStorage
      //   - Response interceptor tự gọi /auth/refresh khi nhận 401, rồi retry
      // → Hoàn toàn giống luồng của các trang chính thức
      const data = await axiosInstance({
        method: ep.method,
        url: ep.path,
        data: parsedBody,
      });

      const elapsed = Date.now() - start;
      setResults((p) => ({ ...p, [key]: { ok: true, status: 200, data, elapsed } }));

      // Sau khi login thành công, lưu token (axiosInstance không tự lưu — chỉ authStore mới làm)
      if (ep.path === '/auth/login' && data?.data?.accessToken) {
        updateToken(data.data.accessToken);
      }
      // Sau khi logout, xóa token
      if (ep.path === '/auth/logout') {
        updateToken('');
      }
    } catch (err) {
      const elapsed = Date.now() - start;
      setResults((p) => ({
        ...p,
        [key]: {
          ok: false,
          status: err.response?.status || 0,
          data: err.response?.data || { error: err.message },
          elapsed,
        },
      }));
    } finally {
      setLoading((p) => ({ ...p, [key]: false }));
      // Re-sync token display: interceptor có thể đã refresh và update localStorage
      setToken(localStorage.getItem(LS_KEY) || '');
    }
  };

  const filtered = ENDPOINTS.filter((e) => e.group === activeGroup);

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span className={styles.logo}>⚡ API Tester</span>
          <span className={styles.baseUrl}>{BASE_URL}</span>
        </div>

        <div className={styles.tokenSection}>
          <label className={styles.tokenLabel}>Bearer Token</label>
          <input
            className={styles.tokenInput}
            type="text"
            placeholder="Paste token or login to auto-fill..."
            value={token}
            onChange={(e) => updateToken(e.target.value)}
          />
          {token && <span className={styles.tokenBadge}>✓ Saved to localStorage</span>}
        </div>

        <nav className={styles.nav}>
          {GROUPS.map((g) => (
            <button
              key={g}
              className={`${styles.navItem} ${activeGroup === g ? styles.navItemActive : ''}`}
              onClick={() => setActiveGroup(g)}
            >
              {g}
              <span className={styles.navCount}>
                {ENDPOINTS.filter((e) => e.group === g).length}
              </span>
            </button>
          ))}

          <a href="/" className={styles.backLink}>← Back to Home</a>
          <a href="/admin" className={styles.backLink}>← Back to Admin</a>

        </nav>
      </aside>

      <main className={styles.main}>
        <h1 className={styles.groupTitle}>{activeGroup}</h1>
        <div className={styles.endpointList}>
          {filtered.map((ep) => {
            const key = getKey(ep);
            const result = results[key];
            const isLoading = loading[key];
            const bodyStr = getBody(ep);

            return (
              <div key={key} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.method} style={{ backgroundColor: METHOD_COLORS[ep.method] }}>
                    {ep.method}
                  </span>
                  <span className={styles.path}>{ep.path}</span>
                  <span className={styles.label}>{ep.label}</span>
                  {ep.auth && <span className={styles.authBadge}>🔒</span>}
                  <button
                    className={`${styles.sendBtn} ${isLoading ? styles.sendBtnLoading : ''}`}
                    onClick={() => handleRequest(ep)}
                    disabled={isLoading}
                  >
                    {isLoading ? '...' : 'Send'}
                  </button>
                </div>

                {ep.body && (
                  <div className={styles.bodySection}>
                    <span className={styles.bodyLabel}>Body</span>
                    <textarea
                      className={styles.bodyTextarea}
                      value={bodyStr}
                      onChange={(e) =>
                        setEditableBodies((p) => ({ ...p, [key]: e.target.value }))
                      }
                      rows={Math.min(8, (bodyStr.match(/\n/g) || []).length + 1)}
                    />
                  </div>
                )}

                {result && (
                  <div className={`${styles.result} ${result.ok ? styles.resultOk : styles.resultErr}`}>
                    <div className={styles.resultMeta}>
                      <span className={`${styles.statusCode} ${result.ok ? styles.statusOk : styles.statusErr}`}>
                        {result.status}
                      </span>
                      <span className={styles.elapsed}>{result.elapsed}ms</span>
                    </div>
                    <pre className={styles.resultBody}>
                      {typeof result.data === 'string'
                        ? result.data
                        : JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
