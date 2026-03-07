'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Section, Card } from '@/components/ui';

export default function CommunityPage() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('site_settings').select('key, value')
        .in('key', ['discord_url', 'telegram_url', 'youtube_url']);
      const obj = {};
      data?.forEach(s => { obj[s.key] = s.value; });
      setSettings(obj);
    };
    load();
  }, []);

  const links = [
    {
      icon: '💬', title: 'Private Discord',
      desc: 'Real-time discussion with D-Armada members. Trade setups, macro debate, system development Q&A.',
      url: settings.discord_url, action: 'Join Discord →',
    },
    {
      icon: '📱', title: 'Telegram Channel',
      desc: 'Quick alerts, market commentary, and community updates delivered straight to your phone.',
      url: settings.telegram_url, action: 'Join Telegram →',
    },
    {
      icon: '🎥', title: 'Weekly Live Sessions',
      desc: 'Every Monday: live macro breakdown and trade planning for the week ahead. Q&A with the team.',
      url: settings.youtube_url, action: 'Watch on YouTube →', internal: '/community/live',
    },
    {
      icon: '🏆', title: 'Leaderboard',
      desc: 'Monthly performance tracking for community members running D-Armada systems on funded accounts.',
      internal: '/community/leaderboard', action: 'View Leaderboard →',
    },
  ];

  return (
    <Section label="Community" title="Join the D-Armada Fleet" subtitle="Connect with systematic traders, share ideas, and grow together.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map(l => {
          const Wrapper = l.internal
            ? ({ children, ...rest }) => <Link href={l.internal} {...rest}>{children}</Link>
            : l.url
              ? ({ children, ...rest }) => <a href={l.url} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a>
              : ({ children, ...rest }) => <div {...rest}>{children}</div>;

          return (
            <Wrapper key={l.title}>
              <Card className="h-full">
                <div className="text-3xl mb-3">{l.icon}</div>
                <h3 className="text-base font-bold text-text-bright mb-2">{l.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed font-light mb-4">{l.desc}</p>
                <span className="text-brand text-xs font-medium">
                  {l.url || l.internal ? l.action : 'Coming soon'}
                </span>
              </Card>
            </Wrapper>
          );
        })}
      </div>
    </Section>
  );
}
