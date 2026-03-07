'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Section, Pill } from '@/components/ui';
import PostCard from '@/components/PostCard';

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function LearnPage() {
  const [posts, setPosts] = useState([]);
  const [level, setLevel] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      let q = supabase.from('posts').select('*')
        .eq('category', 'course').eq('is_published', true)
        .order('published_at', { ascending: false });
      if (level !== 'All') q = q.ilike('subcategory', level);
      const { data } = await q;
      setPosts(data || []);
      setLoading(false);
    };
    load();
  }, [level]);

  return (
    <Section label="D-Armada Research" title="Learn @ D-Armada" subtitle="Structured courses from fundamentals to algorithmic system design. Click any course to begin learning.">
      <div className="flex gap-2 mb-6 flex-wrap">
        {LEVELS.map(l => <Pill key={l} active={level === l} onClick={() => setLevel(l)}>{l}</Pill>)}
      </div>
      {loading ? (
        <div className="text-center py-16 text-brand text-sm animate-pulse">Loading courses...</div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map(post => <PostCard key={post.id} post={post} basePath="/learn" />)}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface-1 border border-border rounded-xl">
          <p className="text-text-muted text-sm">Courses are being developed. Check back soon.</p>
        </div>
      )}
    </Section>
  );
}
