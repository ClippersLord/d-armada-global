'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Section, Card, Tag, Pill } from '@/components/ui';
import PostCard from '@/components/PostCard';

const CATS = ['All', 'Macro', 'Commodities', 'Crypto', 'FX'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function ResearchPage() {
  const [sub, setSub] = useState("market"); 
  const [cat, setCat] = useState("All");
  const [lvl, setLvl] = useState("All");
  const [posts, setPosts] = useState([]);
  const [dbContent, setDbContent] = useState({});
  const [loading, setLoading] = useState(true);

  // Verbatim Course Data from your Demo
  const COURSES = [
    { id: 1, slug: 'course-1', title: "Market Structure Masterclass", lessons: 24, hrs: "8h", level: "Intermediate", desc: "Institutional order flow and high-probability breakout setups." },
    { id: 2, slug: 'course-2', title: "Algorithmic Trading Foundations", lessons: 32, hrs: "12h", level: "Beginner", desc: "From zero to your first MQL5 EA — architecture, execution, and risk." },
    { id: 3, slug: 'course-3', title: "Macro Analysis for Traders", lessons: 18, hrs: "6h", level: "Advanced", desc: "Central bank policy, geopolitics, and flow analysis through the institutional lens." },
    { id: 4, slug: 'course-4', title: "Prop Firm Playbook", lessons: 14, hrs: "5h", level: "Beginner", desc: "Strategies, risk frameworks, and account management for funded trading." },
  ];

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      
      const { data: contentData } = await supabase.from('page_content').select('*');
      const contentMap = {};
      contentData?.forEach(item => { 
        contentMap[`${item.page_slug}_title`] = item.section_title;
        contentMap[`${item.page_slug}_body`] = item.content;
      });
      setDbContent(contentMap);

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

  // Filtering Logic for Courses
  const filteredCourses = lvl === "All" ? COURSES : COURSES.filter(c => c.level === lvl);

  return (
    <Section 
      label="D-Armada Research" 
      title={sub === "market" ? getContent('res-main', 'title', "Market Research") : getContent('learn-main', 'title', "Learn @ D-Armada")}
      subtitle={sub === "market" ? getContent('res-main', 'body', "Deep macro analysis across asset classes") : getContent('learn-main', 'body', "Structured courses from fundamentals to algorithmic system design")}
    >
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
          {/* Exact SubNav from Demo for Learning Levels */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {LEVELS.map(l => <Pill key={l} active={lvl === l} onClick={() => setLvl(l)}>{l}</Pill>)}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCourses.map(course => (
              <Card key={course.id}>
                <div className="flex items-center justify-between mb-4">
                  <Tag color={course.level === "Advanced" ? "#F87171" : course.level === "Intermediate" ? "#20B2AA" : "#34D399"}>
                    {course.level}
                  </Tag>
                  <span className="text-[11px] text-text-muted">{course.lessons} lessons · {course.hrs}</span>
                </div>
                <h3 className="text-lg font-bold text-text-bright mb-2">
                  {getContent(course.slug, 'title', course.title)}
                </h3>
                <p className="text-text-secondary text-sm font-light leading-relaxed mb-4">
                  {getContent(course.slug, 'body', course.desc)}
                </p>
                {/* Progress bar and Footer from Demo */}
                <div className="h-1 bg-border/30 rounded-full mb-4 overflow-hidden">
                  <div className="h-full bg-brand w-0" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-text-muted">0% complete</span>
                  <span className="text-brand text-xs font-bold cursor-pointer">Start →</span>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </Section>
  );
}