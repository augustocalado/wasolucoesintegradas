-- ============================================================
-- WA SOLUÇÕES INTEGRADAS - SCHEMA DO BANCO (Supabase / Postgres)
-- Execute no Supabase Dashboard > SQL Editor
-- ============================================================

-- Tabela de solicitações de atendimento (formulário do site)
create table if not exists public.solicitacoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  empresa text not null,
  telefone text not null,
  email text not null,
  cidade text not null,
  servico text not null,
  urgencia text not null default 'Baixa',
  descricao text not null,
  status text not null default 'novo' check (status in ('novo', 'em_andamento', 'concluido')),
  created_at timestamptz not null default now()
);

-- Índices para consultas do admin
create index if not exists solicitacoes_status_idx on public.solicitacoes (status);
create index if not exists solicitacoes_created_at_idx on public.solicitacoes (created_at desc);

-- Segurança: ativa RLS (Row Level Security)
alter table public.solicitacoes enable row level security;

-- Público (anon) pode SOMENTE inserir novas solicitações
create policy "anon_pode_inserir_solicitacoes"
  on public.solicitacoes
  for insert to anon
  with check (true);

-- O admin usa a chave service_role no servidor (ignora RLS),
-- então leitura/atualização/exclusão ficam protegidas no backend.

-- ============================================================
-- CRIAÇÃO DO USUÁRIO ADMIN
-- Não é feita por SQL. Crie em: Authentication > Users > Add user
-- (e-mail + senha). Esse usuário faz login em /admin.
-- ============================================================
