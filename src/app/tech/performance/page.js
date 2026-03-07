'use client';
import { useState, useEffect } from 'react';
import { Section, Card, Stat } from '@/components/ui';

export default function EAPerformancePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/myfxbook')
      .then(res => res.json())
      .then(d => { if (d.error) setError(d.error); else setData(d); setLoading(false); })
      .catch(() => { setError('Failed to load data'); setLoading(false); });
  }, []);

  return (
    <Section label="D-Armada Technologies" title="EA Performance" subtitle="Live metrics from funded accounts running D-Armada Expert Advisors.">
      {loading && <div className="text-center py-16 text-brand text-sm animate-pulse">Loading live EA performance...</div>}

      {error && (
        <Card className="text-center py-12">
          <p className="text-text-muted text-sm">Performance data not yet configured. Set Myfxbook credentials in Admin → Settings.</p>
        </Card>
      )}

      {data && data.account && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            <Card><Stat value={`${data.account.gain?.toFixed(1) || '0'}%`} label="Total Gain" color="text-profit" /></Card>
            <Card><Stat value={`${data.account.drawdown?.toFixed(1) || '0'}%`} label="Max DD" color="text-loss" /></Card>
            <Card><Stat value={`${data.account.trades || 0}`} label="Trades" color="text-brand" /></Card>
            <Card><Stat value={`${data.account.profitFactor?.toFixed(2) || '—'}`} label="Profit Factor" color="text-brand" /></Card>
            <Card><Stat value={`${data.account.daily?.toFixed(2) || '0'}%`} label="Daily Avg" color="text-brand" /></Card>
          </div>

          {data.monthly && data.monthly.length > 0 && (
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
                      <td className="p-4 text-text-bright font-medium">{m.month || `Month ${i + 1}`}</td>
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
          )}
        </>
      )}
      <p className="text-text-muted text-[11px] mt-6 italic">Live prop firm accounts. Past performance does not guarantee future results.</p>
    </Section>
  );
}
