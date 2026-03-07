'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) setForm({ ...data, features: data.features?.join('\n') || '' });
    };
    load();
  }, [id]);

  if (!form) return <div className="text-text-muted text-sm py-16 text-center">Loading...</div>;

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const payload = {
      name: form.name, slug: form.slug, description: form.description,
      short_description: form.short_description, price_cents: parseInt(form.price_cents) || 0,
      billing_interval: form.billing_interval, stripe_price_id: form.stripe_price_id,
      stripe_product_id: form.stripe_product_id,
      features: form.features ? form.features.split('\n').map(f => f.trim()).filter(Boolean) : [],
      tier: form.tier, download_url: form.download_url, vendor_url: form.vendor_url,
      is_active: form.is_active, version: form.version, changelog: form.changelog,
    };
    const { error } = await supabase.from('products').update(payload).eq('id', id);
    setSaving(false);
    if (error) { alert('Error: ' + error.message); return; }
    router.push('/admin/products');
  };

  const handleDelete = async () => {
    if (!confirm('Delete this product permanently?')) return;
    const supabase = createClient();
    await supabase.from('products').delete().eq('id', id);
    router.push('/admin/products');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-text-bright">Edit Product</h1>
        <div className="flex gap-2">
          <button onClick={handleDelete} className="px-4 py-2.5 border border-loss/30 text-loss rounded-lg text-xs font-semibold tracking-wider uppercase cursor-pointer hover:bg-loss/10">Delete</button>
          <button onClick={handleSave} disabled={saving}
            className="px-5 py-2.5 bg-gradient-to-br from-brand to-brand-dark text-surface-bg rounded-lg text-xs font-semibold tracking-wider uppercase cursor-pointer disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Name</label><input value={form.name} onChange={e => handleChange('name', e.target.value)} className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-bright text-sm outline-none focus:border-brand/50" /></div>
          <div><label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Slug</label><input value={form.slug} onChange={e => handleChange('slug', e.target.value)} className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50" /></div>
        </div>
        <div><label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Short Description</label><textarea value={form.short_description || ''} onChange={e => handleChange('short_description', e.target.value)} rows={2} className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50 resize-vertical" /></div>
        <div><label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Full Description (Markdown)</label><textarea value={form.description || ''} onChange={e => handleChange('description', e.target.value)} rows={12} className="w-full p-4 bg-surface-bg border border-border rounded-lg text-text-primary text-sm font-mono outline-none focus:border-brand/50 resize-vertical leading-relaxed" /></div>
        <div className="grid grid-cols-3 gap-4">
          <div><label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Price (cents)</label><input type="number" value={form.price_cents} onChange={e => handleChange('price_cents', e.target.value)} className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-bright text-sm outline-none focus:border-brand/50" /></div>
          <div><label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Billing</label><select value={form.billing_interval} onChange={e => handleChange('billing_interval', e.target.value)} className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none cursor-pointer"><option value="month">Monthly</option><option value="year">Yearly</option><option value="one_time">One-Time</option></select></div>
          <div><label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Tier</label><select value={form.tier} onChange={e => handleChange('tier', e.target.value)} className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none cursor-pointer"><option value="standard">Standard</option><option value="flagship">Flagship</option><option value="bundle">Bundle</option></select></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Stripe Price ID</label><input value={form.stripe_price_id || ''} onChange={e => handleChange('stripe_price_id', e.target.value)} className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50" placeholder="price_..." /></div>
          <div><label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Version</label><input value={form.version || ''} onChange={e => handleChange('version', e.target.value)} className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50" /></div>
        </div>
        <div><label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Features (one per line)</label><textarea value={form.features || ''} onChange={e => handleChange('features', e.target.value)} rows={5} className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50 resize-vertical" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Download URL</label><input value={form.download_url || ''} onChange={e => handleChange('download_url', e.target.value)} className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50" /></div>
          <div><label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Vendor URL</label><input value={form.vendor_url || ''} onChange={e => handleChange('vendor_url', e.target.value)} className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50" /></div>
        </div>
        <div><label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Changelog</label><textarea value={form.changelog || ''} onChange={e => handleChange('changelog', e.target.value)} rows={5} className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50 resize-vertical" /></div>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={e => handleChange('is_active', e.target.checked)} className="w-4 h-4 accent-brand cursor-pointer" /><span className="text-sm text-text-secondary">Active in shop</span></label>
      </div>
    </div>
  );
}
