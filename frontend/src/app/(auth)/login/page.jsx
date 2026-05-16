import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Đăng nhập',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
