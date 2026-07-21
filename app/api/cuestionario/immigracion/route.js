import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { SECTIONS } from '@/data/immigration-fields';

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

const REQUIRED_FIELDS = [
  'apellidos', 'primer_y_segundo_nombre', 'fecha_de_nacimiento', 'lugar_de_nacimiento',
  'nacionalidad', 'sexo', 'estado_civil',
  'numero_pasaporte', 'pasaporte_expedido_en', 'fecha_expedicion_pasaporte', 'fecha_vencimiento_pasaporte',
  'estatura', 'color_cabello', 'color_ojos', 'color_piel',
  'nombre_completo_padre', 'nombre_completo_madre',
  'direccion_domicilio_panama', 'con_quienes_reside', 'piensa_permanecer_domicilio',
  'direccion_postal_fax_email', 'email', 'nombre_propietario_domicilio', 'direccion_pais_origen', 'telefono_domicilio',
  'profesion_ocupacion', 'ocupacion', 'actividad_desempenada', 'titulos_diplomas', 'universidad_institucion',
  'razon_presencia_panama', 'tiempo_permanencia_panama', 'medios_economicos',
  'puerto_de_entrada', 'pais_de_procedencia', 'compania_transporte', 'fecha_llegada_panama',
  'nombre_responsable', 'direccion_responsable', 'telefono_responsable',
  'visitado_panama', 'visa_aprobada', 'visa_negada', 'visa_cancelada_revocada',
  'solicitud_residencia_previa', 'familiares_en_panama', 'contrato_trabajo_panama', 'intencion_estudiar_panama',
  'residencia_legal', 'detenido_condenado', 'negado_entrada_deportacion', 'trafico_personas',
  'sustancia_controlada', 'explotacion_recursos', 'enfermedad_contagiosa', 'prohibiciones_decreto_ley',
  'solicitud_llenada_otra_persona',
];

