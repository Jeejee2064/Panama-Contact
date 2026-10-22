// Single source of truth for the KYC / Due Diligence questionnaire.
// `required` can be a boolean or a function (values) => boolean — when it's a
// function, it also governs visibility (field is hidden when not required).
// Shared by: app/cuestionario/kyc/page.jsx, app/api/cuestionario/kyc/route.js,
// app/admin/kyc/[id]/page.jsx — change a field once, everywhere stays in sync.

export const YES_NO_OPTIONS = [
  { value: 'Sí', label: 'Sí / Yes' },
  { value: 'No', label: 'No' },
];

export const MARITAL_STATUS_OPTIONS = [
  { value: 'Soltero', label: 'Soltero / Single' },
  { value: 'Casado', label: 'Casado / Married' },
  { value: 'Divorciado', label: 'Divorciado / Divorced' },
  { value: 'Viudo', label: 'Viudo / Widowed' },
  { value: 'Union libre', label: 'Unión libre / Common law' },
];

// Same three brackets as the Due Diligence PDF forms. Older submissions may hold
// the previous six-bracket values — see incomeBracket() for the mapping.
export const INCOME_RANGES = [
  { value: 'Menos de $10,000', label: 'Menos de $10,000 USD / Less than $10,000 USD' },
  { value: '$10,000 - $30,000', label: '$10,000 - $30,000 USD' },
  { value: 'Más de $30,000', label: 'Más de $30,000 USD / More than $30,000 USD' },
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'Efectivo', label: 'Efectivo / Cash' },
  { value: 'Cheque', label: 'Cheque / Check' },
  { value: 'Otro', label: 'Otro / Other' },
];

export const SOURCE_OF_FUNDS_OPTIONS = [
  { value: 'Negocio propio', label: 'Negocio propio / Own Business' },
  { value: 'Herencia', label: 'Herencia / Inheritance' },
  { value: 'Venta de propiedad', label: 'Venta de propiedad / Sale of Property' },
  { value: 'Asalariado', label: 'Asalariado / Salaried' },
  { value: 'Otro', label: 'Otro / Other' },
];

export const PEP_CATEGORY_OPTIONS = [
  { value: 'Figura politica', label: 'Figura política / Political Figure' },
  { value: 'Familiar cercano', label: 'Familiar cercano / Close Family' },
  { value: 'Asociado cercano', label: 'Asociado cercano / Close Associate' },
];

export const TAXPAYER_TYPE_OPTIONS = [
  { value: 'Persona Juridica', label: 'Persona Jurídica / Legal Entity' },
  { value: 'Entidad Publica Nacional', label: 'Entidad Pública Nacional / National Public Entity' },
  { value: 'Asociacion sin fines de lucro', label: 'Asociación sin fines de lucro / Non-profit Association' },
  { value: 'No contribuyente', label: 'No contribuyente / Non-taxpayer' },
];

export const GENDER_OPTIONS = [
  { value: 'Masculino', label: 'Masculino / Male' },
  { value: 'Femenino', label: 'Femenino / Female' },
];

// ─── Reference contacts (dynamic rows, both client types) ─────────────────────

export const REFERENCE_FIELDS = [
  ['name', 'Nombre o razón social / Name or business name'],
  ['relationship', 'Relación / Relationship'],
  ['phone', 'Teléfono / Phone'],
  ['email', 'Correo de contacto / Contact email'],
];

export const MIN_REFERENCES = 3;
export const MAX_REFERENCES = 6;

// ─── Beneficial owners (dynamic rows, legal entity only) ──────────────────────

export const BENEFICIAL_OWNER_FIELDS = [
  ['full_name', 'Nombre completo / Full name'],
  ['id_card', 'Cédula / ID card'],
  ['date_of_birth', 'Fecha de nacimiento / Date of birth'],
  ['nationality', 'Nacionalidad / Nationality'],
  ['address', 'Dirección / Address'],
  ['date_acquired_status', 'Fecha en que adquiere la condición de beneficiario final / Date beneficial owner status was acquired'],
];

