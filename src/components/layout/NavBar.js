'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';

export default function NavBar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-bg/90 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="D-Armada Global" className="h-9" style={{filter:'brightness(1.4) drop-shadow(0 0 8px rgba(32,178,170,0.12))'}} />
        </Link>

        <div className="flex items-center gap-0.5 overflow-x-auto">
          {NAV_ITEMS.map(item => (
            <div
              key={item.key}
              className="relative"
              onMouseEnter={() => item.sub && setOpenDropdown(item.key)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className={`px-2.5 py-1.5 text-[11px] tracking-wide whitespace-nowrap transition-colors ${
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'text-brand font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {item.label}{item.sub ? ' ▾' : ''}
              </Link>

              {item.sub && openDropdown === item.key && (
                <div className="absolute top-full left-0 bg-surface-1 border border-border rounded-lg p-1.5 min-w-[180px] shadow-2xl z-50">
                  {item.sub.map(s => (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={() => setOpenDropdown(null)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-xs transition-all ${
                        pathname === s.href
                          ? 'text-brand bg-brand/10'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                      }`}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
