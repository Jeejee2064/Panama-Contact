import path from 'node:path';
import {
  View, Text, Image, Svg, Path, StyleSheet, Font,
} from '@react-pdf/renderer';

// Visual primitives that reproduce the Panama Contact Due Diligence PDF templates
// (US Legal page, Liberation Sans, slate section bars, light-blue fill-in fields).

const FONT_DIR = path.join(process.cwd(), 'public/fonts');
Font.register({
  family: 'Liberation',
  fonts: [
    { src: path.join(FONT_DIR, 'LiberationSans-Regular.ttf') },
    { src: path.join(FONT_DIR, 'LiberationSans-Bold.ttf'), fontWeight: 'bold' },
    { src: path.join(FONT_DIR, 'LiberationSans-Italic.ttf'), fontStyle: 'italic' },
    { src: path.join(FONT_DIR, 'LiberationSans-BoldItalic.ttf'), fontWeight: 'bold', fontStyle: 'italic' },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

export const LOGO_PATH = path.join(process.cwd(), 'public/kyc-pdf-logo.jpg');

export const C = {
  orange: '#EA542F',
  slate: '#344E65',
  gray: '#5E6E7E',
  fill: '#F5F9FF',
  border: '#BCC6D0',
  panel: '#EEF2F5',
  text: '#1F2D3A',
};

const BORDER = 0.6;

const s = StyleSheet.create({
  page: {
    fontFamily: 'Liberation', fontSize: 8, color: C.text,
    paddingTop: 36, paddingBottom: 50, paddingHorizontal: 45,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  logo: { width: 99, height: 65.5, marginTop: -2 },
  titleBlock: { alignItems: 'flex-end', marginTop: 14 },
  title: { fontSize: 15, fontWeight: 'bold', color: C.slate },
  subtitle: { fontSize: 10.5, fontWeight: 'bold', color: C.orange, marginTop: 1 },
  law: { fontSize: 7.5, color: C.gray, marginTop: 2 },
  rule: { height: 2.2, backgroundColor: C.orange, marginTop: 13 },
  intro: {
    backgroundColor: C.panel, borderLeftWidth: 2.2, borderLeftColor: C.orange,
    paddingVertical: 8, paddingHorizontal: 10, marginTop: 10,
  },
  introText: { fontSize: 8, lineHeight: 1.3 },
  introNote: { fontSize: 8, fontStyle: 'italic', color: C.gray, marginTop: 3, lineHeight: 1.3 },
  bar: {
    backgroundColor: C.slate, borderTopLeftRadius: 2, borderTopRightRadius: 2,
    paddingVertical: 4.5, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'baseline',
  },
  barNum: { color: '#F0846A', fontWeight: 'bold', fontSize: 9, width: 17 },
  barTitle: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 9 },
  barNote: { color: '#D5DDE5', fontSize: 7, fontStyle: 'italic', marginLeft: 6, flex: 1 },
  subHeading: {
    fontSize: 7.2, fontWeight: 'bold', color: C.slate, paddingBottom: 2.5,
    borderBottomWidth: 0.8, borderBottomColor: C.orange, marginBottom: 2.5,
  },
  table: { borderWidth: BORDER, borderColor: C.border },
  row: { flexDirection: 'row' },
  cell: { padding: 2, borderLeftWidth: BORDER, borderLeftColor: C.border, minWidth: 0 },
  label: { fontSize: 6.3, fontWeight: 'bold', color: C.gray, textTransform: 'uppercase', padding: 1, paddingBottom: 1.5 },
  valueBox: { backgroundColor: C.fill, minHeight: 12, paddingHorizontal: 3, paddingVertical: 1.5, justifyContent: 'center' },
  value: { fontSize: 8, color: C.text, lineHeight: 1.25 },
  check: { flexDirection: 'row', alignItems: 'center', marginRight: 9 },
  box: { flexShrink: 0, width: 6.8, height: 6.8, borderWidth: 0.7, borderColor: C.gray, marginRight: 3, backgroundColor: '#FFFFFF' },
  checkLabel: { fontSize: 8, color: C.text },
  footer: {
    position: 'absolute', bottom: 22, left: 45, right: 45, borderTopWidth: BORDER, borderTopColor: C.border,
    paddingTop: 5, flexDirection: 'row', justifyContent: 'space-between',
  },
  footerText: { fontSize: 6.8, color: C.gray },
});

export const styles = s;

export function Header({ t, type }) {
  return (
    <View>
      <View style={s.headerRow}>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer Image, not a DOM <img> */}
        <Image src={LOGO_PATH} style={s.logo} />
        <View style={s.titleBlock}>
          <Text style={s.title}>{t.formTitle}</Text>
          <Text style={s.subtitle}>{t[`${type}_subtitle`]}</Text>
          <Text style={s.law}>{t.law}</Text>
        </View>
      </View>
      <View style={s.rule} />
      <View style={s.intro}>
        <Text style={s.introText}>{t.intro}</Text>
        <Text style={s.introNote}>
          <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>{t.note}</Text>
          {t[`${type}_noteText`]}
        </Text>
      </View>
    </View>
  );
}

export function Footer({ t, type }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>
        <Text style={{ color: C.orange, fontWeight: 'bold' }}>Panama Contact</Text>
        {` · ${t.footerName} · ${t[`${type}_footerType`]} · ${t.confidential}`}
      </Text>
      <Text
        style={{ ...s.footerText, fontSize: 7.5 }}
        render={({ subPageNumber, subPageTotalPages }) => t.page(subPageNumber, subPageTotalPages)}
      />
    </View>
  );
}

export function SectionBar({ num, title, note }) {
  return (
    <View style={[s.bar, { marginTop: 14 }]} minPresenceAhead={44}>
      <Text style={s.barNum}>{num}</Text>
      <Text style={s.barTitle}>{title}</Text>
      {note ? <Text style={s.barNote}>{note}</Text> : null}
    </View>
  );
}

export function SubHeading({ children }) {
  return <Text style={[s.subHeading, { marginTop: 13 }]} minPresenceAhead={50}>{children}</Text>;
}

// A bordered table. When it follows a SectionBar it has no top border/gap (flush with the bar).
export function Table({ children, flush, style }) {
  return (
    <View style={[s.table, flush && { borderTopWidth: 0 }, style]}>{children}</View>
  );
}

// `row` cells never split across pages; cells in a row are laid out with flex weights.
export function Row({ children, first, style }) {
  return (
    <View
      style={[s.row, !first && { borderTopWidth: BORDER, borderTopColor: C.border }, style]}
      wrap={false}
    >
      {children}
    </View>
  );
}

export function Cell({ label, children, flex = 1, first, style }) {
  return (
    <View style={[s.cell, { flex }, first && { borderLeftWidth: 0 }, style]}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      {children}
    </View>
  );
}

export function Field({ label, value, flex, first, minHeight, style }) {
  const text = value === undefined || value === null ? '' : String(value);
  return (
    <Cell label={label} flex={flex} first={first} style={style}>
      <View style={[s.valueBox, minHeight ? { minHeight, justifyContent: 'flex-start' } : null]}>
        <Text style={s.value}>{text}</Text>
      </View>
    </Cell>
  );
}

function Tick() {
  return (
    <Svg width={6.8} height={6.8} viewBox="0 0 10 10" style={{ position: 'absolute', top: -0.6, left: -0.6 }}>
      <Path d="M1.6 5.4 L4 7.8 L8.6 2" stroke={C.orange} strokeWidth={1.7} fill="none" />
    </Svg>
  );
}

export function Check({ on, label }) {
  return (
    <View style={s.check}>
      <View style={s.box}>{on ? <Tick /> : null}</View>
      {label ? <Text style={s.checkLabel}>{label}</Text> : null}
    </View>
  );
}

export function CheckRow({ items, style }) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }, style]}>
      {items.map((it) => <Check key={it.label} on={it.on} label={it.label} />)}
    </View>
  );
}

