'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Tag, LogOut, ArrowLeft, Megaphone, Layers, ShoppingBag, FlaskConical } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import { STORAGE_KEYS } from '@/constants';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/categories', icon: Layers, label: 'Categories' },
  { href: '/admin/brands', icon: ShoppingBag, label: 'Brands' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/vouchers', icon: Tag, label: 'Vouchers' },
  { href: '/admin/campaigns', icon: Megaphone, label: 'Campaigns' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { setUser } = useAuthStore();

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-gray-900 text-white h-full flex flex-col overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-primary-foreground">Admin Panel</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 space-y-2">
        <Link
          href="/"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Shop</span>
        </Link>
        <Link
          href="/test-api"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <FlaskConical size={20} />
          <span>Test API</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
