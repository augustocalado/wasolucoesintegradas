-- ============================================================
-- WA SOLUÇÕES INTEGRADAS - MIGRATION: SISTEMA ADMIN COMPLETO
-- Execute no Supabase Dashboard > SQL Editor
-- (roda sobre o schema base que você já executou)
-- ============================================================

-- Chamados: classificação por tipo (atendimento / suporte / orcamento)
alter table public.solicitacoes add column if not exists tipo text not null default 'atendimento' check (tipo in ('atendimento', 'suporte', 'orcamento'));

-- Chamados: status ampliado (fluxo de orçamentos)
alter table public.solicitacoes drop constraint if exists solicitacoes_status_check;
alter table public.solicitacoes add constraint solicitacoes_status_check check (status in ('novo', 'em_andamento', 'concluido', 'enviado', 'aprovado', 'recusado'));

create index if not exists solicitacoes_tipo_idx on public.solicitacoes (tipo);

-- NÚMERO DE PROTOCOLO (aleatório, único, não sequencial)
alter table public.solicitacoes add column if not exists numero text;

-- Preenche chamados existentes com número único (baseado no id, que é único)
update public.solicitacoes
set numero = 'WA-' || upper(substr(replace(id::text, '-', '') || gen_random_uuid()::text, 1, 6))
where numero is null or trim(numero) = '';

alter table public.solicitacoes alter column numero set not null;
alter table public.solicitacoes alter column numero set default 'WA-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'solicitacoes_numero_key') then
    alter table public.solicitacoes add constraint solicitacoes_numero_key unique (numero);
  end if;
end $$;

-- CLIENTES
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

-- CNPJ para clientes existentes
alter table public.clientes add column if not exists cnpj text default '';

-- FORNECEDORES
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

-- PRODUTOS (catálogo)
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

-- Margem (%) para produtos existentes
alter table public.produtos add column if not exists margem numeric not null default 30;

-- Marca para produtos existentes
alter table public.produtos add column if not exists marca text not null default '';

-- ORÇAMENTOS
create table if not exists public.orcamentos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references public.clientes (id) on delete set null,
  status text not null default 'novo' check (status in ('novo', 'em_andamento', 'enviado', 'aprovado', 'recusado', 'concluido')),
  prazo text not null default '7 dias',
  observacoes text default '',
  created_at timestamptz not null default now()
);

-- ITENS DO ORÇAMENTO
create table if not exists public.orcamento_itens (
  id uuid primary key default gen_random_uuid(),
  orcamento_id uuid not null references public.orcamentos (id) on delete cascade,
  produto_id uuid references public.produtos (id) on delete set null,
  descricao text not null,
  quantidade numeric not null default 1,
  preco_unitario numeric not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists solicitacoes_tipo_idx on public.solicitacoes (tipo);
create index if not exists orcamento_itens_orcamento_idx on public.orcamento_itens (orcamento_id);
create index if not exists produtos_nome_idx on public.produtos (nome);
create index if not exists clientes_nome_idx on public.clientes (nome);
create index if not exists fornecedores_nome_idx on public.fornecedores (nome);

-- Produto: o MESMO nome com MARCA diferente pode ser cadastrado normalmente.
create unique index if not exists produtos_nome_marca_uniq on public.produtos (lower(nome), lower(marca));
drop index if exists produtos_nome_uniq;

-- Segurança: ativa RLS nas novas tabelas.
-- Sem policies = somente o servidor (service_role) acessa; público não.
alter table public.clientes enable row level security;
alter table public.fornecedores enable row level security;
alter table public.produtos enable row level security;
alter table public.orcamentos enable row level security;
alter table public.orcamento_itens enable row level security;
