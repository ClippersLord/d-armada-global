import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { Section, Card, Tag } from '@/components/ui';

export const metadata = { title: 'EA Shop — D-Armada Technologies' };

export default async function ShopPage() {
  const supabase = createServerSupabase();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('tier', { ascending: false });

  return (
    <Section label="D-Armada Technologies" title="EA Shop" subtitle="Production-grade MQL5 Expert Advisors. Every system runs on live funded accounts before release.">
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map(p => (
            <Link key={p.id} href={`/shop/${p.slug}`}>
              <Card glow={p.tier === 'bundle'} className="relative h-full">
                {p.tier === 'bundle' && (
                  <div className="absolute -top-px left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-brand to-transparent" />
                )}
                {p.tier === 'bundle' && <Tag>Best Value</Tag>}
                <h3 className="font-sora text-lg font-bold text-text-bright mt-2 mb-1.5">{p.name}</h3>
                {p.version && <span className="text-[10px] text-text-muted">v{p.version}</span>}
                <p className="text-text-secondary text-xs leading-relaxed mt-2 mb-5 font-light">
                  {p.short_description}
                </p>
                <div className="font-sora text-2xl font-extrabold text-brand mb-5">
                  ${(p.price_cents / 100).toFixed(0)}<span className="text-sm font-normal text-text-muted">/{p.billing_interval === 'one_time' ? '' : p.billing_interval}</span>
                </div>
                {p.features?.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <span className="text-brand text-[10px]">✓</span>
                    <span className="text-text-secondary text-xs">{f}</span>
                  </div>
                ))}
                <div className="mt-5">
                  <span className={`inline-block w-full text-center py-3 rounded-lg text-xs font-semibold tracking-widest uppercase ${
                    p.tier === 'bundle'
                      ? 'bg-gradient-to-br from-brand to-brand-dark text-surface-bg'
                      : 'border border-border text-text-secondary'
                  }`}>
                    {p.tier === 'bundle' ? 'Get Full Access' : 'View Details'}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-text-muted text-sm">Products coming soon. Check back shortly.</p>
        </div>
      )}
    </Section>
  );
}
