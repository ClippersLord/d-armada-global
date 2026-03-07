const MYFXBOOK_API = 'https://www.myfxbook.com/api';

let cachedData = null;
let cacheTime = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export async function getMyfxbookSession() {
  const email = process.env.MYFXBOOK_EMAIL;
  const password = process.env.MYFXBOOK_PASSWORD;
  if (!email || !password) return null;

  const res = await fetch(`${MYFXBOOK_API}/login.json?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
  const data = await res.json();
  if (!data.error && data.session) return data.session;
  return null;
}

export async function getMyfxbookData(session, accountId) {
  if (!session || !accountId) return null;

  const now = Date.now();
  if (cachedData && (now - cacheTime) < CACHE_DURATION) {
    return cachedData;
  }

  try {
    const [summaryRes, monthlyRes, dailyRes] = await Promise.all([
      fetch(`${MYFXBOOK_API}/get-my-accounts.json?session=${session}`),
      fetch(`${MYFXBOOK_API}/get-monthly-gain.json?session=${session}&id=${accountId}`),
      fetch(`${MYFXBOOK_API}/get-daily-gain.json?session=${session}&id=${accountId}&start=2026-01-01&end=2026-12-31`),
    ]);

    const [summary, monthly, daily] = await Promise.all([
      summaryRes.json(), monthlyRes.json(), dailyRes.json(),
    ]);

    const account = summary.accounts?.find(a => String(a.id) === String(accountId));

    const result = {
      account: account || null,
      monthly: monthly.months || [],
      daily: daily.dailyGain || [],
      lastUpdated: new Date().toISOString(),
    };

    cachedData = result;
    cacheTime = now;
    return result;
  } catch (err) {
    console.error('Myfxbook API error:', err);
    return cachedData || null;
  }
}
