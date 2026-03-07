'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function NewProduct() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', slug: '', description: '', short_description: '',
    price_cents: 29700, currency: 'usd', billing_interval: 'month',
    stripe_price_id: '', stripe_product_id: '',
    features: '', tier: 'standard', download_url: '', vendor_url: '',
    is_active: true, version: '1.0', changelog: '',
  });

  const autoSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev, [field]: value,
      ...(field === 'name' && !prev.slug ? { slug: autoSlug(value) } : {}),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const payload = {
      ...form,
      price_cents: parseInt(form.price_cents) || 0,
      features: form.features ? form.features.split('\n').map(f => f.trim()).filter(Boolean) : [],
    };
    const { error } = await supabase.from('products').insert(payload);
    setSaving(false);
    if (error) { alert('Error: ' + error.message); return; }
    router.push('/admin/products');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text-bright">New Product</h1>
        <button onClick={handleSave} disabled={saving}
          className="px-5 py-2.5 bg-gradient-to-br from-brand to-brand-dark text-surface-bg rounded-lg text-xs font-semibold tracking-wider uppercase cursor-pointer disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Product'}
        </button>
      </div>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Product Name</label>
            <input value={form.name} onChange={e => handleChange('name', e.target.value)}
              className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-bright text-sm outline-none focus:border-brand/50" placeholder="D-Armada Breakout v3.0" />
          </div>
          <div>
            <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">URL Slug</label>
            <input value={form.slug} onChange={e => handleChange('slug', e.target.value)}
              className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Short Description (for cards)</label>
          <textarea value={form.short_description} onChange={e => handleChange('short_description', e.target.value)} rows={2}
            className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50 resize-vertical" />
        </div>
        <div>
          <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Full Description (Markdown)</label>
          <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} rows={12}
            className="w-full p-4 bg-surface-bg border border-border rounded-lg text-text-primary text-sm font-mono outline-none focus:border-brand/50 resize-vertical leading-relaxed" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Price (cents)</label>
            <input type="number" value={form.price_cents} onChange={e => handleChange('price_cents', e.target.value)}
              className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-bright text-sm outline-none focus:border-brand/50" />
            <p className="text-[10px] text-text-muted mt-1">29700 = $297.00</p>
          </div>
          <div>
            <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Billing Interval</label>
            <select value={form.billing_interval} onChange={e => handleChange('billing_interval', e.target.value)}
              className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none cursor-pointer">
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
              <option value="one_time">One-Time</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Tier</label>
            <select value={form.tier} onChange={e => handleChange('tier', e.target.value)}
              className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none cursor-pointer">
              <option value="standard">Standard</option>
              <option value="flagship">Flagship</option>
              <option value="bundle">Bundle</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Stripe Price ID</label>
            <input value={form.stripe_price_id} onChange={e => handleChange('stripe_price_id', e.target.value)}
              className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50" placeholder="price_..." />
          </div>
          <div>
            <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Version</label>
            <input value={form.version} onChange={e => handleChange('version', e.target.value)}
              className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Features (one per line)</label>
          <textarea value={form.features} onChange={e => handleChange('features', e.target.value)} rows={5}
            className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50 resize-vertical"
            placeholder={"3-state market philosophy\nProp firm monitoring\nATR management\nSession-aware"} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Download URL (after purchase)</label>
            <input value={form.download_url} onChange={e => handleChange('download_url', e.target.value)}
              className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50" placeholder="Supabase Storage signed URL or direct link" />
          </div>
          <div>
            <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Vendor URL (external, optional)</label>
            <input value={form.vendor_url} onChange={e => handleChange('vendor_url', e.target.value)}
              className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50" placeholder="https://mql5.com/..." />
          </div>
        </div>
        <div>
          <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Changelog (Markdown)</label>
          <textarea value={form.changelog} onChange={e => handleChange('changelog', e.target.value)} rows={5}
            className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50 resize-vertical"
            placeholder="## v3.0 — March 2026&#10;- Feature 1&#10;- Fix 2" />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.is_active} onChange={e => handleChange('is_active', e.target.checked)}
            className="w-4 h-4 accent-brand cursor-pointer" />
          <span className="text-sm text-text-secondary">Active (visible in shop)</span>
        </label>
      </div>
    </div>
  );
}
