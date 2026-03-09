'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Section, Card, Tag, Pill } from '@/components/ui';

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function ResearchPage() {
  const [sub, setSub] = useState("market"); 
  const [lvl, setLvl] = useState("All");
  const [dbContent, setDbContent] = useState({});

  const COURSES = [
    { id: 1, slug: 'c1', title: "Market Structure Masterclass", lessons: 24, hrs: "8h", level: "Intermediate", desc: "Institutional order flow and high-probability breakout setups." },
    { id: 2, slug: 'c2', title: "Algorithmic Trading Foundations", lessons: 32, hrs: "12h", level: "Beginner", desc: "From zero to your first MQL5 EA — architecture, execution, and risk." },
    { id: 3, slug: 'c3', title: "Macro Analysis for Traders", lessons: 18, hrs: "6h", level: "Advanced", desc: "Central bank policy, geopolitics, and flow analysis." },
    { id: 4, slug: 'c4', title: "Prop Firm Playbook", lessons: 14, hrs: "5h", level: "Beginner", desc: "Strategies, risk frameworks, and account management for funded trading." },
  ];

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from('page_content').select('*');
      const contentMap = {};
      data?.forEach(i => { contentMap[`${i.page_slug}_t`] = i.section_title; contentMap[`${i.page_slug}_b`] = i.content; });
      setDbContent(contentMap);
    }
    load();
  }, []);

  const filtered = lvl === "All" ? COURSES : COURSES.filter(c => c.level === lvl);

  return (
    <Section label="D-Armada Research" title={sub === "market" ? "Market Research" : "Learn @ D-Armada"}>
      <div className="flex gap-2 mb-8">
        <Pill active={sub === "market"} onClick={() => setSub("market")}>Market Research</Pill>
        <Pill active={sub === "learn"} onClick={() => setSub("learn")}>Learn @ D-Armada</Pill>
      </div>

      {sub === "learn" && (
        <>
          <div className="flex gap-2 mb-6 flex-wrap">
            {LEVELS.map(l => <Pill key={l} active={lvl === l} onClick={() => setLvl(l)}>{l}</Pill>)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(c => (
              <Card key={c.id}>
                <div className="flex justify-between mb-4"><Tag>{c.level}</Tag><span className="text-xs text-text-muted">{c.lessons} lessons</span></div>
                <h3 className="text-lg font-bold text-text-bright mb-2">{dbContent[`${c.slug}_t`] || c.title}</h3>
                <p className="text-text-secondary text-sm mb-4">{dbContent[`${c.slug}_b`] || c.desc}</p>
                <div className="h-1 bg-border/20 rounded-full mb-4"><div className="h-full bg-brand w-0" /></div>
                <div className="flex justify-between items-center text-xs text-brand font-bold"><span>0% complete</span><span>Start →</span></div>
              </Card>
            ))}
          </div>
        </>
      )}
    </Section>
  );
}