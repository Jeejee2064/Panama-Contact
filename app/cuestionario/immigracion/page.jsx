'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import CuestionarioHeader from '@/components/cuestionario/CuestionarioHeader';
import PhoneField from '@/components/cuestionario/PhoneField';
import DateSelect from '@/components/cuestionario/DateSelect';

// ─── Field definitions per step ───────────────────────────────────────────────

const STEPS = [
  {
    title: 'Identidad / Identity',
    fields: [
      { name: 'apellidos', label: 'Apellidos / Last name', type: 'text', required: true },
      { name: 'primer_y_segundo_nombre', label: 'Primer y segundo nombre / First and middle name', type: 'text', required: true },
      { name: 'otros_apellidos_nombres', label: 'Otros apellidos o nombres / Other names used', type: 'text', required: false },
      { name: 'apellido_de_casada', label: 'Apellido de casada / Maiden name', type: 'text', required: false },
      { name: 'fecha_de_nacimiento', label: 'Fecha de nacimiento / Date of birth', type: 'date', required: true },
      { name: 'lugar_de_nacimiento', label: 'Lugar de nacimiento / Place of birth (country, city, province)', type: 'text', required: true },
      { name: 'nacionalidad', label: 'Nacionalidad / Nationality', type: 'text', required: true },
      {
        name: 'sexo', label: 'Sexo / Sex', type: 'radio', required: true,
        options: [{ value: 'Masculino', label: 'Masculino / Male' }, { value: 'Femenino', label: 'Femenino / Female' }],
      },
      {
        name: 'estado_civil', label: 'Estado civil / Marital status', type: 'select', required: true,
        options: [
          { value: 'Soltero', label: 'Soltero / Single' },
          { value: 'Casado', label: 'Casado / Married' },
          { value: 'Divorciado', label: 'Divorciado / Divorced' },
          { value: 'Viudo', label: 'Viudo / Widowed' },
          { value: 'Union libre', label: 'Unión libre / Common law' },
        ],
      },
      { name: 'estatura', label: 'Estatura / Height (meters)', type: 'text', required: true },
      { name: 'color_cabello', label: 'Color de cabello / Hair color', type: 'text', required: true },
      { name: 'color_ojos', label: 'Color de ojos / Eye color', type: 'text', required: true },
      { name: 'color_piel', label: 'Color de piel / Skin color', type: 'text', required: true },
    ],
  },
  {
    title: 'Documentos / Travel Documents',
    fields: [
      { name: 'numero_pasaporte', label: 'N° de pasaporte / Passport number', type: 'text', required: true },
      { name: 'numero_carne_cedula', label: 'N° de carné o cédula / ID card number', type: 'text', required: false },
      { name: 'pasaporte_expedido_en', label: 'Pasaporte expedido en / Passport issued in', type: 'text', required: true },
      { name: 'fecha_expedicion_pasaporte', label: 'Fecha de expedición / Issue date', type: 'date', required: true },
      { name: 'fecha_vencimiento_pasaporte', label: 'Fecha de vencimiento / Expiry date', type: 'date', required: true },
    ],
  },
  { title: 'Familia / Family', special: 'step3' },
  {
    title: 'Domicilio en Panamá / Address in Panama',
    fields: [
      { name: 'direccion_domicilio_panama', label: 'Dirección y teléfono en Panamá / Address and phone in Panama', type: 'text', required: true },
      { name: 'con_quienes_reside', label: '¿Con quiénes reside? / Who do you live with?', type: 'text', required: true },
      {
        name: 'piensa_permanecer_domicilio', label: '¿Piensa permanecer en este domicilio? / Do you plan to stay at this address?',
        type: 'radio', required: true,
        options: [{ value: 'Sí', label: 'Sí / Yes' }, { value: 'No', label: 'No' }],
      },
      { name: 'direccion_postal_fax_email', label: 'Dirección postal, fax o e-mail / Postal address, fax or email', type: 'text', required: true },
      { name: 'nombre_propietario_domicilio', label: 'Nombre del propietario o arrendatario / Name of owner or tenant', type: 'text', required: true },
      { name: 'direccion_pais_origen', label: 'Dirección en país de origen / Address in country of origin', type: 'text', required: true },
      { name: 'telefono_domicilio', label: 'Teléfono de domicilio / Home phone', type: 'tel', required: true },
    ],
  },
  {
    title: 'Profesión / Occupation',
    fields: [
      { name: 'profesion_ocupacion', label: 'Profesión u ocupación / Profession or occupation', type: 'text', required: true },
      { name: 'ocupacion', label: 'Ocupación / Occupation', type: 'text', required: true },
      { name: 'actividad_desempenada', label: 'Actividad desempeñada / Activity performed', type: 'text', required: true },
      { name: 'nombre_empleador', label: 'Nombre, dirección y teléfono del empleador / Employer name, address and phone', type: 'text', required: false },
      { name: 'titulos_diplomas', label: 'Títulos o diplomas / Degrees or diplomas', type: 'text', required: true },
      { name: 'universidad_institucion', label: 'Universidad o institución / University or institution', type: 'text', required: true },
    ],
  },
  {
    title: 'Estancia en Panamá / Stay in Panama',
    fields: [
      { name: 'razon_presencia_panama', label: 'Razón de su presencia en Panamá / Reason for your presence in Panama', type: 'text', required: true },
      { name: 'tiempo_permanencia_panama', label: '¿Cuánto tiempo planea permanecer? / How long do you plan to stay?', type: 'text', required: true },
      { name: 'fecha_regreso_pais_origen', label: '¿Cuándo planea regresar? / When do you plan to return?', type: 'date', required: false },
      { name: 'medios_economicos', label: '¿Con qué medios económicos? / What financial means do you have?', type: 'text', required: true },
      { name: 'puerto_de_entrada', label: 'Puerto de entrada / Port of entry', type: 'text', required: true },
      { name: 'pais_de_procedencia', label: 'País de procedencia / Country of origin', type: 'text', required: true },
      { name: 'compania_transporte', label: 'Compañía de transporte / Transport company', type: 'text', required: true },
      { name: 'fecha_llegada_panama', label: 'Fecha de llegada a Panamá / Date of arrival in Panama', type: 'date', required: true },
    ],
  },
  {
    title: 'Responsable económico / Financial Guarantor',
    fields: [
      { name: 'nombre_responsable', label: '¿Quién se hará responsable económicamente? / Who will be financially responsible for you?', type: 'text', required: true },
      { name: 'direccion_responsable', label: 'Dirección del responsable / Guarantor\'s address', type: 'text', required: true },
      { name: 'telefono_responsable', label: 'Teléfono del responsable / Guarantor\'s phone', type: 'tel', required: true },
      { name: 'nombre_persona_responsable', label: 'Nombre de la persona responsable / Name of responsible person', type: 'text', required: false },
      { name: 'direccion_persona_responsable', label: 'Dirección de la persona responsable / Address of responsible person', type: 'text', required: false },
      { name: 'telefono_persona_responsable', label: 'Teléfono de la persona responsable / Phone of responsible person', type: 'tel', required: false },
    ],
  },
  // Step 8: Immigration History — handled specially (conditional textarea)
  { title: 'Historial migratorio / Immigration History', special: 'step8' },
  // Step 9: Legal Questions — handled specially (radio + conditional textarea × 8)
  { title: 'Preguntas legales / Legal Questions', special: 'step9' },
  // Step 10: Third party — handled specially (conditional textarea)
  { title: 'Llenado por tercero / Filled by Third Party', special: 'step10' },
];

