import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const REQUIRED_FIELDS = ['tipo', 'nome', 'empresa', 'telefone', 'email', 'cidade', 'servico', 'urgencia', 'descricao'];
const VALID_TIPOS = ['atendimento', 'suporte', 'orcamento'];
const NUMERO_CARACTERES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function gerarNumero() {
  let sufixo = '';
  for (let i = 0; i < 6; i += 1) {
    sufixo += NUMERO_CARACTERES[Math.floor(Math.random() * NUMERO_CARACTERES.length)];
  }
  return `WA-${sufixo}`;
}

async function inserirComNumeroUnico(supabase, dados) {
  for (let tentativa = 0; tentativa < 20; tentativa += 1) {
    const { data, error } = await supabase
      .from('solicitacoes')
      .insert({ ...dados, numero: gerarNumero() })
      .select('id, numero')
      .single();

    if (error) {
      if (error.code === '23505') continue;
      return { error };
    }
    return { data };
  }
  return { error: { message: 'Não foi possível gerar um número de protocolo único' } };
}

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

  const tipo = VALID_TIPOS.includes(body.tipo) ? body.tipo : 'atendimento';

  const supabase = createAdminClient();

  const { data, error } = await inserirComNumeroUnico(supabase, {
    tipo,
    nome: body.nome.trim(),
    empresa: body.empresa.trim(),
    telefone: body.telefone.trim(),
    email: body.email.trim(),
    cidade: body.cidade.trim(),
    servico: body.servico.trim(),
    urgencia: body.urgencia.trim(),
    descricao: body.descricao.trim(),
  });

  if (error) {
    console.error('Erro ao salvar solicitação:', error);
    return NextResponse.json({ ok: false, error: 'Erro ao salvar solicitação' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id, numero: data.numero }, { status: 201 });
}
