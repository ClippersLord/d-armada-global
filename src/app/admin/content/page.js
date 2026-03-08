'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminContent() {
  const [contentItems, setContentItems] = useState([]);
  const [settings, setSettings] = useState([]); // New state for settings
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const supabase = createClient();
    
    // Load Page Content
    const { data: contentData } = await supabase.from('page_content').select('*').order('page_slug');
    setContentItems(contentData || []);

    // Load Site Settings (Myfxbook ID, etc)
    const { data: settingsData } = await supabase.from('site_settings').select('*').order('key');
    setSettings(settingsData || []);

    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (table) => {
    const supabase = createClient();
    const { error } = await supabase
      .from(table)
      .update({ 
        ...(table === 'page_content' 
          ? { section_title: editing.section_title, content: editing.content } 
          : { value: editing.value })
      })
      .eq('id', editing.id);

    if (error) alert(error.message);
    else {
      setEditing(null);
      load();
    }
  };

  if (loading) return <div className="p-20 text-center text-xs uppercase tracking-widest text-text-muted animate-pulse">Synchronizing Systems...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 pt-24 pb-40">
      <h1 className="text-2xl font-bold text-text-bright mb-2 uppercase tracking-widest">Command Center</h1>
      <p className="text-text-muted text-sm mb-10">Manage site architecture, trading frameworks, and API credentials.</p>

      {/* SYSTEM SETTINGS SECTION */}
      <div className="mb-12">
        <h2 className="text-xs uppercase tracking-[0.3em] text-brand font-bold mb-4">System Credentials</h2>
        <div className="space-y-3">
          {settings.map(s => (
            <div key={s.id} className="bg-surface-2 border border-border/50 rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-text-muted uppercase font-mono">{s.key}</p>
                {editing?.id === s.id ? (
                  <input 
                    value={editing.value} 
                    onChange={e => setEditing({...editing, value: e.target.value})}
                    className="bg-transparent border-b border-brand text-text-bright outline-none text-sm mt-1"
                  />
                ) : (
                  <p className="text-sm text-text-secondary font-medium">{s.value || 'Not Set'}</p>
                )}
              </div>
              <div className="flex gap-2">
                {editing?.id === s.id ? (
                  <button onClick={() => handleSave('site_settings')} className="text-profit text-[10px] font-bold uppercase">Save</button>
                ) : (
                  <button onClick={() => setEditing(s)} className="text-brand text-[10px] font-bold uppercase">Update</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAGE CONTENT SECTION */}
      <h2 className="text-xs uppercase tracking-[0.3em] text-brand font-bold mb-4">Page Frameworks</h2>
      <div className="space-y-4">
        {contentItems.map(item => (
          <div key={item.id} className="bg-surface-1 border border-border rounded-xl p-6">
            {editing?.id === item.id ? (
              <div className="space-y-4">
                <input 
                  value={editing.section_title} 
                  onChange={e => setEditing({...editing, section_title: e.target.value})}
                  className="w-full bg-surface-bg border border-border p-3 rounded text-text-bright outline-none"
                />
                <textarea 
                  value={editing.content} 
                  rows={6}
                  onChange={e => setEditing({...editing, content: e.target.value})}
                  className="w-full bg-surface-bg border border-border p-3 rounded text-text-secondary text-sm outline-none"
                />
                <button onClick={() => handleSave('page_content')} className="bg-brand text-surface-bg px-4 py-2 rounded text-xs font-bold uppercase">Apply Changes</button>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-text-bright font-bold">{item.section_title}</h3>
                  <p className="text-text-secondary text-sm mt-2">{item.content}</p>
                </div>
                <button onClick={() => setEditing(item)} className="ml-4 text-brand text-xs font-bold uppercase">Edit</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}