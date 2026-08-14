import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getUserRole } from '@/lib/roles';
import AdminSidebar from '@/components/AdminSidebar';

export default async function PanelLayout({ children }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  const role = getUserRole(user);
  if (role === 'cliente') redirect('/minha-area');

  return (
    <div className="admin-shell">
      <AdminSidebar
        userEmail={user.email}
        userName={user.user_metadata?.full_name || user.email}
        role={role}
      />
      <div className="admin-content">{children}</div>
    </div>
  );
}
