import path from 'node:path';
import {
  Document, Page, View, Text, Image, StyleSheet, Font, renderToBuffer,
} from '@react-pdf/renderer';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { SECTIONS } from '@/data/immigration-fields';

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
    <View style={styles.signatureBlock}>
      <View style={styles.signatureLine}>
        <Text style={styles.signatureLabel}>Firma del cliente / Client signature</Text>
      </View>
      <View style={styles.signatureLine}>
        <Text style={styles.signatureLabel}>Fecha / Date</Text>
      </View>
    </View>
  );
}

function ImmigracionDocument({ row }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Header
          title="Cuestionario de Inmigración"
          subtitle={`${row.apellidos}, ${row.primer_y_segundo_nombre}`}
        />
        <View style={styles.body}>
          {SECTIONS.map((section) => {
            const populated = section.fields.filter(([key]) => row[key]);
            if (!populated.length) return null;
            return (
              <View key={section.title}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {populated.map(([key, label]) => (
                  <FieldRow key={key} label={label} value={row[key]} />
                ))}
              </View>
            );
          })}
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
    .from('immigration_submissions')
    .select('*')
    .eq('id', id)
    .single();

  if (!row) return new Response('Not found', { status: 404 });

  const buffer = await renderToBuffer(<ImmigracionDocument row={row} />);

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="Inmigracion-${safeFilename(`${row.apellidos} ${row.primer_y_segundo_nombre}`)}.pdf"`,
    },
  });
}
