'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-bg px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="text-brand font-bold text-xl tracking-wider mb-1">D-ARMADA</div>
          <div className="text-text-muted text-[10px] tracking-[6px] uppercase">Admin Access</div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 bg-surface-1 border border-border rounded-lg text-text-bright text-sm outline-none focus:border-brand/50 transition-colors"
              placeholder="admin@d-armadaglobal.com"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] text-text-muted tracking-widest uppercase mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 bg-surface-1 border border-border rounded-lg text-text-bright text-sm outline-none focus:border-brand/50 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="text-loss text-xs bg-loss/10 border border-loss/20 rounded-lg p-3">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-br from-brand to-brand-dark text-surface-bg rounded-lg text-xs font-semibold tracking-widest uppercase cursor-pointer disabled:opacity-50 transition-all"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
