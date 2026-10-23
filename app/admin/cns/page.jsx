import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import AdminNav from '@/components/admin/AdminNav';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getCnsAdminData } from '@/lib/cns/content';
import { CNS_PAGES } from '@/lib/cns/schema';

export const dynamic = 'force-dynamic';

export default async function CnsHome() {
  const supabase = await createSupabaseServerClient();
  const { ready } = await getCnsAdminData(supabase);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminNav />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        <p className="text-xs font-semibold text-[#FF491A] uppercase tracking-widest mb-2">Casco Notary Services</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Contenido del sitio</h1>
        <p className="text-sm text-gray-500 mb-8">
          Elige la página que quieres modificar. Cada texto se edita en inglés y en español, y los cambios aparecen
          en el sitio unos segundos después de guardar.
        </p>

        {!ready && (
          <div className="mb-8 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Las tablas todavía no existen en la base de datos.</strong> Ejecuta una vez el archivo{' '}
            <code className="bg-amber-100 px-1 rounded">supabase/cns-cms.sql</code> en el editor SQL de Supabase.
            Mientras tanto el sitio sigue funcionando con los textos actuales y no se puede guardar.
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          {CNS_PAGES.map((p) => (
            <Link
              key={p.slug}
              href={`/admin/cns/${p.slug}`}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-[#FF491A] hover:shadow-md transition flex flex-col"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-1">{p.title}</h2>
              <p className="text-sm text-gray-500 flex-1">{p.description}</p>
              <p className="mt-3 text-xs text-gray-400">{p.sections.length} secciones</p>
              <span className="mt-2 text-sm font-semibold text-[#FF491A] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5">
                Editar <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
