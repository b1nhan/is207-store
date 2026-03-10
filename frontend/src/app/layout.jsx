import './globals.css';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

export const metadata = {
  title: 'Shop App',
  description: 'E-commerce application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <Header />
        <main className="relative z-0 mx-auto mt-20 min-h-[calc(100vh-80px)] w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
