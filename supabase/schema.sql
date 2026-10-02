-- Schema do "desafio", ~5 tabelas do PRD.md ("Modelo de dados").
-- Já inclui a migração v2 (supabase/migracao-v2.sql): pra um banco novo,
-- rode só este arquivo; pra um banco que já existe, rode a migração.
-- Cole isso inteiro no SQL Editor do painel do Supabase e rode.
-- Não é rodado automaticamente por nada no app, é só pra referência
-- e pra colar manualmente.

create extension if not exists pgcrypto;

-- 1) desafios ---------------------------------------------------------
create table if not exists public.desafios (
  id                      uuid primary key default gen_random_uuid(),
  codigo                  text not null unique,
  nome                    text not null,
  duracao_dias            integer not null check (duracao_dias > 0),
  permite_backfill        boolean not null default false,
  estado                  text not null default 'lobby'
                            check (estado in ('lobby', 'ativo', 'encerrado')),
  -- Aponta pra participantes.id, mas participantes só existe depois
  -- (referencia desafios.id), a FK circular é adicionada no fim do
  -- arquivo com ALTER TABLE, depois que as duas tabelas existirem.
  criador_participante_id uuid,
  data_inicio             timestamptz,
  -- v2: dia em que a sala larga sozinha (o criador pode largar antes).
  data_inicio_marcada     date,
  criado_em               timestamptz not null default now()
);

-- 2) participantes -----------------------------------------------------
create table if not exists public.participantes (
  id                uuid primary key default gen_random_uuid(),
  desafio_id        uuid not null references public.desafios(id) on delete cascade,
  nome              text not null,
  emoji             text not null,
  token             text not null unique,
  pronto            boolean not null default false,
  -- v2: o compromisso da pessoa nessa sala (meta de coisas boas por
  -- semana + foco opcional).
  meta_semanal      integer check (meta_semanal is null or meta_semanal between 1 and 30),
  foco              text check (foco is null or char_length(foco) <= 60),
  ultima_atividade  timestamptz not null default now(),
  criado_em         timestamptz not null default now()
);

create index if not exists idx_participantes_desafio_id
  on public.participantes(desafio_id);

-- Agora que participantes existe, fecha a referência circular de desafios.
alter table public.desafios
  add constraint desafios_criador_participante_id_fkey
  foreign key (criador_participante_id) references public.participantes(id);

-- 3) inegociaveis --------------------------------------------------------
create table if not exists public.inegociaveis (
  id              uuid primary key default gen_random_uuid(),
  participante_id uuid not null references public.participantes(id) on delete cascade,
  titulo          text not null,
  -- Valores internos fixos; na tela: treino = Saúde, estudo = Aprendizado,
  -- comida = Lar (ver lib/assuntos-constants.ts).
  assunto         text not null
                    check (assunto in ('treino', 'estudo', 'trabalho', 'comida', 'tarefa', 'outro')),
  alvo            integer check (alvo is null or alvo > 0),
  criado_em       timestamptz not null default now()
);

create index if not exists idx_inegociaveis_participante_id
  on public.inegociaveis(participante_id);

-- 4) realizacoes -----------------------------------------------------------
create table if not exists public.realizacoes (
  id              uuid primary key default gen_random_uuid(),
  participante_id uuid not null references public.participantes(id) on delete cascade,
  -- v2: todo registro novo é 'registro'; os outros valores são do modelo antigo.
  tipo            text not null default 'registro' check (tipo in ('inegociavel', 'extra', 'registro')),
  -- nulo se tipo = 'extra'
  inegociavel_id  uuid references public.inegociaveis(id) on delete set null,
  assunto         text not null default 'outro'
                    check (assunto in ('treino', 'estudo', 'trabalho', 'comida', 'tarefa', 'outro')),
  texto           text not null check (char_length(texto) <= 200),
  -- v2: "isso foi no seu foco?"
  no_foco         boolean not null default false,
  dia             date not null,
  criado_em       timestamptz not null default now()
);

create index if not exists idx_realizacoes_participante_id
  on public.realizacoes(participante_id);
create index if not exists idx_realizacoes_inegociavel_id
  on public.realizacoes(inegociavel_id);

-- 5) reacoes -----------------------------------------------------------
create table if not exists public.reacoes (
  id             uuid primary key default gen_random_uuid(),
  realizacao_id  uuid not null references public.realizacoes(id) on delete cascade,
  participante_id uuid not null references public.participantes(id) on delete cascade,
  criado_em      timestamptz not null default now(),
  -- "um toque = um participante por realização" (PRD, seção Reações)
  unique (realizacao_id, participante_id)
);

create index if not exists idx_reacoes_realizacao_id
  on public.reacoes(realizacao_id);

-- Row Level Security ---------------------------------------------------
-- O app não usa Supabase Auth (identidade é por token de dispositivo,
-- verificado no código do servidor, não pelo Postgres). Habilito RLS
-- em todas as tabelas (boa prática / o "Security Advisor" do Supabase
-- pede) com políticas permissivas pra anon key, a mesma coisa que já
-- temos hoje, onde qualquer verificação de "quem pode fazer o quê"
-- acontece nas Server Actions, não no banco. Dá pra apertar isso
-- depois, se um dia entrar login de verdade.

alter table public.desafios       enable row level security;
alter table public.participantes  enable row level security;
alter table public.inegociaveis   enable row level security;
alter table public.realizacoes    enable row level security;
alter table public.reacoes        enable row level security;

create policy "anon acesso total" on public.desafios
  for all using (true) with check (true);
create policy "anon acesso total" on public.participantes
  for all using (true) with check (true);
create policy "anon acesso total" on public.inegociaveis
  for all using (true) with check (true);
create policy "anon acesso total" on public.realizacoes
  for all using (true) with check (true);
create policy "anon acesso total" on public.reacoes
  for all using (true) with check (true);
