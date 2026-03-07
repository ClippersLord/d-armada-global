import { createServerSupabase } from '@/lib/supabase/server';
import { Section } from '@/components/ui';
import PostCard from '@/components/PostCard';

export const metadata = { title: 'Risk Framework — D-Armada Trading' };

export default async function RiskPage() {
  const supabase = createServerSupabase();
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('category', 'risk-framework')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  return (
    <Section label="D-Armada Trading" title="Risk Framework" subtitle="Position sizing, drawdown control, session management, and ATR floor protection. Click any topic for full details.">
      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map(post => (
            <PostCard key={post.id} post={post} basePath="/trading/risk" />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface-1 border border-border rounded-xl">
          <p className="text-text-muted text-sm">Risk framework documentation is being prepared. Check back soon.</p>
        </div>
      )}
    </Section>
  );
}
