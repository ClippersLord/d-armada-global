'use client';
import { useState, useEffect } from 'react';
import { Section, Card, Stat, Tag } from '@/components/ui';

export default function PerformancePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/myfxbook')
      .then(res => res.json())
      .then(d => {
        if (d.error) setError(d.error);
        else setData(d);
        setLoading(false);
      })
      .catch(() => { setError('Failed to load performance data'); setLoading(false); });
  }, []);

  return (
    <Section label="D-Armada Trading" title="Performance Reports" subtitle="Live Myfxbook-verified performance from funded prop firm accounts running D-Armada systems.">
      {loading && (
        <div className="text-center py-16">
          <div className="text-brand text-sm animate-pulse">Loading live performance data...</div>
        </div>
      )}

      {error && (
        <Card className="text-center py-12">
          <div className="text-text-muted text-sm mb-2">Performance data is not yet configured.</div>
          <p className="text-text-muted text-xs">
            Once Myfxbook credentials are set in Admin → Settings, live performance data will appear here automatically.
          </p>
        </Card>
      )}

      {data && data.account && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            <Card><Stat value={`${data.account.gain?.toFixed(1) || '0.0'}%`} label="Total Gain" color="text-profit" /></Card>
            <Card><Stat value={`${data.account.absGain?.toFixed(0) || '0'}`} label="Abs. Gain ($)" color="text-brand" /></Card>
            <Card><Stat value={`${data.account.drawdown?.toFixed(1) || '0.0'}%`} label="Max Drawdown" color="text-loss" /></Card>
            <Card><Stat value={`${data.account.trades || 0}`} label="Total Trades" color="text-brand" /></Card>
            <Card><Stat value={`${data.account.profitFactor?.toFixed(2) || '0.00'}`} label="Profit Factor" color="text-brand" /></Card>
          </div>

          {/* Monthly Breakdown */}
          {data.monthly && data.monthly.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-text-bright mb-4">Monthly Performance</h2>
              <div className="bg-surface-1 border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {['Month', 'Gain %', 'Pips', 'Lots'].map(h => (
                        <th key={h} className="text-left p-4 text-text-muted text-[10px] tracking-widest uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.monthly.slice(0, 12).map((m, i) => (
                      <tr key={i} className="border-b border-border/30">
                        <td className="p-4 text-text-bright font-medium">
                          {m.month || `Month ${i + 1}`}
                        </td>
                        <td className={`p-4 font-semibold ${(m.gain || 0) >= 0 ? 'text-profit' : 'text-loss'}`}>
                          {(m.gain || 0) >= 0 ? '+' : ''}{m.gain?.toFixed(2) || '0.00'}%
                        </td>
                        <td className="p-4 text-text-secondary">{m.pips?.toFixed(1) || '—'}</td>
                        <td className="p-4 text-text-secondary">{m.lots?.toFixed(2) || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {data.lastUpdated && (
            <p className="text-text-muted text-[11px] mt-6 italic">
              Data last updated: {new Date(data.lastUpdated).toLocaleString()} · Cached for 15 minutes · Source: Myfxbook API
            </p>
          )}
        </>
      )}

      <p className="text-text-muted text-[11px] mt-4 italic">
        Past performance does not guarantee future results. Trading involves risk of capital loss.
      </p>
    </Section>
  );
}
