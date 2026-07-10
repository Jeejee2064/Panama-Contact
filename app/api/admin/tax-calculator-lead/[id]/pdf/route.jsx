import { renderToBuffer } from '@react-pdf/renderer';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import TaxReportDocument from '@/lib/panama-tax/pdf/TaxReportDocument';
import { TAX_DISCLAIMER } from '@/lib/panama-tax/disclaimer';

function safeFilename(name) {
  return (name || 'reporte').replace(/[^a-zA-Z0-9 _-]/g, '').trim() || 'reporte';
}

export async function GET(request, { params }) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { data: row } = await supabase
    .from('tax_calculator_leads')
    .select('*')
    .eq('id', id)
    .single();

  if (!row) return new Response('Not found', { status: 404 });

  const answers = row.answers ?? {};
  const buffer = await renderToBuffer(
    <TaxReportDocument
      firstName={row.first_name}
      generatedAt={new Date(row.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      summaryItems={answers.summaryItems ?? []}
      resultHeadline={answers.resultHeadline}
      resultBody={answers.resultBody}
      calculatorResult={answers.calculatorResult}
      recommendations={answers.recommendations ?? []}
      disclaimer={TAX_DISCLAIMER}
    />
  );

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="Tax-Report-${safeFilename(row.first_name)}.pdf"`,
    },
  });
}
