export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const token = process.env.SENDER_API_TOKEN;
  if (!token) {
    res.status(500).json({ ok: false, error: 'Missing API token' });
    return;
  }

  let body = req.body;
  try {
    if (typeof body === 'string') body = JSON.parse(body);
  } catch {
    res.status(400).json({ ok: false, error: 'Invalid JSON' });
    return;
  }

  const email = String(body?.email ?? '').trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ ok: false, error: 'Invalid email' });
    return;
  }

  const name = String(body?.name ?? '').trim();
  let firstname = '';
  let lastname = '';
  if (name) {
    const safe = name.replace(/\s+/g, ' ').slice(0, 80);
    const parts = safe.split(' ').filter(Boolean);
    firstname = parts[0] || '';
    lastname = parts.slice(1).join(' ');
  }

  try {
    const resp = await fetch('https://api.sender.net/v2/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        ...(firstname ? { firstname } : {}),
        ...(lastname ? { lastname } : {}),
      }),
    });

    const text = await resp.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!resp.ok) {
      res.status(resp.status).json({ ok: false, error: 'Subscribe failed', details: data });
      return;
    }

    res.status(200).json({ ok: true });
  } catch {
    res.status(500).json({ ok: false, error: 'Request failed' });
  }
}