// Cell with a label and a row of checkboxes underneath (gender, "listed on stock exchange"...).
export function ChoiceCell({ label, items, flex, first }) {
  return (
    <Cell label={label} flex={flex} first={first}>
      <View style={{ paddingLeft: 1.5, paddingTop: 1.5, paddingBottom: 1.5 }}>
        <CheckRow items={items} />
      </View>
    </Cell>
  );
}

// "LABEL: ☐ a ☐ b ☐ c" on one line (payment method, source of funds, annual income...).
export function InlineChoice({ label, items, trailing }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5, paddingVertical: 6, flexWrap: 'wrap' }} wrap={false}>
      <Text style={{ fontSize: 7.4, fontWeight: 'bold', color: C.gray, textTransform: 'uppercase', marginRight: 5 }}>{label}:</Text>
      <CheckRow items={items} />
      {trailing}
    </View>
  );
}

// Question on the left, Yes/No on the right (affidavit, PEP, tax questions).
export function QuestionRow({ question, items, first, extra, split = [3, 2] }) {
  return (
    <Row first={first}>
      <Cell flex={split[0]} first style={{ justifyContent: 'center', padding: 4 }}>
        <Text style={{ fontSize: 7.6, lineHeight: 1.25, color: C.text }}>{question}</Text>
      </Cell>
      <Cell flex={split[1]} style={{ justifyContent: 'center' }}>
        <CheckRow items={items} style={{ paddingLeft: 2 }} />
        {extra}
      </Cell>
    </Row>
  );
}

