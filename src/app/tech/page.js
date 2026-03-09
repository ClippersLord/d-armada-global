'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Section, Card, Tag, Pill } from '@/components/ui';

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
      title={tab} 
      subtitle={
        tab === "EA Shop" ? "Production-grade MQL5 Expert Advisors" : 
        tab === "EA Performance" ? "Live metrics from funded accounts" : 
        "R&D pipeline and upcoming features"
      }
    >
      {/* 3-Tab Selector - Matches Demo Verbatim */}
      <div className="flex gap-2 mb-10 flex-wrap">
        {["EA Performance", "EA Shop", "Technology Lab"].map(i => (
          <Pill key={i} active={tab === i} onClick={() => setTab(i)}>{i}</Pill>
        ))}
      </div>

      {tab === "EA Shop" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Flagship EA */}
          <Card>
            <Tag>Flagship</Tag>
            <h3 className="text-lg font-bold text-text-bright mt-4 mb-2">
              {getContent('ea-1', 'title', "D-Armada Breakout v3.0")}
            </h3>
            <p className="text-text-secondary text-sm font-light mb-4 leading-relaxed">
              {getContent('ea-1', 'body', "Multi-timeframe breakout EA with prop firm compliance, adaptive risk, session-aware entries.")}
            </p>
            <div className="text-2xl font-black text-brand mb-6">$297/mo</div>
            <button className="w-full bg-brand/10 text-brand border border-brand/20 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-brand hover:text-surface-bg transition-all">
              Subscribe
            </button>
          </Card>

          {/* Bundle EA - With the specific glow/border from your Demo */}
          <Card className="border-brand/40 shadow-lg shadow-brand/5">
            <Tag>Best Value</Tag>
            <h3 className="text-lg font-bold text-text-bright mt-4 mb-2">
              {getContent('ea-bundle', 'title', "D-Armada Bundle")}
            </h3>
            <p className="text-text-secondary text-sm font-light mb-4 leading-relaxed">
              {getContent('ea-bundle', 'body', "Full ecosystem access: all current EAs, future releases, priority support, private Discord.")}
            </p>
            <div className="text-2xl font-black text-brand mb-6">$397/mo</div>
            <button className="w-full bg-brand text-surface-bg py-3 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-brand/20 hover:brightness-110 transition-all">
              Get Full Access
            </button>
          </Card>
        </div>
      )}

      {tab === "EA Performance" && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="text-center">
            <div className="text-2xl font-black text-profit">+23.7%</div>
            <div className="text-[9px] uppercase tracking-widest text-text-muted mt-1">YTD Return</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-black text-text-bright">54.1%</div>
            <div className="text-[9px] uppercase tracking-widest text-text-muted mt-1">Win Rate</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-black text-text-bright">1.83R</div>
            <div className="text-[9px] uppercase tracking-widest text-text-muted mt-1">Avg Winner</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-black text-loss">-3.1%</div>
            <div className="text-[9px] uppercase tracking-widest text-text-muted mt-1">Max DD</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-black text-text-bright">117</div>
            <div className="text-[9px] uppercase tracking-widest text-text-muted mt-1">Total Trades</div>
          </Card>
        </div>
      )}

      {tab === "Technology Lab" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { t: "Phase 2: ML Integration", s: "IN PROGRESS", d: "Offline CSV-to-Python pipeline. 500+ trade outcomes collected for model training.", col: "#FBBF24" },
            { t: "Correlation EA", s: "RESEARCH", d: "Paired-instrument forex reversal strategy. Shared base currency correlation.", col: "#436660" }
          ].map(entry => (
            <Card key={entry.t}>
              <div className="mb-4">
                <Tag color={entry.col}>{entry.s}</Tag>
              </div>
              <h3 className="text-base font-bold text-text-bright mb-2">{entry.t}</h3>
              <p className="text-text-secondary text-sm font-light leading-relaxed">{entry.d}</p>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}