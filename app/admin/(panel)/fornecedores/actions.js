'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { assertAdmin } from '../actions';

function pickFornecedor(fd) {
  return {
    nome: (fd.get('nome') ?? '').trim(),
    documento: (fd.get('documento') ?? '').trim(),
    telefone: (fd.get('telefone') ?? '').trim(),
    email: (fd.get('email') ?? '').trim(),
    endereco: (fd.get('endereco') ?? '').trim(),
    cidade: (fd.get('cidade') ?? '').trim(),
    uf: (fd.get('uf') ?? '').trim().toUpperCase().slice(0, 2),
    observacoes: (fd.get('observacoes') ?? '').trim(),
  };
}

export async function createFornecedor(prevState, fd) {
  await assertAdmin();
  const data = pickFornecedor(fd);
  if (data.nome.length < 2 || data.telefone.length < 8 || data.cidade.length < 2) {
    return { ok: false, error: 'Preencha nome, telefone e cidade corretamente.' };
  }
  const { error } = await createAdminClient().from('fornecedores').insert(data);
  if (error) return { ok: false, error: 'Erro ao salvar o fornecedor.' };
  revalidatePath('/admin/fornecedores');
  return { ok: true };
}

export async function updateFornecedor(prevState, fd) {
  await assertAdmin();
  const id = fd.get('id');
  const data = pickFornecedor(fd);
  if (typeof id !== 'string' || data.nome.length < 2 || data.telefone.length < 8 || data.cidade.length < 2) {
    return { ok: false, error: 'Preencha nome, telefone e cidade corretamente.' };
  }
  const { error } = await createAdminClient().from('fornecedores').update(data).eq('id', id);
  if (error) return { ok: false, error: 'Erro ao salvar o fornecedor.' };
  revalidatePath('/admin/fornecedores');
  return { ok: true };
}

export async function deleteFornecedor(fd) {
  await assertAdmin();
  const id = fd.get('id');
  if (typeof id !== 'string') return;
  await createAdminClient().from('fornecedores').delete().eq('id', id);
  revalidatePath('/admin/fornecedores');
}
