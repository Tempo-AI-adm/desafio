// Persistência real via Supabase (tabela `realizacoes`, ver
// supabase/schema.sql). Mesmo padrão das outras libs: nomes em
// camelCase, conversão pra snake_case do banco. Só é importado por
// Server Actions e Route Handlers, nunca vai pro bundle do navegador.

import { supabase } from "./supabase";

export { FUSO_DO_APP, hojeISO } from "./tempo";

export type TipoRealizacao = "inegociavel" | "extra";

export type Realizacao = {
  id: string;
  participanteId: string;
  tipo: TipoRealizacao;
  inegociavelId: string | null;
  assunto: string;
  texto: string;
  dia: string;
  criadoEm: string;
};

type LinhaRealizacao = {
  id: string;
  participante_id: string;
  tipo: TipoRealizacao;
  inegociavel_id: string | null;
  assunto: string;
  texto: string;
  dia: string;
  criado_em: string;
};

function paraRealizacao(linha: LinhaRealizacao): Realizacao {
  return {
    id: linha.id,
    participanteId: linha.participante_id,
    tipo: linha.tipo,
    inegociavelId: linha.inegociavel_id,
    assunto: linha.assunto,
    texto: linha.texto,
    dia: linha.dia,
    criadoEm: linha.criado_em,
  };
}

export async function criarRealizacao(dados: {
  participanteId: string;
  tipo: TipoRealizacao;
  inegociavelId: string | null;
  assunto: string;
  texto: string;
  dia: string;
}): Promise<Realizacao> {
  const { data, error } = await supabase
    .from("realizacoes")
    .insert({
      participante_id: dados.participanteId,
      tipo: dados.tipo,
      inegociavel_id: dados.inegociavelId,
      assunto: dados.assunto,
      texto: dados.texto,
      dia: dados.dia,
    })
    .select()
    .single();

  if (error) throw new Error(`Erro ao criar realização: ${error.message}`);
  return paraRealizacao(data as LinhaRealizacao);
}

/** Quantas realizações esse participante já tem num dia, usada pra
 * decidir o selo/copy de comemoração (ver lib/copy.ts). Chamar DEPOIS
 * de criar a realização, pra contar ela também. */
export async function contarRealizacoesNoDia(participanteId: string, dia: string): Promise<number> {
  const { count, error } = await supabase
    .from("realizacoes")
    .select("*", { count: "exact", head: true })
    .eq("participante_id", participanteId)
    .eq("dia", dia);

  if (error) throw new Error(`Erro ao contar realizações do dia: ${error.message}`);
  return count ?? 0;
}

export type RealizacaoComReacoes = Realizacao & {
  /** ids dos participantes que reagiram (o mascote) nessa realização */
  reagiram: string[];
};

/** Todas as realizações de uma sala (dos participantes passados), mais
 * recente primeiro, já com quem reagiu em cada uma. Uma consulta só,
 * pro feed e pros cartões. */
export async function listarRealizacoesDaSala(
  participanteIds: string[],
): Promise<RealizacaoComReacoes[]> {
  if (participanteIds.length === 0) return [];
  const { data, error } = await supabase
    .from("realizacoes")
    .select("*, reacoes(participante_id)")
    .in("participante_id", participanteIds)
    .order("criado_em", { ascending: false });

  if (error) throw new Error(`Erro ao listar realizações da sala: ${error.message}`);
  return (data as (LinhaRealizacao & { reacoes: { participante_id: string }[] })[]).map((l) => ({
    ...paraRealizacao(l),
    reagiram: l.reacoes.map((r) => r.participante_id),
  }));
}

export async function buscarRealizacaoPorId(id: string): Promise<Realizacao | undefined> {
  const { data, error } = await supabase.from("realizacoes").select().eq("id", id).maybeSingle();

  if (error) throw new Error(`Erro ao buscar realização por id: ${error.message}`);
  return data ? paraRealizacao(data as LinhaRealizacao) : undefined;
}

/** Desfazer: apaga a marcação de inegociável, mas só se for dessa
 * pessoa e ainda estiver dentro do limite de tempo (a regra fica aqui
 * no WHERE, não dá pra desfazer registro antigo nem de outra pessoa).
 * Devolve se apagou. Reações da linha somem junto (on delete cascade). */
export async function apagarMarcacaoRecente(dados: {
  realizacaoId: string;
  participanteId: string;
  criadaDepoisDe: string;
}): Promise<boolean> {
  const { data, error } = await supabase
    .from("realizacoes")
    .delete()
    .eq("id", dados.realizacaoId)
    .eq("participante_id", dados.participanteId)
    .eq("tipo", "inegociavel")
    .gte("criado_em", dados.criadaDepoisDe)
    .select("id");

  if (error) throw new Error(`Erro ao desfazer registro: ${error.message}`);
  return (data ?? []).length > 0;
}