const NATURAL_AML_LABEL = 'Indique si usted ha sido objeto de investigación o condena por actividades ilícitas, relacionadas al delito de blanqueo de capitales o financiamiento del terrorismo. / Indicate if you have been the subject of investigation or conviction for illicit activities related to the crime of money laundering or financing of terrorism.';
const LEGAL_AML_LABEL = 'Indique si el Representante Legal, Accionista, Apoderado o la Sociedad misma son o han sido objeto de investigación o condena por actividades ilícitas, relacionadas al delito de blanqueo de capitales o financiamiento del terrorismo. / Indicate if the Legal Representative, Shareholder, Proxy, or the Company itself is or has been the subject of investigation or conviction for illicit activities related to the crime of money laundering or financing of terrorism.';

// ─── Shared declaration fields (rendered on the final step of both flows) ─────

export const SHARED_DECLARATION_FIELDS = [
  { name: 'payment_method', label: 'Forma de pago / Payment method', type: 'select', required: true, options: PAYMENT_METHOD_OPTIONS },
  { name: 'payment_method_other', label: '¿Cuál? / Which one?', type: 'text', required: (v) => v.payment_method === 'Otro' },
  { name: 'aml_investigation_yn', label: NATURAL_AML_LABEL, type: 'radio', required: true, options: YES_NO_OPTIONS },
  { name: 'country_of_origin_resources', label: 'País de origen de los recursos / Country of origin of resources', type: 'text', required: true },
];

// PEP block is identical on both forms; only the column prefix differs (np_ / le_).
function pepFields(p) {
  const isPep = `${p}_is_pep_yn`;
  return [
    { name: isPep, label: '¿Se encuentra usted bajo la categoría de Persona Expuesta Políticamente, familiar o estrecho colaborador? / Are you under the category of Politically Exposed Person, family member, or close associate?', type: 'radio', required: true, options: YES_NO_OPTIONS },
    { name: `${p}_pep_category`, label: 'Si su respuesta es «Sí», seleccione en qué categoría de PEP se encuentra / If your answer is “Yes”, select which PEP category applies', type: 'radio', required: (v) => v[isPep] === 'Sí', options: PEP_CATEGORY_OPTIONS },
    { name: `${p}_pep_separated_24m_yn`, label: '¿Ha sido una Persona Expuesta Políticamente (o un familiar o estrecho colaborador) separado de su cargo durante los últimos 24 meses a la fecha de completar esta declaración? / Has a Politically Exposed Person (or a family member or close associate) been separated from their position during the last 24 months as of the date of completing this declaration?', type: 'radio', required: (v) => v[isPep] === 'Sí', options: YES_NO_OPTIONS },
    { name: `${p}_pep_current_position`, label: 'Cargo político actual / Current political position', type: 'text', required: false },
    { name: `${p}_pep_current_position_date`, label: 'Fecha (cargo actual) / Date (current position)', type: 'date', required: false },
    { name: `${p}_pep_previous_position`, label: 'Cargo político anterior / Previous political position', type: 'text', required: false },
    { name: `${p}_pep_previous_position_date`, label: 'Fecha (cargo anterior) / Date (previous position)', type: 'date', required: false },
  ];
}

// ─── NATURAL PERSON ─────────────────────────────────────────────────────────────

