import { createServerSupabase } from '@/lib/supabase/server';

export default async function AdminOrders() {
  const supabase = createServerSupabase();
  const { data: orders } = await supabase
    .from('orders')
    .select('*, products(name)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-bright mb-8">Orders</h1>
      <div className="bg-surface-1 border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {['Date', 'Customer', 'Product', 'Amount', 'Status'].map(h => (
                <th key={h} className="text-left p-4 text-text-muted text-[10px] tracking-widest uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders?.map(o => (
              <tr key={o.id} className="border-b border-border/30">
                <td className="p-4 text-text-muted text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="p-4">
                  <div className="text-text-bright text-sm">{o.customer_name || '—'}</div>
                  <div className="text-text-muted text-[11px]">{o.customer_email}</div>
                </td>
                <td className="p-4 text-text-secondary text-sm">{o.products?.name || '—'}</td>
                <td className="p-4 text-brand font-semibold">${((o.amount_cents || 0) / 100).toFixed(2)}</td>
                <td className="p-4">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    o.status === 'completed' ? 'bg-profit/10 text-profit' :
                    o.status === 'refunded' ? 'bg-loss/10 text-loss' :
                    'bg-caution/10 text-caution'
                  }`}>{o.status}</span>
                </td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr><td colSpan={5} className="p-8 text-center text-text-muted text-sm">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
