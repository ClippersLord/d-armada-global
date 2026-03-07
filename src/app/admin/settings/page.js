'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const SETTINGS_FIELDS = [
  { key: 'discord_url', label: 'Discord Invite URL', placeholder: 'https://discord.gg/your-invite' },
  { key: 'telegram_url', label: 'Telegram Channel URL', placeholder: 'https://t.me/your-channel' },
  { key: 'youtube_url', label: 'YouTube Channel URL', placeholder: 'https://youtube.com/@your-channel' },
  { key: 'contact_email', label: 'Contact Email', placeholder: 'contact@d-armadaglobal.com' },
  { key: 'myfxbook_account_id', label: 'Myfxbook Account ID', placeholder: 'Your account ID' },
  { key: 'myfxbook_session', label: 'Myfxbook API Session Token', placeholder: 'Session token from login API' },
  { key: 'site_title', label: 'Site Title', placeholder: 'D-Armada Global' },
  { key: 'site_description', label: 'Site Description', placeholder: 'Your site description...' },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('site_settings').select('*');
      if (data) {
        const obj = {};
        data.forEach(s => { obj[s.key] = s.value; });
        setSettings(obj);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();

    for (const [key, value] of Object.entries(settings)) {
      await supabase
        .from('site_settings')
        .upsert({ key, value: value || '' }, { onConflict: 'key' });
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text-bright">Site Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-gradient-to-br from-brand to-brand-dark text-surface-bg rounded-lg text-xs font-semibold tracking-wider uppercase cursor-pointer disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Settings'}
        </button>
      </div>

      <div className="space-y-6">
        {SETTINGS_FIELDS.map(field => (
          <div key={field.key}>
            <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">
              {field.label}
            </label>
            <input
              value={settings[field.key] || ''}
              onChange={e => setSettings(prev => ({ ...prev, [field.key]: e.target.value }))}
              className="w-full p-3 bg-surface-bg border border-border rounded-lg text-text-secondary text-sm outline-none focus:border-brand/50 transition-colors"
              placeholder={field.placeholder}
            />
          </div>
        ))}
      </div>

      <div className="mt-10 p-5 bg-surface-2 border border-border rounded-xl">
        <h3 className="text-sm font-semibold text-text-bright mb-2">How to get Myfxbook API Session</h3>
        <p className="text-text-secondary text-xs leading-relaxed">
          1. Open your browser and go to:<br />
          <code className="text-brand-light bg-surface-bg px-1.5 py-0.5 rounded text-[11px]">
            https://www.myfxbook.com/api/login.json?email=YOUR_EMAIL&password=YOUR_PASSWORD
          </code><br /><br />
          2. Copy the session token from the JSON response.<br />
          3. Paste it in the &quot;Myfxbook API Session Token&quot; field above.<br />
          4. Your Myfxbook Account ID is visible in your dashboard URL.
        </p>
      </div>
    </div>
  );
}
