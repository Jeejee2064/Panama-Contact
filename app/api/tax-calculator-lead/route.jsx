import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { renderToBuffer } from '@react-pdf/renderer';
import TaxReportDocument from '@/lib/panama-tax/pdf/TaxReportDocument';
import { TAX_DISCLAIMER } from '@/lib/panama-tax/disclaimer';
import { getPostHogClient } from '@/lib/posthog-server';

function getServiceClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

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
const CALENDLY_URL = 'https://calendly.com/panama-contact-info/30min';

function buildTaxReportEmailHtml(firstName) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family:sans-serif;background:#f5f5f5;margin:0;padding:24px">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <div style="background:#1e2b3a;padding:20px 24px">
          <img src="https://panama-contact.com/logo-blanc-fond-trans.png" width="130" height="87" alt="Panama Contact Services" style="display:block;border:0;outline:none;text-decoration:none;height:87px;width:130px;max-width:130px" />
          <div style="color:#FF491A;font-size:13px;margin-top:10px">Your personalized Panama tax report</div>
        </div>
        <div style="padding:24px;color:#1a1a1a;font-size:14px;line-height:1.6">
          <p>Hi ${firstName},</p>
          <p>Thank you for using our Panama tax calculator. Your personalized tax report is attached to this email as a PDF.</p>
          <p>Want to go over your specific situation with a real person? Book a free 30-minute call with our team — no obligation.</p>
          <div style="text-align:center;margin:28px 0">
            <a href="${CALENDLY_URL}" style="display:inline-block;background:#FF491A;color:#fff;font-weight:bold;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:14px">
              Book a Free Consultation
            </a>
          </div>
          <p style="color:#666;font-size:12px">This report is an estimate only and not legal, tax, or accounting advice.</p>
        </div>
        <div style="background:#1e2b3a;padding:24px;text-align:center">
          <div style="color:#fff;font-size:13px;font-weight:bold;margin-bottom:10px">Panama Contact Services</div>
          <div style="font-size:12px;line-height:1.7">
            <a href="https://wa.me/50764357515" style="color:#FF4D1C;text-decoration:none">+507 6435-7515</a>
            <span style="color:#4a5a6b">&nbsp;|&nbsp;</span>
            <a href="tel:+5073185882" style="color:#FF4D1C;text-decoration:none">+507 318-5882</a>
            <span style="color:#4a5a6b">&nbsp;|&nbsp;</span>
            <a href="mailto:info@panama-contact.com" style="color:#FF4D1C;text-decoration:none">info@panama-contact.com</a>
          </div>
          <div style="color:#9aa5b1;font-size:11px;line-height:1.6;margin-top:10px">
            Ph Jeronimo, Avenida B y calle 10 este, planta baja<br>
            San Felipe, Ciudad de Panamá, Panamá
          </div>
          <div style="color:#6b7888;font-size:10px;margin-top:14px">
            © ${new Date().getFullYear()} Panamá Contact Services. All rights reserved.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function buildAdminNotificationHtml(firstName, email, sourcePage) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family:sans-serif;background:#f5f5f5;margin:0;padding:24px">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <div style="background:#1e2b3a;padding:20px 24px">
          <img src="https://panama-contact.com/logo-blanc-fond-trans.png" width="130" height="87" alt="Panama Contact Services" style="display:block;border:0;outline:none;text-decoration:none;height:87px;width:130px;max-width:130px" />
          <div style="color:#FF491A;font-size:13px;margin-top:10px">New tax calculator lead (Page ${sourcePage})</div>
        </div>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0"><div style="font-size:11px;color:#999">Name</div><div style="font-size:14px;color:#1a1a1a">${firstName}</div></td></tr>
          <tr><td style="padding:8px 12px"><div style="font-size:11px;color:#999">Email</div><div style="font-size:14px;color:#1a1a1a">${email}</div></td></tr>
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

  // Honeypot
  if (data.website) {
    return Response.json({ success: true });
  }

  const { firstName, email, consent, sourcePage, locale, answers } = data;

  if (!firstName?.trim()) {
    return Response.json({ error: 'Missing required field: firstName' }, { status: 400 });
  }
  if (!email?.trim() || !EMAIL_RE.test(email)) {
    return Response.json({ error: 'Invalid email' }, { status: 400 });
  }
  if (consent !== true) {
    return Response.json({ error: 'Consent is required' }, { status: 400 });
  }
  if (!['A', 'B'].includes(sourcePage)) {
    return Response.json({ error: 'Invalid source_page' }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { error: dbError } = await supabase.from('tax_calculator_leads').insert([{
    source_page: sourcePage,
    locale: locale || 'en',
    first_name: firstName.trim(),
    last_name: null,
    email: email.trim(),
    country: null,
    phone: null,
    answers: answers ?? {},
    consent: true,
  }]);

  if (dbError) {
    console.error('Supabase insert error:', dbError.message, dbError.details, dbError.hint, dbError.code);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }

  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: email.trim(),
    event: 'tax_report_lead_captured',
    properties: {
      source_page: sourcePage,
      locale: locale || 'en',
    },
  });
  await posthog.flush();

  const buffer = await renderToBuffer(
    <TaxReportDocument
      firstName={firstName.trim()}
      generatedAt={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      summaryItems={answers?.summaryItems ?? []}
      resultHeadline={answers?.resultHeadline}
      resultBody={answers?.resultBody}
      calculatorResult={answers?.calculatorResult}
      recommendations={answers?.recommendations ?? []}
      disclaimer={TAX_DISCLAIMER}
    />
  );

  const resend = new Resend(process.env.RESEND_API_KEY);
  const base64Pdf = buffer.toString('base64');

  try {
    const { error: sendErr } = await resend.emails.send({
      from: 'Panama Contact Services <noreply@panama-contact.com>',
      to: email.trim(),
      subject: 'Your Personalized Panama Tax Report',
      html: buildTaxReportEmailHtml(firstName.trim()),
      attachments: [{ filename: 'panama-tax-report.pdf', content: base64Pdf }],
    });
    if (sendErr) console.error('Resend error (lead):', sendErr);
  } catch (emailErr) {
    console.error('Resend error (lead):', emailErr);
    // Don't fail the request — lead is saved and the PDF still downloads below.
  }

  try {
    const { error: sendErr } = await resend.emails.send({
      from: 'Panama Contact Services <noreply@panama-contact.com>',
      to: process.env.EMAIL_ADMIN || 'info@panama-contact.com',
      replyTo: email.trim(),
      subject: `New tax calculator lead – ${firstName.trim()}`,
      html: buildAdminNotificationHtml(firstName.trim(), email.trim(), sourcePage),
    });
    if (sendErr) console.error('Resend error (admin):', sendErr);
  } catch (emailErr) {
    console.error('Resend error (admin):', emailErr);
  }

  // Delivered by email only — no direct browser download.
  return Response.json({ success: true });
}
