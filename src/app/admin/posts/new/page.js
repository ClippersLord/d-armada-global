'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { POST_CATEGORIES } from '@/lib/constants';

export default function NewPost() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    body: '',
    excerpt: '',
    category: 'blog',
    subcategory: '',
    video_url: '',
    is_premium: false,
    is_published: false,
    tags: '',
  });

  const autoSlug = (title) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'title' && !prev.slug ? { slug: autoSlug(value) } : {}),
    }));
  };

  const handleSave = async (publish = false) => {
    setSaving(true);
    const supabase = createClient();
    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
      is_published: publish || form.is_published,
      published_at: publish ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase.from('posts').insert(payload).select().single();
    setSaving(false);

    if (error) {
      alert('Error saving: ' + error.message);
      return;
    }
    router.push('/admin/posts');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text-bright">New Post</h1>
        <div className="flex gap-3">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-5 py-2.5 border border-border text-text-secondary rounded-lg text-xs font-semibold tracking-wider uppercase hover:border-brand/40 transition-all cursor-pointer disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-5 py-2.5 bg-gradient-to-br from-brand to-brand-dark text-surface-bg rounded-lg text-xs font-semibold tracking-wider uppercase cursor-pointer disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Title</label>
          <input
            value={form.title}
            onChange={e => handleChange('title', e.target.value)}
            className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-bright text-lg font-semibold outline-none focus:border-brand/50 transition-colors"
            placeholder="Post title..."
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">URL Slug</label>
          <div className="flex items-center gap-2">
            <span className="text-text-muted text-xs">/</span>
            <input
              value={form.slug}
              onChange={e => handleChange('slug', e.target.value)}
              className="flex-1 p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50 transition-colors"
              placeholder="url-friendly-slug"
            />
          </div>
        </div>

        {/* Category + Subcategory */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Category</label>
            <select
              value={form.category}
              onChange={e => handleChange('category', e.target.value)}
              className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50 cursor-pointer"
            >
              {POST_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Subcategory</label>
            <input
              value={form.subcategory}
              onChange={e => handleChange('subcategory', e.target.value)}
              className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50 transition-colors"
              placeholder="e.g. Macro, Primary, Beginner..."
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Excerpt (short description for cards)</label>
          <textarea
            value={form.excerpt}
            onChange={e => handleChange('excerpt', e.target.value)}
            rows={2}
            className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50 transition-colors resize-vertical"
            placeholder="Brief description shown on listing pages..."
          />
        </div>

        {/* Body (Markdown Editor) */}
        <div>
          <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">
            Content (Markdown supported — **bold**, *italic*, ## headings, [links](url), etc.)
          </label>
          <textarea
            value={form.body}
            onChange={e => handleChange('body', e.target.value)}
            rows={20}
            className="w-full p-4 bg-surface-bg border border-border rounded-lg text-text-primary text-sm font-mono outline-none focus:border-brand/50 transition-colors resize-vertical leading-relaxed"
            placeholder="Write your content here using Markdown...

## Section Heading

Your analysis, strategy details, or article text goes here.

**Bold text** for emphasis, *italic* for nuance.

- Bullet points work too
- Just use dashes

> Blockquotes for key insights

[Link text](https://example.com) for references."
          />
          <p className="text-[10px] text-text-muted mt-1">
            Tip: Use ## for headings, **text** for bold, - for bullet lists, {'>'} for blockquotes
          </p>
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Video Embed URL (optional)</label>
          <input
            value={form.video_url}
            onChange={e => handleChange('video_url', e.target.value)}
            className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50 transition-colors"
            placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
          />
          <p className="text-[10px] text-text-muted mt-1">
            Paste a YouTube or Vimeo URL. It will be embedded above the text content.
          </p>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Tags (comma separated)</label>
          <input
            value={form.tags}
            onChange={e => handleChange('tags', e.target.value)}
            className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50 transition-colors"
            placeholder="gold, macro, fed, breakout..."
          />
        </div>

        {/* Toggles */}
        <div className="flex gap-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_premium}
              onChange={e => handleChange('is_premium', e.target.checked)}
              className="w-4 h-4 accent-brand cursor-pointer"
            />
            <span className="text-sm text-text-secondary">Premium Content (paywall)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
