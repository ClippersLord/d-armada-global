import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminSupabase } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createAdminSupabase();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    await supabase.from('orders').insert({
      customer_email: session.customer_details?.email || '',
      customer_name: session.customer_details?.name || '',
      product_id: session.metadata?.product_id,
      stripe_session_id: session.id,
      stripe_payment_intent: session.payment_intent,
      amount_cents: session.amount_total,
      currency: session.currency,
      status: 'completed',
    });

    // TODO: Send confirmation email via Resend
  }

  if (event.type === 'charge.refunded') {
    const charge = event.data.object;
    await supabase
      .from('orders')
      .update({ status: 'refunded' })
      .eq('stripe_payment_intent', charge.payment_intent);
  }

  return NextResponse.json({ received: true });
}
