import './globals.css';

export const metadata = {
  title: 'IS207-FS',
  description: 'IS207 Phat trien ung dung Web',
};

import AuthGuard from '@/components/auth/AuthGuard';

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}
