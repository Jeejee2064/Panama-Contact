'use client';
import Link from 'next/link';

const SOURCE_LABEL = { A: 'Quiz', B: 'Calculator' };

export default function LeadsTable({ rows }) {
  if (!rows.length) {
    return <p className="text-sm text-gray-500 py-8 text-center">Sin resultados / No results</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Source</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Locale</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-orange-50 transition cursor-pointer">
                <td className="px-4 py-3 font-medium text-gray-900">
                  <Link href={`/admin/leads/${row.id}`} className="block w-full">{row.first_name}</Link>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  <Link href={`/admin/leads/${row.id}`} className="block w-full">{row.email}</Link>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <Link href={`/admin/leads/${row.id}`} className="block w-full">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      row.source_page === 'A' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {SOURCE_LABEL[row.source_page] ?? row.source_page}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600 uppercase hidden sm:table-cell">
                  <Link href={`/admin/leads/${row.id}`} className="block w-full">{row.locale}</Link>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                  <Link href={`/admin/leads/${row.id}`} className="block w-full">
                    {new Date(row.created_at).toLocaleDateString('fr-FR')}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
