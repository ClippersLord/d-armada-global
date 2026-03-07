import { Section, Card } from '@/components/ui';

export const metadata = { title: 'About — D-Armada Global' };

export default function AboutPage() {
  const pillars = [
    ['Our Mission', 'To bridge the gap between institutional-grade analysis and independent traders. We believe algorithmic discipline, macro awareness, and continuous education are the pillars of sustainable trading performance.'],
    ['Our Approach', 'D-Armada operates on a three-state market philosophy: compression→breakout→expansion, breakout→failure→reversal, and range-bound chop. Every system, every analysis, every course is built on this foundation.'],
    ['Our Edge', "We don't sell signals. We build systems, publish research with conviction, and teach traders to think — not follow. Every EA in our suite runs on live funded accounts before it reaches the shop."],
  ];

  return (
    <Section label="About" title="Diversified Armada Global" subtitle="A vertically integrated trading operation — from macro research through algorithmic execution to trader education.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {pillars.map(([t, d]) => (
          <Card key={t}>
            <h3 className="text-base font-bold text-text-bright mb-2">{t}</h3>
            <p className="text-text-secondary text-sm leading-relaxed font-light">{d}</p>
          </Card>
        ))}
      </div>
      <Card className="border-l-2 border-l-brand">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center text-2xl shrink-0">⚓</div>
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-base font-bold text-text-bright mb-1">Founded by a Trader, for Traders</h3>
            <p className="text-text-secondary text-sm leading-relaxed font-light">D-Armada Global was built from the ground up by an active algorithmic trader who got tired of the gap between institutional tools and what&apos;s available to independents. Every product we ship, we use ourselves.</p>
          </div>
        </div>
      </Card>
    </Section>
  );
}
