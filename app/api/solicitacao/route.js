import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const REQUIRED_FIELDS = ['nome', 'empresa', 'telefone', 'email', 'cidade', 'servico', 'urgencia', 'descricao'];

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Dados inválidos' }, { status: 400 });
  }

  const valid = REQUIRED_FIELDS.every((field) => typeof body[field] === 'string' && body[field].trim() !== '');

  if (!valid) {
    return NextResponse.json({ ok: false, error: 'Campos obrigatórios ausentes' }, { status: 400 });
  }

  if (!/^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/.test(body.telefone.trim())) {
    return NextResponse.json({ ok: false, error: 'Telefone inválido' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
    return NextResponse.json({ ok: false, error: 'E-mail inválido' }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('solicitacoes')
    .insert({
      nome: body.nome.trim(),
      empresa: body.empresa.trim(),
      telefone: body.telefone.trim(),
      email: body.email.trim(),
      cidade: body.cidade.trim(),
      servico: body.servico.trim(),
      urgencia: body.urgencia.trim(),
      descricao: body.descricao.trim(),
    })
    .select('id')
    .single();

  if (error) {
    console.error('Erro ao salvar solicitação:', error);
    return NextResponse.json({ ok: false, error: 'Erro ao salvar solicitação' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
