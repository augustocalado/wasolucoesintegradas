'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getUserRole } from '@/lib/roles';

const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_PHOTO_SIZE = 8 * 1024 * 1024;

async function getSessionUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  return user;
}

function assertRole(user, allowed) {
  const role = getUserRole(user);
  if (!allowed.includes(role)) redirect('/admin');
  return role;
}

async function uploadPhotos(admin, chamadoId, fase, files) {
  const urls = [];
  for (const file of files) {
    if (!(file instanceof File) || file.size === 0) continue;
    if (!PHOTO_TYPES.includes(file.type)) {
      throw new Error(`Formato não suportado em "${file.name}". Use JPG, PNG ou WEBP.`);
    }
    if (file.size > MAX_PHOTO_SIZE) {
      throw new Error(`Arquivo "${file.name}" muito grande. O limite é 8 MB por foto.`);
    }
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${(file.name.split('.').pop() || 'jpg').toLowerCase()}`;
    const { error } = await admin.storage
      .from('chamados')
      .upload(`${chamadoId}/${fase}/${name}`, file, { upsert: false, contentType: file.type });
    if (error) throw new Error(`Falha ao enviar "${file.name}": ${error.message}`);
    const { data: pub } = admin.storage.from('chamados').getPublicUrl(`${chamadoId}/${fase}/${name}`);
    urls.push(pub.publicUrl);
  }
  return urls;
}

export async function iniciarAtendimento(prevState, formData) {
  const user = await getSessionUser();
  const role = assertRole(user, ['admin', 'tecnico']);
  const id = String(formData.get('id') || '');
  if (!id) return { ok: false, error: 'Chamado não informado.' };

  const fotos = formData.getAll('fotos').filter((f) => f instanceof File && f.size > 0);
  if (fotos.length === 0) {
    return { ok: false, error: 'Envie pelo menos uma foto do estado ANTES do atendimento para iniciar.' };
  }

  const admin = createAdminClient();
  const { data: s } = await admin.from('solicitacoes').select('id, status, tecnico_id').eq('id', id).maybeSingle();
  if (!s) return { ok: false, error: 'Chamado não encontrado.' };
  if (s.status !== 'novo') return { ok: false, error: 'Este chamado já foi iniciado.' };
  if (role === 'tecnico' && s.tecnico_id && s.tecnico_id !== user.id) {
    return { ok: false, error: 'Este chamado não está atribuído a você.' };
  }

  let urls;
  try {
    urls = await uploadPhotos(admin, id, 'antes', fotos);
  } catch (e) {
    return { ok: false, error: e.message };
  }
  if (urls.length === 0) return { ok: false, error: 'Nenhuma foto válida enviada.' };

  const tecnicoId = role === 'tecnico' ? user.id : s.tecnico_id || user.id;
  const { error } = await admin
    .from('solicitacoes')
    .update({ status: 'em_andamento', tecnico_id: tecnicoId, fotos_antes: urls, inicio_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/chamados/${id}`);
  revalidatePath('/admin');
  return { ok: true, message: 'Atendimento iniciado. Fotos do antes salvas.' };
}

