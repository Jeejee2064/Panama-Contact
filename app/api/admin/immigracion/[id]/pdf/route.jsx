import { createSupabaseServerClient } from '@/lib/supabase/server';
import { renderImmigrationPdf } from '@/lib/immigration-pdf';

function safeFilename(name) {
  return (name || 'documento').replace(/[^a-zA-Z0-9 _-]/g, '').trim() || 'documento';
}

export async function GET(request, { params }) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { data: row } = await supabase
    .from('immigration_submissions')
    .select('*')
    .eq('id', id)
    .single();

  if (!row) return new Response('Not found', { status: 404 });

  const buffer = await renderImmigrationPdf(row);

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="Inmigracion-${safeFilename(`${row.apellidos} ${row.primer_y_segundo_nombre}`)}.pdf"`,
    },
  });
}
