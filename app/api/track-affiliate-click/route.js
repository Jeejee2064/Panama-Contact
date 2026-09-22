import { Resend } from 'resend';

// In-memory rate limiter: IP → [timestamps]
const rateMap = new Map();
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip) {
  const now = Date.now();
  const hits = (rateMap.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_LIMIT) return false;
  hits.push(now);
  rateMap.set(ip, hits);
  return true;
}

// Only these hosts are allowed to trigger an alert — keeps this endpoint
// from being abused to spam arbitrary emails to the admin inbox.
const TRACKED_HOSTS = ['acomodorentals.com', 'www.acomodorentals.com'];

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));
}

function buildEmailHtml({ href, page, locale, referrer, ip, userAgent, timestamp }) {
  const rows = [
    ['Lien cliqué', href],
    ['Page source', page || '—'],
    ['Langue', locale || '—'],
    ['Référent', referrer || '—'],
    ['Adresse IP', ip],
    ['Navigateur', userAgent || '—'],
    ['Heure (UTC)', timestamp],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;vertical-align:top">
              <div style="font-size:11px;color:#999;margin-bottom:2px">${escapeHtml(label)}</div>
              <div style="font-size:14px;color:#1a1a1a;word-break:break-all">${escapeHtml(value)}</div>
            </td>
          </tr>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family:sans-serif;background:#f5f5f5;margin:0;padding:24px">
      <div style="max-width:720px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <div style="background:#1e2b3a;padding:20px 24px">
          <img src="https://panama-contact.com/logo-blanc-fond-trans.png" width="130" height="87" alt="Panama Contact Services" style="display:block;border:0;outline:none;text-decoration:none;height:87px;width:130px;max-width:130px" />
          <div style="color:#FF491A;font-size:13px;margin-top:10px">Clic sortant — Acomodo Rentals</div>
        </div>
        <table style="width:100%;border-collapse:collapse">${rowsHtml}
        </table>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (!checkRateLimit(ip)) {
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { href, page, locale, referrer } = data || {};

  if (typeof href !== 'string' || !href) {
    return Response.json({ error: 'Missing href' }, { status: 400 });
  }

  let hostname;
  try {
    hostname = new URL(href).hostname;
  } catch {
    return Response.json({ error: 'Invalid href' }, { status: 400 });
  }

  if (!TRACKED_HOSTS.includes(hostname)) {
    return Response.json({ error: 'Untracked host' }, { status: 400 });
  }

  const timestamp = new Date().toISOString();
  const userAgent = request.headers.get('user-agent') || '';

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: sendErr } = await resend.emails.send({
      from: 'Panama Contact Services <noreply@panama-contact.com>',
      to: process.env.EMAIL_ADMIN || 'info@panama-contact.com',
      subject: `Clic sortant vers Acomodo Rentals — ${typeof page === 'string' && page ? page : 'page inconnue'}`,
      html: buildEmailHtml({
        href,
        page: typeof page === 'string' ? page : '',
        locale: typeof locale === 'string' ? locale : '',
        referrer: typeof referrer === 'string' ? referrer : '',
        ip,
        userAgent,
        timestamp,
      }),
    });
    if (sendErr) {
      console.error('Resend error:', sendErr);
      return Response.json({ error: 'Email error' }, { status: 500 });
    }
  } catch (emailErr) {
    console.error('Resend error:', emailErr);
    return Response.json({ error: 'Email error' }, { status: 500 });
  }

  return Response.json({ success: true });
}
