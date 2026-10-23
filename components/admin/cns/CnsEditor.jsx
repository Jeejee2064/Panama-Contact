'use client';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowDown, ArrowLeft, ArrowUp, Check, ExternalLink, Eye, EyeOff, GripVertical, Plus, Trash2 } from 'lucide-react';
import { saveCnsItems, saveCnsTexts } from '@/app/admin/cns/actions';
import { CNS_COLLECTIONS, CNS_LOCALES, CNS_LOCALE_LABELS, CNS_PAGES } from '@/lib/cns/schema';

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400';

function LangChip({ locale }) {
  return (
    <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 rounded px-1.5 py-0.5 mb-1">
      {locale} · {CNS_LOCALE_LABELS[locale]}
    </span>
  );
}

function Input({ type, value, onChange, placeholder }) {
  if (type === 'textarea') {
    const rows = Math.min(10, Math.max(2, Math.ceil((value || '').length / 70)));
    return <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${inputClass} resize-y`} />;
  }
  return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />;
}

// One text, shown in both languages side by side.
function TextField({ field, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800">{field.label}</label>
      {field.help && <p className="text-xs text-gray-500 mb-1">{field.help}</p>}
      {field.shared ? (
        <div className="mt-1 max-w-sm">
          <Input type={field.type} value={value.en} onChange={(v) => onChange({ en: v, es: v })} />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3 mt-1">
          {CNS_LOCALES.map((loc) => (
            <div key={loc}>
              <LangChip locale={loc} />
              <Input type={field.type} value={value[loc]} onChange={(v) => onChange({ ...value, [loc]: v })} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function IconButton({ onClick, disabled, title, children, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`w-8 h-8 rounded-lg border text-sm flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed ${
        danger ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );
}

// A list (services, prices, FAQ…): add / reorder / hide / delete.
function ItemList({ def, items, onChange }) {
  const update = (i, patch) => onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const move = (i, dir) => {
    const next = [...items];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    onChange(next);
  };
  const remove = (i) => {
    const label = items[i].title_en || items[i].title_es || 'esta fila';
    if (window.confirm(`¿Eliminar definitivamente “${label}”?\n\nSi solo quieres quitarla del sitio sin borrarla, usa el botón del ojo.`)) {
      onChange(items.filter((_, idx) => idx !== i));
    }
  };
  // Drag & drop: the card is only draggable while the grip is held, so text
  // inside the inputs can still be selected normally.
  const [dragFrom, setDragFrom] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [armed, setArmed] = useState(null);
  const endDrag = () => { setDragFrom(null); setDragOver(null); setArmed(null); };
  const drop = (to) => {
    if (dragFrom !== null && dragFrom !== to) {
      const next = [...items];
      const [moved] = next.splice(dragFrom, 1);
      next.splice(to, 0, moved);
      onChange(next);
    }
    endDrag();
  };
  const add = () =>
    onChange([...items, { id: crypto.randomUUID(), active: true, title_en: '', title_es: '', body_en: '', body_es: '' }]);

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-sm text-gray-400 italic">La lista está vacía.</p>}
      {items.map((it, i) => (
        <div
          key={it.id}
          draggable={armed === i}
          onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; setDragFrom(i); }}
          onDragOver={(e) => { if (dragFrom !== null) { e.preventDefault(); setDragOver(i); } }}
          onDrop={(e) => { e.preventDefault(); drop(i); }}
          onDragEnd={endDrag}
          className={`rounded-xl border p-4 transition ${it.active ? 'border-gray-200 bg-gray-50' : 'border-dashed border-gray-300 bg-gray-100 opacity-70'} ${
            dragFrom === i ? 'opacity-40' : ''
          } ${dragOver === i && dragFrom !== null && dragFrom !== i ? (dragFrom < i ? 'border-b-4 border-b-[#FF491A]' : 'border-t-4 border-t-[#FF491A]') : ''}`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span
                title="Arrastra para reordenar"
                onMouseDown={() => setArmed(i)}
                onMouseUp={() => setArmed(null)}
                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-700 p-1 -ml-1"
              >
                <GripVertical size={18} />
              </span>
              {def.itemLabel} {i + 1}
              {!it.active && <span className="ml-2 normal-case text-amber-700 bg-amber-100 rounded px-1.5 py-0.5">oculto en el sitio</span>}
            </span>
            <div className="flex gap-1.5">
              <IconButton title="Subir" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp size={16} /></IconButton>
              <IconButton title="Bajar" disabled={i === items.length - 1} onClick={() => move(i, 1)}><ArrowDown size={16} /></IconButton>
              <IconButton title={it.active ? 'Ocultar en el sitio (sin borrar)' : 'Volver a mostrar en el sitio'} onClick={() => update(i, { active: !it.active })}>
                {it.active ? <Eye size={16} /> : <EyeOff size={16} />}
              </IconButton>
              <IconButton title="Eliminar" danger onClick={() => remove(i)}><Trash2 size={16} /></IconButton>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {CNS_LOCALES.map((loc) => (
              <div key={loc} className="space-y-2">
                <LangChip locale={loc} />
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-0.5">{def.titleLabel}</label>
                  <Input type="text" value={it[`title_${loc}`]} onChange={(v) => update(i, { [`title_${loc}`]: v })} />
                </div>
                {def.bodyKey && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-0.5">{def.bodyLabel}</label>
                    <Input
                      type={def.bodyLabel === 'Precio' ? 'text' : 'textarea'}
                      placeholder={def.bodyPlaceholder}
                      value={it[`body_${loc}`]}
                      onChange={(v) => update(i, { [`body_${loc}`]: v })}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="w-full rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-semibold text-gray-600 hover:border-[#FF491A] hover:text-[#FF491A] transition">
        <span className="inline-flex items-center gap-1.5"><Plus size={16} />{def.addLabel}</span>
      </button>
      <p className="text-xs text-gray-400">Si una traducción se deja vacía, el sitio muestra la versión en inglés.</p>
    </div>
  );
}

function Section({ section, index, ready, initialTexts, initialItems }) {
  const def = section.collection ? CNS_COLLECTIONS[section.collection] : null;

  const pick = (src) => Object.fromEntries(section.fields.map((f) => [f.key, src[f.key]]));
  const [saved, setSaved] = useState(() => JSON.stringify({ t: pick(initialTexts), i: initialItems }));
  const [texts, setTexts] = useState(() => pick(initialTexts));
  const [items, setItems] = useState(initialItems);
  const [status, setStatus] = useState(null);
  const [pending, startTransition] = useTransition();

  const dirty = JSON.stringify({ t: texts, i: items }) !== saved;

  function save() {
    setStatus(null);
    startTransition(async () => {
      const entries = section.fields.flatMap((f) => CNS_LOCALES.map((loc) => ({ key: f.key, locale: loc, value: texts[f.key][loc] })));
      const results = [];
      if (entries.length) results.push(await saveCnsTexts(entries));
      if (def) results.push(await saveCnsItems(section.collection, items));
      const failed = results.find((r) => !r.ok);
      if (failed) {
        setStatus({ ok: false, message: failed.error });
      } else {
        setSaved(JSON.stringify({ t: texts, i: items }));
        setStatus({ ok: true, message: 'Guardado. El sitio se actualiza en unos segundos.' });
      }
    });
  }

  return (
    <section id={section.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm scroll-mt-6">
      <header className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-start gap-3">
        <span className="w-7 h-7 shrink-0 rounded-full bg-[#FF491A] text-white text-sm font-bold flex items-center justify-center">{index + 1}</span>
        <div>
          <h2 className="text-lg font-bold text-gray-900 leading-tight">{section.title}</h2>
          {section.help && <p className="text-sm text-gray-500 mt-0.5">{section.help}</p>}
        </div>
      </header>

      <div className="px-6 py-5 space-y-5">
        {section.fields.map((f) => (
          <TextField key={f.key} field={f} value={texts[f.key]} onChange={(v) => setTexts((p) => ({ ...p, [f.key]: v }))} />
        ))}
        {def && (
          <div className={section.fields.length ? 'pt-2 border-t border-gray-100' : ''}>
            {section.fields.length > 0 && <h3 className="text-sm font-semibold text-gray-800 mt-4 mb-3">Lista</h3>}
            <ItemList def={def} items={items} onChange={setItems} />
          </div>
        )}
      </div>

      <footer className="px-6 py-4 border-t border-gray-100 flex items-center gap-4 sticky bottom-0 bg-white/95 backdrop-blur rounded-b-2xl">
        <button
          type="button"
          onClick={save}
          disabled={!ready || !dirty || pending}
          className="px-5 py-2 rounded-lg bg-[#FF491A] text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {pending ? 'Guardando…' : 'Guardar esta sección'}
        </button>
        {status ? (
          <span className={`inline-flex items-center gap-1.5 text-sm ${status.ok ? 'text-green-700' : 'text-red-600'}`}>{status.ok ? <Check size={16} /> : <AlertTriangle size={16} />}{status.message}</span>
        ) : dirty ? (
          <span className="text-sm text-amber-700">Cambios sin guardar</span>
        ) : null}
      </footer>
    </section>
  );
}

export default function CnsEditor({ page, ready, initialTexts, initialItems }) {
  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
      <nav className="sticky top-0 z-20 -mx-4 px-4 py-3 mb-4 bg-gray-50/95 backdrop-blur border-b border-gray-200 flex flex-wrap gap-2" aria-label="Páginas">
        {CNS_PAGES.map((p) => (
          <Link
            key={p.slug}
            href={`/admin/cns/${p.slug}`}
            aria-current={p.slug === page.slug ? 'page' : undefined}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              p.slug === page.slug ? 'bg-[#FF491A] text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {p.title}
          </Link>
        ))}
      </nav>

      <Link href="/admin/cns" className="inline-block text-sm text-gray-500 hover:text-[#FF491A] mb-4">
        <span className="inline-flex items-center gap-1.5"><ArrowLeft size={16} />Todas las páginas</span>
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <p className="text-xs font-semibold text-[#FF491A] uppercase tracking-widest mb-1">Casco Notary Services</p>
          <h1 className="text-2xl font-bold text-gray-900">{page.title}</h1>
          <p className="text-sm text-gray-500">{page.description}</p>
        </div>
        <div className="flex gap-2 text-sm">
          <a href={page.path} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"><span className="inline-flex items-center gap-1.5">Ver en inglés<ExternalLink size={14} /></span></a>
          <a href={`/es${page.path}`} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"><span className="inline-flex items-center gap-1.5">Ver en español<ExternalLink size={14} /></span></a>
        </div>
      </div>

      {!ready && (
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Las tablas aún no existen: ejecuta <code className="bg-amber-100 px-1 rounded">supabase/cns-cms.sql</code> en Supabase para poder guardar.
        </div>
      )}

      {page.sections.length > 1 && (
        <p className="text-sm text-gray-500 mb-4">
          Esta página tiene {page.sections.length} secciones, en el mismo orden en que aparecen en el sitio. Cada sección se guarda por separado.
        </p>
      )}

      <div className="space-y-6">
        {page.sections.map((s, i) => (
          <Section
            key={s.id}
            section={s}
            index={i}
            ready={ready}
            initialTexts={initialTexts}
            initialItems={s.collection ? initialItems[s.collection] : []}
          />
        ))}
      </div>
    </main>
  );
}
