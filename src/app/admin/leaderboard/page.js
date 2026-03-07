'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLeaderboard() {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    trader_name: '', account_type: 'prop_firm', month: new Date().toISOString().slice(0, 7),
    pnl_percent: '', win_rate: '', total_trades: '', max_drawdown: '',
    ea_used: '', verified: false, myfxbook_url: '',
  });

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('leaderboard_entries').select('*').order('month', { ascending: false });
    setEntries(data || []);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    const supabase = createClient();
    const payload = {
      ...form,
      pnl_percent: parseFloat(form.pnl_percent) || 0,
      win_rate: parseFloat(form.win_rate) || 0,
      total_trades: parseInt(form.total_trades) || 0,
      max_drawdown: parseFloat(form.max_drawdown) || 0,
    };
    await supabase.from('leaderboard_entries').insert(payload);
    setShowForm(false);
    setForm({ trader_name: '', account_type: 'prop_firm', month: new Date().toISOString().slice(0, 7), pnl_percent: '', win_rate: '', total_trades: '', max_drawdown: '', ea_used: '', verified: false, myfxbook_url: '' });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return;
    const supabase = createClient();
    await supabase.from('leaderboard_entries').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text-bright">Leaderboard</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-gradient-to-br from-brand to-brand-dark text-surface-bg rounded-lg text-xs font-semibold tracking-wider uppercase cursor-pointer">
          {showForm ? 'Cancel' : '+ Add Entry'}
        </button>
      </div>

      {showForm && (
        <div className="bg-surface-1 border border-border rounded-xl p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div><label className="block text-[10px] text-text-muted tracking-widest uppercase mb-1">Trader Name</label><input value={form.trader_name} onChange={e => setForm(p => ({ ...p, trader_name: e.target.value }))} className="w-full p-2.5 bg-surface-bg border border-border rounded-lg text-text-bright text-sm outline-none focus:border-brand/50" /></div>
            <div><label className="block text-[10px] text-text-muted tracking-widest uppercase mb-1">Month (YYYY-MM)</label><input value={form.month} onChange={e => setForm(p => ({ ...p, month: e.target.value }))} className="w-full p-2.5 bg-surface-bg border border-border rounded-lg text-text-bright text-sm outline-none focus:border-brand/50" /></div>
            <div><label className="block text-[10px] text-text-muted tracking-widest uppercase mb-1">P&L %</label><input type="number" step="0.01" value={form.pnl_percent} onChange={e => setForm(p => ({ ...p, pnl_percent: e.target.value }))} className="w-full p-2.5 bg-surface-bg border border-border rounded-lg text-text-bright text-sm outline-none focus:border-brand/50" /></div>
            <div><label className="block text-[10px] text-text-muted tracking-widest uppercase mb-1">Win Rate %</label><input type="number" step="0.1" value={form.win_rate} onChange={e => setForm(p => ({ ...p, win_rate: e.target.value }))} className="w-full p-2.5 bg-surface-bg border border-border rounded-lg text-text-bright text-sm outline-none focus:border-brand/50" /></div>
            <div><label className="block text-[10px] text-text-muted tracking-widest uppercase mb-1">Total Trades</label><input type="number" value={form.total_trades} onChange={e => setForm(p => ({ ...p, total_trades: e.target.value }))} className="w-full p-2.5 bg-surface-bg border border-border rounded-lg text-text-bright text-sm outline-none focus:border-brand/50" /></div>
            <div><label className="block text-[10px] text-text-muted tracking-widest uppercase mb-1">Max DD %</label><input type="number" step="0.01" value={form.max_drawdown} onChange={e => setForm(p => ({ ...p, max_drawdown: e.target.value }))} className="w-full p-2.5 bg-surface-bg border border-border rounded-lg text-text-bright text-sm outline-none focus:border-brand/50" /></div>
            <div><label className="block text-[10px] text-text-muted tracking-widest uppercase mb-1">EA Used</label><input value={form.ea_used} onChange={e => setForm(p => ({ ...p, ea_used: e.target.value }))} className="w-full p-2.5 bg-surface-bg border border-border rounded-lg text-text-bright text-sm outline-none focus:border-brand/50" placeholder="D-Armada Breakout v3.0" /></div>
            <div><label className="block text-[10px] text-text-muted tracking-widest uppercase mb-1">Myfxbook URL</label><input value={form.myfxbook_url} onChange={e => setForm(p => ({ ...p, myfxbook_url: e.target.value }))} className="w-full p-2.5 bg-surface-bg border border-border rounded-lg text-text-bright text-sm outline-none focus:border-brand/50" /></div>
            <div className="flex items-end"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.verified} onChange={e => setForm(p => ({ ...p, verified: e.target.checked }))} className="w-4 h-4 accent-brand cursor-pointer" /><span className="text-sm text-text-secondary">Verified</span></label></div>
          </div>
          <button onClick={handleSave} className="px-5 py-2 bg-brand text-surface-bg rounded-lg text-xs font-semibold uppercase cursor-pointer">Save Entry</button>
        </div>
      )}

      <div className="bg-surface-1 border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border">{['Month', 'Trader', 'P&L', 'Win Rate', 'Trades', 'DD', 'EA', 'Status', ''].map(h => <th key={h} className="text-left p-3 text-text-muted text-[10px] tracking-widest uppercase">{h}</th>)}</tr></thead>
          <tbody>
            {entries.map(e => (
              <tr key={e.id} className="border-b border-border/30">
                <td className="p-3 text-text-muted text-xs">{e.month}</td>
                <td className="p-3 text-text-bright font-medium">{e.trader_name}</td>
                <td className={`p-3 font-semibold ${e.pnl_percent >= 0 ? 'text-profit' : 'text-loss'}`}>{e.pnl_percent}%</td>
                <td className="p-3 text-text-secondary">{e.win_rate}%</td>
                <td className="p-3 text-text-secondary">{e.total_trades}</td>
                <td className="p-3 text-loss">{e.max_drawdown}%</td>
                <td className="p-3 text-text-secondary text-xs">{e.ea_used}</td>
                <td className="p-3"><span className={`text-[9px] font-semibold ${e.verified ? 'text-profit' : 'text-text-muted'}`}>{e.verified ? '✓ Verified' : 'Pending'}</span></td>
                <td className="p-3"><button onClick={() => handleDelete(e.id)} className="text-loss text-xs cursor-pointer hover:underline">×</button></td>
              </tr>
            ))}
            {entries.length === 0 && <tr><td colSpan={9} className="p-8 text-center text-text-muted text-sm">No entries yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
