'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { assertAdmin } from '../actions';

function pickProduto(fd) {
  const precoCusto = Math.max(0, Number(fd.get('preco_custo') || 0));
  const margem = Math.min(90, Math.max(0, Number(fd.get('margem') ?? 30)));
  const precoVenda = margem >= 100 ? precoCusto : precoCusto / (1 - margem / 100);
  return {
    nome: (fd.get('nome') ?? '').trim(),
    descricao: (fd.get('descricao') ?? '').trim(),
    categoria: (fd.get('categoria') ?? 'Outro').trim(),
    unidade: (fd.get('unidade') ?? 'un').trim(),
    preco_custo: precoCusto,
    margem,
    preco_venda: Math.round(precoVenda * 100) / 100,
    fornecedor_id: fd.get('fornecedor_id') ? String(fd.get('fornecedor_id')) : null,
    observacoes: (fd.get('observacoes') ?? '').trim(),
  };
}

async function nomeJaExiste(admin, nome, idExcluido) {
  let query = admin.from('produtos').select('id').ilike('nome', nome);
  if (idExcluido) query = query.neq('id', idExcluido);
  const { data } = await query.maybeSingle();
  return Boolean(data);
}

export async function createProduto(prevState, fd) {
  await assertAdmin();

  const data = pickProduto(fd);
  if (data.nome.length < 2) return { ok: false, error: 'Informe o nome do produto.' };

  const admin = createAdminClient();
  if (await nomeJaExiste(admin, data.nome)) {
    return { ok: false, error: 'Já existe um produto com esse nome.' };
  }

  const { error } = await admin.from('produtos').insert(data);
  if (error?.code === '23505') {
    return { ok: false, error: 'Já existe um produto com esse nome.' };
  }
  if (error) return { ok: false, error: 'Erro ao salvar o produto.' };

  revalidatePath('/admin/produtos');
  return { ok: true };
}

export async function updateProduto(prevState, fd) {
  await assertAdmin();

  const id = fd.get('id');
  const data = pickProduto(fd);
  if (typeof id !== 'string' || data.nome.length < 2) return { ok: false, error: 'Informe o nome do produto.' };

  const admin = createAdminClient();
  if (await nomeJaExiste(admin, data.nome, id)) {
    return { ok: false, error: 'Já existe outro produto com esse nome.' };
  }

  const { error } = await admin.from('produtos').update(data).eq('id', id);
  if (error?.code === '23505') {
    return { ok: false, error: 'Já existe outro produto com esse nome.' };
  }
  if (error) return { ok: false, error: 'Erro ao salvar o produto.' };

  revalidatePath('/admin/produtos');
  return { ok: true };
}

export async function deleteProduto(fd) {
  await assertAdmin();
  const id = fd.get('id');
  if (typeof id !== 'string') return;
  await createAdminClient().from('produtos').delete().eq('id', id);
  revalidatePath('/admin/produtos');
}
