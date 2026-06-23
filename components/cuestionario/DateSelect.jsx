'use client';
import { useState, useEffect } from 'react';

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = [
  { value: 1, label: 'Enero / January' }, { value: 2, label: 'Febrero / February' },
  { value: 3, label: 'Marzo / March' }, { value: 4, label: 'Abril / April' },
  { value: 5, label: 'Mayo / May' }, { value: 6, label: 'Junio / June' },
  { value: 7, label: 'Julio / July' }, { value: 8, label: 'Agosto / August' },
  { value: 9, label: 'Septiembre / September' }, { value: 10, label: 'Octubre / October' },
  { value: 11, label: 'Noviembre / November' }, { value: 12, label: 'Diciembre / December' },
];

function selectClass(hasError) {
  return `border rounded-lg px-2 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:ring-2 transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
    hasError ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 dark:border-gray-700 focus:ring-orange-400 focus:border-orange-400'
  }`;
}

function partsFromValue(value) {
  if (!value) return { y: '', m: '', d: '' };
  const [y, m, d] = value.split('-');
  return { y: y || '', m: m ? String(Number(m)) : '', d: d ? String(Number(d)) : '' };
}

export default function DateSelect({ value, onChange, hasError, yearsBack = 100, yearsForward = 15 }) {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear + yearsForward; y >= currentYear - yearsBack; y--) years.push(y);

  // Local state drives the visible selection — only synced FROM `value` when
  // it's a complete date (e.g. prefilled). This avoids the parent's onChange('')
  // (fired while the date is still incomplete) wiping out a partial selection.
  const [parts, setParts] = useState(() => partsFromValue(value));

  useEffect(() => {
    if (value) setParts(partsFromValue(value));
  }, [value]);

  function update(part, val) {
    const next = { ...parts, [part]: val };
    setParts(next);
    if (next.y && next.m && next.d) {
      onChange(`${next.y}-${String(next.m).padStart(2, '0')}-${String(next.d).padStart(2, '0')}`);
    } else {
      onChange('');
    }
  }

  const cls = selectClass(hasError);

  return (
    <div className="grid grid-cols-3 gap-2">
      <select value={parts.d} onChange={(e) => update('d', e.target.value)} className={cls}>
        <option value="">Día / Day</option>
        {DAYS.map((day) => <option key={day} value={day}>{day}</option>)}
      </select>
      <select value={parts.m} onChange={(e) => update('m', e.target.value)} className={cls}>
        <option value="">Mes / Month</option>
        {MONTHS.map((month) => <option key={month.value} value={month.value}>{month.label}</option>)}
      </select>
      <select value={parts.y} onChange={(e) => update('y', e.target.value)} className={cls}>
        <option value="">Año / Year</option>
        {years.map((year) => <option key={year} value={year}>{year}</option>)}
      </select>
    </div>
  );
}
