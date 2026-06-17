import './globals.css';

export const metadata = {
  title: 'Dashboard Keuangan',
  description: 'Dashboard keuangan sederhana dengan dummy data lokal.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
