'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminContacts() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
      setMessages(data || []);
    };
    load();
  }, []);

  const markRead = async (id) => {
    const supabase = createClient();
    await supabase.from('contact_submissions').update({ is_read: true }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-bright mb-8">Contact Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Message List */}
        <div className="md:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
          {messages.map(m => (
            <button key={m.id} onClick={() => { setSelected(m); markRead(m.id); }}
              className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                selected?.id === m.id ? 'bg-brand/10 border-brand/30' :
                m.is_read ? 'bg-surface-1 border-border hover:bg-surface-2' :
                'bg-surface-2 border-brand/20 hover:bg-brand/5'
              }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-text-bright font-medium">{m.name}</span>
                {!m.is_read && <span className="w-2 h-2 rounded-full bg-brand shrink-0" />}
              </div>
              <div className="text-xs text-text-muted truncate">{m.subject || 'No subject'}</div>
              <div className="text-[10px] text-text-muted mt-1">{new Date(m.created_at).toLocaleDateString()}</div>
            </button>
          ))}
          {messages.length === 0 && <p className="text-text-muted text-sm text-center py-8">No messages yet.</p>}
        </div>

        {/* Message Detail */}
        <div className="md:col-span-2">
          {selected ? (
            <div className="bg-surface-1 border border-border rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-text-bright">{selected.subject || 'No subject'}</h2>
                  <div className="text-sm text-text-secondary mt-1">
                    From: <span className="text-text-bright">{selected.name}</span> &lt;{selected.email}&gt;
                  </div>
                  {selected.phone && <div className="text-sm text-text-secondary">Phone: {selected.phone}</div>}
                  <div className="text-[11px] text-text-muted mt-1">
                    {new Date(selected.created_at).toLocaleString()}
                  </div>
                </div>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your message'}`}
                  className="px-4 py-2 bg-brand text-surface-bg rounded-lg text-xs font-semibold uppercase shrink-0">
                  Reply
                </a>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
          ) : (
            <div className="bg-surface-1 border border-border rounded-xl p-12 text-center">
              <p className="text-text-muted text-sm">Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