export function Declaration({ on, text, first }) {
  return (
    <Row first={first}>
      <View style={{ width: 28, backgroundColor: '#F8F9FB', justifyContent: 'center', alignItems: 'center', borderRightWidth: BORDER, borderRightColor: C.border }}>
        <Check on={on} />
      </View>
      <View style={{ flex: 1, padding: 4 }}>
        <Text style={{ fontSize: 7.2, lineHeight: 1.25 }}>{text}</Text>
      </View>
    </Row>
  );
}

export function YesNo(t, value) {
  return [
    { label: t.yes, on: value === 'Sí' },
    { label: t.no, on: value === 'No' },
  ];
}

export function RefsTable({ t, refs, phoneLabel }) {
  const widths = [243, 149, 139, 196];
  const cols = [t.refName, t.refRelationship, phoneLabel || t.refPhone, t.refEmail];
  const rows = Array.from({ length: Math.max(6, refs.length) }, (_, i) => refs[i] || {});
  return (
    <Table flush>
      <Row first style={{ backgroundColor: C.panel }}>
        {cols.map((c, i) => <Cell key={c} label={c} flex={widths[i]} first={i === 0} style={{ padding: 2.5 }} />)}
      </Row>
      {rows.map((r, i) => (
        <Row key={i}>
          <Cell flex={widths[0]} first>
            <View style={[s.valueBox, { flexDirection: 'row', alignItems: 'center' }]}>
              <Text style={{ fontSize: 7.2, color: C.gray, width: 10 }}>{i + 1}.</Text>
              <Text style={s.value}>{r.name || ''}</Text>
            </View>
          </Cell>
          <Field flex={widths[1]} value={r.relationship} />
          <Field flex={widths[2]} value={r.phone} />
          <Field flex={widths[3]} value={r.email} />
        </Row>
      ))}
    </Table>
  );
}

