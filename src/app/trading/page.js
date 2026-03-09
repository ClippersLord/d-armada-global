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
  const [dbContent, setDbContent] = useState({});

  useEffect(() => {
    async function loadContent() {
      const supabase = createClient();
      const { data } = await supabase.from('page_content').select('*');
      const contentMap = {};
      data?.forEach(item => { contentMap[item.page_slug] = item.content; });
      setDbContent(contentMap);
    }
    loadContent();
  }, []);

  // Helper to prioritize DB content, fallback to EXACT demo text
  const getContent = (slug, fallback) => dbContent[slug] || fallback;

  return (
    <Section 
      label="D-Armada Trading" 
      title="Systematic Trading Operations" 
      subtitle={getContent('trading-main', "Our proprietary approach to algorithmic execution across Gold, BTC, and major FX pairs.")}
    >
      <div className="flex gap-2 mb-8 flex-wrap">
        {["Strategies", "Markets Traded", "Performance Reports", "Risk Framework"].map(i => (
          <Pill key={i} active={tab === i} onClick={() => setTab(i)}>{i}</Pill>
        ))}
      </div>

      {tab === "Strategies" && (
        <div className="grid gap-4">
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <Tag>Primary</Tag>
              <h3 className="text-lg font-bold text-text-bright">Breakout Capture</h3>
            </div>
            <p className="text-text-secondary text-sm font-light leading-relaxed">
              {getContent('strat-breakout', "Identify compression zones and trade the expansion. Uses multi-timeframe context, ATR-based stops, and session-aware entry windows.")}
            </p>
          </Card>
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <Tag>Secondary</Tag>
              <h3 className="text-lg font-bold text-text-bright">Pullback Continuation</h3>
            </div>
            <p className="text-text-secondary text-sm font-light leading-relaxed">
              {getContent('strat-pullback', "After a confirmed breakout, enter on the first structural pullback. Core/Runner split with wide trailing that doesn't engage until 2R+.")}
            </p>
          </Card>
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <Tag>Conditional</Tag>
              <h3 className="text-lg font-bold text-text-bright">Failure Reversal</h3>
            </div>
            <p className="text-text-secondary text-sm font-light leading-relaxed">
              {getContent('strat-failure', "When breakout fails, trade the reversal. Requires opposite-end stop placement with compression-aware algorithms.")}
            </p>
          </Card>
        </div>
      )}

      {tab === "Markets Traded" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            ["XAU/USD", "Gold", "Primary", "#34D399"],
            ["BTC/USD", "Bitcoin", "Primary", "#34D399"],
            ["EUR/USD", "Euro", "Secondary", "#FBBF24"],
            ["GBP/USD", "Cable", "Secondary", "#FBBF24"],
            ["USD/JPY", "Yen", "Watchlist", "#436660"],
            ["US30", "Dow Jones", "Watchlist", "#436660"]
          ].map(([sym, name, status, color]) => (
            <Card key={sym}>
              <div className="text-xl font-extrabold text-text-bright mb-1">{sym}</div>
              <div className="text-xs text-text-muted mb-3">{name}</div>
              <Tag color={color}>{status}</Tag>
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
                <tr key={r.month} className="border-b border-border/30">
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
          <Card>
            <h3 className="text-base font-bold text-text-bright mb-2">Position Sizing</h3>
            <p className="text-text-secondary text-sm font-light leading-relaxed">
              {getContent('risk-pos', "35/65 Core/Runner split. Core targets 1.5R, Runner rides with wide trailing. Max 2% risk per trade, 6% daily cap.")}
            </p>
          </Card>
          <Card>
            <h3 className="text-base font-bold text-text-bright mb-2">Drawdown Control</h3>
            <p className="text-text-secondary text-sm font-light leading-relaxed">
              {getContent('risk-dd', "Max drawdown tracked from challenge start balance. Daily P&L monitoring with auto-shutoff at configurable thresholds.")}
            </p>
          </Card>
          <Card>
            <h3 className="text-base font-bold text-text-bright mb-2">Session Management</h3>
            <p className="text-text-secondary text-sm font-light leading-relaxed">
              {getContent('risk-session', "Entries restricted to London/NY overlap. Positions managed through session transitions with volatility-aware exits.")}
            </p>
          </Card>
          <Card>
            <h3 className="text-base font-bold text-text-bright mb-2">ATR Floor Protection</h3>
            <p className="text-text-secondary text-sm font-light leading-relaxed">
              {getContent('risk-atr', "Trailing stops never move below ATR-based floor. Prevents premature exits during normal volatility expansion.")}
            </p>
          </Card>
        </div>
      )}
    </Section>
  );
}