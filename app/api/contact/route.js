import { Resend } from 'resend';

// In-memory rate limiter: IP → [timestamps]
const rateMap = new Map();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip) {
  const now = Date.now();
  const hits = (rateMap.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_LIMIT) return false;
  hits.push(now);
  rateMap.set(ip, hits);
  return true;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildEmailHtml({ name, email, message }) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family:sans-serif;background:#f5f5f5;margin:0;padding:24px">
      <div style="max-width:720px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <div style="background:#000;padding:20px 24px">
          <div style="color:#fff;font-size:18px;font-weight:bold">Panama Contact Services</div>
          <div style="color:#FF491A;font-size:13px;margin-top:4px">Nuevo mensaje de contacto</div>
        </div>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;vertical-align:top">
              <div style="font-size:11px;color:#999;margin-bottom:2px">Nombre</div>
              <div style="font-size:14px;color:#1a1a1a">${name}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;vertical-align:top">
              <div style="font-size:11px;color:#999;margin-bottom:2px">Email</div>
              <div style="font-size:14px;color:#1a1a1a">${email}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 12px;vertical-align:top">
              <div style="font-size:11px;color:#999;margin-bottom:2px">Mensaje</div>
              <div style="font-size:14px;color:#1a1a1a">${String(message).replace(/\n/g, '<br>')}</div>
            </td>
          </tr>
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

  const { name, email, message } = data;

  if (!name?.trim() || name.trim().length < 2) {
    return Response.json({ error: 'Missing required field: name' }, { status: 400 });
  }
  if (!email?.trim() || !EMAIL_RE.test(email)) {
    return Response.json({ error: 'Missing required field: email' }, { status: 400 });
  }
  if (!message?.trim() || message.trim().length < 10) {
    return Response.json({ error: 'Missing required field: message' }, { status: 400 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: sendErr } = await resend.emails.send({
      from: 'Panama Contact Services <noreply@panama-contact.com>',
      to: process.env.EMAIL_ADMIN || 'info@panama-contact.com',
      replyTo: email,
      subject: `Nuevo mensaje de contacto – ${name}`,
      html: buildEmailHtml({ name, email, message }),
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