function buildEmailHtml(data, id) {
  const sectionHtml = SECTIONS.map((section) => {
    const rows = section.fields
      .filter(([key]) => data[key])
      .map(([key, label]) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;vertical-align:top;width:50%">
            <div style="font-size:11px;color:#999;margin-bottom:2px">${label}</div>
            <div style="font-size:14px;color:#1a1a1a">${String(data[key]).replace(/\n/g, '<br>')}</div>
          </td>
        </tr>
      `).join('');

    if (!rows) return '';
    return `
      <tr><td colspan="2" style="padding:16px 12px 4px;background:#f8f8f8">
        <strong style="font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px">${section.title}</strong>
      </td></tr>
      ${rows}
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family:sans-serif;background:#f5f5f5;margin:0;padding:24px">
      <div style="max-width:720px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <div style="background:#1e2b3a;padding:20px 24px">
          <img src="https://panama-contact.com/logo-blanc-fond-trans.png" width="130" height="87" alt="Panama Contact Services" style="display:block;border:0;outline:none;text-decoration:none;height:87px;width:130px;max-width:130px" />
          <div style="color:#FF491A;font-size:13px;margin-top:10px">Nuevo cuestionario de inmigración</div>
        </div>
        <div style="padding:16px 24px;background:#fff3ef;border-bottom:2px solid #FF491A">
          <a href="https://panama-contact.com/admin/immigracion/${id}" style="color:#FF491A;font-weight:bold;font-size:14px;text-decoration:none">
            Ver cuestionario completo en el panel admin →
          </a>
        </div>
        <table style="width:100%;border-collapse:collapse">
          ${sectionHtml}
        </table>
      </div>
    </body>
    </html>
  `;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildClientConfirmationHtml(data) {
  const fullName = `${data.apellidos} ${data.primer_y_segundo_nombre}`;
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family:sans-serif;background:#f5f5f5;margin:0;padding:24px">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <div style="background:#1e2b3a;padding:20px 24px">
          <img src="https://panama-contact.com/logo-blanc-fond-trans.png" width="130" height="87" alt="Panama Contact Services" style="display:block;border:0;outline:none;text-decoration:none;height:87px;width:130px;max-width:130px" />
        </div>
        <div style="padding:24px;color:#1a1a1a;font-size:14px;line-height:1.6">
          <p>Estimado/a ${fullName},</p>
          <p>Su registro se ha completado exitosamente. Gracias por haberse registrado con nosotros. Hemos recibido y guardado correctamente toda su información.</p>
          <p><strong>Notas importantes – Para el día de su cita en Inmigración:</strong></p>
          <p><strong>Vestimenta no permitida:</strong></p>
          <ul>
            <li>Shorts y minifaldas.</li>
            <li>Camisas sin mangas (camisillas/bividí).</li>
            <li>Escotes pronunciados.</li>
            <li>Ropa muy corta o transparente.</li>
            <li>Pantalones rotos.</li>
            <li>Sandalias playeras o chanclas.</li>
          </ul>
          <p><strong>Recomendaciones:</strong></p>
          <ul>
            <li>Se recomienda el uso de zapatos cerrados y pantalones o faldas largas.</li>
            <li>Las instalaciones suelen tener el aire acondicionado muy frío; lleve abrigo o suéter.</li>
            <li>Si su trámite requiere fotografías tamaño carné, evite ropa sin mangas o escotada.</li>
          </ul>
          <p>Gracias por su confianza. Para cualquier consulta adicional, quedamos a su disposición.</p>
          <hr style="border:none;border-top:1px solid #f0f0f0;margin:24px 0">
          <p>Dear ${fullName},</p>
          <p>Your registration has been completed successfully. Thank you for registering with us. We have received and correctly saved all your information.</p>
          <p><strong>Important notes – For the day of your Immigration appointment:</strong></p>
          <p><strong>Clothing not allowed:</strong></p>
          <ul>
            <li>Shorts and miniskirts.</li>
            <li>Sleeveless shirts (tank tops).</li>
            <li>Low-cut necklines.</li>
            <li>Very short or sheer clothing.</li>
            <li>Ripped/torn pants.</li>
            <li>Beach sandals or flip-flops.</li>
          </ul>
          <p><strong>Recommendations:</strong></p>
          <ul>
            <li>Closed-toe shoes and long pants or skirts are recommended.</li>
            <li>The facilities are usually very cold due to air conditioning; bring a jacket or sweater.</li>
            <li>If your procedure requires passport-style photos, avoid sleeveless or low-cut clothing.</li>
          </ul>
          <p>Thank you for your trust. For any further questions, we remain at your disposal.</p>
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

  // Validate required fields
  for (const field of REQUIRED_FIELDS) {
    if (!data[field] || String(data[field]).trim() === '') {
      return Response.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }
  // Conditional required: spouse fields
  const SPOUSE_STATUSES = ['Casado', 'Union libre'];
  if (SPOUSE_STATUSES.includes(data.estado_civil)) {
    for (const f of ['nombre_conyuge', 'nacionalidad_conyuge', 'tipo_documento_conyuge', 'numero_documento_conyuge']) {
      if (!data[f]?.trim()) return Response.json({ error: `Missing required field: ${f}` }, { status: 400 });
    }
  }
  // Conditional required: familiares_en_panama_detalle
  if (data.familiares_en_panama === 'Sí' && !data.familiares_en_panama_detalle?.trim()) {
    return Response.json({ error: 'Missing field: familiares_en_panama_detalle' }, { status: 400 });
  }
  // Conditional required: visitado_panama follow-up
  if (data.visitado_panama === 'Sí') {
    for (const f of ['visitado_panama_tiempo', 'visitado_panama_tipo_visa']) {
      if (!data[f]?.trim()) return Response.json({ error: `Missing field: ${f}` }, { status: 400 });
    }
  }
  // Conditional required: visa_aprobada follow-up
  if (data.visa_aprobada === 'Sí') {
    for (const f of ['visa_aprobada_cuando', 'visa_aprobada_donde', 'visa_aprobada_tipo_visa']) {
      if (!data[f]?.trim()) return Response.json({ error: `Missing field: ${f}` }, { status: 400 });
    }
  }
  // Conditional required: datos_persona_que_lleno
  if (data.solicitud_llenada_otra_persona === 'Sí' && !data.datos_persona_que_lleno?.trim()) {
    return Response.json({ error: 'Missing field: datos_persona_que_lleno' }, { status: 400 });
  }
  // Validate email format
  if (!EMAIL_RE.test(data.email)) {
    return Response.json({ error: 'Invalid email' }, { status: 400 });
  }

  // Strip honeypot from stored data
  const { website: _hp, ...cleanData } = data;

  // Insert into Supabase (service role bypasses RLS — safe, server-side only)
  const supabase = getServiceClient();
  const { data: row, error: dbError } = await supabase
    .from('immigration_submissions')
    .insert([cleanData])
    .select('id')
    .single();

  if (dbError) {
    console.error('Supabase insert error:', dbError);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }

  // Send emails
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error: sendErr } = await resend.emails.send({
      from: 'Panama Contact Services <noreply@panama-contact.com>',
      to: process.env.EMAIL_ADMIN || 'info@panama-contact.com',
      replyTo: data.email,
      subject: `Nuevo cuestionario – ${data.apellidos} ${data.primer_y_segundo_nombre}`,
      html: buildEmailHtml(cleanData, row.id),
    });
    if (sendErr) console.error('Resend error:', sendErr);
  } catch (emailErr) {
    console.error('Resend error:', emailErr);
    // Don't fail the request — submission is saved
  }

  try {
    const { error: sendErr } = await resend.emails.send({
      from: 'Panama Contact Services <noreply@panama-contact.com>',
      to: data.email,
      subject: 'Su registro ha sido recibido / Your registration has been received – Panama Contact Services',
      html: buildClientConfirmationHtml(cleanData),
    });
    if (sendErr) console.error('Resend error (client confirmation):', sendErr);
  } catch (emailErr) {
    console.error('Resend error (client confirmation):', emailErr);
  }

  return Response.json({ success: true, id: row.id });
}
