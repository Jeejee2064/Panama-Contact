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

export const INCOME_RANGES = [
  { value: 'Menos de $10,000', label: 'Menos de $10,000 USD / Less than $10,000 USD' },
  { value: '$10,000 - $30,000', label: '$10,000 - $30,000 USD' },
  { value: '$30,001 - $50,000', label: '$30,001 - $50,000 USD' },
  { value: '$50,001 - $100,000', label: '$50,001 - $100,000 USD' },
  { value: '$100,001 - $250,000', label: '$100,001 - $250,000 USD' },
  { value: 'Más de $250,000', label: 'Más de $250,000 USD / More than $250,000 USD' },
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

// ─── Beneficial owners (dynamic rows, legal entity only) ──────────────────────

export const BENEFICIAL_OWNER_FIELDS = [
  ['full_name', 'Nombre completo / Full name'],
  ['id_card', 'Cédula o pasaporte / ID card or passport'],
  ['date_of_birth', 'Fecha de nacimiento / Date of birth'],
  ['nationality', 'Nacionalidad / Nationality'],
  ['address', 'Dirección / Address'],
  ['date_acquired_status', 'Fecha en que adquirió la condición de beneficiario final / Date acquired beneficial owner status'],
];

// ─── Shared declaration fields (rendered on the final step of both flows) ─────

export const SHARED_DECLARATION_FIELDS = [
  { name: 'payment_method', label: 'Forma de pago / Payment method', type: 'select', required: true, options: PAYMENT_METHOD_OPTIONS },
  { name: 'payment_method_other', label: '¿Cuál? / Which one?', type: 'text', required: (v) => v.payment_method === 'Otro' },
  { name: 'aml_investigation_yn', label: 'Indique si usted, sus representantes/accionistas o la empresa (según aplique) han sido objeto de investigación o condena por blanqueo de capitales o financiamiento del terrorismo. / Indicate if you, your representatives/shareholders or the company (as applicable) have been investigated or convicted for money laundering or terrorism financing.', type: 'radio', required: true, options: YES_NO_OPTIONS },
  { name: 'country_of_origin_resources', label: 'País de origen de los recursos / Country of origin of resources', type: 'text', required: true },
];

// ─── NATURAL PERSON ─────────────────────────────────────────────────────────────

export const NATURAL_SECTIONS = [
  {
    title: 'Datos generales / General Data',
    fields: [
      { name: 'np_name_surname', label: 'Nombre y apellido / Name and surname', type: 'text', required: true },
      { name: 'np_id_card', label: 'N° de cédula / ID card number', type: 'text', required: false },
      { name: 'np_passport_no', label: 'N° de pasaporte / Passport number', type: 'text', required: true },
      { name: 'np_passport_issue_date', label: 'Fecha de expedición del pasaporte / Passport issue date', type: 'date', required: true },
      { name: 'np_passport_issuing_country', label: 'País de expedición del pasaporte / Passport issuing country', type: 'text', required: true },
      { name: 'np_passport_expiration_date', label: 'Fecha de vencimiento del pasaporte / Passport expiration date', type: 'date', required: true },
      { name: 'np_date_of_birth', label: 'Fecha de nacimiento / Date of birth', type: 'date', required: true },
      { name: 'np_country_of_birth', label: 'País de nacimiento / Country of birth', type: 'text', required: true },
      { name: 'np_gender', label: 'Género / Gender', type: 'radio', required: true, options: GENDER_OPTIONS },
      { name: 'np_marital_status', label: 'Estado civil / Marital status', type: 'select', required: true, options: MARITAL_STATUS_OPTIONS },
      { name: 'np_nationality', label: 'Nacionalidad / Nationality', type: 'text', required: true },
      { name: 'np_country_of_residence', label: 'País de residencia / Country of residence', type: 'text', required: true },
      { name: 'np_po_box', label: 'Casilla postal / P.O. Box', type: 'text', required: false },
      { name: 'np_residential_address', label: 'Dirección residencial / Residential address', type: 'text', required: true },
      { name: 'np_residential_country', label: 'País de la dirección residencial / Country of residential address', type: 'text', required: true },
    ],
  },
  {
    title: 'Contacto y empleo / Contact & Employment',
    fields: [
      { name: 'np_personal_email', label: 'Correo electrónico / Email', type: 'email', required: true },
      { name: 'np_personal_phone', label: 'Teléfono / Phone', type: 'tel', required: true },
      { name: 'np_personal_cellphone', label: 'Celular / Cellphone', type: 'tel', required: true },
      { name: 'np_occupation_profession', label: 'Ocupación o profesión / Occupation or profession', type: 'text', required: true },
      { name: 'np_employer_company', label: 'Empresa empleadora / Employer company', type: 'text', required: false },
      { name: 'np_employer_work_address', label: 'Dirección laboral (calle/avenida) / Work address (street/avenue)', type: 'text', required: false },
      { name: 'np_employer_phone_1', label: 'Teléfono laboral N°1 / Work phone No. 1', type: 'tel', required: false },
      { name: 'np_employer_phone_2', label: 'Teléfono laboral N°2 / Work phone No. 2', type: 'tel', required: false },
      { name: 'np_employer_cellphone', label: 'Celular laboral / Work cellphone', type: 'tel', required: false },
      { name: 'np_employer_work_email', label: 'Correo laboral / Work email', type: 'email', required: false },
    ],
  },
  {
    title: 'Declaración de blanqueo y afidávit / AML Declaration & Affidavit',
    fields: [
      { name: 'np_intermediary_third_party_yn', label: '¿Figura como intermediario de otra persona que sea el beneficiario final de estos fondos? / Do you act as an intermediary for another person who is the true beneficial owner of these funds?', type: 'radio', required: true, options: YES_NO_OPTIONS },
      { name: 'np_beneficiary_name', label: 'Nombre del beneficiario final / Final beneficiary name', type: 'text', required: (v) => v.np_intermediary_third_party_yn === 'Sí' },
      { name: 'np_beneficiary_id_passport', label: 'N° de cédula/pasaporte del beneficiario final / Final beneficiary ID/passport number', type: 'text', required: (v) => v.np_intermediary_third_party_yn === 'Sí' },
    ],
  },
  {
    title: 'Origen de fondos / Source of Funds',
    fields: [
      { name: 'np_source_of_funds', label: 'Fuente de fondos y activos / Source of funds and assets', type: 'checkbox-group', required: true, options: SOURCE_OF_FUNDS_OPTIONS },
      { name: 'np_source_of_funds_other', label: '¿Cuál? / Which one?', type: 'text', required: (v) => Array.isArray(v.np_source_of_funds) && v.np_source_of_funds.includes('Otro') },
      { name: 'np_source_company_name', label: 'Nombre de la empresa (si aplica) / Company name (if applicable)', type: 'text', required: false },
      { name: 'np_source_company_address', label: 'Dirección de la empresa / Company address', type: 'text', required: false },
      { name: 'np_source_company_phone', label: 'Teléfono de la empresa / Company phone', type: 'tel', required: false },
      { name: 'np_source_products_services', label: 'Productos/servicios / Products/services', type: 'text', required: false },
      { name: 'np_source_company_email', label: 'Correo de la empresa / Company email', type: 'email', required: false },
      { name: 'np_source_activity_description', label: 'Breve descripción de la actividad que dio origen a los fondos / Brief description of the activity that gave rise to the funds', type: 'textarea', required: true },
    ],
  },
  {
    title: 'Perfil financiero / Financial Profile',
    fields: [
      { name: 'np_annual_income_range', label: 'Ingreso anual (actividad principal) / Annual income (main activity)', type: 'select', required: true, options: INCOME_RANGES },
      { name: 'np_non_operational_income_activity', label: 'Actividad de ingresos no operacionales / Non-operational income activity', type: 'text', required: false },
      { name: 'np_non_operational_income_range', label: 'Rango de ingresos no operacionales / Non-operational income range', type: 'select', required: false, options: INCOME_RANGES },
    ],
  },
  {
    title: 'Persona Expuesta Políticamente (PEP) / Politically Exposed Person',
    fields: [
      { name: 'np_is_pep_yn', label: '¿Es usted, un familiar cercano o asociado cercano una Persona Expuesta Políticamente? / Are you, a close family member or close associate a Politically Exposed Person?', type: 'radio', required: true, options: YES_NO_OPTIONS },
      { name: 'np_pep_category', label: 'Categoría PEP / PEP category', type: 'radio', required: (v) => v.np_is_pep_yn === 'Sí', options: PEP_CATEGORY_OPTIONS },
      { name: 'np_pep_separated_24m_yn', label: '¿Ha sido separado de su cargo en los últimos 24 meses? / Separated from position in the last 24 months?', type: 'radio', required: (v) => v.np_is_pep_yn === 'Sí', options: YES_NO_OPTIONS },
      { name: 'np_pep_current_position', label: 'Cargo político actual / Current political position', type: 'text', required: false },
      { name: 'np_pep_current_position_date', label: 'Fecha del cargo actual / Current position date', type: 'date', required: false },
      { name: 'np_pep_previous_position', label: 'Cargo político anterior / Previous political position', type: 'text', required: false },
      { name: 'np_pep_previous_position_date', label: 'Fecha del cargo anterior / Previous position date', type: 'date', required: false },
    ],
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
    title: 'Datos generales de la empresa / Company General Data',
    fields: [
      { name: 'le_company_name', label: 'Nombre de la empresa / Company name', type: 'text', required: true },
      { name: 'le_tax_id', label: 'Identificación tributaria (TIN) / Tax identification (TIN)', type: 'text', required: true },
      { name: 'le_registered_office', label: 'Domicilio registrado / Registered office', type: 'text', required: true },
      { name: 'le_physical_address', label: 'Dirección física / Physical address', type: 'text', required: true },
      { name: 'le_postal_address', label: 'Dirección postal / Postal address', type: 'text', required: false },
      { name: 'le_telephone', label: 'Teléfono / Telephone', type: 'tel', required: true },
      { name: 'le_company_type', label: 'Tipo de sociedad / Type of company', type: 'text', required: true },
      { name: 'le_company_activities', label: 'Actividades de la empresa / Company activities', type: 'textarea', required: true },
      { name: 'le_email', label: 'Correo electrónico / Email', type: 'email', required: true },
      { name: 'le_listed_stock_exchange_yn', label: '¿Cotiza en bolsa de valores? / Listed on a stock exchange?', type: 'radio', required: true, options: YES_NO_OPTIONS },
      { name: 'le_stock_exchange_name', label: 'Nombre de la bolsa de valores / Name of the stock exchange', type: 'text', required: (v) => v.le_listed_stock_exchange_yn === 'Sí' },
    ],
  },
  {
    title: 'Representante legal, accionistas y apoderados / Officers',
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
    title: 'Información del representante / accionista / apoderado',
    fields: [
      { name: 'le_rep_building_house', label: 'Edificio / Casa', type: 'text', required: false },
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
      { name: 'le_accountant_id_license', label: 'Cédula/licencia del contador / Accountant ID/license', type: 'text', required: false },
      { name: 'le_accountant_address', label: 'Dirección del contador / Accountant address', type: 'text', required: false },
    ],
  },
  {
    title: 'Origen de recursos / Origin of Resources',
    fields: [
      { name: 'le_origin_assets_declaration', label: 'Declaración del origen de activos y/o fondos / Declaration of origin of assets and/or funds', type: 'textarea', required: true },
    ],
  },
  {
    title: 'Perfil financiero / Financial Profile',
    fields: [
      { name: 'le_annual_income_main_activity', label: 'Ingreso anual de la actividad principal / Annual income of main activity', type: 'select', required: true, options: INCOME_RANGES },
      { name: 'le_monthly_operational_income', label: 'Ingreso operacional mensual / Monthly operational income', type: 'text', required: true },
      { name: 'le_expenses', label: 'Gastos / Expenses', type: 'text', required: true },
      { name: 'le_profit', label: 'Utilidad / Profit', type: 'text', required: true },
      { name: 'le_monthly_non_operational_income', label: 'Ingreso no operacional mensual / Monthly non-operational income', type: 'text', required: false },
      { name: 'le_non_operational_activity', label: 'Actividad no operacional / Non-operational activity', type: 'text', required: false },
      { name: 'le_non_operational_income_range', label: 'Rango de ingresos no operacionales / Non-operational income range', type: 'select', required: false, options: INCOME_RANGES },
    ],
  },
  {
    title: 'Tipo de contribuyente e información internacional',
    fields: [
      { name: 'le_taxpayer_type', label: 'Tipo de contribuyente / Taxpayer type', type: 'select', required: true, options: TAXPAYER_TYPE_OPTIONS },
      { name: 'le_self_withholder_other_income_yn', label: '¿Autorretenedor de otros ingresos? / Self-withholder of other income?', type: 'radio', required: true, options: YES_NO_OPTIONS },
      { name: 'le_itbms_responsible_yn', label: '¿Responsable de ITBMS? / ITBMS responsible?', type: 'radio', required: true, options: YES_NO_OPTIONS },
      { name: 'le_obligated_taxes_other_states_yn', label: '¿Obligado a pagar impuestos en otros estados? / Obligated to pay taxes in other states?', type: 'radio', required: true, options: YES_NO_OPTIONS },
      { name: 'le_obligated_taxes_which_state', label: '¿Cuál? / Which one?', type: 'text', required: (v) => v.le_obligated_taxes_other_states_yn === 'Sí' },
      { name: 'le_foreign_currency_operations_yn', label: '¿Realiza operaciones en moneda extranjera? / Performs operations in foreign currency?', type: 'radio', required: true, options: YES_NO_OPTIONS },
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

export function sectionsForType(clientType) {
  return clientType === 'legal' ? LEGAL_SECTIONS : NATURAL_SECTIONS;
}

export function documentsForType(clientType) {
  return clientType === 'legal' ? LEGAL_DOCUMENTS : NATURAL_DOCUMENTS;
}
