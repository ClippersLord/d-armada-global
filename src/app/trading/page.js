'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Section, Card, Tag, Pill } from '@/components/ui';
import Link from 'next/link';

export default function TradingOperations() {
  const [activeTab, setActiveTab] = useState('philosophy'); // Toggles between Philosophy and Performance
  const [loading, setLoading] = useState(true);
  
  // Create state to hold all your dynamic text, pre-wired for full CMS control.
  const [content, setContent] = useState({
    main: { title: 'Systematic Operations', content: 'Our proprietary approach to algorithmic execution across Gold, BTC, and major FX pairs.' },
    breakout: { title: 'Breakouts', desc: 'Capturing state transitions from balance to impulse, targeting key liquidity pools.' },
    metrics1: { val: '+3.1%', label: 'Monthly Avg Gain' },
    metrics2: { val: '✓ VERIFIED', label: 'Myfxbook-verified' }
  });

  useEffect(() => {
    const fetchContent = async () => {
      const supabase = createClient();
      
      // Multi-fetch all the needed text rows at once.
      const { data } = await supabase
        .from('page_content')
        .select('*')
        .in('page_slug', ['trading-philosophy', 'trading-strategies', 'trading-metrics-1', 'trading-metrics-2']);
      
      if (data) {
        // Map the database response to our UI structure.
        const main = data.find(d => d.page_slug === 'trading-philosophy');
        const breakout = data.find(d => d.page_slug === 'trading-strategies');
        const metric1 = data.find(d => d.page_slug === 'trading-metrics-1');
        const metric2 = data.find(d => d.page_slug === 'trading-metrics-2');
        
        setContent({
          main: { title: main?.section_title, content: main?.content },
          breakout: { title: breakout?.section_title, desc: breakout?.content },
          metrics1: { val: metric1?.section_title, label: metric1?.content },
          metrics2: { val: metric2?.section_title, label: metric2?.content }
        });
      }
      setLoading(false);
    };
    fetchContent();
  }, []);

  return (
    <Section label="D-Armada Trading" title={content.main.title} subtitle={content.main.content}>
      
      {/* Dual Tab Toggle - Philosophy / Performance (from your demo visuals) */}
      <div className="flex border-b border-border mb-12">
        <button 
          onClick={() => setActiveTab('philosophy')}
          className={`pb-4 px-6 text-xs uppercase tracking-widest font-bold transition-all ${activeTab === 'philosophy' ? 'border-b-2 border-brand text-brand' : 'text-text-muted hover:text-text-secondary'}`}
        >
          Philosophy & Strategies
        </button>
        <button 
          onClick={() => setActiveTab('performance')}
          className={`pb-4 px-6 text-xs uppercase tracking-widest font-bold transition-all ${activeTab === 'performance' ? 'border-b-2 border-brand text-brand' : 'text-text-muted hover:text-text-secondary'}`}
        >
          Live Performance Data
        </button>
      </div>

      {activeTab === 'philosophy' ? (
        <div className="space-y-12">
          {/* Main Strategy Highlight - Perfect match for your demo's breakout strategy breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-surface-1 p-10 border border-border rounded-xl">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl text-brand font-black">🎯</div>
                <Tag>CORE METHODOLOGY</Tag>
              </div>
              <h3 className="text-xl font-bold text-text-bright tracking-wide">{content.breakout.title}</h3>
              <p className="text-text-muted text-sm font-light leading-relaxed max-w-lg">
                Identify Balance, capture the Impulse transition, and execute to key liquidity targets. 
                Structured reversals identify false breakouts and failure patterns for institutional entry.
              </p>
            </div>
            <div className="text-center p-6 border border-border bg-surface-bg rounded-lg">
              <p className="text-text-muted text-xs uppercase tracking-widest mb-1">Status</p>
              <p className="text-profit font-black text-xs uppercase tracking-wider">Active Operations</p>
              <Pill className="mt-4 text-[10px] w-full text-center">WTI • GOLD • BTC</Pill>
            </div>
          </div>

          {/* Reversal and Risk Cards (from your demo visuals) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:border-brand/30 border-border/50 bg-surface-1">
              <p className="text-2xl text-brand font-black mb-3">🛡️</p>
              <h3 className="text-lg font-bold text-text-bright mb-1">Reversal Operations</h3>
              <p className="text-text-secondary text-sm font-light leading-relaxed">Structured identifying false breakouts and liquidation points for reversal capture.</p>
            </Card>
            <Card className="hover:border-brand/30 border-border/50 bg-surface-1">
              <p className="text-2xl text-loss font-black mb-3">⚖️</p>
              <h3 className="text-lg font-bold text-text-bright mb-1">Risk & Session Management</h3>
              <p className="text-text-secondary text-sm font-light leading-relaxed">Dynamic lot sizing, ATR-based floors, and rigid session filtering (LDN/NY).</p>
            </Card>
          </div>
        </div>
      ) : (
        /* Performance Tab - Features your dynamic monthly targets display and Myfxbook verification */
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-surface-1 border border-border rounded-xl text-center">
              <p className="text-text-muted text-[10px] uppercase tracking-[0.2em] mb-3">D-Armada Principal Account</p>
              <h2 className="text-4xl font-extrabold text-brand tracking-tighter">{content.metrics1.val}</h2>
              <p className="text-sm text-text-bright mt-1 font-semibold">{content.metrics1.label}</p>
              <Pill className="mt-4 text-[10px]">GOLD • XAUUSD Focus</Pill>
            </div>
            <div className="p-8 bg-surface-1 border border-border rounded-xl text-center flex flex-col items-center justify-center">
              <p className="text-text-muted text-[10px] uppercase tracking-[0.2em] mb-2">Funded Prop Firm Status</p>
              <Tag color="profit">{content.metrics2.val}</Tag>
              <p className="text-sm text-text-bright mt-3 font-semibold">{content.metrics2.label}</p>
            </div>
          </div>
          {/* We will map the live Myfxbook data widget here later */}
          <div className="h-60 bg-surface-1 border border-border rounded-xl flex items-center justify-center text-center">
            <p className="text-text-muted text-xs font-mono uppercase tracking-widest">Integrating Live Myfxbook Widget...</p>
          </div>
        </div>
      )}
    </Section>
  );
}