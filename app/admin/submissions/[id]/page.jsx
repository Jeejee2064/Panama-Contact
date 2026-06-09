import { createSupabaseServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import CopyField from '@/components/admin/CopyField';

export const dynamic = 'force-dynamic';

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
    ['prohibiciones_decreto_ley', 'Art. 50 Decreto Ley N°3 / Prohibitions'],
    ['prohibiciones_decreto_ley_detalle', 'Explicación / Explanation'],
  ]},
  { title: 'Llenado por tercero / Filled by Third Party', fields: [
    ['solicitud_llenada_otra_persona', '¿Esta solicitud fue llenada por otra persona? / Form filled by someone else?'],
    ['datos_persona_que_lleno', 'Datos de la persona que llenó la solicitud / Details of person who filled the form'],
  ]},
];

export default async function SubmissionDetail({ params }) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data: row } = await supabase
    .from('submissions')
    .select('*')
    .eq('id', id)
    .single();

  if (!row) notFound();

  // Mark as read (admin is authenticated, RLS update policy applies)
  if (!row.read) {
    await supabase.from('submissions').update({ read: true }).eq('id', id);
  }

  const submittedAt = new Date(row.created_at).toLocaleString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminNav />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin/submissions" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            ← Volver / Back
          </Link>
          <span className="text-xs text-gray-400">{submittedAt}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">
              {row.apellidos}, {row.primer_y_segundo_nombre}
            </h1>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              row.read ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {row.read ? 'Lu / Read' : 'Non lu / Unread'}
            </span>
          </div>
        </div>

        {SECTIONS.map((section) => {
          const populated = section.fields.filter(([key]) => row[key]);
          if (!populated.length) return null;
          return (
            <div key={section.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{section.title}</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {populated.map(([key, label]) => (
                  <div key={key} className="px-6 py-3 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                      <div className="text-sm text-gray-900 whitespace-pre-wrap">{row[key]}</div>
                    </div>
                    <CopyField value={String(row[key])} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
