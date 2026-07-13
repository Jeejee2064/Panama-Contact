import { createSupabaseServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import LeadsTable from '@/components/admin/LeadsTable';

export const dynamic = 'force-dynamic';

export default async function LeadsListPage({ searchParams }) {
  const { q = '', source = 'all', page = '1' } = await searchParams;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = 20;
  const offset = (pageNum - 1) * pageSize;

  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from('leads')
    .select('id, created_at, email, phone, calc_inputs, result_bucket, status', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (source === 'A' || source === 'B') query = query.eq('calc_inputs->>sourcePage', source);

  if (q) {
    query = query.ilike('email', `%${q}%`);
  }

  const { data: rows, count } = await query;
  const totalPages = Math.ceil((count || 0) / pageSize);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminNav />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tax calculator leads</h1>
          <span className="text-sm text-gray-500">{count ?? 0} total</span>
        </div>

        <form method="GET" className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by email…"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input type="hidden" name="source" value={source} />
          <button type="submit" className="px-5 py-2 rounded-lg bg-[#FF491A] text-white text-sm font-medium">
            Search
          </button>
        </form>

        <div className="flex gap-2 mb-4">
          {[
            { value: 'all', label: 'All' },
            { value: 'A', label: 'Quiz' },
            { value: 'B', label: 'Calculator' },
          ].map((f) => (
            <Link
              key={f.value}
              href={`/admin/leads?source=${f.value}&q=${q}`}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                source === f.value
                  ? 'bg-[#FF491A] text-white'
                  : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        <LeadsTable rows={rows || []} />

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {pageNum > 1 && (
              <Link href={`/admin/leads?page=${pageNum - 1}&source=${source}&q=${q}`}
                className="px-3 py-1.5 rounded border border-gray-300 text-sm hover:bg-gray-50">
                ← Previous
              </Link>
            )}
            <span className="text-sm text-gray-500">{pageNum} / {totalPages}</span>
            {pageNum < totalPages && (
              <Link href={`/admin/leads?page=${pageNum + 1}&source=${source}&q=${q}`}
                className="px-3 py-1.5 rounded border border-gray-300 text-sm hover:bg-gray-50">
                Next →
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
