'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Section, Pill } from '@/components/ui';
import PostCard from '@/components/PostCard';

const CATS = ['All', 'Macro', 'Commodities', 'Crypto', 'FX'];

export default function ResearchPage() {
  const [activeTab, setActiveTab] = useState('intel'); // 'intel' or 'learn'
  const [posts, setPosts] = useState([]);
  const [pageData, setPageData] = useState({ title: 'Market Research', subtitle: 'Loading...' });
  const [cat, setCat] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      
      // 1. Fetch Dynamic Page Text from our new 'page_content' table
      const { data: content } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_slug', 'research-main')
        .single();
      
      if (content) {
        setPageData({ title: content.section_title, subtitle: content.content });
      }

      // 2. Fetch Research Posts
      let q = supabase.from('posts').select('*')
        .eq('category', 'research').eq('is_published', true)
        .order('published_at', { ascending: false });
      
      if (cat !== 'All') q = q.ilike('subcategory', cat);
      
      const { data: postsData } = await q;
      setPosts(postsData || []);
      setLoading(false);
    };
    loadData();
  }, [cat]);

  return (
    <Section label="D-Armada Research" title={pageData.title} subtitle={pageData.subtitle}>
      
      {/* Dual Tab Toggle from Demo */}
      <div className="flex border-b border-border mb-8">
        <button 
          onClick={() => setActiveTab('intel')}
          className={`pb-4 px-6 text-xs uppercase tracking-widest font-bold transition-all ${activeTab === 'intel' ? 'border-b-2 border-brand text-brand' : 'text-text-muted hover:text-text-secondary'}`}
        >
          Daily Intelligence
        </button>
        <button 
          onClick={() => setActiveTab('learn')}
          className={`pb-4 px-6 text-xs uppercase tracking-widest font-bold transition-all ${activeTab === 'learn' ? 'border-b-2 border-brand text-brand' : 'text-text-muted hover:text-text-secondary'}`}
        >
          Learn @ D-Armada
        </button>
      </div>

      {activeTab === 'intel' ? (
        <>
          {/* Categories for Intelligence */}
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
              <p className="text-text-muted text-sm">No research published yet.</p>
            </div>
          )}
        </>
      ) : (
        /* Learn Section - Featured YouTube Content */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* We will map through YouTube links here later */}
          <div className="aspect-video bg-surface-1 border border-border rounded-xl flex items-center justify-center group cursor-pointer hover:border-brand/50 transition-all">
             <p className="text-text-muted group-hover:text-brand transition-all font-mono text-xs uppercase tracking-widest">Masterclass Playlist Coming Soon</p>
          </div>
          <div className="space-y-4">
             <h3 className="text-text-bright font-bold uppercase tracking-wider text-sm">Free Education Hub</h3>
             <p className="text-text-muted text-sm leading-relaxed">
               Access our complete library of technical analysis, session-awareness training, and "Balance vs Impulse" breakdowns. 
               All education remains free to the D-Armada community.
             </p>
          </div>
        </div>
      )}
    </Section>
  );
}