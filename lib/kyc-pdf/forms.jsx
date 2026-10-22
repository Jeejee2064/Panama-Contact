import { Page, View, Text } from '@react-pdf/renderer';
import { STRINGS } from './strings';
import {
  C, styles, pageStyle, Header, Footer, SectionBar, SubHeading, Table, Row, Cell, Field,
  ChoiceCell, InlineChoice, QuestionRow, Declaration, RefsTable, PepSection, DocsSection,
  SignatureBlock, YesNo, fmtDate, incomeItems, incomeText,
} from './primitives';

const NP_DOC_KEYS = ['id_passport_copy', 'work_letter', 'bank_reference_letter', 'tax_return_or_financials', 'proof_of_domicile'];
const LE_DOC_KEYS = ['crp_certificate', 'board_id_copies', 'bank_reference_letter', 'tax_return_or_financials', 'stock_certificate', 'stock_book', 'rubf_proof'];

const gap = (h = 10) => <View style={{ height: h }} />;

function paymentItems(t, row) {
  return [
    { label: t.cash, on: row.payment_method === 'Efectivo' },
    { label: t.check, on: row.payment_method === 'Cheque' },
    { label: t.other, on: row.payment_method === 'Otro' },
  ];
}

function context(row, lang) {
  const t = STRINGS[lang];
  return {
    t,
    refs: Array.isArray(row.reference_contacts) ? row.reference_contacts : [],
    uploaded: new Set((Array.isArray(row.documents) ? row.documents : []).map((d) => d.key)),
    marital: (v) => t.marital[v] || v || '',
  };
}

