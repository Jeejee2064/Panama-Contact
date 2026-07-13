import { renderToBuffer } from '@react-pdf/renderer';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import TaxReportDocument from '@/lib/panama-tax/pdf/TaxReportDocument';
import { recomputeLeadReport } from '@/lib/leadReport';

export async function GET(request, { params }) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { data: row } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (!row) return new Response('Not found', { status: 404 });

  const { reportPayload, bracketBreakdown, disclaimer } = await recomputeLeadReport(row.calc_inputs);

  const buffer = await renderToBuffer(
    <TaxReportDocument
      generatedAt={new Date(row.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      summaryItems={reportPayload.summaryItems}
      resultHeadline={reportPayload.resultHeadline}
      resultBody={reportPayload.resultBody}
      calculatorResult={reportPayload.calculatorResult}
      bracketBreakdown={bracketBreakdown}
      recommendations={reportPayload.recommendations}
      disclaimer={disclaimer}
    />
  );

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="Tax-Report-${id}.pdf"`,
    },
  });
}
