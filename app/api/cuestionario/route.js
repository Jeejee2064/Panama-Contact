import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

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
  'nombre_completo_padre', 'nombre_completo_madre',
  'direccion_domicilio_panama', 'con_quienes_reside', 'piensa_permanecer_domicilio',
  'direccion_postal_fax_email', 'nombre_propietario_domicilio', 'direccion_pais_origen', 'telefono_domicilio',
  'profesion_ocupacion', 'ocupacion', 'actividad_desempenada',
  'razon_presencia_panama', 'tiempo_permanencia_panama', 'medios_economicos',
  'puerto_de_entrada', 'pais_de_procedencia', 'compania_transporte', 'fecha_llegada_panama',
  'nombre_responsable', 'direccion_responsable', 'telefono_responsable',
  'visitado_panama', 'visa_aprobada', 'visa_negada', 'visa_cancelada_revocada',
  'solicitud_residencia_previa', 'familiares_en_panama', 'contrato_trabajo_panama', 'intencion_estudiar_panama',
  'residencia_legal', 'detenido_condenado', 'negado_entrada_deportacion', 'trafico_personas',
  'sustancia_controlada', 'explotacion_recursos', 'enfermedad_contagiosa', 'prohibiciones_decreto_ley',
  'solicitud_llenada_otra_persona',
];

