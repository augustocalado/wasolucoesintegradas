-- ============================================================
-- WA SOLUÇÕES INTEGRADAS - SCHEMA DO BANCO (Supabase / Postgres)
-- Execute no Supabase Dashboard > SQL Editor
-- ============================================================

-- ------------------------------------------------------------
-- CHAMADOS (solicitações enviadas pelo site)
-- tipo: atendimento | suporte | orcamento
-- status: novo | em_andamento | concluido | enviado | aprovado | recusado
-- ------------------------------------------------------------
create table if not exists public.solicitacoes (
  id uuid primary key default gen_random_uuid(),
  numero text not null default 'WA-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6)),
  nome text not null,
  empresa text not null,
  telefone text not null,
  email text not null,
  cidade text not null,
  servico text not null,
  urgencia text not null default 'Baixa',
  descricao text not null,
  tipo text not null default 'atendimento' check (tipo in ('atendimento', 'suporte', 'orcamento')),
  status text not null default 'novo' check (status in ('novo', 'em_andamento', 'concluido', 'enviado', 'aprovado', 'recusado')),
  created_at timestamptz not null default now(),
  constraint solicitacoes_numero_key unique (numero)
);

create index if not exists solicitacoes_status_idx on public.solicitacoes (status);
create index if not exists solicitacoes_tipo_idx on public.solicitacoes (tipo);
create index if not exists solicitacoes_created_at_idx on public.solicitacoes (created_at desc);

-- ------------------------------------------------------------
-- CLIENTES
-- ------------------------------------------------------------
create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  documento text default '',
  cnpj text default '',
  telefone text not null,
  email text default '',
  endereco text default '',
  cidade text not null,
  uf text default '',
  observacoes text default '',
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- FORNECEDORES
-- ------------------------------------------------------------
create table if not exists public.fornecedores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  documento text default '',
  telefone text not null,
  email text default '',
  endereco text default '',
  cidade text not null,
  uf text default '',
  observacoes text default '',
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- PRODUTOS (catálogo)
-- ------------------------------------------------------------
create table if not exists public.produtos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  marca text not null default '',
  descricao text default '',
  categoria text not null default 'Outro',
  unidade text not null default 'un',
  preco_custo numeric not null default 0,
  margem numeric not null default 30,
  preco_venda numeric not null default 0,
  fornecedor_id uuid references public.fornecedores (id) on delete set null,
  observacoes text default '',
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- ORÇAMENTOS
-- ------------------------------------------------------------
create table if not exists public.orcamentos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references public.clientes (id) on delete set null,
  status text not null default 'novo' check (status in ('novo', 'em_andamento', 'enviado', 'aprovado', 'recusado', 'concluido')),
  prazo text not null default '7 dias',
  observacoes text default '',
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- ITENS DO ORÇAMENTO
-- ------------------------------------------------------------
create table if not exists public.orcamento_itens (
  id uuid primary key default gen_random_uuid(),
  orcamento_id uuid not null references public.orcamentos (id) on delete cascade,
  produto_id uuid references public.produtos (id) on delete set null,
  descricao text not null,
  quantidade numeric not null default 1,
  preco_unitario numeric not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists orcamento_itens_orcamento_idx on public.orcamento_itens (orcamento_id);
create index if not exists produtos_nome_idx on public.produtos (nome);
create index if not exists clientes_nome_idx on public.clientes (nome);
create index if not exists fornecedores_nome_idx on public.fornecedores (nome);

-- Produto: o MESMO nome com MARCA diferente pode ser cadastrado normalmente.
create unique index if not exists produtos_nome_marca_uniq on public.produtos (lower(nome), lower(marca));
drop index if exists produtos_nome_uniq;

-- ------------------------------------------------------------
-- SEGURANÇA
-- ------------------------------------------------------------
alter table public.solicitacoes enable row level security;

-- Público (anon) pode SOMENTE inserir novos chamados
create policy "anon_pode_inserir_solicitacoes"
  on public.solicitacoes
  for insert to anon
  with check (true);

-- Clientes, fornecedores, produtos, orçamentos: sem policies =
-- somente o servidor (service_role) acessa; público não.
alter table public.clientes enable row level security;
alter table public.fornecedores enable row level security;
alter table public.produtos enable row level security;
alter table public.orcamentos enable row level security;
alter table public.orcamento_itens enable row level security;

-- ============================================================
-- CRIAÇÃO DO USUÁRIO ADMIN
-- Não é feita por SQL. Crie em: Authentication > Users > Add user
-- (e-mail + senha). Esse usuário faz login em /admin.
-- ============================================================
