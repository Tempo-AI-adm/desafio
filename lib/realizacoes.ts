// Realizações (tabela `realizacoes`, ver supabase/schema.sql), modelo v2:
// todo registro é igual (tipo 'registro'), frase opcional, "no foco"
// opcional, sempre no dia de hoje. Colunas antigas (tipo/assunto/
// inegociavel_id) recebem o valor padrão. Só servidor.

import { supabase } from "./supabase";
import { ehUuid } from "./validacao";

export { FUSO_DO_APP, hojeISO } from "./tempo";

export type Realizacao = {
  id: string;
  participanteId: string;
  /** a frase (opcional): vazio = "[nome] registrou" no feed */
  texto: string;
  noFoco: boolean;
  dia: string;
  criadoEm: string;
};

type LinhaRealizacao = {
  id: string;
  participante_id: string;
  texto: string;
  no_foco: boolean;
  dia: string;
  criado_em: string;
};

function paraRealizacao(linha: LinhaRealizacao): Realizacao {
  return {
    id: linha.id,
    participanteId: linha.participante_id,
    texto: linha.texto,
    noFoco: linha.no_foco,
    dia: linha.dia,
    criadoEm: linha.criado_em,
  };
}

/** Um registro (um toque): frase e "no foco" opcionais, dia de hoje. */
export async function criarRegistro(dados: {
  participanteId: string;
  texto: string;
  noFoco: boolean;
  dia: string;
}): Promise<Realizacao> {
  const { data, error } = await supabase
    .from("realizacoes")
    .insert({
      participante_id: dados.participanteId,
      tipo: "registro",
      assunto: "outro",
      texto: dados.texto,
      no_foco: dados.noFoco,
      dia: dados.dia,
      // Hora do servidor do app (não a do banco): as comparações de tempo
      // (janela de desfazer, esconder dos outros por ~7s, reações novas)
      // usam este mesmo relógio, então um relógio adiantado ou atrasado
      // em relação ao do banco não bagunça nada.
      criado_em: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(`Erro ao registrar: ${error.message}`);
  return paraRealizacao(data as LinhaRealizacao);
}

/** Quantas realizações esse participante tem num dia (decide o selo e o
 * foguinho). Chamar DEPOIS de criar, pra contar a nova também. */
export async function contarRealizacoesNoDia(participanteId: string, dia: string): Promise<number> {
  const { count, error } = await supabase
    .from("realizacoes")
    .select("*", { count: "exact", head: true })
    .eq("participante_id", participanteId)
    .eq("dia", dia);

  if (error) throw new Error(`Erro ao contar realizações do dia: ${error.message}`);
  return count ?? 0;
}

/** O dia de cada realização de uma pessoa (pras semanas dela). */
export async function diasDasRealizacoesDe(participanteId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("realizacoes")
    .select("dia")
    .eq("participante_id", participanteId);

  if (error) throw new Error(`Erro ao listar dias das realizações: ${error.message}`);
  return (data as { dia: string }[]).map((r) => r.dia);
}

export type ReacaoResumo = { participanteId: string; criadoEm: string };

export type RealizacaoComReacoes = Realizacao & {
  /** quem reagiu (os olhinhos) e quando */
  reacoes: ReacaoResumo[];
};

/** Todas as realizações de uma sala (dos participantes passados), mais
 * recente primeiro, já com as reações. Uma consulta só. */
export async function listarRealizacoesDaSala(
  participanteIds: string[],
): Promise<RealizacaoComReacoes[]> {
  if (participanteIds.length === 0) return [];
  const { data, error } = await supabase
    .from("realizacoes")
    .select("id, participante_id, texto, no_foco, dia, criado_em, reacoes(participante_id, criado_em)")
    .in("participante_id", participanteIds)
    .order("criado_em", { ascending: false });

  if (error) throw new Error(`Erro ao listar realizações da sala: ${error.message}`);
  return (data as (LinhaRealizacao & { reacoes: { participante_id: string; criado_em: string }[] })[]).map(
    (l) => ({
      ...paraRealizacao(l),
      reacoes: l.reacoes.map((r) => ({ participanteId: r.participante_id, criadoEm: r.criado_em })),
    }),
  );
}

export async function buscarRealizacaoPorId(id: string): Promise<Realizacao | undefined> {
  if (!ehUuid(id)) return undefined;
  const { data, error } = await supabase
    .from("realizacoes")
    .select("id, participante_id, texto, no_foco, dia, criado_em")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Erro ao buscar realização por id: ${error.message}`);
  return data ? paraRealizacao(data as LinhaRealizacao) : undefined;
}

/** Desfazer: apaga o registro, mas só se for dessa pessoa e ainda
 * estiver dentro do limite de tempo (a regra fica no WHERE). Devolve se
 * apagou. Reações da linha somem junto (on delete cascade). */
export async function apagarRegistroRecente(dados: {
  realizacaoId: string;
  participanteId: string;
  criadaDepoisDe: string;
}): Promise<boolean> {
  if (!ehUuid(dados.realizacaoId)) return false;
  const { data, error } = await supabase
    .from("realizacoes")
    .delete()
    .eq("id", dados.realizacaoId)
    .eq("participante_id", dados.participanteId)
    .gte("criado_em", dados.criadaDepoisDe)
    .select("id");

  if (error) throw new Error(`Erro ao desfazer registro: ${error.message}`);
  return (data ?? []).length > 0;
}
