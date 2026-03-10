import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';

export default function RootLayout({ children }) {
  return (
    <>
      <div id="home" />
      {/* <Header /> */}
      <main className="relative z-0 mx-auto mt-20 w-full">{children}</main>
      {/* <Footer /> */}
    </>
  );
}
