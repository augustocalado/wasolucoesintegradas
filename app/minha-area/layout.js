import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getUserRole } from '@/lib/roles';
import PortalHeader from '@/components/PortalHeader';

export default async function MinhaAreaLayout({ children }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  const role = getUserRole(user);
  if (role !== 'cliente') redirect('/admin');

  return (
    <div className="portal-shell">
      <PortalHeader userName={user.user_metadata?.full_name || user.email} />
      <main className="container portal-main">{children}</main>
    </div>
  );
}
