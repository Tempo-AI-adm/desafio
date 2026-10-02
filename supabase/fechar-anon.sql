-- Fecha o banco pra chave pública (anon). O app acessa o banco só pelo
-- servidor, com a chave secreta (que ignora o RLS), então nada aqui
-- afeta o app. Rode SÓ depois que o app no ar estiver usando a chave
-- secreta (bloco 1B). Pode rodar de novo sem quebrar nada.

-- 1) Tira as políticas que liberavam tudo pra anon.
drop policy if exists "anon acesso total" on public.desafios;
drop policy if exists "anon acesso total" on public.participantes;
drop policy if exists "anon acesso total" on public.inegociaveis;
drop policy if exists "anon acesso total" on public.realizacoes;
drop policy if exists "anon acesso total" on public.reacoes;

-- 2) RLS ligado em todas (sem nenhuma política = anon não lê nem escreve).
alter table public.desafios      enable row level security;
alter table public.participantes enable row level security;
alter table public.inegociaveis  enable row level security;
alter table public.realizacoes   enable row level security;
alter table public.reacoes       enable row level security;

-- 3) Camada extra: tira das chaves públicas qualquer permissão nas
--    tabelas (atuais e futuras). Assim, mesmo que alguém crie uma
--    política por engano, anon continua sem acesso.
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;

-- 4) Conferência: deve voltar ZERO linhas (nenhuma política sobrando).
select schemaname, tablename, policyname from pg_policies where schemaname = 'public';