export const NATURAL_SECTIONS = [
  {
    title: 'Datos generales / General Data',
    fields: [
      { name: 'np_name_surname', label: 'Nombre y apellido / Name and surname', type: 'text', required: true },
      { name: 'np_id_card', label: 'N° de cédula / ID card number', type: 'text', required: false },
      { name: 'np_passport_no', label: 'N° de pasaporte / Passport number', type: 'text', required: true },
      { name: 'np_passport_issue_date', label: 'Fecha de emisión del pasaporte / Passport issue date', type: 'date', required: true },
      { name: 'np_passport_issuing_country', label: 'País emisor del pasaporte / Passport issuing country', type: 'text', required: true },
      { name: 'np_passport_expiration_date', label: 'Fecha de expiración del pasaporte / Passport expiration date', type: 'date', required: true },
      { name: 'np_date_of_birth', label: 'Fecha de nacimiento / Date of birth', type: 'date', required: true },
      { name: 'np_country_of_birth', label: 'País de nacimiento / Country of birth', type: 'text', required: true },
      { name: 'np_gender', label: 'Género / Gender', type: 'radio', required: true, options: GENDER_OPTIONS },
      { name: 'np_marital_status', label: 'Estado civil / Marital status', type: 'select', required: true, options: MARITAL_STATUS_OPTIONS },
      { name: 'np_nationality', label: 'Nacionalidad / Nationality', type: 'text', required: true },
      { name: 'np_country_of_residence', label: 'País de residencia / Country of residence', type: 'text', required: true },
      { name: 'np_po_box', label: 'Apartado postal / P.O. Box', type: 'text', required: false },
      { name: 'np_residential_address', label: 'Dirección residencial / Residential address', type: 'text', required: true },
      { name: 'np_residential_country', label: 'País (dirección residencial) / Country (residential address)', type: 'text', required: true },
    ],
  },
  {
    title: 'Contacto e información laboral / Contact & Employment Information',
    fields: [
      { name: 'np_personal_email', label: 'Correo electrónico / Email', type: 'email', required: true },
      { name: 'np_personal_phone', label: 'Teléfono / Phone', type: 'tel', required: true },
      { name: 'np_personal_cellphone', label: 'Celular / Cellphone', type: 'tel', required: true },
      { name: 'np_occupation_profession', label: 'Ocupación / Profesión / Occupation / Profession', type: 'text', required: true },
      { name: 'np_employer_company', label: 'Empresa donde labora / Employer company', type: 'text', required: false },
      { name: 'np_employer_work_address', label: 'Dirección de trabajo (calle / avenida) / Work address (street / avenue)', type: 'text', required: false },
      { name: 'np_employer_phone_1', label: 'Teléfono No. 1 / Phone No. 1', type: 'tel', required: false },
      { name: 'np_employer_phone_2', label: 'Teléfono No. 2 / Phone No. 2', type: 'tel', required: false },
      { name: 'np_employer_cellphone', label: 'Celular No. / Cellphone No.', type: 'tel', required: false },
      { name: 'np_employer_work_email', label: 'Email de trabajo / Work email', type: 'email', required: false },
    ],
  },
  {
    title: 'Declaración jurada / Affidavit (Sworn Declaration)',
    fields: [
      { name: 'np_intermediary_third_party_yn', label: '¿Figura como intermediario de otra persona que es Beneficiario verdadero de esos fondos? / Do you figure as an intermediary for another person who is the True Beneficial Owner of these funds?', type: 'radio', required: true, options: YES_NO_OPTIONS },
      { name: 'np_beneficiary_name', label: 'Nombre del beneficiario final / Final beneficiary name', type: 'text', required: (v) => v.np_intermediary_third_party_yn === 'Sí' },
      { name: 'np_beneficiary_id_passport', label: 'Número de cédula / pasaporte / ID / Passport number', type: 'text', required: (v) => v.np_intermediary_third_party_yn === 'Sí' },
    ],
  },
  {
    title: 'Declaración de fuente y origen de patrimonio / Declaration of source and origin of assets',
    fields: [
      { name: 'np_source_of_funds', label: 'Procedencia / Source of funds', type: 'checkbox-group', required: true, options: SOURCE_OF_FUNDS_OPTIONS },
      { name: 'np_source_of_funds_other', label: '¿Cuál? / Which one?', type: 'text', required: (v) => Array.isArray(v.np_source_of_funds) && v.np_source_of_funds.includes('Otro') },
      { name: 'np_source_company_name', label: 'Nombre de la empresa / Company name', type: 'text', required: false },
      { name: 'np_source_company_address', label: 'Dirección de la empresa / Company address', type: 'text', required: false },
      { name: 'np_source_company_phone', label: 'Teléfono de la empresa / Company phone', type: 'tel', required: false },
      { name: 'np_source_products_services', label: 'Productos / Servicios / Products / Services', type: 'text', required: false },
      { name: 'np_source_company_email', label: 'Correo de la empresa / Company email', type: 'email', required: false },
      { name: 'np_source_activity_description', label: 'Breve descripción que permita determinar la actividad que dio origen a los fondos involucrados en la operación / Brief description allowing the determination of the activity that gave origin to the funds involved in the operation', type: 'textarea', required: true },
    ],
  },
  {
    title: 'Perfil financiero / Financial Profile',
    fields: [
      { name: 'np_annual_income_range', label: 'Ingreso anual (actividad principal) / Annual income (main activity)', type: 'select', required: true, options: INCOME_RANGES },
      { name: 'np_non_operational_income_activity', label: 'Actividad (ingresos no operacionales) / Activity (non-operational income)', type: 'text', required: false },
      { name: 'np_non_operational_income_range', label: 'Rango de ingresos / Income range', type: 'select', required: false, options: INCOME_RANGES },
    ],
  },
  {
    title: 'Persona Expuesta Políticamente (PEP) / Politically Exposed Person',
    fields: pepFields('np'),
  },
];

