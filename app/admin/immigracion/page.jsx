import { createSupabaseServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import ImmigracionTable from '@/components/admin/ImmigracionTable';

export const dynamic = 'force-dynamic';

export default async function ImmigracionListPage({ searchParams }) {
  const { q = '', filter = 'all', page = '1' } = await searchParams;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = 20;
  const offset = (pageNum - 1) * pageSize;

  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from('immigration_submissions')
    .select('id, created_at, read, apellidos, primer_y_segundo_nombre, nacionalidad, fecha_llegada_panama', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (filter === 'unread') query = query.eq('read', false);
  if (filter === 'read') query = query.eq('read', true);

  if (q) {
    query = query.or(
      `apellidos.ilike.%${q}%,primer_y_segundo_nombre.ilike.%${q}%,nacionalidad.ilike.%${q}%,numero_pasaporte.ilike.%${q}%`
    );
  }

  const { data: rows, count } = await query;
  const totalPages = Math.ceil((count || 0) / pageSize);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminNav />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Cuestionarios de inmigración</h1>
          <span className="text-sm text-gray-500">{count ?? 0} total</span>
        </div>

        <form method="GET" className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Buscar por apellido, nombre, nacionalidad, pasaporte…"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input type="hidden" name="filter" value={filter} />
          <button type="submit" className="px-5 py-2 rounded-lg bg-[#FF491A] text-white text-sm font-medium">
            Buscar
          </button>
        </form>

        <div className="flex gap-2 mb-4">
          {[
            { value: 'all', label: 'Tous / All' },
            { value: 'unread', label: 'Non lus / Unread' },
            { value: 'read', label: 'Lus / Read' },
          ].map((f) => (
            <Link
              key={f.value}
              href={`/admin/immigracion?filter=${f.value}&q=${q}`}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                filter === f.value
                  ? 'bg-[#FF491A] text-white'
                  : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        <ImmigracionTable rows={rows || []} />

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {pageNum > 1 && (
              <Link href={`/admin/immigracion?page=${pageNum - 1}&filter=${filter}&q=${q}`}
                className="px-3 py-1.5 rounded border border-gray-300 text-sm hover:bg-gray-50">
                ← Anterior
              </Link>
            )}
            <span className="text-sm text-gray-500">{pageNum} / {totalPages}</span>
            {pageNum < totalPages && (
              <Link href={`/admin/immigracion?page=${pageNum + 1}&filter=${filter}&q=${q}`}
                className="px-3 py-1.5 rounded border border-gray-300 text-sm hover:bg-gray-50">
                Siguiente →
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
