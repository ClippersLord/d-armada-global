'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Section, Card, Tag, Pill } from '@/components/ui';
import PostCard from '@/components/PostCard';

const CATS = ['All', 'Macro', 'Commodities', 'Crypto', 'FX'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function ResearchPage() {
  const [sub, setSub] = useState("market"); // 'market' or 'learn'
  const [cat, setCat] = useState("All");
  const [lvl, setLvl] = useState("All");
  const [posts, setPosts] = useState([]);
  const [dbContent, setDbContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      
      // 1. Fetch CMS Content
      const { data: contentData } = await supabase.from('page_content').select('*');
      const contentMap = {};
      contentData?.forEach(item => { 
        contentMap[`${item.page_slug}_title`] = item.section_title;
        contentMap[`${item.page_slug}_body`] = item.content;
      });
      setDbContent(contentMap);

      // 2. Fetch Research Posts (for the Intel tab)
      let q = supabase.from('posts').select('*')
        .eq('category', 'research').eq('is_published', true)
        .order('published_at', { ascending: false });
      if (cat !== 'All') q = q.ilike('subcategory', cat);
      const { data: postsData } = await q;
      
      setPosts(postsData || []);
      setLoading(false);
    }
    loadData();
  }, [cat]);

  const getContent = (slug, type, fallback) => dbContent[`${slug}_${type}`] || fallback;

  return (
    <Section 
      label="D-Armada Research" 
      title={sub === "market" ? getContent('res-main', 'title', "Market Research") : getContent('learn-main', 'title', "Learn @ D-Armada")}
      subtitle={sub === "market" ? getContent('res-main', 'body', "Deep macro analysis across asset classes") : getContent('learn-main', 'body', "Structured courses from fundamentals to algorithmic system design")}
    >
      {/* Tab Switcher from Demo */}
      <div className="flex gap-2 mb-8">
        <Pill active={sub === "market"} onClick={() => setSub("market")}>Market Research</Pill>
        <Pill active={sub === "learn"} onClick={() => setSub("learn")}>Learn @ D-Armada</Pill>
      </div>

      {sub === "market" ? (
        <>
          <div className="flex gap-2 mb-6 flex-wrap">
            {CATS.map(c => <Pill key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Pill>)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map(post => <PostCard key={post.id} post={post} basePath="/research" />)}
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-2 mb-6 flex-wrap">
            {LEVELS.map(l => <Pill key={l} active={lvl === l} onClick={() => setLvl(l)}>{l}</Pill>)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Course 1: Masterclass */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <Tag color="#20B2AA">Intermediate</Tag>
                <span className="text-[11px] text-text-muted">24 lessons · 8h</span>
              </div>
              <h3 className="text-lg font-bold text-text-bright mb-2">
                {getContent('course-1', 'title', "Market Structure Masterclass")}
              </h3>
              <p className="text-text-secondary text-sm font-light leading-relaxed mb-4">
                {getContent('course-1', 'body', "Institutional order flow and high-probability breakout setups.")}
              </p>
              <div className="flex justify-between items-center pt-4 border-t border-border/30">
                <span className="text-[11px] text-text-muted">0% complete</span>
                <span className="text-brand text-xs font-bold cursor-pointer">Start →</span>
              </div>
            </Card>

            {/* Course 2: Foundations */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <Tag color="#34D399">Beginner</Tag>
                <span className="text-[11px] text-text-muted">32 lessons · 12h</span>
              </div>
              <h3 className="text-lg font-bold text-text-bright mb-2">
                {getContent('course-2', 'title', "Algorithmic Trading Foundations")}
              </h3>
              <p className="text-text-secondary text-sm font-light leading-relaxed mb-4">
                {getContent('course-2', 'body', "From zero to your first MQL5 EA — architecture, execution, and risk.")}
              </p>
              <div className="flex justify-between items-center pt-4 border-t border-border/30">
                <span className="text-[11px] text-text-muted">0% complete</span>
                <span className="text-brand text-xs font-bold cursor-pointer">Start →</span>
              </div>
            </Card>
          </div>
        </>
      )}
    </Section>
  );
}