const SPOUSE_STATUSES = ['Casado', 'Union libre'];

const STEP8_RADIOS = [
  { name: 'visitado_panama', label: '¿Ha visitado Panamá? / Have you visited Panama?' },
  { name: 'visa_aprobada', label: '¿Le han aprobado una visa panameña? / Have you been approved a Panamanian visa?' },
  { name: 'visa_negada', label: '¿Le han negado una visa panameña? / Have you been denied a Panamanian visa?' },
  { name: 'visa_cancelada_revocada', label: '¿Le han cancelado o revocado una visa? / Has a visa been cancelled or revoked?' },
  { name: 'solicitud_residencia_previa', label: '¿Alguien sometió solicitud de residencia en su nombre? / Has anyone filed a residency application on your behalf?' },
  { name: 'familiares_en_panama', label: '¿Tiene familiares con residencia o ciudadanía panameña? / Do you have relatives with Panamanian residency or citizenship?', conditional: 'familiares_en_panama_detalle' },
  { name: 'contrato_trabajo_panama', label: '¿Tiene contrato de trabajo en Panamá? / Do you have a work contract in Panama?' },
  { name: 'intencion_estudiar_panama', label: '¿Tiene intención de estudiar en Panamá? / Do you intend to study in Panama?' },
];

const STEP9_QUESTIONS = [
  { name: 'residencia_legal', label: '¿Su residencia en el país es legal? / Is your current residence legal?' },
  { name: 'detenido_condenado', label: '¿Ha sido detenido o condenado por algún delito? / Have you ever been arrested or convicted of any crime?' },
  { name: 'negado_entrada_deportacion', label: '¿Le han negado la entrada a Panamá o ha sido deportado? / Have you ever been denied entry to Panama or deported?' },
  { name: 'trafico_personas', label: '¿Ha participado en tráfico de personas? / Have you ever participated in human trafficking?' },
  { name: 'sustancia_controlada', label: '¿Ha distribuido o vendido ilícitamente una sustancia controlada? / Have you ever illegally distributed or sold a controlled substance?' },
  { name: 'explotacion_recursos', label: '¿Ha ejecutado actos de explotación de recursos naturales en Panamá? / Have you exploited natural resources in Panama?' },
  { name: 'enfermedad_contagiosa', label: '¿Ha sufrido alguna enfermedad contagiosa importante? / Have you ever suffered from a significant contagious disease?' },
  { name: 'prohibiciones_decreto_ley', label: 'Respecto al artículo 50 del Decreto Ley N°3 del 22 de febrero de 2008, ¿afirma o niega estar comprendido en dichas prohibiciones? / Regarding article 50 of Decree Law N°3 of February 22, 2008, do you affirm or deny being subject to said prohibitions?' },
];

