import Link from 'next/link';
import { Section, Card, Tag } from '@/components/ui';

export const metadata = { title: 'D-Armada Trading — Systematic Trading Operations' };

const SECTIONS = [
  { href: '/trading/strategies', icon: '🎯', title: 'Strategies', desc: 'Our three-state market philosophy: breakout capture, pullback continuation, and failure reversal.', tag: 'Core' },
  { href: '/trading/markets', icon: '📈', title: 'Markets Traded', desc: 'Live charts and real-time data for Gold, BTC, major FX pairs, and indices.', tag: 'Live Data' },
  { href: '/trading/performance', icon: '📊', title: 'Performance Reports', desc: 'Live Myfxbook-verified performance from funded prop firm accounts.', tag: 'Verified' },
  { href: '/trading/risk', icon: '🛡️', title: 'Risk Framework', desc: 'Position sizing, drawdown control, session management, and ATR floor protection.', tag: 'Essential' },
];

export default function TradingPage() {
  return (
    <Section label="D-Armada Trading" title="Systematic Trading Operations" subtitle="Our proprietary approach to algorithmic execution across Gold, BTC, and major FX pairs.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SECTIONS.map(s => (
          <Link key={s.href} href={s.href}>
            <Card className="h-full">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{s.icon}</span>
                <Tag>{s.tag}</Tag>
              </div>
              <h3 className="text-lg font-bold text-text-bright mb-2">{s.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed font-light">{s.desc}</p>
              <span className="text-brand text-xs font-medium mt-4 inline-block">Explore →</span>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
