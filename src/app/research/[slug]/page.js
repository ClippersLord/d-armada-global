import { createServerSupabase } from '@/lib/supabase/server';
import PostDisplay from '@/components/PostDisplay';
import { Section, Card, Button } from '@/components/ui';
import Link from 'next/link';

// Helper to convert standard YouTube links into Embed links
const getEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

export default async function ResearchPost({ params }) {
  const supabase = createServerSupabase();
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('category', 'research')
    .eq('is_published', true)
    .single();

  // 1. If the URL is wrong or post is offline
  if (!post) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 pt-32 pb-48 text-center text-text-secondary font-sora">
        Module or Research Brief not found.
      </div>
    );
  }

  // 2. If the post has a YouTube Video, show the Video Vault Layout
  if (post.video_url) {
    return (
      <Section label="D-Armada Curriculum" title={post.title} className="pb-48">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* MAIN VIDEO PLAYER */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden border border-border/40 shadow-2xl">
              <iframe 
                className="w-full h-full"
                src={getEmbedUrl(post.video_url)} 
                title={post.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <Card>
              <h4 className="text-brand text-[10px] font-bold uppercase tracking-[3px] mb-4 font-sora">Lesson Overview</h4>
              {/* Renders your rich text content from the database */}
              <div 
                className="text-text-secondary text-sm font-light leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
            </Card>
          </div>

          {/* SIDEBAR: Mentorship & Assets */}
          <div className="space-y-6">
            <Card className="bg-surface-2 border-brand/20">
              <h4 className="text-text-bright text-xs font-bold uppercase mb-4 font-sora">Downloadable Assets</h4>
              <div className="space-y-3">
                <div className="p-3 bg-surface-1 border border-border rounded flex justify-between items-center cursor-pointer hover:border-brand/50 transition-all">
                  <span className="text-[11px] text-text-secondary">Strategy Cheat Sheet (PDF)</span>
                  <span className="text-brand">↓</span>
                </div>
                <div className="p-3 bg-surface-1 border border-border rounded flex justify-between items-center cursor-pointer hover:border-brand/50 transition-all">
                  <span className="text-[11px] text-text-secondary">EA Optimization Set Files</span>
                  <span className="text-brand">↓</span>
                </div>
              </div>
            </Card>

            <Card className="border-brand/40 bg-brand/5">
              <h4 className="text-brand text-[10px] font-bold uppercase tracking-widest mb-2">Need Guidance?</h4>
              <p className="text-text-secondary text-[11px] mb-6 font-light">Skip the trial and error. Apply for the D-Armada 1-on-1 Mentorship program.</p>
              <Link href="/contact"><Button primary full>Apply for Mentorship</Button></Link>
            </Card>
          </div>
        </div>
      </Section>
    );
  }

  // 3. Fallback: If there is NO video attached, show the standard written post layout
  return <PostDisplay post={post} />;
}