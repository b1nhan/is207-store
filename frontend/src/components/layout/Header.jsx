'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOutIcon, ShoppingCartIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import SearchBar from './SearchBar';
import useAuthStore from '@/store/authStore';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { title: 'Trang chủ', href: '/' },
  { title: 'Sản phẩm', href: '/products' },
  { title: 'Danh mục', href: '/' },
];

const DROPDOWN_ITEMS = [{ title: 'Profile', href: '/profile', icon: UserIcon }];

const Logo = () => (
  <Link href="/">
    <span className="text-text-primary text-2xl font-bold tracking-tight">
      Shop<span className="text-primary">FS</span>
    </span>
  </Link>
);

const NavLinks = () => (
  <nav className="hidden space-x-8 md:flex">
    {NAV_ITEMS.map(({ title, href }) => (
      <Link
        key={title}
        href={href}
        className="text-text-primary hover:text-primary text-lg font-semibold transition-colors"
      >
        {title}
      </Link>
    ))}
  </nav>
);

import { authService } from '@/services/authService';

const AccountDropdown = ({ user, logout }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      router.push('/login');
    }
  };

  console.log(user)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="lg" className="text-lg font-semibold">
          {user?.username || 'Account'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {DROPDOWN_ITEMS.map(({ title, href, icon: Icon }) => (
          <DropdownMenuItem key={title} asChild className="cursor-pointer">
            <Link href={href}>
              <Icon className="mr-2 h-4 w-4" />
              {title}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600">
          <LogOutIcon className="mr-2 h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className="bg-primary-foreground sticky top-0 z-50 flex h-16 w-full items-center justify-around">
      <Logo />
      <SearchBar />
      <NavLinks />
      <div className="flex gap-4 items-center">
        <Button variant="ghost" size="icon-lg">
          <ShoppingCartIcon />
        </Button>
        {isAuthenticated ? (
          <AccountDropdown user={user} logout={logout} />
        ) : (
          <Button asChild variant="default" size="default" className="font-semibold">
            <Link href="/login">Đăng nhập</Link>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
