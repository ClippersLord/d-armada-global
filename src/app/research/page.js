'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Section, Pill } from '@/components/ui';
import PostCard from '@/components/PostCard';

const CATS = ['All', 'Macro', 'Commodities', 'Crypto', 'FX'];

export default function ResearchPage() {
  const [posts, setPosts] = useState([]);
  const [cat, setCat] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      let q = supabase.from('posts').select('*')
        .eq('category', 'research').eq('is_published', true)
        .order('published_at', { ascending: false });
      if (cat !== 'All') q = q.ilike('subcategory', cat);
      const { data } = await q;
      setPosts(data || []);
      setLoading(false);
    };
    load();
  }, [cat]);

  return (
    <Section label="D-Armada Research" title="Market Research" subtitle="Deep macro analysis across asset classes. Click any article to read the full analysis or watch the video.">
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATS.map(c => <Pill key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Pill>)}
      </div>
      {loading ? (
        <div className="text-center py-16 text-brand text-sm animate-pulse">Loading research...</div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map(post => <PostCard key={post.id} post={post} basePath="/research" />)}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface-1 border border-border rounded-xl">
          <p className="text-text-muted text-sm">No research published yet. Check back soon.</p>
        </div>
      )}
    </Section>
  );
}
