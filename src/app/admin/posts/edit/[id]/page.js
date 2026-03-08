'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { POST_CATEGORIES } from '@/lib/constants';

export default function EditPost() {
  const { id } = useParams();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('posts').select('*').eq('id', id).single();
      if (data) setForm({ ...data, tags: data.tags?.join(', ') || '' });
    };
    load();
  }, [id]);

  if (!form) return <div className="text-text-muted text-sm py-16 text-center">Loading...</div>;

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async (publish = null) => {
    setSaving(true);
    const supabase = createClient();
    const payload = {
      title: form.title, slug: form.slug, body: form.body, excerpt: form.excerpt,
      category: form.category, subcategory: form.subcategory, video_url: form.video_url,
      is_premium: form.is_premium,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      ...(publish === true ? { is_published: true, published_at: form.published_at || new Date().toISOString() } : {}),
      ...(publish === false ? { is_published: false } : {}),
    };
    const { error } = await supabase.from('posts').update(payload).eq('id', id);
    setSaving(false);
    if (error) { alert('Error: ' + error.message); return; }
    router.push('/admin/posts');
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post permanently?')) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from('posts').delete().eq('id', id);
    router.push('/admin/posts');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-text-bright">Edit Post</h1>
        <div className="flex gap-2">
          <button onClick={handleDelete} disabled={deleting}
            className="px-4 py-2.5 border border-loss/30 text-loss rounded-lg text-xs font-semibold tracking-wider uppercase cursor-pointer hover:bg-loss/10 disabled:opacity-50">
            Delete
          </button>
          {form.is_published ? (
            <button onClick={() => handleSave(false)} disabled={saving}
              className="px-4 py-2.5 border border-caution/30 text-caution rounded-lg text-xs font-semibold tracking-wider uppercase cursor-pointer disabled:opacity-50">
              Unpublish
            </button>
          ) : (
            <button onClick={() => handleSave(true)} disabled={saving}
              className="px-4 py-2.5 bg-gradient-to-br from-profit to-profit/80 text-surface-bg rounded-lg text-xs font-semibold tracking-wider uppercase cursor-pointer disabled:opacity-50">
              Publish
            </button>
          )}
          <button onClick={() => handleSave()} disabled={saving}
            className="px-5 py-2.5 bg-gradient-to-br from-brand to-brand-dark text-surface-bg rounded-lg text-xs font-semibold tracking-wider uppercase cursor-pointer disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Title</label>
          <input value={form.title} onChange={e => handleChange('title', e.target.value)}
            className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-bright text-lg font-semibold outline-none focus:border-brand/50" />
        </div>
        <div>
          <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Slug</label>
          <input value={form.slug} onChange={e => handleChange('slug', e.target.value)}
            className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Category</label>
            <select value={form.category} onChange={e => handleChange('category', e.target.value)}
              className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none cursor-pointer">
              {POST_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Subcategory</label>
            <input value={form.subcategory || ''} onChange={e => handleChange('subcategory', e.target.value)}
              className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50" placeholder="e.g. Macro, Primary..." />
          </div>
        </div>
        <div>
          <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Excerpt</label>
          <textarea value={form.excerpt || ''} onChange={e => handleChange('excerpt', e.target.value)} rows={2}
            className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50 resize-vertical" />
        </div>
        <div>
          <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Content (Markdown)</label>
          <textarea value={form.body || ''} onChange={e => handleChange('body', e.target.value)} rows={20}
            className="w-full p-4 bg-surface-bg border border-border rounded-lg text-text-primary text-sm font-mono outline-none focus:border-brand/50 resize-vertical leading-relaxed" />
        </div>
        <div>
          <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Video URL</label>
          <input value={form.video_url || ''} onChange={e => handleChange('video_url', e.target.value)}
            className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50" placeholder="https://youtube.com/watch?v=..." />
        </div>
        <div>
          <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Tags (comma separated)</label>
          <input value={form.tags || ''} onChange={e => handleChange('tags', e.target.value)}
            className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50" />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.is_premium || false} onChange={e => handleChange('is_premium', e.target.checked)}
            className="w-4 h-4 accent-brand cursor-pointer" />
          <span className="text-sm text-text-secondary">Premium Content</span>
        </label>
      </div>
    </div>
  );
}
