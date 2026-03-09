'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Section, Card, Tag, Pill, Stat, Btn } from '@/components/ui';

export default function TechPage() {
  const [tab, setTab] = useState("EA Shop");
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
      title={getContent('tech-main', 'title', tab)} 
      subtitle={tab === "EA Shop" ? "Production-grade MQL5 Expert Advisors" : tab === "EA Performance" ? "Live metrics from funded accounts" : "R&D pipeline and upcoming features"}
    >
      {/* The 3-Tab System from your Demo */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {["EA Performance", "EA Shop", "Technology Lab"].map(i => (
          <Pill key={i} active={tab === i} onClick={() => setTab(i)}>{i}</Pill>
        ))}
      </div>

      {tab === "EA Shop" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* EA Card 1 */}
          <Card>
            <Tag>Flagship</Tag>
            <h3 className="text-lg font-bold text-text-bright mt-4 mb-2">{getContent('ea-1', 'title', "D-Armada Breakout v3.0")}</h3>
            <p className="text-text-secondary text-sm font-light mb-4">{getContent('ea-1', 'body', "Multi-timeframe breakout EA with prop firm compliance, adaptive risk, session-aware entries.")}</p>
            <div className="text-2xl font-black text-brand mb-6">$297/mo</div>
            <Btn primary full>Subscribe</Btn>
          </Card>

          {/* Bundle Card with the "Glow" from your Demo */}
          <Card style={{ border: '1px solid #20B2AA55', boxShadow: '0 0 40px #20B2AA0C' }}>
            <Tag>Best Value</Tag>
            <h3 className="text-lg font-bold text-text-bright mt-4 mb-2">{getContent('ea-bundle', 'title', "D-Armada Bundle")}</h3>
            <p className="text-text-secondary text-sm font-light mb-4">{getContent('ea-bundle', 'body', "Full ecosystem access: all current EAs, future releases, priority support, private Discord.")}</p>
            <div className="text-2xl font-black text-brand mb-6">$397/mo</div>
            <Btn primary full>Get Full Access</Btn>
          </Card>
        </div>
      )}

      {tab === "EA Performance" && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card><Stat value="+23.7%" label="YTD Return" color="#34D399" /></Card>
          <Card><Stat value="54.1%" label="Win Rate" /></Card>
          <Card><Stat value="1.83R" label="Avg Winner" /></Card>
          <Card><Stat value="-3.1%" label="Max DD" color="#F87171" /></Card>
          <Card><Stat value="117" label="Total Trades" /></Card>
        </div>
      )}

      {tab === "Technology Lab" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { t: "Phase 2: ML Integration", s: "IN PROGRESS", d: "Offline CSV-to-Python pipeline. 500+ trade outcomes collected for model training.", col: "#FBBF24" },
            { t: "Performance Dashboard", s: "PLANNED", d: "Real-time web dashboard with D-Armada visual identity.", col: "#436660" }
          ].map(entry => (
            <Card key={entry.t}>
              <Tag color={entry.col}>{entry.s}</Tag>
              <h3 className="text-base font-bold text-text-bright mt-4 mb-2">{entry.t}</h3>
              <p className="text-text-secondary text-sm font-light">{entry.d}</p>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}