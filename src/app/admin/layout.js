'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/posts', label: 'Posts & Content', icon: '📝' },
  { href: '/admin/products', label: 'EA Products', icon: '🤖' },
  { href: '/admin/orders', label: 'Orders', icon: '💳' },
  { href: '/admin/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { href: '/admin/contacts', label: 'Contact Messages', icon: '✉️' },
  { href: '/admin/settings', label: 'Site Settings', icon: '⚙️' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="flex min-h-screen bg-surface-bg">
      {/* Sidebar */}
      <aside className="w-56 bg-surface-1 border-r border-border flex flex-col shrink-0">
        <div className="p-5 border-b border-border">
          <Link href="/" className="text-brand font-bold text-sm tracking-wider">D-ARMADA</Link>
          <div className="text-[9px] text-text-muted tracking-widest mt-0.5">ADMIN PANEL</div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {ADMIN_NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs transition-all ${
                pathname === item.href
                  ? 'bg-brand/10 text-brand font-semibold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <Link href="/" className="block px-3 py-2 text-xs text-text-muted hover:text-text-primary transition-colors mb-1">
            ← View Site
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-3 py-2 text-xs text-loss hover:text-loss/80 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
