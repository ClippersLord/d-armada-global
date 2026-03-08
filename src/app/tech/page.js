'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Section, Card, Tag } from '@/components/ui';
import Link from 'next/link';

export default function TechPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTech = async () => {
      const supabase = createClient();
      // Fetching active EAs and Tools from your Arsenal
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      setProducts(data || []);
      setLoading(false);
    };
    fetchTech();
  }, []);

  return (
    <Section 
      label="D-Armada Technologies" 
      title="Algorithmic Arsenal" 
      subtitle="Precision trading software engineered for Gold, Bitcoin, and WTI breakout operations."
    >
      {/* Sub-navigation for Lab and Performance */}
      <div className="flex gap-4 mb-12 border-b border-border pb-4">
        <Link href="/tech/lab" className="text-[10px] uppercase tracking-widest font-bold text-text-muted hover:text-brand transition-all">
          Research Lab
        </Link>
        <Link href="/tech/performance" className="text-[10px] uppercase tracking-widest font-bold text-text-muted hover:text-brand transition-all">
          Backtest Data
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-brand animate-pulse text-xs uppercase tracking-widest">Scanning Arsenal...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => (
            <Card key={item.id} className="group hover:border-brand/40 transition-all bg-surface-1 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <Tag>{item.category || 'Expert Advisor'}</Tag>
                <span className="text-[10px] text-text-muted font-mono">v{item.version || '1.0'}</span>
              </div>
              
              <h3 className="text-lg font-bold text-text-bright mb-2 group-hover:text-brand transition-colors">
                {item.name}
              </h3>
              
              <p className="text-text-secondary text-sm leading-relaxed font-light mb-6 flex-grow">
                {item.short_description || 'Algorithmic execution system designed for D-Armada Global frameworks.'}
              </p>

              <div className="mt-auto pt-6 border-t border-border/50 flex justify-between items-center">
                <div className="text-brand font-bold">
                  {item.price_cents > 0 ? `$${(item.price_cents / 100).toFixed(0)}` : 'FREE'}
                </div>
                <Link 
                  href={`/tech/${item.slug || item.id}`}
                  className="bg-brand/10 text-brand hover:bg-brand hover:text-surface-bg px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-all"
                >
                  View Specs
                </Link>
              </div>
            </Card>
          ))}

          {products.length === 0 && (
            <div className="col-span-full py-20 text-center bg-surface-bg border border-dashed border-border rounded-xl">
              <p className="text-text-muted text-sm">The arsenal is currently being calibrated. Check back soon.</p>
            </div>
          )}
        </div>
      )}
    </Section>
  );
}