'use client';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, Reorder, useDragControls } from 'framer-motion';
import { AlertTriangle, ArrowDown, ArrowLeft, ArrowUp, Check, ChevronDown, ChevronsUpDown, ExternalLink, Eye, EyeOff, GripVertical, Loader2, Plus, Trash2 } from 'lucide-react';
import { saveCnsItems, saveCnsTexts } from '@/app/admin/cns/actions';
import { CNS_COLLECTIONS, CNS_LOCALES, CNS_LOCALE_LABELS, CNS_PAGES } from '@/lib/cns/schema';

const inputClass =
  'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50/60 placeholder:text-gray-300 hover:border-gray-300 focus:bg-white focus:outline-none focus:border-[#FF491A] focus:ring-4 focus:ring-orange-100 transition';

function LangChip({ locale }) {
  return (
    <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-[#0F1B2A] text-[#C9A55C] rounded-full px-2 py-0.5">
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

function IconButton({ onClick, disabled, title, children, tone = 'default', active }) {
  const tones = {
    default: 'text-gray-500 hover:text-gray-900 hover:bg-gray-100',
    danger: 'text-gray-400 hover:text-red-600 hover:bg-red-50',
  };
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      whileTap={{ scale: 0.88 }}
      className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-colors disabled:opacity-25 disabled:cursor-not-allowed ${tones[tone]} ${active ? 'bg-amber-100 text-amber-700' : ''}`}
    >
      {children}
    </motion.button>
  );
}

const spring = { type: 'spring', stiffness: 520, damping: 40, mass: 0.8 };

// One row of a list. Collapsed = a compact line that is easy to drag;
// expanded = the full EN/ES form.
function ItemRow({ def, item, index, count, open, flash, confirming, onToggle, onUpdate, onMove, onRemove }) {
  const controls = useDragControls();
  const preview = item.title_en || item.title_es || '(sin título)';
  const sub = def.bodyKey ? item.body_en || item.body_es : '';

  return (
    <Reorder.Item
      as="div"
      value={item}
      dragListener={false}
      dragControls={controls}
      layout="position"
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: spring }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
      whileDrag={{ scale: 1.015, boxShadow: '0 18px 40px -12px rgba(15,27,42,0.28)', zIndex: 20 }}
      transition={spring}
      className={`relative rounded-xl border bg-white ${
        item.active ? 'border-gray-200' : 'border-dashed border-gray-300 bg-gray-50'
      } ${flash ? 'ring-2 ring-[#FF491A]/50 border-[#FF491A]/60' : ''} transition-[box-shadow,border-color] duration-500`}
    >
      <div className="flex items-center gap-2 pl-2 pr-2 py-2">
        <span
          title="Arrastra para reordenar"
          onPointerDown={(e) => controls.start(e)}
          style={{ touchAction: 'none' }}
          className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-[#FF491A] p-1.5 rounded-md hover:bg-orange-50 transition-colors select-none"
        >
          <GripVertical size={18} />
        </span>
        <span className="w-6 h-6 shrink-0 rounded-md bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center tabular-nums">
          {index + 1}
        </span>

        <button type="button" onClick={onToggle} className={`flex-1 min-w-0 text-left flex items-center gap-3 py-1 ${item.active ? '' : 'opacity-50'}`}>
          <span className="font-medium text-sm text-gray-900 truncate">{preview}</span>
          {sub && !open && <span className="hidden md:block text-xs text-gray-400 truncate max-w-[40%]">{sub}</span>}
          {!item.active && (
            <span className="shrink-0 text-[11px] font-semibold text-amber-700 bg-amber-100 rounded-full px-2 py-0.5">oculto</span>
          )}
        </button>

        <div className="flex items-center gap-0.5 shrink-0">
          <IconButton title="Subir" disabled={index === 0} onClick={() => onMove(-1)}><ArrowUp size={16} /></IconButton>
          <IconButton title="Bajar" disabled={index === count - 1} onClick={() => onMove(1)}><ArrowDown size={16} /></IconButton>
          <IconButton
            title={item.active ? 'Ocultar en el sitio (sin borrar)' : 'Volver a mostrar en el sitio'}
            onClick={() => onUpdate({ active: !item.active })}
            active={!item.active}
          >
            {item.active ? <Eye size={16} /> : <EyeOff size={16} />}
          </IconButton>
          {confirming ? (
            <motion.button
              type="button"
              onClick={onRemove}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-8 px-2.5 rounded-lg bg-red-600 text-white text-xs font-semibold flex items-center gap-1"
            >
              <Trash2 size={14} /> ¿Seguro?
            </motion.button>
          ) : (
            <IconButton title="Eliminar" tone="danger" onClick={onRemove}><Trash2 size={16} /></IconButton>
          )}
          <IconButton title={open ? 'Cerrar' : 'Editar'} onClick={onToggle}>
            <motion.span animate={{ rotate: open ? 180 : 0 }} className="flex"><ChevronDown size={18} /></motion.span>
          </IconButton>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="grid md:grid-cols-2 gap-4 px-4 pb-4 pt-3 mx-2 border-t border-gray-100">
              {CNS_LOCALES.map((loc) => (
                <div key={loc} className="space-y-2.5">
                  <LangChip locale={loc} />
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{def.titleLabel}</label>
                    <Input type="text" value={item[`title_${loc}`]} onChange={(v) => onUpdate({ [`title_${loc}`]: v })} />
                  </div>
                  {def.bodyKey && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{def.bodyLabel}</label>
                      <Input
                        type={def.bodyLabel === 'Precio' ? 'text' : 'textarea'}
                        placeholder={def.bodyPlaceholder}
                        value={item[`body_${loc}`]}
                        onChange={(v) => onUpdate({ [`body_${loc}`]: v })}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}

// A list (services, prices, FAQ…): drag to reorder, add, hide, delete.
function ItemList({ def, items, onChange }) {
  const [openIds, setOpenIds] = useState(() => new Set());
  const [flashId, setFlashId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const toggle = (id) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const flash = (id) => {
    setFlashId(id);
    setTimeout(() => setFlashId((cur) => (cur === id ? null : cur)), 900);
  };
  const update = (id, patch) => onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const move = (i, dir) => {
    const next = [...items];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    onChange(next);
    flash(items[i].id);
  };
  // Two-step delete: first click arms the button, second one deletes.
  const remove = (id) => {
    if (confirmId !== id) {
      setConfirmId(id);
      setTimeout(() => setConfirmId((cur) => (cur === id ? null : cur)), 3000);
      return;
    }
    setConfirmId(null);
    onChange(items.filter((it) => it.id !== id));
  };
  const add = () => {
    const id = crypto.randomUUID();
    onChange([...items, { id, active: true, title_en: '', title_es: '', body_en: '', body_es: '' }]);
    setOpenIds((prev) => new Set(prev).add(id));
  };

  const allOpen = items.length > 0 && items.every((it) => openIds.has(it.id));

  return (
    <div>
      {items.length > 1 && (
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <GripVertical size={14} /> Arrastra desde el icono para cambiar el orden
          </p>
          <button
            type="button"
            onClick={() => setOpenIds(allOpen ? new Set() : new Set(items.map((it) => it.id)))}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#FF491A]/40 bg-orange-50 px-3 py-1.5 text-sm font-semibold text-[#FF491A] hover:bg-[#FF491A] hover:text-white transition-colors"
          >
            <ChevronsUpDown size={16} /> {allOpen ? 'Cerrar todo' : 'Abrir todo'}
          </button>
        </div>
      )}

      <Reorder.Group as="div" axis="y" values={items} onReorder={onChange} className="space-y-2">
        <AnimatePresence initial={false}>
          {items.map((it, i) => (
            <ItemRow
              key={it.id}
              def={def}
              item={it}
              index={i}
              count={items.length}
              open={openIds.has(it.id)}
              flash={flashId === it.id}
              confirming={confirmId === it.id}
              onToggle={() => toggle(it.id)}
              onUpdate={(patch) => update(it.id, patch)}
              onMove={(dir) => move(i, dir)}
              onRemove={() => remove(it.id)}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {items.length === 0 && <p className="text-sm text-gray-400 italic py-3">La lista está vacía.</p>}

      <motion.button
        type="button"
        onClick={add}
        whileTap={{ scale: 0.99 }}
        className="mt-3 w-full rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-semibold text-gray-500 hover:border-[#FF491A] hover:text-[#FF491A] hover:bg-orange-50/50 transition-colors"
      >
        <span className="inline-flex items-center gap-1.5"><Plus size={16} />{def.addLabel}</span>
      </motion.button>
      <p className="text-xs text-gray-400 mt-2">Si una traducción se deja vacía, el sitio muestra la versión en inglés.</p>
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
  const showStatus = dirty && status?.ok ? null : status;

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
    <motion.section
      id={section.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 6) * 0.05, duration: 0.3, ease: 'easeOut' }}
      className={`bg-white rounded-2xl border shadow-sm scroll-mt-20 transition-colors duration-300 ${dirty ? 'border-amber-300' : 'border-gray-100'}`}
    >
      <header className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-start gap-3">
        <span className="relative w-8 h-8 shrink-0 rounded-xl bg-[#0F1B2A] text-[#C9A55C] text-sm font-bold flex items-center justify-center">
          {index + 1}
          {dirty && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 ring-2 ring-white" />}
        </span>
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
        <motion.button
          type="button"
          onClick={save}
          disabled={!ready || !dirty || pending}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF491A] text-white text-sm font-semibold shadow-sm shadow-orange-200 hover:bg-[#e8410f] transition-colors disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {pending && <Loader2 size={16} className="animate-spin" />}
          {pending ? 'Guardando…' : 'Guardar esta sección'}
        </motion.button>
        <AnimatePresence mode="wait" initial={false}>
          {showStatus ? (
            <motion.span
              key={showStatus.message}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`inline-flex items-center gap-1.5 text-sm ${showStatus.ok ? 'text-green-700' : 'text-red-600'}`}
            >
              {showStatus.ok ? <Check size={16} /> : <AlertTriangle size={16} />}{showStatus.message}
            </motion.span>
          ) : dirty ? (
            <motion.span key="dirty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-amber-700">
              Cambios sin guardar
            </motion.span>
          ) : null}
        </AnimatePresence>
      </footer>
    </motion.section>
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
            className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              p.slug === page.slug ? 'text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {p.slug === page.slug && (
              <motion.span layoutId="cns-active-tab" transition={spring} className="absolute inset-0 rounded-full bg-[#FF491A]" />
            )}
            <span className="relative">{p.title}</span>
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
