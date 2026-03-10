import './globals.css';
import { Geist } from 'next/font/google';
import { cn } from '@/lib/utils';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: 'IS207-FS',
  description: 'IS207 Phat trien ung dung Web',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={cn('font-sans', geist.variable)}>
      <body>{children}</body>
    </html>
  );
}
