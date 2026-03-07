import { createServerSupabase } from '@/lib/supabase/server';
import { Section, Card, Tag } from '@/components/ui';

export const metadata = { title: 'Leaderboard — D-Armada Community' };

export default async function LeaderboardPage() {
  const supabase = createServerSupabase();
  const { data: entries } = await supabase
    .from('leaderboard_entries')
    .select('*')
    .order('pnl_percent', { ascending: false });

  const months = [...new Set(entries?.map(e => e.month) || [])].sort().reverse();

  return (
    <Section label="Community" title="Performance Leaderboard" subtitle="Monthly performance tracking for community members running D-Armada systems.">
      {entries && entries.length > 0 ? (
        months.map(month => {
          const monthEntries = entries.filter(e => e.month === month);
          return (
            <div key={month} className="mb-8">
              <h2 className="text-lg font-semibold text-text-bright mb-4">{month}</h2>
              <div className="bg-surface-1 border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {['Rank', 'Trader', 'P&L %', 'Win Rate', 'Trades', 'Max DD', 'EA', 'Verified'].map(h => (
                        <th key={h} className="text-left p-3 text-text-muted text-[10px] tracking-widest uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {monthEntries.map((e, i) => (
                      <tr key={e.id} className="border-b border-border/30">
                        <td className="p-3 text-text-bright font-bold">{i + 1}</td>
                        <td className="p-3 text-text-bright font-medium">{e.trader_name}</td>
                        <td className={`p-3 font-semibold ${e.pnl_percent >= 0 ? 'text-profit' : 'text-loss'}`}>
                          {e.pnl_percent >= 0 ? '+' : ''}{e.pnl_percent}%
                        </td>
                        <td className="p-3 text-text-secondary">{e.win_rate}%</td>
                        <td className="p-3 text-text-secondary">{e.total_trades}</td>
                        <td className="p-3 text-loss">{e.max_drawdown}%</td>
                        <td className="p-3 text-text-secondary text-xs">{e.ea_used}</td>
                        <td className="p-3">
                          {e.verified ? (
                            e.myfxbook_url ? (
                              <a href={e.myfxbook_url} target="_blank" rel="noopener noreferrer">
                                <Tag color="profit">✓ Verified</Tag>
                              </a>
                            ) : <Tag color="profit">✓ Verified</Tag>
                          ) : <Tag color="muted">Pending</Tag>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      ) : (
        <Card className="text-center py-12">
          <div className="text-3xl mb-3">🏆</div>
          <p className="text-text-muted text-sm">The leaderboard is being set up. Community rankings will appear here soon.</p>
        </Card>
      )}
    </Section>
  );
}
