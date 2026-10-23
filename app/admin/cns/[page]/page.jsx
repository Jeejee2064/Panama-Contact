import { notFound } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import CnsEditor from '@/components/admin/cns/CnsEditor';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getCnsAdminData } from '@/lib/cns/content';
import { getCnsPage } from '@/lib/cns/schema';

export const dynamic = 'force-dynamic';

export default async function CnsPageEditor({ params }) {
  const { page: slug } = await params;
  const page = getCnsPage(slug);
  if (!page) notFound();

  const supabase = await createSupabaseServerClient();
  const data = await getCnsAdminData(supabase);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminNav />
      <CnsEditor page={page} ready={data.ready} initialTexts={data.texts} initialItems={data.items} />
    </div>
  );
}