const SECTIONS = [
  { title: 'Identidad / Identity', fields: [
    ['apellidos', 'Apellidos / Last name'],
    ['primer_y_segundo_nombre', 'Primer y segundo nombre / First and middle name'],
    ['otros_apellidos_nombres', 'Otros apellidos o nombres / Other names used'],
    ['apellido_de_casada', 'Apellido de casada / Maiden name'],
    ['fecha_de_nacimiento', 'Fecha de nacimiento / Date of birth'],
    ['lugar_de_nacimiento', 'Lugar de nacimiento / Place of birth'],
    ['nacionalidad', 'Nacionalidad / Nationality'],
    ['sexo', 'Sexo / Sex'],
    ['estado_civil', 'Estado civil / Marital status'],
    ['estatura', 'Estatura / Height'],
    ['color_cabello', 'Color de cabello / Hair color'],
    ['color_ojos', 'Color de ojos / Eye color'],
    ['color_piel', 'Color de piel / Skin color'],
  ]},
  { title: 'Documentos / Travel Documents', fields: [
    ['numero_pasaporte', 'N° de pasaporte / Passport number'],
    ['numero_carne_cedula', 'N° de carné o cédula / ID card number'],
    ['pasaporte_expedido_en', 'Pasaporte expedido en / Passport issued in'],
    ['fecha_expedicion_pasaporte', 'Fecha de expedición / Issue date'],
    ['fecha_vencimiento_pasaporte', 'Fecha de vencimiento / Expiry date'],
  ]},
  { title: 'Familia / Family', fields: [
    ['nombre_completo_padre', 'Nombre completo del padre y su nacionalidad / Father\'s full name and nationality'],
    ['nombre_completo_madre', 'Nombre completo de la madre y su nacionalidad / Mother\'s full name and nationality'],
    ['nombre_conyuge', 'Nombre del cónyuge / Spouse\'s name'],
    ['nacionalidad_conyuge', 'Nacionalidad del cónyuge / Spouse\'s nationality'],
    ['tipo_documento_conyuge', 'Tipo de documento del cónyuge / Spouse\'s document type'],
    ['numero_documento_conyuge', 'N° del documento del cónyuge / Spouse\'s document number'],
    ['personas_ingresaron_con_usted', 'Personas que ingresaron con usted / People who entered with you'],
  ]},
  { title: 'Domicilio en Panamá / Address in Panama', fields: [
    ['direccion_domicilio_panama', 'Dirección y teléfono en Panamá / Address and phone in Panama'],
    ['con_quienes_reside', '¿Con quiénes reside? / Who do you live with?'],
    ['piensa_permanecer_domicilio', '¿Piensa permanecer en este domicilio? / Do you plan to stay at this address?'],
    ['direccion_postal_fax_email', 'Dirección postal, fax o e-mail / Postal address, fax or email'],
    ['nombre_propietario_domicilio', 'Nombre del propietario o arrendatario / Name of owner or tenant'],
    ['direccion_pais_origen', 'Dirección en país de origen / Address in country of origin'],
    ['telefono_domicilio', 'Teléfono de domicilio / Home phone'],
  ]},
  { title: 'Profesión / Occupation', fields: [
    ['profesion_ocupacion', 'Profesión u ocupación / Profession or occupation'],
    ['ocupacion', 'Ocupación / Occupation'],
    ['actividad_desempenada', 'Actividad desempeñada / Activity performed'],
    ['nombre_empleador', 'Nombre del empleador / Employer name'],
    ['titulos_diplomas', 'Títulos o diplomas / Degrees or diplomas'],
    ['universidad_institucion', 'Universidad o institución / University or institution'],
  ]},
  { title: 'Estancia en Panamá / Stay in Panama', fields: [
    ['razon_presencia_panama', 'Razón de su presencia en Panamá / Reason for presence in Panama'],
    ['tiempo_permanencia_panama', 'Tiempo de permanencia / Length of stay'],
    ['fecha_regreso_pais_origen', 'Fecha de regreso / Return date'],
    ['medios_economicos', 'Medios económicos / Financial means'],
    ['puerto_de_entrada', 'Puerto de entrada / Port of entry'],
    ['pais_de_procedencia', 'País de procedencia / Country of origin'],
    ['compania_transporte', 'Compañía de transporte / Transport company'],
    ['fecha_llegada_panama', 'Fecha de llegada a Panamá / Date of arrival in Panama'],
  ]},
  { title: 'Responsable económico / Financial Guarantor', fields: [
    ['nombre_responsable', 'Responsable económico / Financial guarantor'],
    ['direccion_responsable', 'Dirección del responsable / Guarantor\'s address'],
    ['telefono_responsable', 'Teléfono del responsable / Guarantor\'s phone'],
    ['nombre_persona_responsable', 'Nombre de la persona responsable / Name of responsible person'],
    ['direccion_persona_responsable', 'Dirección de la persona responsable / Address of responsible person'],
    ['telefono_persona_responsable', 'Teléfono de la persona responsable / Phone of responsible person'],
  ]},
  { title: 'Historial migratorio / Immigration History', fields: [
    ['visitado_panama', '¿Ha visitado Panamá? / Have you visited Panama?'],
    ['visa_aprobada', '¿Le han aprobado una visa panameña? / Approved a Panamanian visa?'],
    ['visa_negada', '¿Le han negado una visa panameña? / Denied a Panamanian visa?'],
    ['visa_cancelada_revocada', '¿Le han cancelado o revocado una visa? / Visa cancelled or revoked?'],
    ['solicitud_residencia_previa', '¿Alguien sometió solicitud de residencia en su nombre? / Prior residency application?'],
    ['familiares_en_panama', '¿Tiene familiares con residencia o ciudadanía panameña? / Relatives with Panamanian residency?'],
    ['familiares_en_panama_detalle', 'Detalle familiares en Panamá / Family details'],
    ['contrato_trabajo_panama', '¿Tiene contrato de trabajo en Panamá? / Work contract in Panama?'],
    ['intencion_estudiar_panama', '¿Tiene intención de estudiar en Panamá? / Intend to study in Panama?'],
  ]},
  { title: 'Preguntas legales / Legal Questions', fields: [
    ['residencia_legal', '¿Su residencia en el país es legal? / Is your current residence legal?'],
    ['residencia_legal_detalle', 'Explicación / Explanation'],
    ['detenido_condenado', '¿Ha sido detenido o condenado por algún delito? / Ever arrested or convicted?'],
    ['detenido_condenado_detalle', 'Explicación / Explanation'],
    ['negado_entrada_deportacion', '¿Le han negado la entrada a Panamá o ha sido deportado? / Denied entry or deported?'],
    ['negado_entrada_deportacion_detalle', 'Explicación / Explanation'],
    ['trafico_personas', '¿Ha participado en tráfico de personas? / Participated in human trafficking?'],
    ['trafico_personas_detalle', 'Explicación / Explanation'],
    ['sustancia_controlada', '¿Ha distribuido o vendido ilícitamente una sustancia controlada? / Illegally sold controlled substance?'],
    ['sustancia_controlada_detalle', 'Explicación / Explanation'],
    ['explotacion_recursos', '¿Ha ejecutado actos de explotación de recursos naturales en Panamá? / Exploited natural resources?'],
    ['explotacion_recursos_detalle', 'Explicación / Explanation'],
    ['enfermedad_contagiosa', '¿Ha sufrido alguna enfermedad contagiosa importante? / Significant contagious disease?'],
    ['enfermedad_contagiosa_detalle', 'Explicación / Explanation'],
    ['prohibiciones_decreto_ley', 'Art. 50 Decreto Ley N°3 del 22 feb 2008 — prohibiciones / prohibitions'],
    ['prohibiciones_decreto_ley_detalle', 'Explicación / Explanation'],
  ]},
  { title: 'Llenado por tercero / Filled by Third Party', fields: [
    ['solicitud_llenada_otra_persona', '¿Esta solicitud fue llenada por otra persona? / Form filled by someone else?'],
    ['datos_persona_que_lleno', 'Datos de la persona que llenó la solicitud / Details of the person who filled the form'],
  ]},
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
        <div style="background:#000;padding:20px 24px">
          <div style="color:#fff;font-size:18px;font-weight:bold">Panama Contact</div>
          <div style="color:#FF491A;font-size:13px;margin-top:4px">Nuevo cuestionario de inmigración</div>
        </div>
        <div style="padding:16px 24px;background:#fff3ef;border-bottom:2px solid #FF491A">
          <a href="https://panama-contact.com/admin/submissions/${id}" style="color:#FF491A;font-weight:bold;font-size:14px;text-decoration:none">
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
  // Conditional required: familiares_en_panama_detalle
  if (data.familiares_en_panama === 'Sí' && !data.familiares_en_panama_detalle?.trim()) {
    return Response.json({ error: 'Missing field: familiares_en_panama_detalle' }, { status: 400 });
  }
  // Conditional required: datos_persona_que_lleno
  if (data.solicitud_llenada_otra_persona === 'Sí' && !data.datos_persona_que_lleno?.trim()) {
    return Response.json({ error: 'Missing field: datos_persona_que_lleno' }, { status: 400 });
  }

  // Strip honeypot from stored data
  const { website: _hp, ...cleanData } = data;

  // Insert into Supabase (service role bypasses RLS — safe, server-side only)
  const supabase = getServiceClient();
  const { data: row, error: dbError } = await supabase
    .from('submissions')
    .insert([cleanData])
    .select('id')
    .single();

  if (dbError) {
    console.error('Supabase insert error:', dbError);
    return Response.json({ error: 'Database error' }, { status: 500 });
  }

  // Send email
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Panama Contact <noreply@panama-contact.com>',
      to: process.env.EMAIL_ADMIN || 'info@panama-contact.com',
      replyTo: data.direccion_postal_fax_email || undefined,
      subject: `Nuevo cuestionario – ${data.apellidos} ${data.primer_y_segundo_nombre}`,
      html: buildEmailHtml(cleanData, row.id),
    });
  } catch (emailErr) {
    console.error('Resend error:', emailErr);
    // Don't fail the request — submission is saved
  }

  return Response.json({ success: true, id: row.id });
}
