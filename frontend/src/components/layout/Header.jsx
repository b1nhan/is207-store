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

const NAV_ITEMS = [
  { title: 'Trang chủ', href: '/' },
  { title: 'Sản phẩm', href: '/products' },
  { title: 'Danh mục', href: '/' },
  { title: 'Đăng ký', href: '/register' },
];

const DROPDOWN_ITEMS = [{ title: 'Profile', href: '/', icon: UserIcon }];

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

const AccountDropdown = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="lg" className="text-lg font-semibold">
        Account
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      {DROPDOWN_ITEMS.map(({ title, href, icon: Icon }) => (
        <DropdownMenuItem key={title} asChild>
          <Link href={href}>
            <Icon />
            {title}
          </Link>
        </DropdownMenuItem>
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive">
        <LogOutIcon />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const Header = () => (
  <header className="bg-primary-foreground sticky top-0 z-50 flex h-16 w-full items-center justify-around">
    <Logo />
    <SearchBar />
    <NavLinks />
    <div className="flex gap-4">
      <Button variant="ghost" size="icon-lg">
        <ShoppingCartIcon />
      </Button>
      <AccountDropdown />
    </div>
  </header>
);

export default Header;
