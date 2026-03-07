import { createServerSupabase } from '@/lib/supabase/server';
import { Section } from '@/components/ui';
import PostCard from '@/components/PostCard';

export const metadata = { title: 'Strategies — D-Armada Trading' };

export default async function StrategiesPage() {
  const supabase = createServerSupabase();
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('category', 'strategy')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  return (
    <Section label="D-Armada Trading" title="Trading Strategies" subtitle="Built on a three-state market philosophy — breakout capture, pullback continuation, and failure reversal. Click any strategy for full details.">
      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map(post => (
            <PostCard key={post.id} post={post} basePath="/trading/strategies" />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface-1 border border-border rounded-xl">
          <p className="text-text-muted text-sm">Strategy content is being prepared. Check back soon.</p>
        </div>
      )}
    </Section>
  );
}
