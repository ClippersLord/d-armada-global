import './globals.css';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'D-Armada Global | Institutional Algorithmic Trading & Research',
  description: 'Elite MQL5 & Python Expert Advisors, Prop-Firm Risk Frameworks, and Institutional Market Research. Master automated trading across Gold, Bitcoin, and WTI.',
  keywords: 'Algorithmic Trading, MQL5 Expert Advisor, Python Trading Bots, Gold (XAUUSD) Strategy, Bitcoin Trading, WTI Crude Oil, Prop Firm Funded Trading, Forex Mentorship',
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
