import { cache } from 'react';
import { createClient } from '@supabase/supabase-js';
import en from '@/messages/en.json';
import es from '@/messages/es.json';
import { CNS_COLLECTIONS, CNS_DEFAULT_WHATSAPP, allTextKeys } from './schema';

// Content of the Casco Notary Services pages. Source of truth is the database
// (tables cns_texts / cns_items, edited from /admin/cns). The JSON files in
// messages/ are only the fallback used while the tables are missing/empty or
// Supabase is unreachable, so the public site never breaks because of the CMS.

const FALLBACK = { en: en.CascoNotaryPage, es: es.CascoNotaryPage };

export function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

export function setPath(obj, path, value) {
  const keys = path.split('.');
  let o = obj;
  for (const k of keys.slice(0, -1)) {
    if (o[k] == null || typeof o[k] !== 'object') o[k] = {};
    o = o[k];
  }
  o[keys[keys.length - 1]] = value;
}

// Row of cns_items → the shape the components expect, for one locale.
// A blank translation falls back to the other language rather than showing
// an empty line on the page.
export function itemToContent(row, collection, locale) {
  const def = CNS_COLLECTIONS[collection];
  const pick = (field) => row[`${field}_${locale}`] || row[`${field}_${locale === 'en' ? 'es' : 'en'}`] || '';
  if (!def.titleKey) return pick('title');
  const out = { [def.titleKey]: pick('title') };
  if (def.bodyKey) out[def.bodyKey] = pick('body');
  return out;
}

function publicClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function fetchCns(supabase) {
  const [texts, items] = await Promise.all([
    supabase.from('cns_texts').select('key, locale, value'),
    supabase.from('cns_items').select('*').order('sort_order', { ascending: true }),
  ]);
  if (texts.error || items.error) return null;
  return { texts: texts.data || [], items: items.data || [] };
}

function withDefaults(locale) {
  const base = structuredClone(FALLBACK[locale]);
  if (!base.chrome.whatsappNumber) base.chrome.whatsappNumber = CNS_DEFAULT_WHATSAPP;
  return base;
}

function applyDb(content, db, locale) {
  const keys = new Set(allTextKeys());
  for (const row of db.texts) {
    if (row.locale === locale && keys.has(row.key)) setPath(content, row.key, row.value ?? '');
  }
  // Only replace a list when the table has been seeded; before that the
  // fallback JSON keeps the page complete.
  if (db.items.length > 0) {
    for (const [name, def] of Object.entries(CNS_COLLECTIONS)) {
      const rows = db.items.filter((r) => r.collection === name && r.active !== false);
      setPath(content, def.path, rows.map((r) => itemToContent(r, name, locale)));
    }
  }
  return content;
}

// Public pages: anonymous client, no cookies → pages stay statically
// generated. Edits show up through revalidatePath() in the admin actions.
export const getCnsContent = cache(async (locale) => {
  const content = withDefaults(locale);
  try {
    const db = await fetchCns(publicClient());
    if (db) applyDb(content, db, locale);
  } catch {
    // keep the fallback
  }
  return content;
});

// Admin editor: everything, in both languages, including hidden items.
// `supabase` is the logged-in server client.
export async function getCnsAdminData(supabase) {
  const db = await fetchCns(supabase);
  const ready = db !== null;

  const texts = {};
  for (const key of allTextKeys()) {
    texts[key] = {
      en: getPath(withDefaults('en'), key) ?? '',
      es: getPath(withDefaults('es'), key) ?? '',
    };
  }
  for (const row of db?.texts || []) {
    if (texts[row.key] && (row.locale === 'en' || row.locale === 'es')) texts[row.key][row.locale] = row.value ?? '';
  }

  const items = Object.fromEntries(Object.keys(CNS_COLLECTIONS).map((name) => [name, []]));
  for (const row of db?.items || []) {
    if (items[row.collection]) items[row.collection].push(row);
  }

  return { ready, seeded: (db?.items.length || 0) > 0, texts, items };
}
