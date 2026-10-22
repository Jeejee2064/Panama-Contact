-- The legal-entity Due Diligence form now includes the PEP section (07), as in the PDF.
-- Run this in the Supabase SQL editor BEFORE deploying, otherwise legal-entity submissions will fail.
alter table kyc_submissions
  add column if not exists le_is_pep_yn text,
  add column if not exists le_pep_category text,
  add column if not exists le_pep_separated_24m_yn text,
  add column if not exists le_pep_current_position text,
  add column if not exists le_pep_current_position_date text,
  add column if not exists le_pep_previous_position text,
  add column if not exists le_pep_previous_position_date text;
