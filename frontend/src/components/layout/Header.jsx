'use client';

import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOutIcon, ShoppingCartIcon, UserIcon, PackageIcon, LayoutDashboardIcon } from 'lucide-react';
import Link from 'next/link';
import SearchBar from './SearchBar';
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/authService';

const NAV_ITEMS = [
  { title: 'Trang chủ', href: '/' },
  { title: 'Sản phẩm', href: '/products' },
  { title: 'Danh mục', href: '/category' },
  { title: 'Khuyến mãi', href: '/campaigns' },
];

const DROPDOWN_ITEMS = [
  { title: 'Profile', href: '/profile', icon: UserIcon },
  { title: 'Lịch sử đơn hàng', href: '/orders', icon: PackageIcon },
];

// ── Logo with spring hover ─────────────────────────────────────────────────────
const Logo = () => {
  const reduced = useReducedMotion();
  return (
    <Link href="/">
      <motion.span
        whileHover={reduced ? {} : { scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
        className="inline-block text-2xl font-bold tracking-tight"
        style={{ color: 'var(--text-primary)' }}
      >
        Shop<span style={{ color: 'var(--primary)' }}>FS</span>
      </motion.span>
    </Link>
  );
};

// ── Nav links with hover underline slide ──────────────────────────────────────
const NavLinks = () => {
  const reduced = useReducedMotion();
  return (
    <nav className="hidden space-x-8 md:flex">
      {NAV_ITEMS.map(({ title, href }) => (
        <Link
          key={title}
          href={href}
          className="relative text-lg font-semibold transition-colors"
          style={{ color: 'var(--text-primary)' }}
        >
          {/* Hover underline that slides in */}
          {!reduced && (
            <motion.span
              className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-left rounded-full"
              style={{ background: 'linear-gradient(90deg, var(--sa-500), var(--sa-700))' }}
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            />
          )}
          <motion.span
            whileHover={reduced ? {} : { color: 'var(--primary)' }}
            transition={{ duration: 0.18 }}
          >
            {title}
          </motion.span>
        </Link>
      ))}
    </nav>
  );
};

// ── Account dropdown (unchanged logic) ────────────────────────────────────────
const AccountDropdown = ({ user, logout }) => {
  const router = useRouter();
  const { clearCartState } = useCartStore();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      clearCartState();
      router.push('/login');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="lg" className="text-lg font-semibold">
          {user?.username || 'Account'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto flex flex-col justify-end">
        {DROPDOWN_ITEMS.map(({ title, href, icon: Icon }) => (
          <DropdownMenuItem key={title} asChild className="cursor-pointer">
            <Link href={href}>
              <Icon className="mr-2 h-4 w-4" />
              {title}
            </Link>
          </DropdownMenuItem>
        ))}
        {user?.role === 'ADMIN' && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/admin">
              <LayoutDashboardIcon className="mr-2 h-4 w-4" />
              Admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// ── Header ────────────────────────────────────────────────────────────────────
const Header = () => {
  const { isAuthenticated, user, logout, isInitialized } = useAuthStore();
  const { totalItems, fetchCart, clearCartState } = useCartStore();
  const pathname = usePathname();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      const onFocus = () => fetchCart();
      window.addEventListener('focus', onFocus);
      const intervalId = setInterval(() => fetchCart(), 3 * 60 * 1000);
      return () => {
        window.removeEventListener('focus', onFocus);
        clearInterval(intervalId);
      };
    } else if (isInitialized && !isAuthenticated) {
      clearCartState();
    }
  }, [isAuthenticated, isInitialized, fetchCart, clearCartState]);

  return (
    <header
      className="sticky top-0 z-50 flex h-16 w-full items-center justify-around"
      style={{
        background: 'rgba(255, 255, 255, 0.50)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        /* Gradient bottom border using box-shadow trick */
        boxShadow: `
          0 1px 0 0 var(--sa-200),
        `,
      }}
    >
      <Logo />
      <SearchBar />
      <NavLinks />
      <div className="flex items-center gap-4">
        {/* Cart icon with badge */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        >
          <Button variant="ghost" size="icon-2xl" asChild className="relative">
            <Link href="/cart">
              <ShoppingCartIcon className="size-6" />
              {totalItems > 0 && (
                <span
                  className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full text-[12px] font-bold leading-none text-white"
                  style={{ background: 'var(--error)' }}
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </Button>
        </motion.div>

        {/* Auth button */}
        {isAuthenticated ? (
          <AccountDropdown user={user} logout={logout} />
        ) : (
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <Button
              asChild
              variant="default"
              size="default"
              className="font-semibold"
              style={{
                background: 'linear-gradient(135deg, var(--sa-600), var(--sa-700))',
                color: 'var(--primary-foreground)',
              }}
            >
              <Link href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}>
                Đăng nhập
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
