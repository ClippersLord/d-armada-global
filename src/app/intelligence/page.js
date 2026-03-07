'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Section, Card, Tag } from '@/components/ui';
import { TradingViewMiniChart, TradingViewTicker } from '@/components/TradingViewWidget';

const INSTRUMENTS = [
  { symbol: 'OANDA:XAUUSD', label: 'XAU/USD', name: 'Gold' },
  { symbol: 'BITSTAMP:BTCUSD', label: 'BTC/USD', name: 'Bitcoin' },
  { symbol: 'TVC:DXY', label: 'DXY', name: 'Dollar Index' },
  { symbol: 'OANDA:EURUSD', label: 'EUR/USD', name: 'Euro' },
  { symbol: 'OANDA:GBPUSD', label: 'GBP/USD', name: 'Cable' },
  { symbol: 'OANDA:USDJPY', label: 'USD/JPY', name: 'Yen' },
];

export default function IntelligencePage() {
  const [macros, setMacros] = useState([]);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('posts').select('id, title, slug, excerpt, published_at, video_url')
        .eq('category', 'macro-context').eq('is_published', true)
        .order('published_at', { ascending: false }).limit(3);
      setMacros(data || []);
    };
    load();
  }, []);

  return (
    <Section label="Market Intelligence" title="Real-Time Market Dashboard" subtitle="Key levels, sentiment, and macro context at a glance.">
      {/* Ticker Tape */}
      <div className="mb-8 rounded-xl overflow-hidden border border-border">
        <TradingViewTicker />
      </div>

      {/* Mini Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {INSTRUMENTS.map(inst => (
          <Card key={inst.symbol}>
            <div className="mb-2">
              <div className="text-xs text-text-muted tracking-wider">{inst.label}</div>
              <div className="text-sm font-semibold text-text-bright">{inst.name}</div>
            </div>
            <div className="rounded-lg overflow-hidden">
              <TradingViewMiniChart symbol={inst.symbol} height={180} />
            </div>
          </Card>
        ))}
      </div>

      {/* Macro Context Section */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-text-bright mb-4">Macro Context</h2>
        {macros.length > 0 ? (
          <div className="space-y-3">
            {macros.map(m => (
              <Link key={m.id} href={`/intelligence/macro/${m.slug}`}>
                <Card className="border-l-2 border-l-brand">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag>{m.video_url ? 'Video' : 'Analysis'}</Tag>
                    {m.published_at && (
                      <span className="text-text-muted text-[11px]">
                        {new Date(m.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-text-bright mb-1">{m.title}</h3>
                  {m.excerpt && <p className="text-text-secondary text-sm font-light">{m.excerpt}</p>}
                  <span className="text-brand text-xs font-medium mt-2 inline-block">
                    {m.video_url ? 'Watch →' : 'Read →'}
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="text-center py-8">
            <p className="text-text-muted text-sm">Macro context updates will appear here once published from the admin panel.</p>
          </Card>
        )}
      </div>

      <p className="text-text-muted text-[11px] mt-8 italic">
        Charts powered by TradingView. Data may be delayed.
      </p>
    </Section>
  );
}
