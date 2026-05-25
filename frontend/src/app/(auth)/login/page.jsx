import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Đăng nhập',
};

export default function LoginPage() {
  return (
    <div id="login" className="relative">
      <Link
        href="/"
        className="absolute left-4 top-4 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 md:left-8 md:top-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to homepage
      </Link>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <LoginForm />
      </div>
    </div>
  );
}
