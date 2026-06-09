'use client';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function AdminNav() {
  const router = useRouter();

  async function logout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <header className="bg-black py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src="/logo-blanc.avif" alt="Panama Contact" className="h-8 object-contain" />
        <span className="text-white text-sm opacity-60">Admin</span>
      </div>
      <button
        onClick={logout}
        className="text-white text-sm opacity-70 hover:opacity-100 transition"
      >
        Déconnexion / Logout
      </button>
    </header>
  );
}
