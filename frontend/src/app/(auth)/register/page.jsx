import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Đăng ký',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}
