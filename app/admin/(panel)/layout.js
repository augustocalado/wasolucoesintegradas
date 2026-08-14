import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { assertAdmin } from './actions';
import AdminSidebar from '@/components/AdminSidebar';

export default async function PanelLayout({ children }) {
  await assertAdmin();

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  return (
    <div className="admin-shell">
      <AdminSidebar userEmail={user.email} userName={user.user_metadata?.full_name || user.email} />
      <div className="admin-content">{children}</div>
    </div>
  );
}
