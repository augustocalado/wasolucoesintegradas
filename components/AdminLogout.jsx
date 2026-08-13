'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Icons from '@/components/Icons';

export default function AdminLogout() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button type="button" className="admin-logout-btn" onClick={handleLogout}>
      <Icons name="shield" size={16} /> Sair
    </button>
  );
}
