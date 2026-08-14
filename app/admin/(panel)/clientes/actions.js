'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { assertAdmin } from '../actions';

function pickCliente(fd) {
  return {
    nome: (fd.get('nome') ?? '').trim(),
    documento: (fd.get('documento') ?? '').trim(),
    cnpj: (fd.get('cnpj') ?? '').trim(),
    telefone: (fd.get('telefone') ?? '').trim(),
    email: (fd.get('email') ?? '').trim(),
    endereco: (fd.get('endereco') ?? '').trim(),
    cidade: (fd.get('cidade') ?? '').trim(),
    uf: (fd.get('uf') ?? '').trim().toUpperCase().slice(0, 2),
    observacoes: (fd.get('observacoes') ?? '').trim(),
  };
}

export async function createCliente(prevState, fd) {
  await assertAdmin();
  const data = pickCliente(fd);
  if (data.nome.length < 2 || data.telefone.length < 8 || data.cidade.length < 2) {
    return { ok: false, error: 'Preencha nome, telefone e cidade corretamente.' };
  }
  const { error } = await createAdminClient().from('clientes').insert(data);
  if (error) return { ok: false, error: 'Erro ao salvar o cliente.' };
  revalidatePath('/admin/clientes');
  return { ok: true };
}

export async function updateCliente(prevState, fd) {
  await assertAdmin();
  const id = fd.get('id');
  const data = pickCliente(fd);
  if (typeof id !== 'string' || data.nome.length < 2 || data.telefone.length < 8 || data.cidade.length < 2) {
    return { ok: false, error: 'Preencha nome, telefone e cidade corretamente.' };
  }
  const { error } = await createAdminClient().from('clientes').update(data).eq('id', id);
  if (error) return { ok: false, error: 'Erro ao salvar o cliente.' };
  revalidatePath('/admin/clientes');
  return { ok: true };
}

export async function deleteCliente(fd) {
  await assertAdmin();
  const id = fd.get('id');
  if (typeof id !== 'string') return;
  await createAdminClient().from('clientes').delete().eq('id', id);
  revalidatePath('/admin/clientes');
}
