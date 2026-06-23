import { createSupabaseServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import KycTable from '@/components/admin/KycTable';

export const dynamic = 'force-dynamic';

export default async function KycListPage({ searchParams }) {
  const { q = '', filter = 'all', type = 'all', page = '1' } = await searchParams;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = 20;
  const offset = (pageNum - 1) * pageSize;

  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from('kyc_submissions')
    .select('id, created_at, read, client_type, display_name, display_secondary', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (filter === 'unread') query = query.eq('read', false);
  if (filter === 'read') query = query.eq('read', true);
  if (type === 'natural' || type === 'legal') query = query.eq('client_type', type);

  if (q) {
    query = query.or(`display_name.ilike.%${q}%,display_secondary.ilike.%${q}%`);
  }

  const { data: rows, count } = await query;
  const totalPages = Math.ceil((count || 0) / pageSize);

  const qs = (overrides = {}) => {
    const params = new URLSearchParams({ q, filter, type, ...overrides });
    return `?${params.toString()}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminNav />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Formularios KYC</h1>
          <span className="text-sm text-gray-500">{count ?? 0} total</span>
        </div>

        <form method="GET" className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Buscar por nombre, empresa…"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input type="hidden" name="filter" value={filter} />
          <input type="hidden" name="type" value={type} />
          <button type="submit" className="px-5 py-2 rounded-lg bg-[#FF491A] text-white text-sm font-medium">
            Buscar
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { value: 'all', label: 'Tous / All' },
            { value: 'unread', label: 'Non lus / Unread' },
            { value: 'read', label: 'Lus / Read' },
          ].map((f) => (
            <Link
              key={f.value}
              href={qs({ filter: f.value })}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                filter === f.value ? 'bg-[#FF491A] text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </Link>
          ))}
          <span className="w-px bg-gray-200 mx-1" />
          {[
            { value: 'all', label: 'Todos' },
            { value: 'natural', label: 'Persona Natural' },
            { value: 'legal', label: 'Empresa' },
          ].map((t) => (
            <Link
              key={t.value}
              href={qs({ type: t.value })}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                type === t.value ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        <KycTable rows={rows || []} />

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {pageNum > 1 && (
              <Link href={qs({ page: String(pageNum - 1) })} className="px-3 py-1.5 rounded border border-gray-300 text-sm hover:bg-gray-50">
                ← Anterior
              </Link>
            )}
            <span className="text-sm text-gray-500">{pageNum} / {totalPages}</span>
            {pageNum < totalPages && (
              <Link href={qs({ page: String(pageNum + 1) })} className="px-3 py-1.5 rounded border border-gray-300 text-sm hover:bg-gray-50">
                Siguiente →
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
