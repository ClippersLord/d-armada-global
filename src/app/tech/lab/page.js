import { createServerSupabase } from '@/lib/supabase/server';
import { Section } from '@/components/ui';
import PostCard from '@/components/PostCard';

export const metadata = { title: 'Technology Lab — D-Armada Technologies' };

export default async function TechLabPage() {
  const supabase = createServerSupabase();
  const { data: posts } = await supabase
    .from('posts').select('*')
    .eq('category', 'tech-lab').eq('is_published', true)
    .order('published_at', { ascending: false });

  return (
    <Section label="D-Armada Technologies" title="Technology Lab" subtitle="R&D pipeline, architecture deep-dives, beta testing programs, and development logs.">
      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map(post => <PostCard key={post.id} post={post} basePath="/tech/lab" />)}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface-1 border border-border rounded-xl">
          <p className="text-text-muted text-sm">Lab updates coming soon.</p>
        </div>
      )}
    </Section>
  );
}
