'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function AdminNav() {
  const router = useRouter();
  const pathname = usePathname();

  async function logout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <header className="bg-black py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/admin" className="flex items-center gap-3">
          <img src="/logo-blanc.avif" alt="Panama Contact" className="h-8 object-contain" />
          <span className="text-white text-sm opacity-60">Admin</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/admin/immigracion"
            className={`text-sm transition ${pathname.startsWith('/admin/immigracion') ? 'text-white font-semibold' : 'text-white/60 hover:text-white'}`}
          >
            Inmigración
          </Link>
          <Link
            href="/admin/kyc"
            className={`text-sm transition ${pathname.startsWith('/admin/kyc') ? 'text-white font-semibold' : 'text-white/60 hover:text-white'}`}
          >
            KYC
          </Link>
        </nav>
      </div>
      <button
        onClick={logout}
        className="text-white text-sm opacity-70 hover:opacity-100 transition"
      >
        Cerrar sesión / Logout
      </button>
    </header>
  );
}
