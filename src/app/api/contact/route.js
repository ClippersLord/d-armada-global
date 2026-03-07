import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase/server';

export async function POST(request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const supabase = createAdminSupabase();

    // Save to database
    const { error } = await supabase.from('contact_submissions').insert({
      name, email, phone: phone || null, subject: subject || '', message,
    });

    if (error) {
      console.error('Contact save error:', error);
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
    }

    // Send email notification (uncomment when Resend is configured)
    /*
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'D-Armada Global <noreply@d-armadaglobal.com>',
      to: process.env.CONTACT_EMAIL,
      subject: `[Contact] ${subject || 'New message'} from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });
    */

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