export function NaturalPersonPage({ row, lang }) {
  const { t, refs, uploaded, marital } = context(row, lang);
  const sources = row.np_source_of_funds || [];
  const otherSource = sources.includes('Otro');
  const sourceLabel = (key, label) => ({ label, on: sources.includes(key) });

  return (
    <Page size={[612, 1008]} style={pageStyle}>
      <Header t={t} type="np" />
      <Footer t={t} type="np" />

      {/* 01 GENERAL DATA */}
      <SectionBar num="01" title={t.np_generalData} />
      <Table flush>
        <Row first>
          <Field first label={t.np_name} value={row.np_name_surname} />
          <Field label={t.np_idCard} value={row.np_id_card} />
          <Field label={t.np_passportNo} value={row.np_passport_no} />
        </Row>
        <Row>
          <Field first label={t.np_passportIssue} value={fmtDate(row.np_passport_issue_date)} />
          <Field label={t.np_passportCountry} value={row.np_passport_issuing_country} />
          <Field label={t.np_passportExpiry} value={fmtDate(row.np_passport_expiration_date)} />
        </Row>
        <Row>
          <Field first label={t.np_dob} value={fmtDate(row.np_date_of_birth)} />
          <Field label={t.np_countryOfBirth} value={row.np_country_of_birth} />
          <Field label={t.nationality} value={row.np_nationality} />
        </Row>
        <Row>
          <ChoiceCell
            first
            label={t.gender}
            items={[{ label: t.F, on: row.np_gender === 'Femenino' }, { label: t.M, on: row.np_gender === 'Masculino' }]}
          />
          <Field label={t.maritalStatus} value={marital(row.np_marital_status)} />
          <Field label={t.np_countryOfResidence} value={row.np_country_of_residence} />
        </Row>
        <Row>
          <Field first flex={4} label={t.np_address} value={row.np_residential_address} />
          <Field flex={1} label={t.np_country} value={row.np_residential_country} />
          <Field flex={1} label={t.np_poBox} value={row.np_po_box} />
        </Row>
        <Row>
          <Field first label={t.email} value={row.np_personal_email} />
          <Field label={t.phone} value={row.np_personal_phone} />
          <Field label={t.cellphone} value={row.np_personal_cellphone} />
        </Row>
      </Table>

      <SubHeading>{t.np_employment}</SubHeading>
      <Table>
        <Row first>
          <Field first flex={3} label={t.np_occupation} value={row.np_occupation_profession} />
          <Field flex={3} label={t.np_employer} value={row.np_employer_company} />
        </Row>
        <Row><Field first label={t.np_workAddress} value={row.np_employer_work_address} /></Row>
        <Row>
          <Field first label={t.np_phone1} value={row.np_employer_phone_1} />
          <Field label={t.np_phone2} value={row.np_employer_phone_2} />
          <Field label={t.np_cell} value={row.np_employer_cellphone} />
        </Row>
        <Row><Field first label={t.np_workEmail} value={row.np_employer_work_email} /></Row>
      </Table>

      {/* 02 PAYMENT METHOD */}
      <SectionBar num="02" title={t.np_paymentTitle} />
      <Table flush>
        <Row first>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, padding: 5 }}>
            <InlineChoice label={t.paymentMethod} items={paymentItems(t, row)} />
            <Text style={{ fontSize: 7.4, color: C.gray, marginRight: 4 }}>{t.pleaseSpecify}</Text>
            <View style={[styles.valueBox, { flex: 1 }]}><Text style={styles.value}>{row.payment_method_other || ''}</Text></View>
          </View>
        </Row>
      </Table>

      {/* 03 AFFIDAVIT */}
      <SectionBar num="03" title={t.np_affidavit} />
      <Table flush>
        <QuestionRow first question={t.np_amlQ} items={YesNo(t, row.aml_investigation_yn)} />
        <QuestionRow question={t.np_intermediaryQ} items={YesNo(t, row.np_intermediary_third_party_yn)} />
      </Table>
      <SubHeading>{t.np_ifAffirmative}</SubHeading>
      <Table>
        <Row first>
          <Field first flex={4} label={t.np_beneficiary} value={row.np_beneficiary_name} />
          <Field flex={2} label={t.np_beneficiaryId} value={row.np_beneficiary_id_passport} />
        </Row>
      </Table>
      <Text style={{ fontSize: 7.8, fontStyle: 'italic', color: C.text, lineHeight: 1.45, textAlign: 'justify', marginTop: 13 }}>
        {t.np_affidavitText}
      </Text>

      {/* 04 SOURCE OF ASSETS */}
      <SectionBar num="04" title={t.np_sourceTitle} />
      <Table flush>
        <Row first>
          <InlineChoice
            label={t.np_sourceOfFunds}
            items={[
              sourceLabel('Negocio propio', t.np_ownBusiness),
              sourceLabel('Herencia', t.np_inheritance),
              sourceLabel('Venta de propiedad', t.np_saleOfProperty),
              sourceLabel('Asalariado', t.np_salaried),
              { label: t.other, on: otherSource },
            ]}
            trailing={otherSource && row.np_source_of_funds_other
              ? <Text style={{ fontSize: 7.6 }}>({row.np_source_of_funds_other})</Text> : null}
          />
        </Row>
      </Table>
      {gap(14)}
      <Table>
        <Row first>
          <Field first label={t.np_companyName} value={row.np_source_company_name} />
          <Field label={t.np_companyAddress} value={row.np_source_company_address} />
          <Field label={t.np_companyPhone} value={row.np_source_company_phone} />
        </Row>
        <Row>
          <Field first flex={3} label={t.np_products} value={row.np_source_products_services} />
          <Field flex={3} label={t.np_companyEmail} value={row.np_source_company_email} />
        </Row>
        <Row>
          <Field first label={t.np_activityDescription} value={row.np_source_activity_description} minHeight={42} />
        </Row>
      </Table>

      {/* Page 2 */}
      <View break>
        <Table>
          <Row first><Field first label={t.countryOfOrigin} value={row.country_of_origin_resources} /></Row>
        </Table>
      </View>

      <SectionBar num="05" title={t.np_financialTitle} />
      <Table flush>
        <Row first>
          <InlineChoice label={t.annualIncome} items={incomeItems(t, row.np_annual_income_range)} />
        </Row>
      </Table>
      <SubHeading>{t.np_nonOperational}</SubHeading>
      <Table>
        <Row first><Field first label={t.np_activity} value={row.np_non_operational_income_activity} /></Row>
        <Row>
          <ChoiceCell first label={t.np_incomeRange} items={incomeItems(t, row.np_non_operational_income_range)} />
        </Row>
      </Table>
      {gap(12)}
      <Table>
        <Declaration first on={row.declaration_lawful_resources === true} text={t.declLawful} />
        <Declaration on={row.declaration_no_third_party_deposits === true} text={t.declNoThirdParty} />
      </Table>

      <SectionBar num="06" title={t.refsTitle} note={t.refsNote} />
      <RefsTable t={t} refs={refs} />

      <PepSection t={t} num="07" values={row} p="np" />

      <DocsSection t={t} num="08" items={t.np_docs} keys={NP_DOC_KEYS} uploaded={uploaded} split={3} />
      <SignatureBlock t={t} label={t.signature} />
    </Page>
  );
}

