import { NextResponse } from 'next/server';
import { getMyfxbookSession, getMyfxbookData } from '@/lib/myfxbook';
import { createAdminSupabase } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createAdminSupabase();
    const { data: settings } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['myfxbook_account_id', 'myfxbook_session']);

    const settingsMap = {};
    settings?.forEach(s => { settingsMap[s.key] = s.value; });

    let session = settingsMap.myfxbook_session;
    const accountId = settingsMap.myfxbook_account_id;

    if (!accountId) {
      return NextResponse.json({ error: 'Myfxbook account not configured' }, { status: 400 });
    }

    if (!session) {
      session = await getMyfxbookSession();
      if (!session) {
        return NextResponse.json({ error: 'Could not authenticate with Myfxbook' }, { status: 401 });
      }
    }

    const data = await getMyfxbookData(session, accountId);
    if (!data) {
      return NextResponse.json({ error: 'Failed to fetch Myfxbook data' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Myfxbook route error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
