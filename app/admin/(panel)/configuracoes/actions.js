'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { ROLES, getUserRole } from '@/lib/roles';

async function assertAdminUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');
  if (getUserRole(user) !== 'admin') redirect('/admin');
  return user;
}

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

export async function saveLogo(prevState, formData) {
  await assertAdminUser();

  const file = formData.get('logo');
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'Selecione uma imagem para usar como logo.' };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { ok: false, error: 'Formato não suportado. Use PNG, JPG, SVG ou WEBP.' };
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { ok: false, error: 'Imagem muito grande. O limite é 2 MB.' };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const admin = createAdminClient();

  const { error: upError } = await admin.storage.from('site').upload(`logo.${ext}`, file, {
    upsert: true,
    contentType: file.type,
  });
  if (upError) {
    return { ok: false, error: `Falha ao enviar a imagem: ${upError.message}` };
  }

  const { data: pub } = admin.storage.from('site').getPublicUrl(`logo.${ext}`);
  await admin
    .from('settings')
    .update({ value: pub.publicUrl, updated_at: new Date().toISOString() })
    .eq('key', 'logo_url');

  revalidatePath('/admin/configuracoes');
  return { ok: true, message: 'Logo atualizada com sucesso.' };
}

export async function createUser(prevState, formData) {
  await assertAdminUser();

  const nome = (formData.get('nome') ?? '').trim();
  const email = (formData.get('email') ?? '').trim().toLowerCase();
  const senha = String(formData.get('senha') || '');
  const telefone = (formData.get('telefone') ?? '').trim();
  const role = formData.get('role');

  if (!nome || !email || !senha) return { ok: false, error: 'Nome, e-mail e senha são obrigatórios.' };
  if (senha.length < 6) return { ok: false, error: 'A senha deve ter ao menos 6 caracteres.' };
  if (!ROLES.includes(role)) return { ok: false, error: 'Papel inválido.' };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
    user_metadata: { full_name: nome, role, telefone },
  });

  if (error) {
    if (/already registered/i.test(error.message || '')) {
      return { ok: false, error: 'Já existe um usuário com esse e-mail.' };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath('/admin/configuracoes');
  return { ok: true, message: 'Usuário criado com sucesso.' };
}

export async function updateUser(prevState, formData) {
  const adminUser = await assertAdminUser();

  const id = String(formData.get('id') || '');
  const nome = (formData.get('nome') ?? '').trim();
  const telefone = (formData.get('telefone') ?? '').trim();
  const role = formData.get('role');
  const novaSenha = String(formData.get('nova_senha') || '');
  const ativo = formData.get('ativo') === 'on' || formData.get('ativo') === 'true' || formData.get('ativo') === '1';

  if (!id || !nome) return { ok: false, error: 'Dados incompletos.' };
  if (!ROLES.includes(role)) return { ok: false, error: 'Papel inválido.' };
  if (id === adminUser.id && role !== 'admin') return { ok: false, error: 'Você não pode remover seu próprio papel de administrador.' };
  if (id === adminUser.id && !ativo) return { ok: false, error: 'Você não pode desativar a própria conta.' };

  const admin = createAdminClient();
  const { data: existing } = await admin.auth.admin.getUserById(id);
  if (!existing?.user) return { ok: false, error: 'Usuário não encontrado.' };

  const attributes = {
    user_metadata: {
      ...(existing.user.user_metadata ?? {}),
      full_name: nome,
      role,
      telefone,
    },
    banned: !ativo,
  };
  if (novaSenha) {
    if (novaSenha.length < 6) return { ok: false, error: 'A nova senha deve ter ao menos 6 caracteres.' };
    attributes.password = novaSenha;
  }

  const { error } = await admin.auth.admin.updateUserById(id, attributes);
  if (error) return { ok: false, error: error.message };

  revalidatePath('/admin/configuracoes');
  return { ok: true, message: 'Usuário atualizado com sucesso.' };
}

export async function deleteUser(prevState, formData) {
  const adminUser = await assertAdminUser();

  const id = String(formData.get('id') || '');
  if (!id) return { ok: false, error: 'Usuário não informado.' };
  if (id === adminUser.id) return { ok: false, error: 'Você não pode excluir a própria conta.' };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return { ok: false, error: error.message };

  revalidatePath('/admin/configuracoes');
  return { ok: true, message: 'Usuário excluído com sucesso.' };
}
