import { createSupabaseServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Download } from 'lucide-react';
import AdminNav from '@/components/admin/AdminNav';
import CopyField from '@/components/admin/CopyField';

export const dynamic = 'force-dynamic';

const SOURCE_LABEL = { A: 'Tax Exposure Quiz', B: 'Income Tax Calculator' };

function currency(value) {
  if (typeof value !== 'number') return '—';
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export default async function LeadDetail({ params }) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const { data: row } = await supabase
    .from('tax_calculator_leads')
    .select('*')
    .eq('id', id)
    .single();

  if (!row) notFound();

  const answers = row.answers ?? {};
  const calc = answers.calculatorResult;

  const submittedAt = new Date(row.created_at).toLocaleString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminNav />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6 gap-3">
          <Link href="/admin/leads" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            ← Back
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">{submittedAt}</span>
            <a
              href={`/api/admin/tax-calculator-lead/${id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-full bg-[#FF491A] text-white font-medium hover:bg-[#e6451a] transition"
            >
              <Download size={14} /> Download PDF
            </a>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900">{row.first_name}</h1>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-orange-100 text-orange-700">
              {SOURCE_LABEL[row.source_page] ?? row.source_page}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-600 uppercase">
              {row.locale}
            </span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-gray-400 mb-0.5">Email</div>
              <div className="text-sm text-gray-900">{row.email}</div>
            </div>
            <CopyField value={row.email} />
          </div>
        </div>

        {answers.resultHeadline && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Result</h2>
            </div>
            <div className="px-6 py-4">
              <p className="font-semibold text-gray-900 mb-1">{answers.resultHeadline}</p>
              {answers.resultBody && <p className="text-sm text-gray-600">{answers.resultBody}</p>}
            </div>
          </div>
        )}

        {calc && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tax calculation</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                ['Gross income', currency(calc.grossIncome)],
                ['Taxable income', currency(calc.taxableIncome)],
                ['Estimated ISR', currency(calc.tax)],
                ['Effective rate', typeof calc.effectiveRate === 'number' ? `${(calc.effectiveRate * 100).toFixed(1)}%` : '—'],
                ['Net annual', currency(calc.netAnnual)],
                ['Net monthly', currency(calc.netMonthly)],
              ].map(([label, value]) => (
                <div key={label} className="px-6 py-3 flex items-center justify-between gap-4">
                  <div className="text-xs text-gray-400">{label}</div>
                  <div className="text-sm text-gray-900 font-medium">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {answers.summaryItems?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Answers</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {answers.summaryItems.map(({ label, value }) => (
                <div key={label} className="px-6 py-3 flex items-start justify-between gap-4">
                  <div className="text-xs text-gray-400 flex-1">{label}</div>
                  <div className="text-sm text-gray-900 text-right">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {answers.recommendations?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recommendations shown</h2>
            </div>
            <ul className="px-6 py-4 flex flex-col gap-2">
              {answers.recommendations.map((rec) => (
                <li key={rec} className="text-sm text-gray-700">• {rec}</li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
