import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';

export default async function AdminProducts() {
  const supabase = createServerSupabase();
  const { data: products } = await supabase
    .from('products').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text-bright">EA Products</h1>
        <Link href="/admin/products/new"
          className="px-5 py-2.5 bg-gradient-to-br from-brand to-brand-dark text-surface-bg rounded-lg text-xs font-semibold tracking-wider uppercase">
          + New Product
        </Link>
      </div>
      <div className="bg-surface-1 border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {['Name', 'Price', 'Tier', 'Status', ''].map(h => (
                <th key={h} className="text-left p-4 text-text-muted text-[10px] tracking-widest uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products?.map(p => (
              <tr key={p.id} className="border-b border-border/30 hover:bg-surface-2/50">
                <td className="p-4">
                  <div className="text-text-bright font-medium">{p.name}</div>
                  <div className="text-text-muted text-[11px]">v{p.version} · /{p.slug}</div>
                </td>
                <td className="p-4 text-brand font-semibold">
                  ${(p.price_cents / 100).toFixed(0)}/{p.billing_interval}
                </td>
                <td className="p-4">
                  <span className="bg-brand/10 text-brand text-[9px] px-2 py-0.5 rounded tracking-wider uppercase">{p.tier}</span>
                </td>
                <td className="p-4">
                  <span className={`text-[10px] font-semibold ${p.is_active ? 'text-profit' : 'text-text-muted'}`}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link href={`/admin/products/${p.id}/edit`} className="text-brand text-xs hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
            {(!products || products.length === 0) && (
              <tr><td colSpan={5} className="p-8 text-center text-text-muted text-sm">No products yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
