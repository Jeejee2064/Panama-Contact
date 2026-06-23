import Link from 'next/link';
import CuestionarioHeader from '@/components/cuestionario/CuestionarioHeader';

export default function CuestionarioChooser() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
      <CuestionarioHeader />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl w-full">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
            ¿Qué formulario necesita completar? / Which form do you need to complete?
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center mb-10">
            Seleccione el cuestionario correspondiente. / Select the relevant questionnaire.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/cuestionario/immigracion"
              className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 hover:border-[#FF491A] hover:shadow-md transition flex flex-col"
            >
              <span className="text-xs font-semibold text-[#FF491A] uppercase tracking-widest mb-3">
                Inmigración / Immigration
              </span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Cuestionario migratorio
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex-1">
                Para solicitudes de visa, residencia y trámites migratorios en Panamá. /
                For visa, residency and immigration applications in Panama.
              </p>
              <span className="mt-4 text-sm font-semibold text-[#FF491A] group-hover:translate-x-1 transition-transform inline-block">
                Comenzar / Start →
              </span>
            </Link>

            <Link
              href="/cuestionario/kyc"
              className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 hover:border-[#FF491A] hover:shadow-md transition flex flex-col"
            >
              <span className="text-xs font-semibold text-[#FF491A] uppercase tracking-widest mb-3">
                KYC / Due Diligence
              </span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Formulario de debida diligencia
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex-1">
                Conforme a la Ley 23 del 27 de abril de 2015, para personas naturales y
                empresas. / In compliance with Law 23 of April 27, 2015, for individuals
                and companies.
              </p>
              <span className="mt-4 text-sm font-semibold text-[#FF491A] group-hover:translate-x-1 transition-transform inline-block">
                Comenzar / Start →
              </span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
