import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import {
  NATURAL_SECTIONS, LEGAL_SECTIONS, NATURAL_DOCUMENTS, LEGAL_DOCUMENTS,
  REFERENCE_FIELDS, BENEFICIAL_OWNER_FIELDS, MIN_REFERENCES,
  SHARED_DECLARATION_FIELDS, isRequired, sectionsForType, documentsForType,
} from '@/data/kyc-fields';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
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

function validateSections(sections, data) {
  for (const section of sections) {
    for (const field of section.fields) {
      if (!isRequired(field, data)) continue;
      const value = data[field.name];
      if (field.type === 'checkbox-group') {
        if (!Array.isArray(value) || value.length === 0) return field.name;
      } else if (value === undefined || value === null || String(value).trim() === '') {
        return field.name;
      }
    }
  }
  return null;
}

function buildEmailHtml(data, id) {
  const sections = sectionsForType(data.client_type);
  const sectionHtml = sections.map((section) => {
    const rows = section.fields
      .filter((f) => data[f.name] !== undefined && data[f.name] !== null && data[f.name] !== '')
      .map((f) => {
        const val = Array.isArray(data[f.name]) ? data[f.name].join(', ') : data[f.name];
        return `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;vertical-align:top;width:50%">
            <div style="font-size:11px;color:#999;margin-bottom:2px">${f.label}</div>
            <div style="font-size:14px;color:#1a1a1a">${String(val).replace(/\n/g, '<br>')}</div>
          </td>
        </tr>`;
      }).join('');
    if (!rows) return '';
    return `
      <tr><td colspan="2" style="padding:16px 12px 4px;background:#f8f8f8">
        <strong style="font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px">${section.title}</strong>
      </td></tr>
      ${rows}`;
  }).join('');

  const sharedRows = SHARED_DECLARATION_FIELDS
    .filter((f) => data[f.name])
    .map((f) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;vertical-align:top;width:50%">
          <div style="font-size:11px;color:#999;margin-bottom:2px">${f.label}</div>
          <div style="font-size:14px;color:#1a1a1a">${data[f.name]}</div>
        </td>
      </tr>`).join('');

  const refRows = (data.reference_contacts || []).map((ref, i) => `
    <tr><td colspan="2" style="padding:8px 12px;border-bottom:1px solid #f0f0f0">
      <div style="font-size:11px;color:#999;margin-bottom:2px">Referencia ${i + 1} / Reference ${i + 1}</div>
      <div style="font-size:14px;color:#1a1a1a">${ref.name} — ${ref.relationship} — ${ref.phone} — ${ref.email}</div>
    </td></tr>`).join('');

  const ownerRows = (data.le_beneficial_owners || []).map((o, i) => `
    <tr><td colspan="2" style="padding:8px 12px;border-bottom:1px solid #f0f0f0">
      <div style="font-size:11px;color:#999;margin-bottom:2px">Beneficiario final ${i + 1} / Beneficial owner ${i + 1}</div>
      <div style="font-size:14px;color:#1a1a1a">${o.full_name} — ${o.id_card} — ${o.nationality}</div>
    </td></tr>`).join('');

  const docRows = (data.documents || []).map((d) => `
    <tr><td colspan="2" style="padding:8px 12px;border-bottom:1px solid #f0f0f0">
      <div style="font-size:14px;color:#1a1a1a">✓ ${d.label} — ${d.original_filename}</div>
    </td></tr>`).join('');

  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family:sans-serif;background:#f5f5f5;margin:0;padding:24px">
      <div style="max-width:720px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <div style="background:#000;padding:20px 24px">
          <div style="color:#fff;font-size:18px;font-weight:bold">Panama Contact</div>
          <div style="color:#FF491A;font-size:13px;margin-top:4px">Nuevo formulario KYC (${data.client_type === 'legal' ? 'Empresa' : 'Persona Natural'})</div>
        </div>
        <div style="padding:16px 24px;background:#fff3ef;border-bottom:2px solid #FF491A">
          <a href="https://panama-contact.com/admin/kyc/${id}" style="color:#FF491A;font-weight:bold;font-size:14px;text-decoration:none">
            Ver formulario completo en el panel admin →
          </a>
        </div>
        <table style="width:100%;border-collapse:collapse">
          ${sectionHtml}
          ${ownerRows ? `<tr><td colspan="2" style="padding:16px 12px 4px;background:#f8f8f8"><strong style="font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px">Beneficiarios finales / Beneficial Owners</strong></td></tr>${ownerRows}` : ''}
          <tr><td colspan="2" style="padding:16px 12px 4px;background:#f8f8f8"><strong style="font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px">Forma de pago y declaración / Payment & Declaration</strong></td></tr>
          ${sharedRows}
          <tr><td colspan="2" style="padding:16px 12px 4px;background:#f8f8f8"><strong style="font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px">Referencias / References</strong></td></tr>
          ${refRows}
          <tr><td colspan="2" style="padding:16px 12px 4px;background:#f8f8f8"><strong style="font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px">Documentos / Documents</strong></td></tr>
          ${docRows}
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

  if (!['natural', 'legal'].includes(data.client_type)) {
    return Response.json({ error: 'Invalid client_type' }, { status: 400 });
  }

  // Validate type-specific sections
  const sections = sectionsForType(data.client_type);
  const missingField = validateSections(sections, data);
  if (missingField) {
    return Response.json({ error: `Missing required field: ${missingField}` }, { status: 400 });
  }

  // Validate shared declaration fields
  const missingShared = validateSections([{ fields: SHARED_DECLARATION_FIELDS }], data);
  if (missingShared) {
    return Response.json({ error: `Missing required field: ${missingShared}` }, { status: 400 });
  }

  // Validate legal declarations + signature
  if (data.declaration_lawful_resources !== true) {
    return Response.json({ error: 'declaration_lawful_resources must be accepted' }, { status: 400 });
  }
  if (data.declaration_no_third_party_deposits !== true) {
    return Response.json({ error: 'declaration_no_third_party_deposits must be accepted' }, { status: 400 });
  }
  if (!data.signature_full_name?.trim()) {
    return Response.json({ error: 'Missing required field: signature_full_name' }, { status: 400 });
  }

  // Validate references (min count + all sub-fields filled)
  const references = Array.isArray(data.reference_contacts) ? data.reference_contacts : [];
  if (references.length < MIN_REFERENCES) {
    return Response.json({ error: `At least ${MIN_REFERENCES} references are required` }, { status: 400 });
  }
  for (const ref of references) {
    for (const [key] of REFERENCE_FIELDS) {
      if (!ref[key]?.trim()) return Response.json({ error: `Missing reference field: ${key}` }, { status: 400 });
    }
  }

  // Validate beneficial owners (legal only)
  if (data.client_type === 'legal') {
    const owners = Array.isArray(data.le_beneficial_owners) ? data.le_beneficial_owners : [];
    if (owners.length < 1) {
      return Response.json({ error: 'At least 1 beneficial owner is required' }, { status: 400 });
    }
    for (const owner of owners) {
      for (const [key] of BENEFICIAL_OWNER_FIELDS) {
        if (!owner[key]?.trim()) return Response.json({ error: `Missing beneficial owner field: ${key}` }, { status: 400 });
      }
    }
  }

  // Validate documents (all checklist keys present)
  const requiredDocs = documentsForType(data.client_type);
  const uploadedDocs = Array.isArray(data.documents) ? data.documents : [];
  const uploadedKeys = new Set(uploadedDocs.map((d) => d.key));
  for (const doc of requiredDocs) {
    if (!uploadedKeys.has(doc.key)) {
      return Response.json({ error: `Missing required document: ${doc.key}` }, { status: 400 });
    }
  }

  // Compute display columns
  const display_name = data.client_type === 'legal' ? data.le_company_name : data.np_name_surname;
  const display_secondary = data.client_type === 'legal' ? data.le_company_activities : data.np_nationality;

  if (!display_name?.trim()) {
    return Response.json({ error: 'Missing name field for selected client type' }, { status: 400 });
  }

  // Strip honeypot, build row
  const { website: _hp, ...cleanData } = data;
  const row = { ...cleanData, display_name, display_secondary };

  const supabase = getServiceClient();
  const { data: inserted, error: dbError } = await supabase
    .from('kyc_submissions')
    .insert([row])
    .select('id')
    .single();

  if (dbError) {
    console.error('Supabase insert error:', dbError);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Panama Contact <noreply@panama-contact.com>',
      to: process.env.EMAIL_ADMIN || 'info@panama-contact.com',
      replyTo: data.np_personal_email || data.le_email || undefined,
      subject: `Nuevo KYC (${data.client_type === 'legal' ? 'Empresa' : 'Persona Natural'}) – ${display_name}`,
      html: buildEmailHtml(row, inserted.id),
    });
  } catch (emailErr) {
    console.error('Resend error:', emailErr);
  }

  return Response.json({ success: true, id: inserted.id });
}
