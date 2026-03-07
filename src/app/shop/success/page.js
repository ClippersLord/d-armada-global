'use client';

import { Suspense } from 'react'; // Added this
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Section, Card, Button } from '@/components/ui';

// 1. We move your merchant logic and UI into this internal component
function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <Section label="D-Armada Technologies" title="Purchase Successful!" subtitle="">
      <Card className="max-w-lg border-l-2 border-l-profit">
        <div className="text-center">
          <div className="text-5xl mb-4 text-profit">✓</div>
          <h2 className="text-xl font-bold text-text-bright mb-2">Thank You for Your Purchase</h2>
          <p className="text-text-secondary text-sm font-light leading-relaxed mb-6">
            Your order has been confirmed. You will receive a confirmation email with download instructions shortly.
            If you don&apos;t see it within a few minutes, check your spam folder.
          </p>

          {sessionId && (
            <p className="text-text-muted text-[11px] mb-6">
              Order reference: {sessionId.slice(0, 20)}...
            </p>
          )}

          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/shop"><Button primary>Back to Shop</Button></Link>
            <Link href="/contact"><Button>Need Help?</Button></Link>
          </div>
        </div>
      </Card>
    </Section>
  );
}

// 2. The main export now simply "hosts" the content inside a Suspense wrapper
export default function ShopSuccessPage() {
  return (
    <Suspense fallback={
      <Section label="D-Armada Technologies" title="Verifying..." subtitle="">
        <div className="text-center py-20 text-text-muted">Loading purchase details...</div>
      </Section>
    }>
      <SuccessContent />
    </Suspense>
  );
}