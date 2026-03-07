'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Section, Card, Tag } from '@/components/ui';
import PostCard from '@/components/PostCard';

export default function LiveSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const [{ data: posts }, { data: settings }] = await Promise.all([
        supabase.from('posts').select('*')
          .eq('category', 'live-session').eq('is_published', true)
          .order('published_at', { ascending: false }).limit(10),
        supabase.from('site_settings').select('value').eq('key', 'youtube_url').single(),
      ]);
      setSessions(posts || []);
      setYoutubeUrl(settings?.value || '');
    };
    load();
  }, []);

  return (
    <Section label="Community" title="Weekly Live Sessions" subtitle="Every Monday: live macro breakdown and trade planning for the week ahead.">
      {youtubeUrl && (
        <Card className="mb-8 border-l-2 border-l-brand">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-base font-semibold text-text-bright mb-1">D-Armada YouTube Channel</h3>
              <p className="text-text-secondary text-sm font-light">Subscribe for live sessions, strategy breakdowns, and market analysis.</p>
            </div>
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer"
              className="px-5 py-2.5 bg-gradient-to-br from-brand to-brand-dark text-surface-bg rounded-lg text-xs font-semibold tracking-wider uppercase">
              Subscribe →
            </a>
          </div>
        </Card>
      )}

      {sessions.length > 0 ? (
        <div className="space-y-3">
          {sessions.map(s => (
            <PostCard key={s.id} post={s} basePath="/community/live" />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-text-muted text-sm">Live session recordings will appear here once published.</p>
        </Card>
      )}
    </Section>
  );
}
