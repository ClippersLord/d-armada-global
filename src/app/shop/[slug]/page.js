'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ReactMarkdown from 'react-markdown';
import { Tag, Button } from '@/components/ui';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      setProduct(data);
      setLoading(false);
    };
    load();
  }, [slug]);

  const handleBuy = async () => {
    if (!product?.stripe_price_id) {
      // Fallback to vendor URL if no Stripe configured
      if (product?.vendor_url) {
        window.open(product.vendor_url, '_blank');
        return;
      }
      alert('Checkout is not yet configured for this product.');
      return;
    }

    setBuying(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (err) {
      alert('Checkout error: ' + err.message);
      setBuying(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-text-muted">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-bright mb-2">Product Not Found</h1>
          <p className="text-text-secondary">This product doesn&apos;t exist or is no longer available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 pt-24 pb-16">
      <div className="grid md:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="md:col-span-2">
          <div className="flex gap-2 mb-3">
            <Tag>{product.tier}</Tag>
            {product.version && <Tag color="muted">v{product.version}</Tag>}
          </div>
          <h1 className="text-3xl font-extrabold text-text-bright mb-3">{product.name}</h1>
          <p className="text-text-secondary text-base font-light leading-relaxed mb-8">
            {product.short_description}
          </p>

          {product.description && (
            <div className="prose-darmada">
              <ReactMarkdown>{product.description}</ReactMarkdown>
            </div>
          )}

          {product.changelog && (
            <div className="mt-10 pt-8 border-t border-border">
              <h3 className="text-lg font-semibold text-text-bright mb-4">Changelog</h3>
              <div className="prose-darmada text-sm">
                <ReactMarkdown>{product.changelog}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar — Purchase Card */}
        <div className="md:col-span-1">
          <div className="sticky top-24 bg-surface-1 border border-border rounded-xl p-6">
            <div className="font-sora text-3xl font-extrabold text-brand mb-1">
              ${(product.price_cents / 100).toFixed(0)}
            </div>
            <div className="text-text-muted text-xs mb-6">
              {product.billing_interval === 'one_time' ? 'One-time purchase' : `per ${product.billing_interval}`}
            </div>

            {product.features?.map((f, i) => (
              <div key={i} className="flex items-center gap-2.5 mb-3">
                <span className="text-brand text-xs">✓</span>
                <span className="text-text-secondary text-sm">{f}</span>
              </div>
            ))}

            <div className="mt-6 space-y-3">
              <Button primary full onClick={handleBuy} disabled={buying}>
                {buying ? 'Redirecting...' : 'Buy Now'}
              </Button>

              {product.vendor_url && (
                <a href={product.vendor_url} target="_blank" rel="noopener noreferrer" className="block">
                  <Button full>View on MQL5 Market →</Button>
                </a>
              )}
            </div>

            <p className="text-[10px] text-text-muted mt-4 leading-relaxed">
              Secure checkout powered by Stripe. Your payment information never touches our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
