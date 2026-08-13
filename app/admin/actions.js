'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

async function assertAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');
}

const VALID_STATUS = ['novo', 'em_andamento', 'concluido'];

export async function updateStatus(formData) {
  await assertAdmin();

  const id = formData.get('id');
  const status = formData.get('status');

  if (typeof id !== 'string' || typeof status !== 'string' || !VALID_STATUS.includes(status)) {
    return;
  }

  const admin = createAdminClient();
  await admin.from('solicitacoes').update({ status }).eq('id', id);

  revalidatePath('/admin');
}

export async function deleteRequest(formData) {
  await assertAdmin();

  const id = formData.get('id');

  if (typeof id !== 'string') {
    return;
  }

  const admin = createAdminClient();
  await admin.from('solicitacoes').delete().eq('id', id);

  revalidatePath('/admin');
}
