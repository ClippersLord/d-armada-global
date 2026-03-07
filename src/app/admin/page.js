import { createServerSupabase } from '@/lib/supabase/server';

export default async function AdminDashboard() {
  const supabase = createServerSupabase();

  const [
    { count: postCount },
    { count: productCount },
    { count: orderCount },
    { data: recentContacts },
  ] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(5),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-bright mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Posts', value: postCount || 0, color: 'text-brand' },
          { label: 'Products', value: productCount || 0, color: 'text-brand' },
          { label: 'Orders', value: orderCount || 0, color: 'text-profit' },
          { label: 'Messages', value: recentContacts?.length || 0, color: 'text-caution' },
        ].map(s => (
          <div key={s.label} className="bg-surface-2 border border-border rounded-xl p-5 text-center">
            <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-text-muted tracking-widest uppercase mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-text-bright mb-4">Recent Contact Messages</h2>
      {recentContacts?.length > 0 ? (
        <div className="space-y-2">
          {recentContacts.map(c => (
            <div key={c.id} className="bg-surface-1 border border-border rounded-lg p-4 flex justify-between items-start">
              <div>
                <div className="text-sm text-text-bright font-medium">{c.name}</div>
                <div className="text-xs text-text-muted mt-0.5">{c.subject}</div>
                <div className="text-xs text-text-secondary mt-1 line-clamp-1">{c.message}</div>
              </div>
              <div className="text-[10px] text-text-muted shrink-0 ml-4">
                {new Date(c.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-text-muted text-sm">No messages yet.</p>
      )}
    </div>
  );
}