// ─── Small helpers ─────────────────────────────────────────────────────────────

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
          <input
            type="radio"
            value={opt.value}
            {...register(name, { required })}
            className="sr-only peer"
          />
          <span className="px-4 py-2 md:px-5 md:py-2.5 rounded-full border border-gray-300 dark:border-gray-700 text-sm md:text-base text-gray-700 dark:text-gray-300 peer-checked:bg-[#FF491A] peer-checked:border-[#FF491A] peer-checked:text-white transition select-none">
            {opt.label}
          </span>
        </label>
      ))}
      {error && <p className="w-full text-xs text-red-500 mt-1">{error.message || 'Campo requerido / Required'}</p>}
    </div>
  );
}

function renderField(field, { register, errors, control }) {
  const err = errors[field.name];
  if (field.type === 'tel') {
    return (
      <div key={field.name} data-field={field.name} className="flex flex-col">
        <FieldLabel label={field.label} required={field.required} />
        <Controller
          name={field.name}
          control={control}
          rules={{ required: field.required ? 'Requerido / Required' : false }}
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
        <FieldLabel label={field.label} required={field.required} />
        <Controller
          name={field.name}
          control={control}
          rules={{ required: field.required ? 'Requerido / Required' : false }}
          render={({ field: { value, onChange } }) => (
            <DateSelect value={value} onChange={onChange} hasError={!!err} />
          )}
        />
        {err && <p className="text-xs text-red-500 mt-1">{err.message}</p>}
      </div>
    );
  }
  if (field.type === 'text') {
    return (
      <div key={field.name} data-field={field.name} className="flex flex-col">
        <FieldLabel label={field.label} required={field.required} />
        <input
          type="text"
          {...register(field.name, { required: field.required ? 'Requerido / Required' : false })}
          className={inputClass(!!err)}
        />
        {err && <p className="text-xs text-red-500 mt-1">{err.message}</p>}
      </div>
    );
  }
  if (field.type === 'textarea') {
    return (
      <div key={field.name} data-field={field.name} className="flex flex-col">
        <FieldLabel label={field.label} required={field.required} />
        <textarea
          rows={3}
          {...register(field.name, { required: field.required ? 'Requerido / Required' : false })}
          className={inputClass(!!err)}
        />
        {err && <p className="text-xs text-red-500 mt-1">{err.message}</p>}
      </div>
    );
  }
  if (field.type === 'radio') {
    return (
      <div key={field.name} data-field={field.name} className="flex flex-col gap-1">
        <FieldLabel label={field.label} required={field.required} />
        <RadioPills name={field.name} options={field.options} register={register} error={err} required={field.required ? 'Requerido / Required' : false} />
      </div>
    );
  }
  if (field.type === 'select') {
    return (
      <div key={field.name} data-field={field.name} className="flex flex-col">
        <FieldLabel label={field.label} required={field.required} />
        <select
          {...register(field.name, { required: field.required ? 'Requerido / Required' : false })}
          className={inputClass(!!err)}
        >
          <option value="">— seleccionar / select —</option>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {err && <p className="text-xs text-red-500 mt-1">{err.message}</p>}
      </div>
    );
  }
  return null;
}

