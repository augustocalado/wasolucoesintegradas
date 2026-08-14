import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getUserRole, ROLE_LABELS } from '@/lib/roles';
import { saveLogo, createUser, updateUser, deleteUser } from './actions';
import ConfiguracoesClient from '@/components/admin/ConfiguracoesClient';

export const dynamic = 'force-dynamic';

export default async function AdminConfiguracoes() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');
  if (getUserRole(user) !== 'admin') redirect('/admin');

  const admin = createAdminClient();
  const [{ data: logoRows }, { data: authData }] = await Promise.all([
    admin.from('settings').select('value').eq('key', 'logo_url').maybeSingle(),
    admin.auth.admin.listUsers(),
  ]);

  const usuarios = (authData?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? '',
    nome: u.user_metadata?.full_name || u.email || 'Sem nome',
    role: u.user_metadata?.role || 'admin',
    telefone: u.user_metadata?.telefone || '',
    ativo: !u.banned,
  }));

  return (
    <ConfiguracoesClient
      logoUrl={logoRows?.value ?? ''}
      usuarios={usuarios}
      roleLabels={ROLE_LABELS}
      saveLogo={saveLogo}
      createUser={createUser}
      updateUser={updateUser}
      deleteUser={deleteUser}
    />
  );
}
