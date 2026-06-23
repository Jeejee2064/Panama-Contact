'use client';
import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
  REFERENCE_FIELDS, BENEFICIAL_OWNER_FIELDS, SHARED_DECLARATION_FIELDS,
  isRequired, sectionsForType, documentsForType,
} from '@/data/kyc-fields';
import FileUploadField from '@/components/kyc/FileUploadField';
import CuestionarioHeader from '@/components/cuestionario/CuestionarioHeader';
import PhoneField from '@/components/cuestionario/PhoneField';
import DateSelect from '@/components/cuestionario/DateSelect';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validateEmail = (v) => !v || EMAIL_REGEX.test(v) || 'Correo inválido / Invalid email';

// ─── Small helpers (shared visual primitives, same scale as immigration form) ──

function splitBilingual(text) {
  const idx = text.indexOf(' / ');
  if (idx === -1) return [text, ''];
  return [text.slice(0, idx), text.slice(idx + 3)];
}

function FieldLabel({ label, required }) {
  const [es, en] = splitBilingual(label);
  return (
    <label className="block mb-1 leading-snug">
      <span className="block text-xs md:text-sm text-gray-600 dark:text-gray-300">
        {es}{!required && <span className="text-gray-400 dark:text-gray-500"> (opcional)</span>}
      </span>
      {en && (
        <span className="block text-xs md:text-sm text-gray-400 dark:text-gray-500 italic">
          {en}{!required && ' (optional)'}
        </span>
      )}
    </label>
  );
}

function StepTitle({ title }) {
  const [es, en] = splitBilingual(title);
  return (
    <div className="mb-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">{es}</h2>
      {en && <p className="text-sm md:text-base text-gray-400 dark:text-gray-500 italic mt-0.5">{en}</p>}
    </div>
  );
}

function BilingualText({ text, className }) {
  const [es, en] = splitBilingual(text);
  return (
    <span className={className}>
      <span className="block">{es}</span>
      {en && <span className="block text-gray-400 dark:text-gray-500 italic">{en}</span>}
    </span>
  );
}

function inputClass(hasError) {
  return `w-full border rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:ring-2 transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
    hasError ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 dark:border-gray-700 focus:ring-orange-400 focus:border-orange-400'
  }`;
}

function RadioPills({ name, options, register, error, required }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center cursor-pointer">
          <input type="radio" value={opt.value} {...register(name, { required })} className="sr-only peer" />
          <span className="px-4 py-2 md:px-5 md:py-2.5 rounded-full border border-gray-300 dark:border-gray-700 text-sm md:text-base text-gray-700 dark:text-gray-300 peer-checked:bg-[#FF491A] peer-checked:border-[#FF491A] peer-checked:text-white transition select-none">
            {opt.label}
          </span>
        </label>
      ))}
      {error && <p className="w-full text-xs text-red-500 mt-1">{error.message || 'Campo requerido / Required'}</p>}
    </div>
  );
}

function CheckboxGroup({ name, options, register, error, validate }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center cursor-pointer">
          <input type="checkbox" value={opt.value} {...register(name, { validate })} className="sr-only peer" />
          <span className="px-4 py-2 md:px-5 md:py-2.5 rounded-full border border-gray-300 dark:border-gray-700 text-sm md:text-base text-gray-700 dark:text-gray-300 peer-checked:bg-[#FF491A] peer-checked:border-[#FF491A] peer-checked:text-white transition select-none">
            {opt.label}
          </span>
        </label>
      ))}
      {error && <p className="w-full text-xs text-red-500 mt-1">{error.message || 'Seleccione al menos una opción / Select at least one option'}</p>}
    </div>
  );
}

function isVisible(field, values) {
  return typeof field.required !== 'function' || field.required(values);
}

