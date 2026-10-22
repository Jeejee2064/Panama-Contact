-- Primera vez vs Renovación on the immigration questionnaire.
alter table immigration_submissions add column if not exists tipo_solicitud text;
