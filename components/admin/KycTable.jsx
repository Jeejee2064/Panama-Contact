'use client';
import Link from 'next/link';

export default function KycTable({ rows }) {
  if (!rows.length) {
    return <p className="text-sm text-gray-500 py-8 text-center">Sin resultados / No results</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre / Empresa</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Detalle</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Fecha de envío</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-orange-50 transition cursor-pointer">
                <td className="px-4 py-3">
                  <Link href={`/admin/kyc/${row.id}`} className="block">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      row.client_type === 'legal' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {row.client_type === 'legal' ? 'Empresa' : 'Persona'}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  <Link href={`/admin/kyc/${row.id}`} className="block w-full">{row.display_name}</Link>
                </td>
                <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                  <Link href={`/admin/kyc/${row.id}`} className="block w-full truncate max-w-xs">{row.display_secondary || '—'}</Link>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/kyc/${row.id}`} className="block">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      row.read ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {row.read ? 'Leído' : 'No leído'}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                  <Link href={`/admin/kyc/${row.id}`} className="block w-full">
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