export const NATURAL_DOCUMENTS = [
  {
    key: 'id_passport_copy',
    label: 'Copia de cédula o pasaporte / ID card or passport copy',
    instructions: 'Foto o escaneo a color, página completa, los 4 esquinas visibles, sin dedos, reflejos ni sombras sobre el texto. / Color photo or scan, full page, all 4 corners visible, no fingers, glare or shadows over the text.',
  },
  {
    key: 'work_letter',
    label: 'Carta laboral / Work letter',
    instructions: 'Documento oficial de su empleador, con membrete, firmado y fechado dentro de los últimos 3 meses. / Official document from your employer, on letterhead, signed and dated within the last 3 months.',
  },
  {
    key: 'bank_reference_letter',
    label: 'Carta de referencia bancaria / Bank reference letter',
    instructions: 'Documento oficial con membrete del banco, firmado y fechado dentro de los últimos 3 meses. / Official bank letterhead document, signed and dated within the last 3 months.',
  },
  {
    key: 'tax_return_or_financials',
    label: 'Declaración de renta o estados financieros / Tax return or financial statements',
    instructions: 'Documento completo y legible, correspondiente al período fiscal más reciente. / Complete and legible document, for the most recent fiscal period.',
  },
  {
    key: 'proof_of_domicile',
    label: 'Comprobante de domicilio / Proof of domicile',
    instructions: 'Factura de servicio (luz, agua, internet) a su nombre, de los últimos 3 meses. / Utility bill (electricity, water, internet) in your name, within the last 3 months.',
  },
];

// ─── LEGAL ENTITY ───────────────────────────────────────────────────────────────

