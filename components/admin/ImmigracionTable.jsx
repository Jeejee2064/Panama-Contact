'use client';
import Link from 'next/link';
import { Download } from 'lucide-react';

export default function ImmigracionTable({ rows }) {
  if (!rows.length) {
    return <p className="text-sm text-gray-500 py-8 text-center">Sin resultados / No results</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Apellidos</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Nacionalidad</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Llegada</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Fecha de envío</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-orange-50 transition cursor-pointer">
                <td className="px-4 py-3 font-medium text-gray-900">
                  <Link href={`/admin/immigracion/${row.id}`} className="block w-full">{row.apellidos}</Link>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  <Link href={`/admin/immigracion/${row.id}`} className="block w-full">{row.primer_y_segundo_nombre}</Link>
                </td>
                <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                  <Link href={`/admin/immigracion/${row.id}`} className="block w-full">{row.nacionalidad}</Link>
                </td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                  <Link href={`/admin/immigracion/${row.id}`} className="block w-full">{row.fecha_llegada_panama || '—'}</Link>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/immigracion/${row.id}`} className="block">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      row.read ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {row.read ? 'Leído' : 'No leído'}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                  <Link href={`/admin/immigracion/${row.id}`} className="block w-full">
                    {new Date(row.created_at).toLocaleDateString('fr-FR')}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`/api/admin/immigracion/${row.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-orange-100 text-gray-500 hover:text-[#FF491A] transition"
                    title="Descargar PDF"
                  >
                    <Download size={15} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
