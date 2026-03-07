'use client';
import { useState } from 'react';
import { Section, Button } from '@/components/ui';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <Section label="Contact" title="Get In Touch" subtitle="Questions about our research, EAs, or partnership opportunities? We'd love to hear from you.">
      {status === 'sent' ? (
        <div className="bg-profit/10 border border-profit/20 rounded-xl p-8 text-center max-w-lg">
          <div className="text-3xl mb-3">✓</div>
          <h3 className="text-lg font-semibold text-text-bright mb-2">Message Sent</h3>
          <p className="text-text-secondary text-sm">We&apos;ll get back to you as soon as possible.</p>
          <button onClick={() => setStatus(null)} className="mt-4 text-brand text-xs cursor-pointer">Send another →</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
          <div>
            <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required
              className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-bright text-sm outline-none focus:border-brand/50" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Email *</label>
            <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required
              className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-bright text-sm outline-none focus:border-brand/50" placeholder="you@email.com" />
          </div>
          <div>
            <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Phone</label>
            <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-bright text-sm outline-none focus:border-brand/50" placeholder="+1 234 567 8900" />
          </div>
          <div>
            <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Subject</label>
            <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
              className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-bright text-sm outline-none focus:border-brand/50" placeholder="What's this about?" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Message *</label>
            <textarea rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required
              className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-bright text-sm outline-none focus:border-brand/50 resize-vertical" placeholder="Your message..." />
          </div>
          {status === 'error' && (
            <div className="md:col-span-2 text-loss text-xs bg-loss/10 border border-loss/20 rounded-lg p-3">
              Something went wrong. Please try again or email us directly.
            </div>
          )}
          <div>
            <Button primary type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      )}
    </Section>
  );
}