function renderField(field, { register, errors, values, control }) {
  if (!isVisible(field, values)) return null;
  const required = isRequired(field, values);
  const err = errors[field.name];
  const requiredMsg = required ? 'Requerido / Required' : false;

  if (field.type === 'tel') {
    return (
      <div key={field.name} data-field={field.name} className="flex flex-col">
        <FieldLabel label={field.label} required={required} />
        <Controller
          name={field.name}
          control={control}
          rules={{ required: requiredMsg }}
          render={({ field: { value, onChange } }) => (
            <PhoneField value={value} onChange={onChange} hasError={!!err} />
          )}
        />
        {err && <p className="text-xs text-red-500 mt-1">{err.message}</p>}
      </div>
    );
  }
  if (field.type === 'date') {
    return (
      <div key={field.name} data-field={field.name} className="flex flex-col">
        <FieldLabel label={field.label} required={required} />
        <Controller
          name={field.name}
          control={control}
          rules={{ required: requiredMsg }}
          render={({ field: { value, onChange } }) => (
            <DateSelect value={value} onChange={onChange} hasError={!!err} />
          )}
        />
        {err && <p className="text-xs text-red-500 mt-1">{err.message}</p>}
      </div>
    );
  }
  if (field.type === 'text' || field.type === 'email') {
    return (
      <div key={field.name} data-field={field.name} className="flex flex-col">
        <FieldLabel label={field.label} required={required} />
        <input
          type={field.type}
          {...register(field.name, { required: requiredMsg, validate: field.type === 'email' ? validateEmail : undefined })}
          className={inputClass(!!err)}
        />
        {err && <p className="text-xs text-red-500 mt-1">{err.message}</p>}
      </div>
    );
  }
  if (field.type === 'textarea') {
    return (
      <div key={field.name} data-field={field.name} className="flex flex-col">
        <FieldLabel label={field.label} required={required} />
        <textarea rows={3} {...register(field.name, { required: requiredMsg })} className={inputClass(!!err)} />
        {err && <p className="text-xs text-red-500 mt-1">{err.message}</p>}
      </div>
    );
  }
  if (field.type === 'radio') {
    return (
      <div key={field.name} data-field={field.name} className="flex flex-col gap-1">
        <FieldLabel label={field.label} required={required} />
        <RadioPills name={field.name} options={field.options} register={register} error={err} required={requiredMsg} />
      </div>
    );
  }
  if (field.type === 'select') {
    return (
      <div key={field.name} data-field={field.name} className="flex flex-col">
        <FieldLabel label={field.label} required={required} />
        <select {...register(field.name, { required: requiredMsg })} className={inputClass(!!err)}>
          <option value="">— seleccionar / select —</option>
          {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {err && <p className="text-xs text-red-500 mt-1">{err.message}</p>}
      </div>
    );
  }
  if (field.type === 'checkbox-group') {
    const validate = required
      ? (v) => (Array.isArray(v) && v.length > 0) || 'Seleccione al menos una opción / Select at least one option'
      : undefined;
    return (
      <div key={field.name} data-field={field.name} className="flex flex-col gap-1">
        <FieldLabel label={field.label} required={required} />
        <CheckboxGroup name={field.name} options={field.options} register={register} error={err} validate={validate} />
      </div>
    );
  }
  return null;
}

// ─── Special steps ──────────────────────────────────────────────────────────────

function TypeStep({ clientType, setClientType, error }) {
  return (
    <div className="flex flex-col gap-4">
      <BilingualText
        className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-1"
        text="Seleccione el tipo de cliente para mostrar el formulario correspondiente. / Select the client type to display the relevant form."
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setClientType('natural')}
          className={`p-6 rounded-xl border-2 text-left transition ${clientType === 'natural' ? 'border-[#FF491A] bg-orange-50 dark:bg-orange-950/30' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
        >
          <span className="block text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Persona Natural</span>
          <span className="block text-sm text-gray-500 dark:text-gray-400">Natural Person</span>
        </button>
        <button
          type="button"
          onClick={() => setClientType('legal')}
          className={`p-6 rounded-xl border-2 text-left transition ${clientType === 'legal' ? 'border-[#FF491A] bg-orange-50 dark:bg-orange-950/30' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
        >
          <span className="block text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Empresa</span>
          <span className="block text-sm text-gray-500 dark:text-gray-400">Legal Entity</span>
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function ReferencesStep({ fields, append, remove, register, errors, minRows, control }) {
  return (
    <div className="flex flex-col gap-4">
      <BilingualText
        className="text-sm md:text-base text-gray-600 dark:text-gray-300"
        text={`Indique al menos ${minRows} referencias (bancaria, comercial y personal). / Provide at least ${minRows} references (banking, commercial and personal).`}
      />
      {fields.map((field, index) => (
        <div key={field.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 grid sm:grid-cols-2 gap-3">
          {REFERENCE_FIELDS.map(([key, label]) => {
            const err = errors?.reference_contacts?.[index]?.[key];
            const fieldPath = `reference_contacts.${index}.${key}`;
            if (key === 'phone') {
              return (
                <div key={key} data-field={fieldPath} className="flex flex-col">
                  <FieldLabel label={label} required={true} />
                  <Controller
                    name={fieldPath}
                    control={control}
                    rules={{ required: 'Requerido / Required' }}
                    render={({ field: { value, onChange } }) => (
                      <PhoneField value={value} onChange={onChange} hasError={!!err} />
                    )}
                  />
                  {err && <p className="text-xs text-red-500 mt-1">{err.message}</p>}
                </div>
              );
            }
            return (
              <div key={key} data-field={fieldPath} className="flex flex-col">
                <FieldLabel label={label} required={true} />
                <input
                  type={key === 'email' ? 'email' : 'text'}
                  {...register(fieldPath, {
                    required: 'Requerido / Required',
                    validate: key === 'email' ? validateEmail : undefined,
                  })}
                  className={inputClass(!!err)}
                />
                {err && <p className="text-xs text-red-500 mt-1">{err.message}</p>}
              </div>
            );
          })}
          {fields.length > minRows && (
            <button type="button" onClick={() => remove(index)} className="sm:col-span-2 text-xs text-red-500 hover:underline text-left">
              Eliminar referencia / Remove reference
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ name: '', relationship: '', phone: '', email: '' })}
        className="self-start text-sm font-semibold text-[#FF491A] hover:underline"
      >
        + Agregar referencia / Add reference
      </button>
    </div>
  );
}

function BeneficialOwnersStep({ fields, append, remove, register, errors, minRows, control }) {
  return (
    <div className="flex flex-col gap-4">
      <BilingualText
        className="text-sm md:text-base text-gray-600 dark:text-gray-300"
        text="Identifique a las personas naturales que son beneficiarias finales de la empresa. / Identify the natural persons who are the final beneficial owners of the company."
      />
      {fields.map((field, index) => (
        <div key={field.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 grid sm:grid-cols-2 gap-3">
          {BENEFICIAL_OWNER_FIELDS.map(([key, label]) => {
            const err = errors?.le_beneficial_owners?.[index]?.[key];
            const fieldPath = `le_beneficial_owners.${index}.${key}`;
            if (key === 'date_of_birth' || key === 'date_acquired_status') {
              return (
                <div key={key} data-field={fieldPath} className="flex flex-col">
                  <FieldLabel label={label} required={true} />
                  <Controller
                    name={fieldPath}
                    control={control}
                    rules={{ required: 'Requerido / Required' }}
                    render={({ field: { value, onChange } }) => (
                      <DateSelect value={value} onChange={onChange} hasError={!!err} />
                    )}
                  />
                  {err && <p className="text-xs text-red-500 mt-1">{err.message}</p>}
                </div>
              );
            }
            return (
              <div key={key} data-field={fieldPath} className="flex flex-col">
                <FieldLabel label={label} required={true} />
                <input
                  type="text"
                  {...register(fieldPath, { required: 'Requerido / Required' })}
                  className={inputClass(!!err)}
                />
                {err && <p className="text-xs text-red-500 mt-1">{err.message}</p>}
              </div>
            );
          })}
          {fields.length > minRows && (
            <button type="button" onClick={() => remove(index)} className="sm:col-span-2 text-xs text-red-500 hover:underline text-left">
              Eliminar beneficiario / Remove owner
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ full_name: '', id_card: '', date_of_birth: '', nationality: '', address: '', date_acquired_status: '' })}
        className="self-start text-sm font-semibold text-[#FF491A] hover:underline"
      >
        + Agregar beneficiario / Add owner
      </button>
    </div>
  );
}

function DocumentsStep({ docsConfig, documents, setDocuments, draftId, error }) {
  return (
    <div className="flex flex-col gap-4">
      {docsConfig.map((doc) => (
        <div key={doc.key} data-field={`document-${doc.key}`}>
          <FileUploadField
            draftId={draftId}
            docKey={doc.key}
            label={doc.label}
            instructions={doc.instructions}
            required={true}
            value={documents[doc.key] || null}
            onChange={(val) =>
              setDocuments((prev) => {
                const next = { ...prev };
                if (val) next[doc.key] = val;
                else delete next[doc.key];
                return next;
              })
            }
          />
        </div>
      ))}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

function FinalStep({ register, errors }) {
  return (
    <div className="flex flex-col gap-5">
      <label data-field="declaration_lawful_resources" className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          {...register('declaration_lawful_resources', { required: 'Debe aceptar esta declaración / You must accept this declaration' })}
          className="mt-1 w-4 h-4 accent-[#FF491A]"
        />
        <BilingualText
          className="text-sm md:text-base text-gray-700 dark:text-gray-300"
          text="Declaro que los recursos que entrego no provienen de ninguna actividad ilícita contemplada en el Código Penal panameño. / I declare that the resources I deliver do not come from any illicit activity contemplated in the Panamanian Penal Code."
        />
      </label>
      {errors.declaration_lawful_resources && <p className="text-xs text-red-500">{errors.declaration_lawful_resources.message}</p>}

      <label data-field="declaration_no_third_party_deposits" className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          {...register('declaration_no_third_party_deposits', { required: 'Debe aceptar esta declaración / You must accept this declaration' })}
          className="mt-1 w-4 h-4 accent-[#FF491A]"
        />
        <BilingualText
          className="text-sm md:text-base text-gray-700 dark:text-gray-300"
          text="No permitiré que terceros realicen depósitos en mis cuentas con recursos provenientes de actividades ilícitas. / I will not allow third parties to make deposits to my accounts with resources from illicit activities."
        />
      </label>
      {errors.declaration_no_third_party_deposits && <p className="text-xs text-red-500">{errors.declaration_no_third_party_deposits.message}</p>}

      <div data-field="signature_full_name" className="flex flex-col">
        <FieldLabel label="Nombre completo (firma) / Full name (signature)" required={true} />
        <input type="text" {...register('signature_full_name', { required: 'Requerido / Required' })} className={inputClass(!!errors.signature_full_name)} />
        {errors.signature_full_name && <p className="text-xs text-red-500 mt-1">{errors.signature_full_name.message}</p>}
      </div>
    </div>
  );
}

// ─── Steps builder ──────────────────────────────────────────────────────────────

const MIN_REFERENCES = 3;
const MIN_BENEFICIAL_OWNERS = 1;

function buildSteps(clientType) {
  const typeStep = { title: 'Tipo de cliente / Client Type', special: 'type' };
  if (!clientType) return [typeStep];

  const sections = sectionsForType(clientType).map((s) => ({ title: s.title, fields: s.fields }));
  const sharedStep = { title: 'Forma de pago y declaración / Payment & Declaration', fields: SHARED_DECLARATION_FIELDS };
  const refStep = { title: 'Referencias / References', special: 'references' };
  const docStep = { title: 'Documentos / Documents', special: 'documents' };
  const finalStep = { title: 'Declaración final / Final Declaration', special: 'final' };

  if (clientType === 'legal') {
    const beneficialStep = { title: 'Beneficiarios finales / Beneficial Owners', special: 'beneficial-owners' };
    return [typeStep, ...sections, beneficialStep, sharedStep, refStep, docStep, finalStep];
  }
  return [typeStep, ...sections, sharedStep, refStep, docStep, finalStep];
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function KycPage() {
  const [draftId] = useState(() => crypto.randomUUID());
  const [clientType, setClientType] = useState(null);
  const [typeError, setTypeError] = useState('');
  const [documents, setDocuments] = useState({});
  const [documentsError, setDocumentsError] = useState('');
  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, trigger, watch, control, getFieldState, formState: { errors } } = useForm({
    mode: 'onBlur',
    defaultValues: {
      reference_contacts: Array.from({ length: MIN_REFERENCES }, () => ({ name: '', relationship: '', phone: '', email: '' })),
      le_beneficial_owners: Array.from({ length: MIN_BENEFICIAL_OWNERS }, () => ({ full_name: '', id_card: '', date_of_birth: '', nationality: '', address: '', date_acquired_status: '' })),
    },
  });

  const { fields: referenceFields, append: appendReference, remove: removeReference } = useFieldArray({ control, name: 'reference_contacts' });
  const { fields: ownerFields, append: appendOwner, remove: removeOwner } = useFieldArray({ control, name: 'le_beneficial_owners' });

  const steps = buildSteps(clientType);
  const currentStep = steps[stepIndex];
  const totalSteps = steps.length;
  const docsConfig = clientType ? documentsForType(clientType) : [];

  function requiredFieldsForStep(step, values) {
    if (step.special === 'type' || step.special === 'documents') return [];
    if (step.special === 'references') {
      return referenceFields.flatMap((_, i) => REFERENCE_FIELDS.map(([key]) => `reference_contacts.${i}.${key}`));
    }
    if (step.special === 'beneficial-owners') {
      return ownerFields.flatMap((_, i) => BENEFICIAL_OWNER_FIELDS.map(([key]) => `le_beneficial_owners.${i}.${key}`));
    }
    if (step.special === 'final') {
      return ['declaration_lawful_resources', 'declaration_no_third_party_deposits', 'signature_full_name'];
    }
    return (step.fields || []).filter((f) => isRequired(f, values)).map((f) => f.name);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function scrollToField(selector) {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function scrollToFirstError(fieldNames) {
    // getFieldState reads live internal state — `errors` from the render
    // closure can be stale right after an awaited trigger() call.
    for (const name of fieldNames) {
      if (getFieldState(name).error) {
        scrollToField(`[data-field="${name}"]`);
        return;
      }
    }
  }

  async function goNext() {
    if (currentStep.special === 'type') {
      if (!clientType) { setTypeError('Por favor seleccione un tipo de cliente / Please select a client type'); return; }
      setTypeError('');
      setStepIndex((i) => i + 1);
      scrollToTop();
      return;
    }
    if (currentStep.special === 'documents') {
      const missing = docsConfig.find((d) => !documents[d.key]);
      if (missing) {
        setDocumentsError('Por favor suba todos los documentos requeridos. / Please upload all required documents.');
        scrollToField(`[data-field="document-${missing.key}"]`);
        return;
      }
      setDocumentsError('');
      setStepIndex((i) => i + 1);
      scrollToTop();
      return;
    }
    const fieldsToValidate = requiredFieldsForStep(currentStep, watch());
    const valid = await trigger(fieldsToValidate);
    if (valid) {
      setStepIndex((i) => Math.min(i + 1, totalSteps - 1));
      scrollToTop();
    } else {
      scrollToFirstError(fieldsToValidate);
    }
  }

  async function onSubmit(formData) {
    const fieldsToValidate = requiredFieldsForStep(currentStep, watch());
    const valid = await trigger(fieldsToValidate);
    if (!valid) {
      scrollToFirstError(fieldsToValidate);
      return;
    }

    setSubmitting(true);
    setServerError('');

    const payload = {
      ...formData,
      client_type: clientType,
      documents: Object.values(documents),
      website: formData.website || '',
    };
    if (clientType !== 'legal') delete payload.le_beneficial_owners;

    try {
      const res = await fetch('/api/cuestionario/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 429) {
        setServerError('Demasiadas solicitudes. Por favor intente más tarde. / Too many requests. Please try again later.');
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body.error || 'Error al enviar. Por favor intente de nuevo. / Submission error. Please try again.');
        return;
      }
      setDone(true);
    } catch {
      setServerError('Error de conexión. Por favor intente de nuevo. / Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
        <CuestionarioHeader />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-10 max-w-lg w-full text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">¡Enviado con éxito!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-1 text-sm">Su formulario KYC ha sido recibido.</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Your KYC form has been received.</p>
            <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">Nos pondremos en contacto con usted a la brevedad. / We will contact you shortly.</p>
          </div>
        </div>
      </div>
    );
  }

  const values = watch();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
      <CuestionarioHeader />

      <div className="h-1 bg-gray-200 dark:bg-gray-800">
        <div className="h-full bg-[#FF491A] transition-all duration-500" style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }} />
      </div>

      <div className="px-6 pt-6 pb-2 flex items-center justify-between max-w-2xl md:max-w-3xl mx-auto w-full">
        <span className="text-xs md:text-sm font-semibold text-[#FF491A] uppercase tracking-widest">
          Paso {stepIndex + 1} de {totalSteps}
        </span>
        <span className="text-xs md:text-sm text-gray-400 dark:text-gray-500">{splitBilingual(currentStep.title)[0]}</span>
      </div>

      <main className="flex-1 px-4 pb-16">
        <div className="max-w-2xl md:max-w-3xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" {...register('website')} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 md:p-10">
              <StepTitle title={currentStep.title} />

              <div className="flex flex-col gap-5">
                {currentStep.special === 'type' && (
                  <TypeStep clientType={clientType} setClientType={setClientType} error={typeError} />
                )}
                {currentStep.special === 'references' && (
                  <ReferencesStep fields={referenceFields} append={appendReference} remove={removeReference} register={register} errors={errors} minRows={MIN_REFERENCES} control={control} />
                )}
                {currentStep.special === 'beneficial-owners' && (
                  <BeneficialOwnersStep fields={ownerFields} append={appendOwner} remove={removeOwner} register={register} errors={errors} minRows={MIN_BENEFICIAL_OWNERS} control={control} />
                )}
                {currentStep.special === 'documents' && (
                  <DocumentsStep docsConfig={docsConfig} documents={documents} setDocuments={setDocuments} draftId={draftId} error={documentsError} />
                )}
                {currentStep.special === 'final' && (
                  <FinalStep register={register} errors={errors} />
                )}
                {!currentStep.special && currentStep.fields.map((field) => renderField(field, { register, errors, values, control }))}
              </div>
            </div>

            {serverError && <p className="mt-4 text-sm text-red-600 text-center">{serverError}</p>}

            <div className="flex items-center justify-between mt-6 gap-4">
              {stepIndex > 0 ? (
                <button
                  type="button"
                  onClick={() => { setStepIndex((s) => s - 1); scrollToTop(); }}
                  className="px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  ← Anterior / Back
                </button>
              ) : <div />}

              {stepIndex < totalSteps - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="px-8 py-3 rounded-full bg-[#FF491A] text-white text-sm md:text-base font-bold hover:bg-[#e6451a] transition shadow"
                >
                  Siguiente / Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-full bg-[#FF491A] text-white text-sm md:text-base font-bold hover:bg-[#e6451a] transition shadow disabled:opacity-60 flex items-center gap-2"
                >
                  {submitting && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  )}
                  {submitting ? 'Enviando...' : 'Enviar / Submit'}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
