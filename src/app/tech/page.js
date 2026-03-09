'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Section, Card, Tag, Pill, Stat } from '@/components/ui';

export default function TechPage() {
  // We use this state to switch the view without changing the URL
  const [activeHub, setActiveHub] = useState("EA Shop");
  const [dbContent, setDbContent] = useState({});

  useEffect(() => {
    async function loadTechData() {
      const supabase = createClient();
      const { data } = await supabase.from('page_content').select('*');
      const contentMap = {};
      data?.forEach(item => { 
        contentMap[`${item.page_slug}_title`] = item.section_title;
        contentMap[`${item.page_slug}_body`] = item.content;
      });
      setDbContent(contentMap);
    }
    loadTechData();
  }, []);

  const getContent = (slug, type, fallback) => dbContent[`${slug}_${type}`] || fallback;

  return (
    <Section 
      label="D-Armada Technologies" 
      title={activeHub} 
      subtitle={
        activeHub === "EA Shop" ? "Production-grade MQL5 Expert Advisors" : 
        activeHub === "EA Performance" ? "Live metrics from funded accounts" : 
        "R&D pipeline and upcoming features"
      }
    >
      {/* ─── THE 3 HUBS NAVIGATION ─── */}
      <div className="flex gap-3 mb-12 border-b border-white/5 pb-6 overflow-x-auto">
        {["EA Performance", "EA Shop", "Technology Lab"].map(hub => (
          <Pill key={hub} active={activeHub === hub} onClick={() => setActiveHub(hub)}>
            {hub}
          </Pill>
        ))}
      </div>

      {/* ─── HUB 1: PERFORMANCE ─── */}
      {activeHub === "EA Performance" && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="text-center bg-[#0F1A1A] border-[#1A302E]"><Stat value="+23.7%" label="YTD Return" color="#34D399" /></Card>
            <Card className="text-center bg-[#0F1A1A] border-[#1A302E]"><Stat value="54.1%" label="Win Rate" /></Card>
            <Card className="text-center bg-[#0F1A1A] border-[#1A302E]"><Stat value="1.83R" label="Avg Winner" /></Card>
            <Card className="text-center bg-[#0F1A1A] border-[#1A302E]"><Stat value="-3.1%" label="Max DD" color="#F87171" /></Card>
            <Card className="text-center bg-[#0F1A1A] border-[#1A302E]"><Stat value="117" label="Total Trades" /></Card>
          </div>
          
          <div className="bg-[#0F1A1A] border border-[#1A302E] rounded-xl p-16 text-center">
            <p className="text-[#436660] text-[10px] font-mono uppercase tracking-[0.3em]">Connecting Live Myfxbook Feed...</p>
          </div>
        </div>
      )}

      {/* ─── HUB 2: EA SHOP ─── */}
      {activeHub === "EA Shop" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#0F1A1A] border-[#1A302E]">
            <Tag>Flagship</Tag>
            <h3 className="text-xl font-bold text-[#E0F0ED] mt-4 mb-2">{getContent('ea-1', 'title', "D-Armada Breakout v3.0")}</h3>
            <p className="text-[#7A9E99] text-sm font-light mb-6 leading-relaxed">{getContent('ea-1', 'body', "Multi-timeframe breakout EA with prop firm compliance.")}</p>
            <div className="text-2xl font-black text-[#20B2AA] mb-6">$297/mo</div>
            <button className="w-full bg-[#20B2AA]/10 text-[#20B2AA] border border-[#20B2AA]/20 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#20B2AA] transition-all">Subscribe</button>
          </Card>

          <Card className="border-[#20B2AA]/40 bg-[#0F1A1A] shadow-[0_0_50px_rgba(32,178,170,0.1)]">
            <Tag>Best Value</Tag>
            <h3 className="text-xl font-bold text-[#E0F0ED] mt-4 mb-2">{getContent('ea-bundle', 'title', "D-Armada Bundle")}</h3>
            <p className="text-[#7A9E99] text-sm font-light mb-6 leading-relaxed">{getContent('ea-bundle', 'body', "Full ecosystem access: all current EAs and private Discord.")}</p>
            <div className="text-2xl font-black text-[#20B2AA] mb-6">$397/mo</div>
            <button className="w-full bg-[#20B2AA] text-[#0A1212] py-3 rounded-lg text-xs font-bold uppercase tracking-widest">Get Full Access</button>
          </Card>
        </div>
      )}

      {/* ─── HUB 3: TECHNOLOGY LAB ─── */}
      {activeHub === "Technology Lab" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { id: 'lab-1', t: "Phase 2: ML Integration", s: "IN PROGRESS", d: "Offline CSV-to-Python pipeline for model training.", col: "#FBBF24" },
            { id: 'lab-2', t: "Correlation EA", s: "RESEARCH", d: "Paired-instrument forex reversal strategy.", col: "#436660" }
          ].map(entry => (
            <Card key={entry.t} className="bg-[#0F1A1A] border-[#1A302E]">
              <Tag color={entry.col}>{entry.s}</Tag>
              <h3 className="text-lg font-bold text-[#E0F0ED] mt-4 mb-2">{getContent(entry.id, 'title', entry.t)}</h3>
              <p className="text-[#7A9E99] text-sm font-light leading-relaxed">{getContent(entry.id, 'body', entry.d)}</p>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}