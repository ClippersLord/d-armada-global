'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Section, Card, Tag, Pill } from '@/components/ui';

const PERF = [
  { month: "Jan 2026", trades: 47, winRate: "54.2%", avgR: "1.8R", pnl: "+8.4%", dd: "-3.1%" },
  { month: "Feb 2026", trades: 52, winRate: "52.8%", avgR: "2.1R", pnl: "+11.2%", dd: "-2.7%" },
  { month: "Mar 2026", trades: 18, winRate: "55.6%", avgR: "1.6R", pnl: "+4.1%", dd: "-1.8%" },
];

export default function TradingPage() {
  const [tab, setTab] = useState("Strategies");
  const [content, setContent] = useState({});

  useEffect(() => {
    async function loadContent() {
      const supabase = createClient();
      const { data } = await supabase.from('page_content').select('*');
      const contentMap = {};
      data?.forEach(item => { contentMap[item.page_slug] = item; });
      setContent(contentMap);
    }
    loadContent();
  }, []);

  return (
    <Section 
      label="D-Armada Trading" 
      title="Systematic Trading Operations" 
      subtitle={content['trading-main']?.content || "Our proprietary approach to algorithmic execution across Gold, BTC, and major FX pairs."}
    >
      {/* Exact SubNav from your Demo */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {["Strategies", "Markets Traded", "Performance Reports", "Risk Framework"].map(i => (
          <Pill key={i} active={tab === i} onClick={() => setTab(i)}>{i}</Pill>
        ))}
      </div>

      {tab === "Strategies" && (
        <div className="grid gap-4">
          {[
            { tag: "Primary", title: "Breakout Capture", slug: "strat-breakout" },
            { tag: "Secondary", title: "Pullback Continuation", slug: "strat-pullback" },
            { tag: "Conditional", title: "Failure Reversal", slug: "strat-failure" }
          ].map((s) => (
            <Card key={s.title}>
              <div className="flex items-center gap-3 mb-3">
                <Tag>{s.tag}</Tag>
                <h3 className="text-lg font-bold text-text-bright">{s.title}</h3>
              </div>
              <p className="text-text-secondary text-sm font-light leading-relaxed">
                {content[s.slug]?.content || "Loading strategy details..."}
              </p>
            </Card>
          ))}
        </div>
      )}

      {tab === "Markets Traded" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            ["XAU/USD", "Gold", "Primary"], ["BTC/USD", "Bitcoin", "Primary"], 
            ["EUR/USD", "Euro", "Secondary"], ["GBP/USD", "Cable", "Secondary"], 
            ["USD/JPY", "Yen", "Watchlist"], ["US30", "Dow Jones", "Watchlist"]
          ].map(([sym, name, status]) => (
            <Card key={sym}>
              <div className="text-xl font-extrabold text-text-bright mb-1">{sym}</div>
              <div className="text-xs text-text-muted mb-3">{name}</div>
              <Tag color={status === "Primary" ? "#34D399" : status === "Secondary" ? "#FBBF24" : "#436660"}>{status}</Tag>
            </Card>
          ))}
        </div>
      )}

      {tab === "Performance Reports" && (
        <div className="overflow-x-auto bg-surface-1 border border-border rounded-xl">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border">
                {["Month", "Trades", "Win Rate", "Avg R", "P&L", "Max DD"].map(h => (
                  <th key={h} className="p-4 text-[10px] uppercase tracking-widest text-text-muted font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERF.map(r => (
                <tr key={r.month} className="border-b border-border/30 hover:bg-surface-2/50">
                  <td className="p-4 text-text-bright font-semibold">{r.month}</td>
                  <td className="p-4 text-text-secondary">{r.trades}</td>
                  <td className="p-4 text-text-secondary">{r.winRate}</td>
                  <td className="p-4 text-text-secondary">{r.avgR}</td>
                  <td className="p-4 text-profit font-bold">{r.pnl}</td>
                  <td className="p-4 text-loss">{r.dd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Risk Framework" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Position Sizing", slug: "risk-pos" },
            { title: "Drawdown Control", slug: "risk-dd" },
            { title: "Session Management", slug: "risk-session" },
            { title: "ATR Floor Protection", slug: "risk-atr" }
          ].map((r) => (
            <Card key={r.title}>
              <h3 className="text-base font-bold text-text-bright mb-2">{r.title}</h3>
              <p className="text-text-secondary text-sm font-light leading-relaxed">
                {content[r.slug]?.content || "Loading risk details..."}
              </p>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}