import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { Section, Card, Stat, Tag } from '@/components/ui';

export const metadata = { title: 'Investor Relations — D-Armada Global' };

export default async function InvestorPage() {
  const supabase = createServerSupabase();
  const { data: posts } = await supabase
    .from('posts').select('*')
    .eq('category', 'investor').eq('is_published', true)
    .order('published_at', { ascending: false });

  return (
    <Section label="Investor Relations" title="Growth & Vision" subtitle="D-Armada Global is building the infrastructure layer for the next generation of systematic traders.">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <Card><Stat value="3" label="Revenue Streams" /></Card>
        <Card><Stat value="SaaS" label="Model" /></Card>
        <Card><Stat value="MRR" label="Growing" color="text-profit" /></Card>
        <Card><Stat value="2026" label="Launch Year" /></Card>
      </div>

      {/* Strategic Pillars */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
  {[
    {
      t: 'Revenue Model', 
      d: 'Live trading/capital management, Subscription licensing for EAs, and premium mentorship. Three independent recurring revenue streams.',
      icon: '📊'
    },
    {
      t: 'Market Opportunity', 
      d: 'The retail algorithmic trading market is growing rapidly as traders demand systematic approaches. The prop firm ecosystem creates natural demand for compliant, tested systems.',
      icon: '📈'
    },
    {
      t: 'Competitive Moat', 
      d: 'Vertically integrated: we produce the research, build the algorithms, and train the traders. No dependency on third-party infrastructure.',
      icon: '🛡️'
    },
  ].map((pillar) => (
    <Card key={pillar.t} className="bg-surface-1 border-border/50">
      <div className="text-2xl mb-4">{pillar.icon}</div>
      <h3 className="text-text-bright font-bold mb-3 tracking-wide uppercase text-sm">
        {pillar.t}
      </h3>
      <p className="text-text-secondary text-xs leading-relaxed font-light">
        {pillar.d}
      </p>
    </Card>
  ))}
</div>

      {/* Investor Updates */}
      {posts && posts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text-bright mb-4">Investor Updates</h2>
          <div className="space-y-3">
            {posts.map(post => (
              <Link key={post.id} href={`/investor/${post.slug}`}>
                <Card className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex gap-2 mb-1.5">
                      {post.subcategory && <Tag color="muted">{post.subcategory}</Tag>}
                      {post.published_at && (
                        <span className="text-text-muted text-[11px]">
                          {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-text-bright">{post.title}</h3>
                    {post.excerpt && <p className="text-text-secondary text-sm mt-1 font-light">{post.excerpt}</p>}
                  </div>
                  <span className="text-brand text-xs font-medium shrink-0">{post.video_url ? 'Watch →' : 'Read →'}</span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {(!posts || posts.length === 0) && (
        <Card className="text-center py-8">
          <p className="text-text-muted text-sm">Investor updates will be published here. For inquiries, please use the contact page.</p>
        </Card>
      )}
    </Section>
  );
}