// ─── Special step components ──────────────────────────────────────────────────

function Step3({ register, errors, watch }) {
  const estadoCivil = watch('estado_civil');
  const hasSpouse = SPOUSE_STATUSES.includes(estadoCivil);

  return (
    <div className="flex flex-col gap-5">
      {[
        { name: 'nombre_completo_padre', label: 'Nombre completo del padre y su nacionalidad / Father\'s full name and nationality' },
        { name: 'nombre_completo_madre', label: 'Nombre completo de la madre y su nacionalidad / Mother\'s full name and nationality' },
      ].map(({ name, label }) => (
        <div key={name} data-field={name} className="flex flex-col">
          <FieldLabel label={label} required={true} />
          <input type="text" {...register(name, { required: 'Requerido / Required' })} className={inputClass(!!errors[name])} />
          {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name].message}</p>}
        </div>
      ))}

      {hasSpouse && [
        { name: 'nombre_conyuge', label: 'Nombre del cónyuge / Spouse\'s name' },
        { name: 'nacionalidad_conyuge', label: 'Nacionalidad del cónyuge / Spouse\'s nationality' },
        { name: 'tipo_documento_conyuge', label: 'Tipo de documento del cónyuge / Spouse\'s document type' },
        { name: 'numero_documento_conyuge', label: 'N° del documento del cónyuge / Spouse\'s document number' },
      ].map(({ name, label }) => (
        <div key={name} data-field={name} className="flex flex-col">
          <FieldLabel label={label} required={true} />
          <input type="text" {...register(name, { required: 'Requerido / Required' })} className={inputClass(!!errors[name])} />
          {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name].message}</p>}
        </div>
      ))}

      <div data-field="personas_ingresaron_con_usted" className="flex flex-col">
        <FieldLabel label="Nombre y parentesco de las personas que ingresaron con usted / Name and relationship of people who entered with you" required={false} />
        <textarea rows={3} {...register('personas_ingresaron_con_usted')} className={inputClass(false)} />
      </div>
    </div>
  );
}

