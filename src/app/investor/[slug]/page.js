import { createServerSupabase } from '@/lib/supabase/server';
import PostDisplay from '@/components/PostDisplay';

export default async function InvestorPost({ params }) {
  const supabase = createServerSupabase();
  const { data: post } = await supabase
    .from('posts').select('*')
    .eq('slug', params.slug).eq('category', 'investor').eq('is_published', true).single();
  return <PostDisplay post={post} />;
}
