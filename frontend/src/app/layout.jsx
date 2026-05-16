import './globals.css';

export const metadata = {
  title: 'IS207-FS',
  description: 'IS207 Phat trien ung dung Web',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
