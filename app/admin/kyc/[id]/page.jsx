import { createSupabaseServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Download } from 'lucide-react';
import AdminNav from '@/components/admin/AdminNav';
import CopyField from '@/components/admin/CopyField';
import {
  sectionsForType, SHARED_DECLARATION_FIELDS, REFERENCE_FIELDS, BENEFICIAL_OWNER_FIELDS,
} from '@/data/kyc-fields';

export const dynamic = 'force-dynamic';

export default async function KycDetail({ params }) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data: row } = await supabase
    .from('kyc_submissions')
    .select('*')
    .eq('id', id)
    .single();

  if (!row) notFound();

  if (!row.read) {
    await supabase.from('kyc_submissions').update({ read: true }).eq('id', id);
  }

  const submittedAt = new Date(row.created_at).toLocaleString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const sections = sectionsForType(row.client_type);
  const documents = Array.isArray(row.documents) ? row.documents : [];
  const documentsWithUrls = await Promise.all(
    documents.map(async (doc) => {
      const { data: signed } = await supabase.storage
        .from('kyc-documents')
        .createSignedUrl(doc.path, 300, { download: doc.original_filename });
      return { ...doc, url: signed?.signedUrl || null };
    })
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminNav />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin/kyc" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            ← Volver / Back
          </Link>
          <span className="text-xs text-gray-400">{submittedAt}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900">{row.display_name}</h1>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              row.client_type === 'legal' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
            }`}>
              {row.client_type === 'legal' ? 'Empresa' : 'Persona Natural'}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              row.read ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {row.read ? 'Lu / Read' : 'Non lu / Unread'}
            </span>
          </div>
        </div>

        {sections.map((section) => {
          const populated = section.fields.filter((f) => {
            const v = row[f.name];
            return Array.isArray(v) ? v.length > 0 : v !== null && v !== undefined && v !== '';
          });
          if (!populated.length) return null;
          return (
            <div key={section.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{section.title}</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {populated.map((f) => {
                  const value = Array.isArray(row[f.name]) ? row[f.name].join(', ') : row[f.name];
                  return (
                    <div key={f.name} className="px-6 py-3 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-400 mb-0.5">{f.label}</div>
                        <div className="text-sm text-gray-900 whitespace-pre-wrap">{value}</div>
                      </div>
                      <CopyField value={String(value)} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Beneficial owners */}
        {row.client_type === 'legal' && Array.isArray(row.le_beneficial_owners) && row.le_beneficial_owners.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Beneficiarios finales / Beneficial Owners</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {row.le_beneficial_owners.map((owner, i) => (
                <div key={i} className="px-6 py-3">
                  <div className="text-xs text-gray-400 mb-1">Beneficiario {i + 1} / Owner {i + 1}</div>
                  <div className="grid sm:grid-cols-2 gap-1 text-sm text-gray-900">
                    {BENEFICIAL_OWNER_FIELDS.map(([key, label]) => (
                      <div key={key}><span className="text-gray-400">{label}: </span>{owner[key]}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shared declaration fields */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Forma de pago y declaración / Payment & Declaration</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {SHARED_DECLARATION_FIELDS.filter((f) => row[f.name]).map((f) => (
              <div key={f.name} className="px-6 py-3 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-400 mb-0.5">{f.label}</div>
                  <div className="text-sm text-gray-900 whitespace-pre-wrap">{row[f.name]}</div>
                </div>
                <CopyField value={String(row[f.name])} />
              </div>
            ))}
          </div>
        </div>

        {/* References */}
        {Array.isArray(row.reference_contacts) && row.reference_contacts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Referencias / References</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {row.reference_contacts.map((ref, i) => (
                <div key={i} className="px-6 py-3">
                  <div className="text-xs text-gray-400 mb-1">Referencia {i + 1} / Reference {i + 1}</div>
                  <div className="grid sm:grid-cols-2 gap-1 text-sm text-gray-900">
                    {REFERENCE_FIELDS.map(([key, label]) => (
                      <div key={key}><span className="text-gray-400">{label}: </span>{ref[key]}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        {documentsWithUrls.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Documentos / Documents</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {documentsWithUrls.map((doc) => (
                <div key={doc.key} className="px-6 py-3 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-400 mb-0.5">{doc.label}</div>
                    <div className="text-sm text-gray-900 truncate">{doc.original_filename}</div>
                  </div>
                  {doc.url ? (
                    <a
                      href={doc.url}
                      className="shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-[#FF491A] text-white font-medium hover:bg-[#e6451a] transition"
                    >
                      <Download size={13} /> Descargar / Download
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">No disponible</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Signature */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Declaración final / Final Declaration</h2>
          </div>
          <div className="px-6 py-3 text-sm text-gray-900">
            <div className="text-xs text-gray-400 mb-0.5">Firma (nombre completo) / Signature (full name)</div>
            {row.signature_full_name}
          </div>
        </div>
      </main>
    </div>
  );
}
