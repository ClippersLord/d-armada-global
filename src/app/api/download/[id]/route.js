import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';

export async function GET(request, { params }) {
  const { id: orderId } = params;

  if (!orderId) {
    return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
  }

  try {
    const supabase = createAdminSupabase();

    // Verify the order exists and is completed
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, products(name, download_url)')
      .eq('id', orderId)
      .eq('status', 'completed')
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found or not completed' }, { status: 404 });
    }

    if (!order.products?.download_url) {
      return NextResponse.json({ error: 'Download not available for this product' }, { status: 404 });
    }

    // Redirect to the download URL (which should be a signed Supabase Storage URL)
    return NextResponse.redirect(order.products.download_url);
  } catch (err) {
    console.error('Download error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
