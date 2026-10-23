'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { CNS_COLLECTIONS, CNS_LOCALES, allTextKeys } from '@/lib/cns/schema';

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Sesión expirada. Vuelve a iniciar sesión.');
  return supabase;
}

function refreshPublicPages() {
  revalidatePath('/[locale]/casco-notary-services', 'layout');
}

// entries: [{ key, locale, value }]
export async function saveCnsTexts(entries) {
  try {
    const supabase = await requireAdmin();
    const allowed = new Set(allTextKeys());
    const rows = (entries || []).map((e) => {
      if (!allowed.has(e.key) || !CNS_LOCALES.includes(e.locale)) throw new Error(`Campo no válido: ${e.key}`);
      return { key: e.key, locale: e.locale, value: String(e.value ?? ''), updated_at: new Date().toISOString() };
    });
    if (rows.length) {
      const { error } = await supabase.from('cns_texts').upsert(rows, { onConflict: 'key,locale' });
      if (error) throw new Error(error.message);
    }
    refreshPublicPages();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// items: [{ id, active, title_en, title_es, body_en, body_es }] in display order.
// The full list for the collection is sent, so rows missing from it are deleted.
export async function saveCnsItems(collection, items) {
  try {
    if (!CNS_COLLECTIONS[collection]) throw new Error('Lista no válida');
    const supabase = await requireAdmin();

    const rows = (items || []).map((it, i) => ({
      id: it.id,
      collection,
      sort_order: (i + 1) * 10,
      active: it.active !== false,
      title_en: String(it.title_en ?? ''),
      title_es: String(it.title_es ?? ''),
      body_en: String(it.body_en ?? ''),
      body_es: String(it.body_es ?? ''),
      updated_at: new Date().toISOString(),
    }));

    const { data: existing, error: readError } = await supabase.from('cns_items').select('id').eq('collection', collection);
    if (readError) throw new Error(readError.message);

    const keep = new Set(rows.map((r) => r.id));
    const toDelete = (existing || []).map((r) => r.id).filter((id) => !keep.has(id));
    if (toDelete.length) {
      const { error } = await supabase.from('cns_items').delete().in('id', toDelete);
      if (error) throw new Error(error.message);
    }
    if (rows.length) {
      const { error } = await supabase.from('cns_items').upsert(rows, { onConflict: 'id' });
      if (error) throw new Error(error.message);
    }
    refreshPublicPages();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
