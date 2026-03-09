'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Section, Card, Tag, Stat, Button } from '@/components/ui';
import Link from 'next/link';

export default function EADeepDive() {
  const { slug } = useParams();
  const [ea, setEa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEA() {
      const supabase = createClient();
      const { data } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_slug', slug)
        .single();
      
      if (data) setEa(data);
      setLoading(false);
    }
    fetchEA();
  }, [slug]);

  if (loading) return <Section title="Loading Arsenal..." className="pb-48" />;
  if (!ea) return <Section title="System Not Found" subtitle="This EA is currently offline." className="pb-48" />;

  return (
    <Section 
      label="Technology Deep-Dive" 
      title={ea.section_title} 
      subtitle="Full technical specifications and backtest parameters"
      className="pb-48"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Data & Performance Visualization */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden border-border/40 bg-surface-1">
            <div className="bg-surface-2 p-4 border-b border-border flex justify-between items-center">
              <span className="text-[10px] font-mono text-brand uppercase tracking-widest font-bold font-sora">Strategy Tester Report</span>
              <Tag color="profit">Verified Logic</Tag>
            </div>
            
            <div className="h-72 bg-[#050A0A] flex flex-col items-center justify-center border-b border-border p-8 text-center">
               <div className="w-full max-w-md h-1 bg-border/30 rounded-full mb-4 overflow-hidden">
                  <div className="h-full bg-brand w-2/3 shadow-[0_0_15px_#20B2AA]" />
               </div>
               <p className="text-text-muted text-[10px] font-mono uppercase tracking-[0.3em] animate-pulse">
                  Streaming Live Equity Curve Data...
               </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border bg-surface-1">
              <div className="p-6"><Stat value="2.41" label="Profit Factor" /></div>
              <div className="p-6"><Stat value="68%" label="Win Rate" /></div>
              <div className="p-6"><Stat value="14.2%" label="Max DD" color="text-loss" /></div>
              <div className="p-6"><Stat value="1.95" label="Sharpe Ratio" /></div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h4 className="text-brand text-[10px] font-bold uppercase tracking-[3px] mb-4 font-sora">Core Philosophy</h4>
              <p className="text-text-secondary text-sm font-light leading-relaxed">{ea.content}</p>
            </Card>
            <Card>
              <h4 className="text-brand text-[10px] font-bold uppercase tracking-[3px] mb-4 font-sora">Operational Specs</h4>
              <ul className="space-y-3 text-[12px] text-text-secondary font-light">
                <li className="flex justify-between border-b border-border/30 pb-2"><span>Timeframe</span> <span className="text-text-bright font-bold">M15 / H1</span></li>
                <li className="flex justify-between border-b border-border/30 pb-2"><span>Asset Class</span> <span className="text-text-bright font-bold">XAUUSD / FX</span></li>
                <li className="flex justify-between border-b border-border/30 pb-2"><span>Execution</span> <span className="text-text-bright font-bold">Fully Automated</span></li>
              </ul>
            </Card>
          </div>
        </div>

        {/* RIGHT COLUMN: Subscription Licensing */}
        <div className="space-y-6">
          <Card className="border-brand/40 bg-surface-1 shadow-2xl shadow-brand/5 sticky top-24">
            <Tag>Licensing Model</Tag>
            <div className="mt-4 mb-8">
              <h3 className="text-2xl font-bold text-text-bright font-sora">Subscription Access</h3>
              <p className="text-text-secondary text-xs mt-2 font-light leading-relaxed">Continuous updates, session-specific optimizations, and MQL5 cloud access.</p>
            </div>
            
            <div className="text-4xl font-black text-brand mb-10">$297<span className="text-sm text-text-muted font-normal tracking-normal"> / month</span></div>
            
            <Button primary full>Deploy to Terminal</Button>
            
            <div className="mt-8 pt-8 border-t border-border/50">
               <p className="text-[11px] text-text-muted uppercase tracking-widest mb-4">Included in License:</p>
               <div className="space-y-3">
                  {["Prop Firm Compliance", "Daily Loss Ceiling", "Session-Aware Logic", "Private Support"].map(f => (
                    <div key={f} className="flex items-center gap-3 text-[11px] text-text-secondary font-light">
                      <div className="w-1 h-1 rounded-full bg-brand" /> {f}
                    </div>
                  ))}
               </div>
            </div>

            <Link href="/contact" className="block mt-8 text-center">
              <span className="text-[10px] text-text-muted hover:text-brand transition-colors cursor-pointer font-bold uppercase tracking-widest">
                 Inquire About Mentorship Pricing
              </span>
            </Link>
          </Card>
        </div>
      </div>
    </Section>
  );
}