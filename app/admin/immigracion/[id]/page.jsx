import { createSupabaseServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Download } from 'lucide-react';
import AdminNav from '@/components/admin/AdminNav';
import CopyField from '@/components/admin/CopyField';
import { SECTIONS } from '@/data/immigration-fields';

export const dynamic = 'force-dynamic';

export default async function ImmigracionDetail({ params }) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data: row } = await supabase
    .from('immigration_submissions')
    .select('*')
    .eq('id', id)
    .single();

  if (!row) notFound();

  // Mark as read (admin is authenticated, RLS update policy applies)
  if (!row.read) {
    await supabase.from('immigration_submissions').update({ read: true }).eq('id', id);
  }

  const submittedAt = new Date(row.created_at).toLocaleString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminNav />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6 gap-3">
          <Link href="/admin/immigracion" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            ← Volver / Back
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">{submittedAt}</span>
            <a
              href={`/api/admin/immigracion/${id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-full bg-[#FF491A] text-white font-medium hover:bg-[#e6451a] transition"
            >
              <Download size={14} /> Descargar PDF
            </a>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">
              {row.apellidos}, {row.primer_y_segundo_nombre}
            </h1>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              row.read ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {row.read ? 'Leído / Read' : 'No leído / Unread'}
            </span>
          </div>
        </div>

        {SECTIONS.map((section) => {
          const populated = section.fields.filter(([key]) => row[key]);
          if (!populated.length) return null;
          return (
            <div key={section.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{section.title}</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {populated.map(([key, label]) => (
                  <div key={key} className="px-6 py-3 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                      <div className="text-sm text-gray-900 whitespace-pre-wrap">{row[key]}</div>
                    </div>
                    <CopyField value={String(row[key])} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
