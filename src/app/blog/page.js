import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { Section, Card, Tag } from '@/components/ui';

export const metadata = { title: 'Blog — D-Armada Global' };

export default async function BlogPage() {
  const supabase = createServerSupabase();
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, published_at, tags')
    .eq('category', 'blog')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  return (
    <Section label="Blog" title="Insights & Commentary" subtitle="Trading perspectives, system design thoughts, and market observations.">
      {posts && posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="flex gap-2 mb-1.5">
                    {post.tags?.slice(0, 2).map(tag => (
                      <Tag key={tag} color="muted">{tag}</Tag>
                    ))}
                    {post.published_at && (
                      <span className="text-text-muted text-[11px]">
                        {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-text-bright">{post.title}</h3>
                  {post.excerpt && <p className="text-text-secondary text-sm mt-1 font-light">{post.excerpt}</p>}
                </div>
                <span className="text-brand text-xs font-medium shrink-0">Read →</span>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-text-muted text-sm">No posts published yet. Check back soon.</p>
        </div>
      )}
    </Section>
  );
}
