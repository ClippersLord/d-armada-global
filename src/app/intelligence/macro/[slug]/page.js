import { createServerSupabase } from '@/lib/supabase/server';
import PostDisplay from '@/components/PostDisplay';

export default async function MacroPost({ params }) {
  const supabase = createServerSupabase();
  const { data: post } = await supabase
    .from('posts').select('*')
    .eq('slug', params.slug).eq('category', 'macro-context').eq('is_published', true).single();
  return <PostDisplay post={post} />;
}
