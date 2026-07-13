import path from 'node:path';
import {
  Document, Page, View, Text, Image, StyleSheet, Font,
} from '@react-pdf/renderer';

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
  paragraph: { fontSize: 9.5, lineHeight: 1.5, color: '#324158', marginBottom: 6 },
  row: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0', paddingVertical: 5 },
  label: { width: '50%', paddingRight: 16, color: '#999999', fontSize: 8 },
  value: { width: '50%', color: '#1a1a1a', fontSize: 9 },
  resultBox: {
    backgroundColor: '#fff3ef', borderWidth: 1, borderColor: '#FF491A', borderRadius: 4,
    padding: 14, marginTop: 4, marginBottom: 10,
  },
  resultHeadline: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#FF491A', marginBottom: 4 },
  recommendationItem: { fontSize: 9.5, lineHeight: 1.5, marginBottom: 4 },
  pageNumber: {
    position: 'absolute', bottom: 14, left: 0, right: 0,
    textAlign: 'center', fontSize: 8, color: '#999999',
  },
  disclaimer: { fontSize: 7.5, color: '#999999', lineHeight: 1.4, marginTop: 20 },
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

function currency(value) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function CalculatorResultTable({ result }) {
  if (!result) return null;
  const rows = [
    ['Taxable income', currency(result.taxableIncome)],
    ['Estimated ISR (income tax)', currency(result.tax)],
    ['Effective tax rate', `${(result.effectiveRate * 100).toFixed(1)}%`],
    ['Net annual income', currency(result.netAnnual)],
    ['Net monthly income', currency(result.netMonthly)],
  ];
  return (
    <View wrap={false}>
      <Text style={styles.sectionTitle}>Tax estimate breakdown</Text>
      {rows.map(([label, value]) => (
        <View key={label} style={styles.row}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

function DeductionsComparisonTable({ result }) {
  if (!result || !result.deductions || result.deductions.total <= 0) return null;
  const rows = [
    ['Tax without deductions', currency(result.comparison.taxWithoutDeductions)],
    ['Tax with your deductions', currency(result.comparison.taxWithDeductions)],
    ['You save', currency(result.comparison.savings)],
  ];
  return (
    <View wrap={false}>
      <Text style={styles.sectionTitle}>Your deductions savings</Text>
      {rows.map(([label, value]) => (
        <View key={label} style={styles.row}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

function BracketBreakdownTable({ rows }) {
  if (!rows || rows.length === 0) return null;
  return (
    <View wrap={false}>
      <Text style={styles.sectionTitle}>How your tax was calculated</Text>
      {rows.map((row) => (
        <View key={row.min} style={styles.row}>
          <Text style={styles.label}>
            {currency(row.min)} – {row.max !== null ? currency(row.max) : 'and above'} ({(row.rate * 100).toFixed(0)}%)
          </Text>
          <Text style={styles.value}>{currency(row.taxForBracket)}</Text>
        </View>
      ))}
    </View>
  );
}

export default function TaxReportDocument({
  generatedAt,
  summaryItems = [],
  resultHeadline,
  resultBody,
  calculatorResult,
  bracketBreakdown,
  recommendations = [],
  disclaimer,
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Header title="Your Personalized Panama Tax Report" />

        <View style={styles.body}>
          <View wrap={false}>
            <Text style={styles.paragraph}>
              This report was generated on {generatedAt} based on the information you provided. It is an
              estimate only — see the disclaimer on the last page.
            </Text>
          </View>

          {resultHeadline && (
            <View style={styles.resultBox} wrap={false}>
              <Text style={styles.resultHeadline}>{resultHeadline}</Text>
              {resultBody && <Text style={styles.paragraph}>{resultBody}</Text>}
            </View>
          )}

          <CalculatorResultTable result={calculatorResult} />
          <DeductionsComparisonTable result={calculatorResult} />
          <BracketBreakdownTable rows={bracketBreakdown} />

          {calculatorResult && (
            <View wrap={false}>
              <Text style={styles.sectionTitle}>Not included in this estimate</Text>
              <Text style={styles.paragraph}>
                This is an income tax (ISR) estimate only. It doesn&apos;t include Social Security
                contributions (CSS) or the ITBMS sales tax, which are calculated separately under
                different rules.
              </Text>
            </View>
          )}

          {summaryItems.length > 0 && (
            <View wrap={false}>
              <Text style={styles.sectionTitle}>Summary of your answers</Text>
              {summaryItems.map(({ label, value }) => (
                <View key={label} style={styles.row}>
                  <Text style={styles.label}>{label}</Text>
                  <Text style={styles.value}>{String(value)}</Text>
                </View>
              ))}
            </View>
          )}

          <View wrap={false}>
            <Text style={styles.sectionTitle}>Panama&apos;s territorial tax system</Text>
            <Text style={styles.paragraph}>
              Panama taxes individuals only on Panamanian-source income. Foreign-source income —
              earned outside Panama, from a foreign employer, foreign clients, or foreign investments —
              is generally exempt from Panamanian income tax, regardless of where you live.
            </Text>
          </View>

          {recommendations.length > 0 && (
            <View wrap={false}>
              <Text style={styles.sectionTitle}>Personalized recommendations</Text>
              {recommendations.map((rec) => (
                <Text key={rec} style={styles.recommendationItem}>• {rec}</Text>
              ))}
            </View>
          )}

          <View wrap={false}>
            <Text style={styles.sectionTitle}>Next steps</Text>
            <Text style={styles.paragraph}>
              Book a free 30-minute consultation with our team to review your specific situation and
              get tailored guidance on residency, company formation, and tax compliance in Panama.
            </Text>
          </View>

          <View wrap={false}>
            <Text style={styles.sectionTitle}>Disclaimer</Text>
            <Text style={styles.disclaimer}>{disclaimer}</Text>
          </View>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
}
