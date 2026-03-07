import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { POST_CATEGORIES } from '@/lib/constants';

export default async function AdminPosts({ searchParams }) {
  const supabase = createServerSupabase();
  const category = searchParams?.category || '';

  let query = supabase
    .from('posts')
    .select('id, title, slug, category, subcategory, is_published, is_premium, published_at, created_at')
    .order('created_at', { ascending: false });

  if (category) query = query.eq('category', category);

  const { data: posts } = await query;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text-bright">Posts & Content</h1>
        <Link
          href="/admin/posts/new"
          className="px-5 py-2.5 bg-gradient-to-br from-brand to-brand-dark text-surface-bg rounded-lg text-xs font-semibold tracking-wider uppercase"
        >
          + New Post
        </Link>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Link
          href="/admin/posts"
          className={`px-3 py-1.5 rounded-full text-[11px] border transition-all ${
            !category ? 'bg-brand/10 border-brand/30 text-brand' : 'border-border text-text-secondary hover:text-text-primary'
          }`}
        >
          All
        </Link>
        {POST_CATEGORIES.map(cat => (
          <Link
            key={cat.value}
            href={`/admin/posts?category=${cat.value}`}
            className={`px-3 py-1.5 rounded-full text-[11px] border transition-all ${
              category === cat.value ? 'bg-brand/10 border-brand/30 text-brand' : 'border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Posts Table */}
      <div className="bg-surface-1 border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-text-muted text-[10px] tracking-widest uppercase">Title</th>
              <th className="text-left p-4 text-text-muted text-[10px] tracking-widest uppercase">Category</th>
              <th className="text-left p-4 text-text-muted text-[10px] tracking-widest uppercase">Status</th>
              <th className="text-left p-4 text-text-muted text-[10px] tracking-widest uppercase">Date</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {posts?.map(post => (
              <tr key={post.id} className="border-b border-border/50 hover:bg-surface-2/50 transition-colors">
                <td className="p-4">
                  <div className="text-text-bright font-medium">{post.title}</div>
                  <div className="text-text-muted text-[11px] mt-0.5">/{post.slug}</div>
                </td>
                <td className="p-4">
                  <span className="bg-brand/10 text-brand text-[9px] px-2 py-0.5 rounded tracking-wider uppercase">
                    {post.category}
                  </span>
                  {post.subcategory && (
                    <span className="text-text-muted text-[10px] ml-2">{post.subcategory}</span>
                  )}
                </td>
                <td className="p-4">
                  <span className={`text-[10px] font-semibold ${post.is_published ? 'text-profit' : 'text-caution'}`}>
                    {post.is_published ? 'Published' : 'Draft'}
                  </span>
                  {post.is_premium && (
                    <span className="bg-caution/10 text-caution text-[9px] px-1.5 py-0.5 rounded ml-2">PRO</span>
                  )}
                </td>
                <td className="p-4 text-text-muted text-xs">
                  {new Date(post.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="text-brand text-xs hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(!posts || posts.length === 0) && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-muted text-sm">
                  No posts yet. Create your first post to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