export function PepSection({ t, num, values, p }) {
  const yn = values[`${p}_is_pep_yn`];
  const cat = values[`${p}_pep_category`];
  return (
    <View>
      <SectionBar num={num} title={t.pepTitle} />
      <View style={{ backgroundColor: C.panel, padding: 6, paddingHorizontal: 8 }} wrap={false}>
        {[t.pepDef, t.pepFamily, t.pepAssoc].map(([head, body], i) => (
          <Text key={head} style={{ fontSize: 6.8, lineHeight: 1.3, marginTop: i ? 3 : 0 }}>
            <Text style={{ fontWeight: 'bold', color: C.slate }}>{head}</Text>{body}
          </Text>
        ))}
      </View>
      <View style={{ height: 10 }} />
      <Table>
        <QuestionRow first question={t.pepQ1} items={YesNo(t, yn)} split={[2, 3]} />
        <QuestionRow
          question={t.pepQ2}
          split={[2, 3]}
          items={[
            { label: t.pepFigure, on: cat === 'Figura politica' },
            { label: t.pepCloseFamily, on: cat === 'Familiar cercano' },
            { label: t.pepCloseAssoc, on: cat === 'Asociado cercano' },
          ]}
        />
        <QuestionRow question={t.pepQ3} split={[2, 3]} items={YesNo(t, values[`${p}_pep_separated_24m_yn`])} />
      </Table>
      <View style={{ height: 10 }} />
      <Table>
        <Row first>
          <Field first flex={2} label={t.pepCurrent} value={values[`${p}_pep_current_position`]} />
          <Field flex={1} label={t.date} value={fmtDate(values[`${p}_pep_current_position_date`])} />
          <Field flex={2} label={t.pepPrevious} value={values[`${p}_pep_previous_position`]} />
          <Field flex={1} label={t.date} value={fmtDate(values[`${p}_pep_previous_position_date`])} />
        </Row>
      </Table>
    </View>
  );
}

export function DocsSection({ t, num, items, keys, uploaded, split }) {
  const left = items.slice(0, split);
  const right = items.slice(split);
  const col = (list, offset) => list.map((label, i) => (
    <View key={label} style={{ flexDirection: 'row', marginBottom: 4, paddingRight: 10 }}>
      <Check on={uploaded.has(keys[offset + i])} />
      <Text style={{ fontSize: 7.4, lineHeight: 1.25, flex: 1 }}>{label}</Text>
    </View>
  ));
  return (
    <View wrap={false}>
      <SectionBar num={num} title={t.docsTitle} />
      <View style={{ flexDirection: 'row', paddingTop: 5 }}>
        <View style={{ flex: 1 }}>{col(left, 0)}</View>
        <View style={{ flex: 1 }}>{col(right, split)}</View>
      </View>
    </View>
  );
}

// Left blank on purpose: the client signs and dates the printed form by hand.
export function SignatureBlock({ t, label }) {
  const line = (flex, text) => (
    <View style={{ flex }}>
      <View style={{ backgroundColor: C.fill, height: 26 }} />
      <View style={{ borderTopWidth: 1, borderTopColor: C.text }} />
      <Text style={{ fontSize: 6.3, fontWeight: 'bold', color: C.gray, textTransform: 'uppercase', marginTop: 3 }}>{text}</Text>
    </View>
  );
  return (
    <View style={{ flexDirection: 'row', marginTop: 34 }} wrap={false}>
      {line(430, label)}
      <View style={{ flex: 40 }} />
      {line(222, t.date)}
    </View>
  );
}

export function fmtDate(v) {
  if (!v) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v));
  return m ? `${m[3]}/${m[2]}/${m[1]}` : String(v);
}

// Old submissions used six income brackets; map every stored value onto the three printed on the form.
export function incomeBracket(v) {
  if (!v) return null;
  if (v === 'Menos de $10,000') return 'low';
  if (v === '$10,000 - $30,000') return 'mid';
  return 'high';
}

export function incomeItems(t, v) {
  const b = incomeBracket(v);
  return [
    { label: t.incomeLow, on: b === 'low' },
    { label: t.incomeMid, on: b === 'mid' },
    { label: t.incomeHigh, on: b === 'high' },
  ];
}

export const incomeText = (t, v) => ({ low: t.incomeLow, mid: t.incomeMid, high: t.incomeHigh }[incomeBracket(v)] || '');

export const pageStyle = s.page;
