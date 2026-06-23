import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';

export default function AdminHome() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminNav />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl w-full">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Panel de administración
          </h1>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/admin/immigracion"
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:border-[#FF491A] hover:shadow-md transition flex flex-col"
            >
              <span className="text-xs font-semibold text-[#FF491A] uppercase tracking-widest mb-3">
                Inmigración
              </span>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Cuestionarios migratorios</h2>
              <p className="text-sm text-gray-500 flex-1">
                Ver y gestionar las solicitudes de inmigración recibidas.
              </p>
              <span className="mt-4 text-sm font-semibold text-[#FF491A] group-hover:translate-x-1 transition-transform inline-block">
                Ver lista →
              </span>
            </Link>

            <Link
              href="/admin/kyc"
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:border-[#FF491A] hover:shadow-md transition flex flex-col"
            >
              <span className="text-xs font-semibold text-[#FF491A] uppercase tracking-widest mb-3">
                KYC
              </span>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Formularios de debida diligencia</h2>
              <p className="text-sm text-gray-500 flex-1">
                Ver y gestionar los formularios KYC de personas naturales y empresas.
              </p>
              <span className="mt-4 text-sm font-semibold text-[#FF491A] group-hover:translate-x-1 transition-transform inline-block">
                Ver lista →
              </span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
