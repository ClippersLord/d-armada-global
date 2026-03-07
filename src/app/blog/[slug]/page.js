import { createServerSupabase } from '@/lib/supabase/server';
import PostDisplay from '@/components/PostDisplay';

export async function generateMetadata({ params }) {
  const supabase = createServerSupabase();
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single();

  return {
    title: post ? `${post.title} — D-Armada Global` : 'Not Found',
    description: post?.excerpt || '',
  };
}

export default async function BlogPost({ params }) {
  const supabase = createServerSupabase();
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('category', 'blog')
    .eq('is_published', true)
    .single();

  return <PostDisplay post={post} />;
}
