-- Migração v2 (CONCEITO.md): meta semanal + foco por pessoa, registro
-- de uma frase, data de início marcada. Só ACRESCENTA (colunas novas,
-- valores padrão, um valor a mais permitido em `tipo`): o app que já
-- está no ar continua funcionando depois disto.
-- Cole inteiro no SQL Editor do Supabase e rode uma vez. Rodar de novo
-- não quebra nada (tudo é "if not exists" / "if exists").

-- desafios: dia em que a sala larga sozinha (o criador pode largar antes).
alter table public.desafios
  add column if not exists data_inicio_marcada date;

-- participantes: o compromisso de cada pessoa (um por sala).
alter table public.participantes
  add column if not exists meta_semanal integer,
  add column if not exists foco text;

alter table public.participantes
  drop constraint if exists participantes_meta_semanal_check,
  add constraint participantes_meta_semanal_check
    check (meta_semanal is null or meta_semanal between 1 and 30);

alter table public.participantes
  drop constraint if exists participantes_foco_check,
  add constraint participantes_foco_check
    check (foco is null or char_length(foco) <= 60);

-- realizacoes: todo registro é igual ("registro"), com "foi no foco?".
-- Assunto deixa de ser pedido: o banco recebe 'outro' por padrão.
alter table public.realizacoes
  add column if not exists no_foco boolean not null default false;

alter table public.realizacoes
  alter column assunto set default 'outro';

alter table public.realizacoes
  drop constraint if exists realizacoes_tipo_check,
  add constraint realizacoes_tipo_check
    check (tipo in ('inegociavel', 'extra', 'registro'));

alter table public.realizacoes
  alter column tipo set default 'registro';

alter table public.realizacoes
  drop constraint if exists realizacoes_texto_check,
  add constraint realizacoes_texto_check
    check (char_length(texto) <= 200);