export async function finalizarAtendimento(prevState, formData) {
  const user = await getSessionUser();
  const role = assertRole(user, ['admin', 'tecnico']);
  const id = String(formData.get('id') || '');
  const assinaturaNome = (formData.get('assinatura_nome') ?? '').trim();
  const assinaturaDataUrl = String(formData.get('assinatura') || '');
  const fotos = formData.getAll('fotos').filter((f) => f instanceof File && f.size > 0);

  if (!id) return { ok: false, error: 'Chamado não informado.' };
  if (fotos.length === 0) return { ok: false, error: 'Envie pelo menos uma foto do estado DEPOIS do atendimento.' };
  if (!assinaturaNome) return { ok: false, error: 'Informe o nome de quem acompanhou e assinou o serviço.' };
  if (!assinaturaDataUrl.startsWith('data:image/')) return { ok: false, error: 'Assine no campo acima para finalizar.' };

  const admin = createAdminClient();
  const { data: s } = await admin.from('solicitacoes').select('id, status, tecnico_id').eq('id', id).maybeSingle();
  if (!s) return { ok: false, error: 'Chamado não encontrado.' };
  if (s.status !== 'em_andamento') return { ok: false, error: 'O atendimento precisa estar em andamento para finalizar.' };
  if (role === 'tecnico' && s.tecnico_id !== user.id) {
    return { ok: false, error: 'Este chamado não está atribuído a você.' };
  }

  let urls;
  try {
    urls = await uploadPhotos(admin, id, 'depois', fotos);
  } catch (e) {
    return { ok: false, error: e.message };
  }
  if (urls.length === 0) return { ok: false, error: 'Nenhuma foto válida enviada.' };

  const b64 = assinaturaDataUrl.split(',')[1];
  const ext = assinaturaDataUrl.includes('image/png') ? 'png' : 'jpg';
  const sigPath = `${id}/assinatura.${ext}`;
  const { error: sigErr } = await admin.storage
    .from('chamados')
    .upload(sigPath, Buffer.from(b64, 'base64'), { upsert: true, contentType: `image/${ext}` });
  if (sigErr) return { ok: false, error: `Falha ao salvar a assinatura: ${sigErr.message}` };
  const { data: sigPub } = admin.storage.from('chamados').getPublicUrl(sigPath);

  const { error } = await admin
    .from('solicitacoes')
    .update({
      status: 'concluido',
      fotos_depois: urls,
      assinatura_url: sigPub.publicUrl,
      assinatura_nome: assinaturaNome,
      conclusao_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/chamados/${id}`);
  revalidatePath('/admin');
  return { ok: true, message: 'Atendimento finalizado. Fotos do depois e assinatura salvas.' };
}

export async function adicionarFotos(prevState, formData) {
  const user = await getSessionUser();
  const role = assertRole(user, ['admin', 'tecnico']);
  const id = String(formData.get('id') || '');
  const fase = String(formData.get('fase') || '');

  if (!id) return { ok: false, error: 'Chamado não informado.' };
  if (!['antes', 'depois'].includes(fase)) return { ok: false, error: 'Fase inválida.' };

  const fotos = formData.getAll('fotos').filter((f) => f instanceof File && f.size > 0);
  if (fotos.length === 0) return { ok: false, error: 'Selecione ao menos uma foto.' };

  const admin = createAdminClient();
  const { data: s } = await admin.from('solicitacoes').select('id, status, tecnico_id').eq('id', id).maybeSingle();
  if (!s) return { ok: false, error: 'Chamado não encontrado.' };
  if (s.status !== 'em_andamento') return { ok: false, error: 'O chamado precisa estar em andamento para adicionar fotos.' };
  if (role === 'tecnico' && s.tecnico_id !== user.id) {
    return { ok: false, error: 'Este chamado não está atribuído a você.' };
  }

  let urls;
  try {
    urls = await uploadPhotos(admin, id, fase, fotos);
  } catch (e) {
    return { ok: false, error: e.message };
  }
  if (urls.length === 0) return { ok: false, error: 'Nenhuma foto válida enviada.' };

  const col = fase === 'antes' ? 'fotos_antes' : 'fotos_depois';
  const { data: cur } = await admin.from('solicitacoes').select(col).eq('id', id).maybeSingle();
  const merged = [...(cur?.[col] ?? []), ...urls];
  const { error } = await admin.from('solicitacoes').update({ [col]: merged }).eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/chamados/${id}`);
  return { ok: true, message: `Fotos do ${fase === 'antes' ? 'antes' : 'depois'} adicionadas.` };
}

export async function atribuirTecnico(prevState, formData) {
  const user = await getSessionUser();
  assertRole(user, ['admin']);
  const id = String(formData.get('id') || '');
  const tecnicoId = String(formData.get('tecnico_id') || '') || null;

  if (!id) return { ok: false, error: 'Chamado não informado.' };

  const admin = createAdminClient();
  const { error } = await admin.from('solicitacoes').update({ tecnico_id: tecnicoId }).eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/chamados/${id}`);
  revalidatePath('/admin');
  return { ok: true, message: tecnicoId ? 'Técnico atribuído ao chamado.' : 'Técnico removido do chamado.' };
}
