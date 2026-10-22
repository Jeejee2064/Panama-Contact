import { Fragment } from 'react';
import { Document, Page, renderToBuffer } from '@react-pdf/renderer';
import { SECTIONS } from '@/data/immigration-fields';
import {
  pageStyle, Header, Footer, SectionBar, Table, Row, Field, ChoiceCell, QuestionRow,
  SignatureBlock, YesNo, fmtDate,
} from '@/lib/kyc-pdf/primitives';

// Same visual language as the KYC Due Diligence PDF: Spanish form first, then the English one.
// Labels come from data/immigration-fields.js ("Español / English"), so the form stays in sync.

const STRINGS = {
  es: {
    formTitle: 'CUESTIONARIO DE INMIGRACIÓN',
    law: 'Decreto Ley N°3 del 22 de febrero de 2008',
    footerName: 'Cuestionario de Inmigración',
    im_footerType: 'Solicitud de Residencia',
    confidential: 'Confidencial',
    page: (n, total) => `Página ${n} de ${total}`,
    intro: 'Información suministrada por el solicitante para la preparación de su trámite migratorio ante el Servicio Nacional de Migración de Panamá.',
    note: 'Nota:',
    im_noteText: ' Las respuestas deben coincidir con los documentos oficiales del solicitante.',
    yes: 'Sí', no: 'No', M: 'Masculino', F: 'Femenino',
    first: 'Primera vez', renewal: 'Renovación',
    signature: 'Firma del solicitante', date: 'Fecha',
    pick: (l) => l.split(' / ')[0],
  },
  en: {
    formTitle: 'IMMIGRATION QUESTIONNAIRE',
    law: 'Decree Law N°3 of February 22, 2008',
    footerName: 'Immigration Questionnaire',
    im_footerType: 'Residency Application',
    confidential: 'Confidential',
    page: (n, total) => `Page ${n} of ${total}`,
    intro: 'Information provided by the applicant for the preparation of their immigration procedure before Panama\'s National Immigration Service.',
    note: 'Note:',
    im_noteText: ' Answers must match the applicant\'s official documents.',
    yes: 'Yes', no: 'No', M: 'Male', F: 'Female',
    first: 'First time', renewal: 'Renewal',
    signature: 'Applicant signature', date: 'Date',
    pick: (l) => l.slice(l.indexOf(' / ') + 3),
  },
};

const YES_NO_KEYS = new Set([
  'piensa_permanecer_domicilio', 'visitado_panama', 'visa_aprobada', 'visa_negada', 'visa_cancelada_revocada',
  'solicitud_residencia_previa', 'familiares_en_panama', 'contrato_trabajo_panama', 'intencion_estudiar_panama',
  'residencia_legal', 'detenido_condenado', 'negado_entrada_deportacion', 'trafico_personas', 'sustancia_controlada',
  'explotacion_recursos', 'enfermedad_contagiosa', 'prohibiciones_decreto_ley', 'solicitud_llenada_otra_persona',
]);

// Follow-up answers: only printed when filled in.
const OPTIONAL_KEYS = new Set([
  'visitado_panama_tiempo', 'visitado_panama_tipo_visa', 'visa_aprobada_cuando', 'visa_aprobada_donde',
  'visa_aprobada_tipo_visa', 'familiares_en_panama_detalle', 'datos_persona_que_lleno',
  'nombre_persona_responsable', 'direccion_persona_responsable', 'telefono_persona_responsable',
]);

// Not asked on renewals (see app/cuestionario/immigracion/page.jsx).
const FIRST_TIME_ONLY = new Set([
  'estatura', 'color_cabello', 'color_ojos', 'color_piel',
  'puerto_de_entrada', 'pais_de_procedencia', 'compania_transporte', 'fecha_llegada_panama',
]);

const isLong = (label, value) => label.length > 60 || String(value || '').length > 45;

function buildRows(fields, row, t) {
  const rows = [];
  let pending = [];
  const flush = () => {
    for (let i = 0; i < pending.length; i += 2) rows.push({ kind: 'fields', items: pending.slice(i, i + 2) });
    pending = [];
  };

  for (const [key, rawLabel] of fields) {
    const label = t.pick(rawLabel);
    const value = row[key];
    const filled = value !== undefined && value !== null && value !== '';
    if (OPTIONAL_KEYS.has(key) && !filled) continue;
    if (row.tipo_solicitud === 'Renovación' && FIRST_TIME_ONLY.has(key)) continue;
    // Explanations are only relevant when the answer is "Sí".
    if (key.endsWith('_detalle') && !filled) continue;

    if (YES_NO_KEYS.has(key)) {
      flush();
      rows.push({ kind: 'yesno', key, label, value });
    } else if (key === 'tipo_solicitud' || key === 'sexo') {
      flush();
      rows.push({ kind: 'choice', key, label, value });
    } else if (isLong(label, value)) {
      flush();
      rows.push({ kind: 'fields', items: [{ key, label, value }] });
    } else {
      pending.push({ key, label, value });
    }
  }
  flush();
  return rows;
}

function renderRow(r, i, t) {
  const first = i === 0;
  if (r.kind === 'yesno') {
    return <QuestionRow key={r.key} first={first} question={r.label} items={YesNo(t, r.value)} />;
  }
  if (r.kind === 'choice') {
    const items = r.key === 'sexo'
      ? [{ label: t.M, on: r.value === 'Masculino' }, { label: t.F, on: r.value === 'Femenino' }]
      : [{ label: t.first, on: r.value === 'Primera vez' }, { label: t.renewal, on: r.value === 'Renovación' }];
    return (
      <Row key={r.key} first={first}>
        <ChoiceCell first label={r.label} items={items} />
      </Row>
    );
  }
  return (
    <Row key={r.items[0].key} first={first}>
      {r.items.map((it, j) => (
        <Field key={it.key} first={j === 0} label={it.label} value={fmtDate(it.value)} />
      ))}
    </Row>
  );
}

function ImmigrationPage({ row, lang }) {
  const t = { ...STRINGS[lang], im_subtitle: `${row.apellidos || ''}, ${row.primer_y_segundo_nombre || ''}`.toUpperCase() };

  return (
    <Page size={[612, 1008]} style={pageStyle}>
      <Header t={t} type="im" />
      <Footer t={t} type="im" />

      {SECTIONS.map((section, idx) => {
        const rows = buildRows(section.fields, row, t);
        if (!rows.length) return null;
        return (
          <Fragment key={section.title}>
            <SectionBar num={String(idx + 1).padStart(2, '0')} title={t.pick(section.title)} />
            <Table flush>{rows.map((r, i) => renderRow(r, i, t))}</Table>
          </Fragment>
        );
      })}

      <SignatureBlock t={t} label={t.signature} />
    </Page>
  );
}

function ImmigrationPdf({ row }) {
  return (
    <Document title={`Inmigración - ${row.apellidos || ''}`} author="Panama Contact">
      <ImmigrationPage row={row} lang="es" />
      <ImmigrationPage row={row} lang="en" />
    </Document>
  );
}

export function renderImmigrationPdf(row) {
  return renderToBuffer(<ImmigrationPdf row={row} />);
}