export const LEGAL_SECTIONS = [
  {
    title: 'Datos generales de la sociedad / General data of the company',
    fields: [
      { name: 'le_company_name', label: 'Nombre de la empresa / Company name', type: 'text', required: true },
      { name: 'le_tax_id', label: 'Identificación fiscal (TIN) / Tax identification (TIN)', type: 'text', required: true },
      { name: 'le_registered_office', label: 'Domicilio social / Registered office', type: 'text', required: true },
      { name: 'le_physical_address', label: 'Dirección física / Physical address', type: 'text', required: true },
      { name: 'le_postal_address', label: 'Dirección postal / Postal address', type: 'text', required: false },
      { name: 'le_telephone', label: 'Teléfono / Telephone', type: 'tel', required: true },
      { name: 'le_company_type', label: 'Tipo de persona / sociedad / Type of company / entity', type: 'text', required: true },
      { name: 'le_company_activities', label: 'Actividades de la empresa / Company activities', type: 'textarea', required: true },
      { name: 'le_email', label: 'Correo electrónico / Email', type: 'email', required: true },
      { name: 'le_listed_stock_exchange_yn', label: '¿Cotiza en bolsa? / Listed on stock exchange?', type: 'radio', required: true, options: YES_NO_OPTIONS },
      { name: 'le_stock_exchange_name', label: 'Nombre de la bolsa / Name of the stock exchange', type: 'text', required: (v) => v.le_listed_stock_exchange_yn === 'Sí' },
    ],
  },
  {
    title: 'Dignatarios y accionistas / Officers and shareholders',
    fields: [
      { name: 'le_legal_representative', label: 'Representante legal / Legal representative', type: 'text', required: true },
      { name: 'le_president', label: 'Presidente / President', type: 'text', required: false },
      { name: 'le_secretary', label: 'Secretario / Secretary', type: 'text', required: false },
      { name: 'le_treasurer', label: 'Tesorero / Treasurer', type: 'text', required: false },
      { name: 'le_proxies_others', label: 'Apoderados u otros / Proxies or others', type: 'text', required: false },
      { name: 'le_shareholders', label: 'Accionistas / Shareholders', type: 'textarea', required: true },
    ],
  },
  {
    title: 'Información general del representante legal / accionista / apoderado / General information of the legal representative / shareholder / proxy',
    fields: [
      { name: 'le_rep_name_surname', label: 'Nombre y apellido / Name and surname', type: 'text', required: true },
      { name: 'le_rep_date_of_birth', label: 'Fecha de nacimiento / Date of birth', type: 'date', required: true },
      { name: 'le_rep_place_of_birth', label: 'Lugar de nacimiento / Place of birth', type: 'text', required: true },
      { name: 'le_rep_id_card', label: 'Cédula / ID card', type: 'text', required: true },
      { name: 'le_rep_nationality', label: 'Nacionalidad / Nationality', type: 'text', required: true },
      { name: 'le_rep_gender', label: 'Género / Gender', type: 'radio', required: true, options: GENDER_OPTIONS },
      { name: 'le_rep_profession_occupation', label: 'Profesión u ocupación / Profession or occupation', type: 'text', required: true },
      { name: 'le_rep_email', label: 'Correo electrónico / Email', type: 'email', required: true },
      { name: 'le_rep_residence_building_house', label: 'Residencia (edificio/casa) / Residence (building/house)', type: 'text', required: false },
      { name: 'le_rep_marital_status', label: 'Estado civil / Marital status', type: 'select', required: true, options: MARITAL_STATUS_OPTIONS },
      { name: 'le_rep_local_telephone', label: 'Teléfono local / Local telephone', type: 'tel', required: true },
      { name: 'le_rep_cell_phone', label: 'Celular / Cell phone', type: 'tel', required: true },
      { name: 'le_accountant_name', label: 'Nombre del contador / Accountant name', type: 'text', required: false },
      { name: 'le_accountant_email', label: 'Correo del contador / Accountant email', type: 'email', required: false },
      { name: 'le_accountant_id_license', label: 'Cédula de contador / idoneidad / Accountant ID / license', type: 'text', required: false },
      { name: 'le_accountant_address', label: 'Dirección del contador / Accountant address', type: 'text', required: false },
    ],
  },
  {
    title: 'Declaración de fuente y origen de recursos / Declaration of source and origin of resources',
    fields: [
      { name: 'le_origin_assets_declaration', label: 'Declaración de origen de bienes y/o fondos / Declaration of origin of assets and/or funds', type: 'textarea', required: true },
    ],
  },
  {
    title: 'Perfil financiero / Financial Profile',
    fields: [
      { name: 'le_annual_income_main_activity', label: 'Ingresos anuales (actividad principal) / Annual income (main activity)', type: 'select', required: true, options: INCOME_RANGES },
      { name: 'le_monthly_operational_income', label: 'Ingresos operacionales mensuales / Monthly operational income', type: 'text', required: true },
      { name: 'le_expenses', label: 'Egresos / Expenses', type: 'text', required: true },
      { name: 'le_profit', label: 'Utilidad / Profit', type: 'text', required: true },
      { name: 'le_monthly_non_operational_income', label: 'Ingresos no operacionales mensuales / Monthly non-operational income', type: 'text', required: false },
      { name: 'le_non_operational_activity', label: 'Actividad / Activity', type: 'text', required: false },
      { name: 'le_non_operational_income_range', label: 'Rango de ingresos / Income range', type: 'select', required: false, options: INCOME_RANGES },
    ],
  },
  {
    title: 'Persona Expuesta Políticamente (PEP) / Politically Exposed Person',
    fields: pepFields('le'),
  },
  {
    title: 'Información tributaria y operaciones internacionales / Tax information & international operations',
    fields: [
      { name: 'le_taxpayer_type', label: 'Tipo de contribuyente / Taxpayer type', type: 'select', required: true, options: TAXPAYER_TYPE_OPTIONS },
      { name: 'le_self_withholder_other_income_yn', label: 'Autorretenedor de otros ingresos / Self-withholder of other income', type: 'radio', required: true, options: YES_NO_OPTIONS },
      { name: 'le_itbms_responsible_yn', label: 'Responsable de ITBMS / ITBMS responsible', type: 'radio', required: true, options: YES_NO_OPTIONS },
      { name: 'le_obligated_taxes_other_states_yn', label: 'Obligado a tributar en otros Estados / Obligated to pay taxes in other States', type: 'radio', required: true, options: YES_NO_OPTIONS },
      { name: 'le_obligated_taxes_which_state', label: '¿Cuál? / Which one?', type: 'text', required: (v) => v.le_obligated_taxes_other_states_yn === 'Sí' },
      { name: 'le_foreign_currency_operations_yn', label: 'Realiza operaciones en moneda extranjera / Performs operations in foreign currency', type: 'radio', required: true, options: YES_NO_OPTIONS },
      { name: 'le_foreign_currency_which', label: '¿Cuál? / Which one?', type: 'text', required: (v) => v.le_foreign_currency_operations_yn === 'Sí' },
    ],
  },
];

