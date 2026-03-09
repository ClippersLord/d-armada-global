'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Section, Card, Tag, Btn } from '@/components/ui';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShop() {
      const supabase = createClient();
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('price_cents', { ascending: true });
      setProducts(data || []);
      setLoading(false);
    }
    loadShop();
  }, []);

  return (
    <Section 
      label="D-Armada Shop" 
      title="The Algorithmic Collection" 
      subtitle="Select the tier that fits your capital and risk requirements. All systems are prop-firm compliant."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p) => (
          <Card key={p.id} glow={p.tier === 'bundle'}>
            <div className="flex justify-between items-start mb-4">
              <Tag color={p.tier === 'flagship' ? "#20B2AA" : "#436660"}>{p.tier}</Tag>
              <span className="text-[10px] text-text-muted font-mono">v{p.version}</span>
            </div>
            <h3 className="text-xl font-bold text-text-bright mb-2">{p.name}</h3>
            <p className="text-text-secondary text-sm font-light mb-6 h-12 line-clamp-2">{p.short_description}</p>
            
            <div className="text-3xl font-black text-brand mb-6">
              ${(p.price_cents / 100).toFixed(0)}<span className="text-xs text-text-muted font-normal"> /mo</span>
            </div>

            <ul className="space-y-3 mb-8">
              {p.features?.map((f, i) => (
                <li key={i} className="text-xs text-text-secondary flex gap-2">
                  <span className="text-brand">✓</span> {f}
                </li>
              ))}
            </ul>

            <Btn primary={p.tier === 'bundle'} full>Purchase License</Btn>
          </Card>
        ))}
      </div>
    </Section>
  );
}