export function LegalEntityPage({ row, lang }) {
  const { t, refs, uploaded, marital } = context(row, lang);
  const owners = Array.isArray(row.le_beneficial_owners) ? row.le_beneficial_owners : [];
  const ownerRows = Array.from({ length: Math.max(4, owners.length) }, (_, i) => owners[i] || {});
  const ownerWidths = [153, 97, 97, 104, 148, 128];
  const ownerKeys = ['full_name', 'id_card', 'date_of_birth', 'nationality', 'address', 'date_acquired_status'];
  const taxType = row.le_taxpayer_type;

  return (
    <Page size={[612, 1008]} style={pageStyle}>
      <Header t={t} type="le" />
      <Footer t={t} type="le" />

      {/* 01 COMPANY */}
      <SectionBar num="01" title={t.le_companyData} />
      <Table flush>
        <Row first>
          <Field first label={t.le_companyName} value={row.le_company_name} />
          <Field label={t.le_taxId} value={row.le_tax_id} />
          <Field label={t.le_registeredOffice} value={row.le_registered_office} />
        </Row>
        <Row>
          <Field first label={t.le_physicalAddress} value={row.le_physical_address} />
          <Field label={t.le_postalAddress} value={row.le_postal_address} />
          <Field label={t.le_telephone} value={row.le_telephone} />
        </Row>
        <Row>
          <Field first flex={2} label={t.le_type} value={row.le_company_type} />
          <Field flex={4} label={t.le_activities} value={row.le_company_activities} />
        </Row>
        <Row>
          <Field first flex={2} label={t.email} value={row.le_email} />
          <ChoiceCell flex={2} label={t.le_listed} items={YesNo(t, row.le_listed_stock_exchange_yn)} />
          <Field flex={2} label={t.le_exchange} value={row.le_stock_exchange_name} />
        </Row>
      </Table>

      <SubHeading>{t.le_officers}</SubHeading>
      <Table>
        <Row first>
          <Field first label={t.le_legalRep} value={row.le_legal_representative} />
          <Field label={t.le_president} value={row.le_president} />
          <Field label={t.le_secretary} value={row.le_secretary} />
        </Row>
        <Row>
          <Field first label={t.le_treasurer} value={row.le_treasurer} />
          <Field label={t.le_proxies} value={row.le_proxies_others} />
          <Field label={t.le_shareholders} value={row.le_shareholders} />
        </Row>
      </Table>

      {/* 02 REPRESENTATIVE */}
      <SectionBar num="02" title={t.le_repTitle} />
      <Table flush>
        <Row first>
          <Field first label={t.le_repName} value={row.le_rep_name_surname} />
          <Field label={t.dateOfBirth} value={fmtDate(row.le_rep_date_of_birth)} />
          <Field label={t.le_placeOfBirth} value={row.le_rep_place_of_birth} />
        </Row>
        <Row>
          <Field first label={t.le_idCard} value={row.le_rep_id_card} />
          <Field label={t.nationality} value={row.le_rep_nationality} />
          <ChoiceCell
            label={t.gender}
            items={[{ label: t.F, on: row.le_rep_gender === 'Femenino' }, { label: t.M, on: row.le_rep_gender === 'Masculino' }]}
          />
        </Row>
        <Row>
          <Field first label={t.le_profession} value={row.le_rep_profession_occupation} />
          <Field label={t.maritalStatus} value={marital(row.le_rep_marital_status)} />
          <Field label={t.email} value={row.le_rep_email} />
        </Row>
        <Row><Field first label={t.le_residence} value={row.le_rep_residence_building_house} /></Row>
        <Row>
          <Field first flex={3} label={t.le_localPhone} value={row.le_rep_local_telephone} />
          <Field flex={3} label={t.le_cell} value={row.le_rep_cell_phone} />
        </Row>
      </Table>

      <SubHeading>{t.le_accountant}</SubHeading>
      <Table>
        <Row first>
          <Field first flex={3} label={t.le_accName} value={row.le_accountant_name} />
          <Field flex={3} label={t.le_accId} value={row.le_accountant_id_license} />
        </Row>
        <Row>
          <Field first flex={3} label={t.le_accEmail} value={row.le_accountant_email} />
          <Field flex={3} label={t.le_accAddress} value={row.le_accountant_address} />
        </Row>
      </Table>
      {gap(12)}
      <Table>
        <QuestionRow first question={t.le_amlQ} items={YesNo(t, row.aml_investigation_yn)} />
      </Table>

      {/* 03 BENEFICIAL OWNERS */}
      <SectionBar num="03" title={t.le_ownersTitle} />
      <Table flush>
        <Row first style={{ backgroundColor: C.panel }}>
          {t.le_ownerCols.map((c, i) => <Cell key={c} label={c} flex={ownerWidths[i]} first={i === 0} />)}
        </Row>
        {ownerRows.map((o, i) => (
          <Row key={i}>
            {ownerKeys.map((k, j) => (
              <Field
                key={k}
                flex={ownerWidths[j]}
                first={j === 0}
                value={k.startsWith('date_') ? fmtDate(o[k]) : o[k]}
                minHeight={20}
              />
            ))}
          </Row>
        ))}
      </Table>

      {/* 04 DECLARATION */}
      <SectionBar num="04" title={t.le_originTitle} />
      <Text style={{ fontSize: 7.8, fontStyle: 'italic', lineHeight: 1.45, textAlign: 'justify', marginTop: 5 }}>
        {t.le_originText}
      </Text>

      {/* Page 2 */}
      <View break>
        <Table>
          <Row first>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, padding: 5 }}>
              <InlineChoice label={t.le_paymentLabel} items={paymentItems(t, row)} />
              <Text style={{ fontSize: 7.4, color: C.gray, marginRight: 4 }}>{t.whichOne}</Text>
              <View style={[styles.valueBox, { flex: 1 }]}><Text style={styles.value}>{row.payment_method_other || ''}</Text></View>
            </View>
          </Row>
        </Table>
      </View>

      <SectionBar num="05" title={t.le_financialTitle} />
      <Table flush>
        <Row first><InlineChoice label={t.annualIncome} items={incomeItems(t, row.le_annual_income_main_activity)} /></Row>
      </Table>
      {gap(12)}
      <Table>
        <Row first>
          <Field first label={t.le_monthlyOp} value={row.le_monthly_operational_income} />
          <Field label={t.le_expenses} value={row.le_expenses} />
          <Field label={t.le_profit} value={row.le_profit} />
        </Row>
        <Row>
          <Field first label={t.le_monthlyNonOp} value={row.le_monthly_non_operational_income} />
          <Field label={t.le_activity} value={row.le_non_operational_activity} />
          <Field label={t.le_incomeRange} value={incomeText(t, row.le_non_operational_income_range)} />
        </Row>
        <Row>
          <Field first flex={4} label={t.le_originAssets} value={row.le_origin_assets_declaration} />
          <Field flex={2} label={t.countryOfOrigin} value={row.country_of_origin_resources} />
        </Row>
      </Table>

      <SubHeading>{t.le_taxInfo}</SubHeading>
      <Table>
        <Row first>
          <InlineChoice
            label={t.le_taxpayerType}
            items={[
              { label: t.le_taxLegal, on: taxType === 'Persona Juridica' },
              { label: t.le_taxPublic, on: taxType === 'Entidad Publica Nacional' },
              { label: t.le_taxNonProfit, on: taxType === 'Asociacion sin fines de lucro' },
              { label: t.le_taxNone, on: taxType === 'No contribuyente' },
            ]}
          />
        </Row>
      </Table>
      {gap(12)}
      <Table>
        <QuestionRow first question={t.le_selfWithholder} items={YesNo(t, row.le_self_withholder_other_income_yn)} />
        <QuestionRow question={t.le_itbms} items={YesNo(t, row.le_itbms_responsible_yn)} />
        <QuestionRow
          question={t.le_otherStates}
          items={YesNo(t, row.le_obligated_taxes_other_states_yn)}
          extra={<WhichOne t={t} value={row.le_obligated_taxes_which_state} />}
        />
      </Table>

      <SubHeading>{t.le_international}</SubHeading>
      <Table>
        <QuestionRow
          first
          question={t.le_foreignCurrency}
          items={YesNo(t, row.le_foreign_currency_operations_yn)}
          extra={<WhichOne t={t} value={row.le_foreign_currency_which} />}
        />
      </Table>

      <SectionBar num="06" title={t.refsTitle} note={t.refsNote} />
      <RefsTable t={t} refs={refs} phoneLabel={t.le_refPhone} />

      <PepSection t={t} num="07" values={row} p="le" />

      <SectionBar num="08" title={t.le_declTitle} />
      <Table flush>
        <Declaration first on={row.declaration_lawful_resources === true} text={t.le_declLawful || t.declLawful} />
        <Declaration on={row.declaration_no_third_party_deposits === true} text={t.le_declNoThirdParty || t.declNoThirdParty} />
      </Table>

      <View break>
        <DocsSection t={t} num="09" items={t.le_docs} keys={LE_DOC_KEYS} uploaded={uploaded} split={5} />
        <SignatureBlock t={t} label={t.le_signature} />
      </View>
    </Page>
  );
}

function WhichOne({ t, value }) {
  return (
    <View style={{ marginTop: 2, paddingLeft: 2 }}>
      <Text style={{ fontSize: 6.8, color: C.gray }}>{t.whichOne}</Text>
      <View style={[styles.valueBox, { marginTop: 1 }]}><Text style={styles.value}>{value || ''}</Text></View>
    </View>
  );
}
