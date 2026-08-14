'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { assertAdmin } from '../actions';

const VALID_STATUS = ['novo', 'em_andamento', 'enviado', 'aprovado', 'recusado', 'concluido'];

export async function createOrcamento(fd) {
  await assertAdmin();

  const cliente_id = fd.get('cliente_id') ? String(fd.get('cliente_id')) : null;
  const status = VALID_STATUS.includes(String(fd.get('status'))) ? String(fd.get('status')) : 'novo';
  const prazo = String(fd.get('prazo') ?? '').trim() || '7 dias';
  const observacoes = String(fd.get('observacoes') ?? '').trim();

  let itens = [];
  try {
    itens = JSON.parse(String(fd.get('itens') || '[]'));
  } catch {
    itens = [];
  }
  if (!Array.isArray(itens)) itens = [];

  const cleanItems = itens
    .map((i) => ({
      produto_id: i.produto_id ? String(i.produto_id) : null,
      descricao: String(i.descricao ?? '').trim(),
      quantidade: Number(i.quantidade) || 1,
      preco_unitario: Number(i.preco_unitario) || 0,
    }))
    .filter((i) => i.descricao !== '');

  if (!cliente_id) return;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('orcamentos')
    .insert({ cliente_id, status, prazo, observacoes })
    .select('id')
    .single();

  if (error || !data) return;

  if (cleanItems.length > 0) {
    await admin
      .from('orcamento_itens')
      .insert(cleanItems.map((i) => ({ ...i, orcamento_id: data.id })));
  }

  revalidatePath('/admin/orcamentos');
  redirect(`/admin/orcamentos/${data.id}`);
}

export async function updateOrcamentoStatus(fd) {
  await assertAdmin();

  const id = fd.get('id');
  const status = fd.get('status');

  if (typeof id !== 'string' || typeof status !== 'string' || !VALID_STATUS.includes(status)) return;

  await createAdminClient().from('orcamentos').update({ status }).eq('id', id);
  revalidatePath('/admin/orcamentos');
  revalidatePath(`/admin/orcamentos/${id}`);
}

export async function deleteOrcamento(fd) {
  await assertAdmin();

  const id = fd.get('id');
  if (typeof id !== 'string') return;

  await createAdminClient().from('orcamentos').delete().eq('id', id);
  revalidatePath('/admin/orcamentos');
  redirect('/admin/orcamentos');
}

export async function addItem(fd) {
  await assertAdmin();

  const orcamento_id = fd.get('orcamento_id');
  const produto_id = fd.get('produto_id') ? String(fd.get('produto_id')) : null;
  const descricao = String(fd.get('descricao') ?? '').trim();
  const quantidade = Number(fd.get('quantidade')) || 1;
  const preco_unitario = Number(fd.get('preco_unitario')) || 0;

  if (typeof orcamento_id !== 'string' || descricao === '') return;

  await createAdminClient()
    .from('orcamento_itens')
    .insert({ orcamento_id, produto_id, descricao, quantidade, preco_unitario });

  revalidatePath(`/admin/orcamentos/${orcamento_id}`);
}

export async function updateItem(fd) {
  await assertAdmin();

  const id = fd.get('id');
  const orcamento_id = fd.get('orcamento_id');
  const quantidade = Number(fd.get('quantidade')) || 1;
  const preco_unitario = Number(fd.get('preco_unitario')) || 0;

  if (typeof id !== 'string' || typeof orcamento_id !== 'string') return;

  await createAdminClient().from('orcamento_itens').update({ quantidade, preco_unitario }).eq('id', id);
  revalidatePath(`/admin/orcamentos/${orcamento_id}`);
}

export async function deleteItem(fd) {
  await assertAdmin();

  const id = fd.get('id');
  const orcamento_id = fd.get('orcamento_id');

  if (typeof id !== 'string' || typeof orcamento_id !== 'string') return;

  await createAdminClient().from('orcamento_itens').delete().eq('id', id);
  revalidatePath(`/admin/orcamentos/${orcamento_id}`);
}
