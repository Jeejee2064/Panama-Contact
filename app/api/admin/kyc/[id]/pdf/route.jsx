import path from 'node:path';
import {
  Document, Page, View, Text, Image, StyleSheet, Font, renderToBuffer,
} from '@react-pdf/renderer';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  sectionsForType, SHARED_DECLARATION_FIELDS, REFERENCE_FIELDS, BENEFICIAL_OWNER_FIELDS,
} from '@/data/kyc-fields';

Font.register({
  family: 'Gravesend',
  src: path.join(process.cwd(), 'public/fonts/gravesend.otf'),
});

const LOGO_PATH = path.join(process.cwd(), 'public/logo-blanc-fond-trans.png');

const styles = StyleSheet.create({
  page: { paddingBottom: 36, fontSize: 9, fontFamily: 'Helvetica', color: '#324158' },
  header: {
    backgroundColor: '#1e2b3a', paddingVertical: 16, paddingHorizontal: 24,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  logo: { width: 90, height: 60 },
  headerText: { textAlign: 'right' },
  headerTitle: { fontSize: 13, fontFamily: 'Gravesend', color: '#fff' },
  headerSubtitle: { fontSize: 9, color: '#FF491A', marginTop: 4 },
  body: { paddingHorizontal: 24, paddingTop: 16 },
  sectionTitle: {
    fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#FF491A', textTransform: 'uppercase',
    letterSpacing: 1, marginTop: 14, marginBottom: 6, borderBottomWidth: 1,
    borderBottomColor: '#eeeeee', paddingBottom: 4,
  },
  subLabel: { fontSize: 8, color: '#999999', marginBottom: 2 },
  row: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0', paddingVertical: 5 },
  label: { width: '40%', paddingRight: 16, color: '#999999', fontSize: 8 },
  value: { width: '60%', color: '#1a1a1a', fontSize: 9 },
  signatureBlock: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, paddingHorizontal: 24 },
  signatureLine: { borderTopWidth: 1, borderTopColor: '#324158', width: 220, paddingTop: 4 },
  signatureLabel: { fontSize: 8, color: '#666666', textAlign: 'center' },
  footer: { backgroundColor: '#1e2b3a', paddingVertical: 14, alignItems: 'center', marginTop: 30 },
  footerLogo: { width: 70, height: 47 },
  pageNumber: {
    position: 'absolute', bottom: 14, left: 0, right: 0,
    textAlign: 'center', fontSize: 8, color: '#999999',
  },
});

function Header({ title, subtitle }) {
  return (
    <View style={styles.header}>
      {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer Image, not a DOM <img> */}
      <Image src={LOGO_PATH} style={styles.logo} />
      <View style={styles.headerText}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

function Footer() {
  return (
    <View style={styles.footer}>
      {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer Image, not a DOM <img> */}
      <Image src={LOGO_PATH} style={styles.footerLogo} />
    </View>
  );
}

function FieldRow({ label, value }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{Array.isArray(value) ? value.join(', ') : String(value)}</Text>
    </View>
  );
}

function SignatureBlock() {
  return (
    <View style={styles.signatureBlock} wrap={false}>
      <View style={styles.signatureLine}>
        <Text style={styles.signatureLabel}>Firma del cliente / Client signature</Text>
      </View>
      <View style={styles.signatureLine}>
        <Text style={styles.signatureLabel}>Fecha / Date</Text>
      </View>
    </View>
  );
}

function KycDocument({ row }) {
  const sections = sectionsForType(row.client_type);
  const owners = row.client_type === 'legal' && Array.isArray(row.le_beneficial_owners) ? row.le_beneficial_owners : [];
  const refs = Array.isArray(row.reference_contacts) ? row.reference_contacts : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Header
          title={`Formulario KYC (${row.client_type === 'legal' ? 'Empresa' : 'Persona Natural'})`}
          subtitle={row.display_name}
        />
        <View style={styles.body}>
          {sections.map((section) => {
            const populated = section.fields.filter((f) => {
              const v = row[f.name];
              return Array.isArray(v) ? v.length > 0 : v !== null && v !== undefined && v !== '';
            });
            if (!populated.length) return null;
            return (
              <View key={section.title} wrap={false}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {populated.map((f) => <FieldRow key={f.name} label={f.label} value={row[f.name]} />)}
              </View>
            );
          })}

          {owners.length > 0 && (
            <View wrap={false}>
              <Text style={styles.sectionTitle}>Beneficiarios finales / Beneficial Owners</Text>
              {owners.map((owner, i) => (
                <View key={i} style={{ marginBottom: 6 }}>
                  <Text style={styles.subLabel}>Beneficiario {i + 1} / Owner {i + 1}</Text>
                  {BENEFICIAL_OWNER_FIELDS.map(([key, label]) => (
                    <FieldRow key={key} label={label} value={owner[key]} />
                  ))}
                </View>
              ))}
            </View>
          )}

          <View wrap={false}>
            <Text style={styles.sectionTitle}>Forma de pago y declaración / Payment &amp; Declaration</Text>
            {SHARED_DECLARATION_FIELDS.filter((f) => row[f.name]).map((f) => (
              <FieldRow key={f.name} label={f.label} value={row[f.name]} />
            ))}
          </View>

          {refs.length > 0 && (
            <View wrap={false}>
              <Text style={styles.sectionTitle}>Referencias / References</Text>
              {refs.map((ref, i) => (
                <View key={i} style={{ marginBottom: 6 }}>
                  <Text style={styles.subLabel}>Referencia {i + 1} / Reference {i + 1}</Text>
                  {REFERENCE_FIELDS.map(([key, label]) => (
                    <FieldRow key={key} label={label} value={ref[key]} />
                  ))}
                </View>
              ))}
            </View>
          )}

          <View wrap={false}>
            <Text style={styles.sectionTitle}>Declaración final / Final Declaration</Text>
            <FieldRow label="Firma (nombre completo) / Signature (full name)" value={row.signature_full_name} />
          </View>
        </View>

        <SignatureBlock />
        <Footer />
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}

function safeFilename(name) {
  return (name || 'documento').replace(/[^a-zA-Z0-9 _-]/g, '').trim() || 'documento';
}

export async function GET(request, { params }) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { data: row } = await supabase
    .from('kyc_submissions')
    .select('*')
    .eq('id', id)
    .single();

  if (!row) return new Response('Not found', { status: 404 });

  const buffer = await renderToBuffer(<KycDocument row={row} />);

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="KYC-${safeFilename(row.display_name)}.pdf"`,
    },
  });
}
