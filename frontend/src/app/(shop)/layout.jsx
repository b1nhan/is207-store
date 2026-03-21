import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

export default function ShopLayout({ children }) {
  return (
    <>
      <div id="home" />
      <Header />
      <main className="relative z-0 mx-auto min-h-[calc(100vh-80px)] w-full">
        {children}
      </main>
      <Footer />
    </>
  );
}
