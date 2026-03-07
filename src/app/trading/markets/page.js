'use client';
import { Section, Card, Tag } from '@/components/ui';
import { TradingViewMiniChart } from '@/components/TradingViewWidget';

const MARKETS = [
  { symbol: 'OANDA:XAUUSD', name: 'Gold', pair: 'XAU/USD', status: 'Primary' },
  { symbol: 'BITSTAMP:BTCUSD', name: 'Bitcoin', pair: 'BTC/USD', status: 'Primary' },
  { symbol: 'OANDA:EURUSD', name: 'Euro', pair: 'EUR/USD', status: 'Secondary' },
  { symbol: 'OANDA:GBPUSD', name: 'Cable', pair: 'GBP/USD', status: 'Secondary' },
  { symbol: 'OANDA:USDJPY', name: 'Yen', pair: 'USD/JPY', status: 'Watchlist' },
  { symbol: 'TVC:DJI', name: 'Dow Jones', pair: 'US30', status: 'Watchlist' },
];

export default function MarketsPage() {
  return (
    <Section label="D-Armada Trading" title="Markets Traded" subtitle="Live charts and real-time data for the instruments we trade and monitor.">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MARKETS.map(m => (
          <Card key={m.symbol}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-lg font-bold text-text-bright">{m.pair}</div>
                <div className="text-xs text-text-muted">{m.name}</div>
              </div>
              <Tag color={m.status === 'Primary' ? 'profit' : m.status === 'Secondary' ? 'caution' : 'muted'}>
                {m.status}
              </Tag>
            </div>
            <div className="rounded-lg overflow-hidden border border-border">
              <TradingViewMiniChart symbol={m.symbol} height={200} />
            </div>
          </Card>
        ))}
      </div>
      <p className="text-text-muted text-[11px] mt-6 italic">
        Charts powered by TradingView. Data may be delayed depending on exchange.
      </p>
    </Section>
  );
}
