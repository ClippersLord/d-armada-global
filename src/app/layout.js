import './globals.css';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'D-Armada Global',
  description: 'Institutional-grade research. Battle-tested algorithms. Education that transforms retail traders into systematic operators.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-surface-bg min-h-screen text-text-primary font-sora">
        <NavBar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