function Step8({ register, errors, watch }) {
  const familiares = watch('familiares_en_panama');
  return (
    <div className="flex flex-col gap-5">
      {STEP8_RADIOS.map((q) => (
        <div key={q.name} data-field={q.name} className="flex flex-col gap-1">
          <FieldLabel label={q.label} required={true} />
          <RadioPills
            name={q.name}
            options={[{ value: 'Sí', label: 'Sí / Yes' }, { value: 'No', label: 'No' }]}
            register={register}
            error={errors[q.name]}
            required="Requerido / Required"
          />
          {q.conditional && familiares === 'Sí' && (
            <div data-field="familiares_en_panama_detalle" className="mt-2">
              <FieldLabel label="Nombre y parentesco / Name and relationship" required={true} />
              <textarea
                rows={3}
                {...register('familiares_en_panama_detalle', { required: 'Requerido / Required' })}
                className={inputClass(!!errors.familiares_en_panama_detalle)}
              />
              {errors.familiares_en_panama_detalle && (
                <p className="text-xs text-red-500 mt-1">{errors.familiares_en_panama_detalle.message}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Step9({ register, errors, watch }) {
  return (
    <div className="flex flex-col gap-6">
      {STEP9_QUESTIONS.map((q) => {
        const val = watch(q.name);
        const detailName = q.name + '_detalle';
        return (
          <div key={q.name} data-field={q.name} className="flex flex-col gap-1">
            <FieldLabel label={q.label} required={true} />
            <RadioPills
              name={q.name}
              options={[{ value: 'Sí', label: 'Sí / Yes' }, { value: 'No', label: 'No' }]}
              register={register}
              error={errors[q.name]}
              required="Requerido / Required"
            />
            {val === 'Sí' && (
              <div data-field={detailName} className="mt-2">
                <FieldLabel label="Por favor explique / Please explain" required={true} />
                <textarea
                  rows={3}
                  {...register(detailName, { required: 'Requerido / Required' })}
                  className={inputClass(!!errors[detailName])}
                />
                {errors[detailName] && (
                  <p className="text-xs text-red-500 mt-1">{errors[detailName].message}</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Step10({ register, errors, watch }) {
  const llenada = watch('solicitud_llenada_otra_persona');
  return (
    <div className="flex flex-col gap-5">
      <div data-field="solicitud_llenada_otra_persona" className="flex flex-col gap-1">
        <FieldLabel label="¿Esta solicitud fue llenada por otra persona? / Was this form filled out by someone else?" required={true} />
        <RadioPills
          name="solicitud_llenada_otra_persona"
          options={[{ value: 'Sí', label: 'Sí / Yes' }, { value: 'No', label: 'No' }]}
          register={register}
          error={errors.solicitud_llenada_otra_persona}
          required="Requerido / Required"
        />
      </div>
      {llenada === 'Sí' && (
        <div data-field="datos_persona_que_lleno" className="flex flex-col gap-1">
          <FieldLabel label="Datos de la persona que llenó la solicitud (nombre, dirección, nacionalidad, estado civil, N° documento, parentesco) / Details of the person who filled the form (name, address, nationality, marital status, ID/passport number, relationship)" required={true} />
          <textarea
            rows={5}
            {...register('datos_persona_que_lleno', { required: 'Requerido / Required' })}
            className={inputClass(!!errors.datos_persona_que_lleno)}
          />
          {errors.datos_persona_que_lleno && (
            <p className="text-xs text-red-500 mt-1">{errors.datos_persona_que_lleno.message}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ImmigracionPage() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, trigger, watch, control, getFieldState, formState: { errors } } = useForm({ mode: 'onBlur' });

  const totalSteps = STEPS.length;
  const currentStep = STEPS[step];

  // Collect required field names for the current step
  function requiredFieldsForStep(idx) {
    const s = STEPS[idx];
    if (s.special === 'step3') {
      const names = ['nombre_completo_padre', 'nombre_completo_madre'];
      if (SPOUSE_STATUSES.includes(watch('estado_civil'))) {
        names.push('nombre_conyuge', 'nacionalidad_conyuge', 'tipo_documento_conyuge', 'numero_documento_conyuge');
      }
      return names;
    }
    if (s.special === 'step8') {
      const names = STEP8_RADIOS.map((q) => q.name);
      const famVal = watch('familiares_en_panama');
      if (famVal === 'Sí') names.push('familiares_en_panama_detalle');
      return names;
    }
    if (s.special === 'step9') {
      const names = STEP9_QUESTIONS.map((q) => q.name);
      STEP9_QUESTIONS.forEach((q) => {
        if (watch(q.name) === 'Sí') names.push(q.name + '_detalle');
      });
      return names;
    }
    if (s.special === 'step10') {
      const names = ['solicitud_llenada_otra_persona'];
      if (watch('solicitud_llenada_otra_persona') === 'Sí') names.push('datos_persona_que_lleno');
      return names;
    }
    return (s.fields || []).filter((f) => f.required).map((f) => f.name);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function scrollToFirstError(fieldNames) {
    // getFieldState reads live internal state — `errors` from the render
    // closure can be stale right after an awaited trigger() call.
    for (const name of fieldNames) {
      if (getFieldState(name).error) {
        const el = document.querySelector(`[data-field="${name}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
      }
    }
  }

  async function goNext() {
    const fieldsToValidate = requiredFieldsForStep(step);
    const valid = await trigger(fieldsToValidate);
    if (valid) {
      setStep((s) => Math.min(s + 1, totalSteps - 1));
      scrollToTop();
    } else {
      scrollToFirstError(fieldsToValidate);
    }
  }

  async function onSubmit(data) {
    // Last step validation
    const fieldsToValidate = requiredFieldsForStep(step);
    const valid = await trigger(fieldsToValidate);
    if (!valid) {
      scrollToFirstError(fieldsToValidate);
      return;
    }

    setSubmitting(true);
    setServerError('');

    try {
      const res = await fetch('/api/cuestionario/immigracion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, website: data.website || '' }),
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
            <p className="text-gray-500 dark:text-gray-400 mb-1 text-sm">Su cuestionario ha sido recibido.</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Your questionnaire has been received.</p>
            <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">Nos pondremos en contacto con usted a la brevedad. / We will contact you shortly.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
      <CuestionarioHeader />

      {/* Progress bar */}
      <div className="h-1 bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full bg-[#FF491A] transition-all duration-500"
          style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step counter */}
      <div className="px-6 pt-6 pb-2 flex items-center justify-between max-w-2xl md:max-w-3xl mx-auto w-full">
        <span className="text-xs md:text-sm font-semibold text-[#FF491A] uppercase tracking-widest">
          Paso {step + 1} de {totalSteps}
        </span>
        <span className="text-xs md:text-sm text-gray-400 dark:text-gray-500">{splitBilingual(currentStep.title)[0]}</span>
      </div>

      {/* Form */}
      <main className="flex-1 px-4 pb-16">
        <div className="max-w-2xl md:max-w-3xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Honeypot */}
            <input type="text" {...register('website')} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 md:p-10">
              <StepTitle title={currentStep.title} />

              <div className="flex flex-col gap-5">
                {currentStep.special === 'step3' && (
                  <Step3 register={register} errors={errors} watch={watch} />
                )}
                {currentStep.special === 'step8' && (
                  <Step8 register={register} errors={errors} watch={watch} />
                )}
                {currentStep.special === 'step9' && (
                  <Step9 register={register} errors={errors} watch={watch} />
                )}
                {currentStep.special === 'step10' && (
                  <Step10 register={register} errors={errors} watch={watch} />
                )}
                {!currentStep.special && currentStep.fields.map((field) =>
                  renderField(field, { register, errors, control })
                )}
              </div>
            </div>

            {serverError && (
              <p className="mt-4 text-sm text-red-600 text-center">{serverError}</p>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 gap-4">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => { setStep((s) => s - 1); scrollToTop(); }}
                  className="px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  ← Anterior / Back
                </button>
              ) : <div />}

              {step < totalSteps - 1 ? (
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
