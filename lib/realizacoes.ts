// Persistência real via Supabase (tabela `realizacoes`, ver
// supabase/schema.sql). Mesmo padrão das outras libs: nomes em
// camelCase, conversão pra snake_case do banco. Só é importado por
// Server Actions e Route Handlers, nunca vai pro bundle do navegador.

import { supabase } from "./supabase";

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

/** "Hoje" no formato da coluna `dia` (date, sem hora). Usa o
 * relógio/fuso do servidor, mesma simplificação já usada em
 * `criadoEm`/`ultimaAtividade` no resto do app. */
export function hojeISO(): string {
  return new Date().toISOString().slice(0, 10);
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

/** Progresso de um inegociável (quantas vezes já foi marcado), vira
 * bolinhas preenchidas se tem alvo, ou "cumpri" se não tem. */
export async function contarRealizacoesPorInegociavel(inegociavelId: string): Promise<number> {
  const { count, error } = await supabase
    .from("realizacoes")
    .select("*", { count: "exact", head: true })
    .eq("inegociavel_id", inegociavelId);

  if (error) throw new Error(`Erro ao contar realizações do inegociável: ${error.message}`);
  return count ?? 0;
}