export const LEGAL_DOCUMENTS = [
  {
    key: 'crp_certificate',
    label: 'Copia de CRP o comprobante de registro en el RP / Copy of CRP or Public Registry proof',
    instructions: 'Documento oficial vigente del Registro Público, completo y legible. / Current official Public Registry document, complete and legible.',
  },
  {
    key: 'board_id_copies',
    label: 'Copias de identificación de la junta directiva / ID copies of the board of directors',
    instructions: 'Foto o escaneo a color de cada documento, página completa, sin dedos ni reflejos. / Color photo or scan of each document, full page, no fingers or glare.',
  },
  {
    key: 'bank_reference_letter',
    label: 'Carta de referencia bancaria / Bank reference letter',
    instructions: 'Documento oficial con membrete del banco, firmado y fechado dentro de los últimos 3 meses. / Official bank letterhead document, signed and dated within the last 3 months.',
  },
  {
    key: 'tax_return_or_financials',
    label: 'Declaración de renta, estados financieros o balance / Income tax return, financial statements or balance sheet',
    instructions: 'Documento completo y legible, correspondiente al período fiscal más reciente. / Complete and legible document, for the most recent fiscal period.',
  },
  {
    key: 'stock_certificate',
    label: 'Copia del certificado de acciones / Copy of stock certificate',
    instructions: 'Documento completo, legible, con los datos del titular visibles. / Complete document, legible, with holder details visible.',
  },
  {
    key: 'stock_book',
    label: 'Copia del libro de acciones / Copy of stock book',
    instructions: 'Páginas relevantes mostrando la titularidad actual de las acciones. / Relevant pages showing current share ownership.',
  },
  {
    key: 'rubf_proof',
    label: 'Comprobante de registro en el RUBF / Proof of RUBF registration',
    instructions: 'Comprobante oficial de inscripción en el Registro Único de Beneficiarios Finales. / Official proof of registration in the Single Registry of Beneficial Owners.',
  },
];

// ─── Helpers shared by client form, API route and admin detail page ───────────

export function isRequired(field, values) {
  return typeof field.required === 'function' ? field.required(values) : !!field.required;
}

// The AML question is worded differently on the natural-person and legal-entity forms.
export function sharedFieldsForType(clientType) {
  return SHARED_DECLARATION_FIELDS.map((f) => (
    f.name === 'aml_investigation_yn' && clientType === 'legal' ? { ...f, label: LEGAL_AML_LABEL } : f
  ));
}

export function sectionsForType(clientType) {
  return clientType === 'legal' ? LEGAL_SECTIONS : NATURAL_SECTIONS;
}

export function documentsForType(clientType) {
  return clientType === 'legal' ? LEGAL_DOCUMENTS : NATURAL_DOCUMENTS;
}
