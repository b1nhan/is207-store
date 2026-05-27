import './globals.css';

export const metadata = {
  title: 'IS207-FS',
  description: 'IS207 Phat trien ung dung Web',
};

import AuthGuard from '@/components/auth/AuthGuard';
import { Toaster } from 'sonner';
import { ConfirmProvider } from '@/components/ui/ConfirmDialog';

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body suppressHydrationWarning>
        <AuthGuard>
          <ConfirmProvider>
            {children}
          </ConfirmProvider>
        </AuthGuard>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

