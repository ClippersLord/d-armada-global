'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Section, Card, Tag } from '@/components/ui';

const SECTIONS = [
  { href: '/trading/strategies', icon: '🎯', title: 'Strategies', tag: 'Core' },
  { href: '/trading/markets', icon: '📈', title: 'Markets Traded', tag: 'Live Data' },
  { href: '/trading/performance', icon: '📊', title: 'Performance Reports', tag: 'Verified' },
  { href: '/trading/risk', icon: '🛡️', title: 'Risk Framework', tag: 'Essential' },
];

export default function TradingPage() {
  const [framework, setFramework] = useState({ title: 'Systematic Operations', content: 'Loading proprietary framework...' });

  useEffect(() => {
    const fetchFramework = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_slug', 'trading-framework')
        .single();
      
      if (data) {
        setFramework({ title: data.section_title, content: data.content });
      }
    };
    fetchFramework();
  }, []);

  return (
    <Section label="D-Armada Trading" title={framework.title} subtitle={framework.content}>
      
      {/* Strategy Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {SECTIONS.map(s => (
          <Link key={s.href} href={s.href}>
            <Card className="h-full hover:border-brand/40 transition-all border-border/50 bg-surface-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{s.icon}</span>
                <Tag>{s.tag}</Tag>
              </div>
              <h3 className="text-lg font-bold text-text-bright mb-2">{s.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed font-light">
                View our specialized {s.title.toLowerCase()} for Gold, BTC, and FX.
              </p>
              <span className="text-brand text-xs font-medium mt-4 inline-block uppercase tracking-widest">Explore Operations →</span>
            </Card>
          </Link>
        ))}
      </div>

      {/* Target Metrics Display (From your 80/800/8000 targets) */}
      <div className="bg-surface-bg border border-border rounded-xl p-8">
        <h3 className="text-xs uppercase tracking-[0.2em] text-brand font-bold mb-6 text-center">Standard Profit Targets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-text-bright">80 Pips</div>
            <div className="text-[10px] text-text-muted uppercase mt-1">WTI & FX Pairs</div>
          </div>
          <div className="text-center border-x border-border/50">
            <div className="text-2xl font-bold text-text-bright">800 Pips</div>
            <div className="text-[10px] text-text-muted uppercase mt-1">Gold (XAUUSD)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-text-bright">8000 Pips</div>
            <div className="text-[10px] text-text-muted uppercase mt-1">Bitcoin (BTCUSD)</div>
          </div>
        </div>
      </div>
    </Section>
  );
}