// Persistência real via Supabase (tabela `participantes`, ver
// supabase/schema.sql). Mesmos nomes/formas de lib/desafios.ts, só
// assíncronas agora. Só é importado por Server Actions, Route
// Handlers e Server Components, nunca vai pro bundle do navegador.

import { supabase } from "./supabase";
import { ehUuid } from "./validacao";

export type Participante = {
  id: string;
  desafioId: string;
  nome: string;
  emoji: string;
  token: string;
  pronto: boolean;
  /** o compromisso: coisas boas por semana (nulo só em sala antiga) */
  metaSemanal: number | null;
  /** foco opcional do período */
  foco: string | null;
  ultimaAtividade: string;
  criadoEm: string;
};

type LinhaParticipante = {
  id: string;
  desafio_id: string;
  nome: string;
  emoji: string;
  token: string;
  pronto: boolean;
  meta_semanal: number | null;
  foco: string | null;
  ultima_atividade: string;
  criado_em: string;
};

function paraParticipante(linha: LinhaParticipante): Participante {
  return {
    id: linha.id,
    desafioId: linha.desafio_id,
    nome: linha.nome,
    emoji: linha.emoji,
    token: linha.token,
    pronto: linha.pronto,
    metaSemanal: linha.meta_semanal,
    foco: linha.foco,
    ultimaAtividade: linha.ultima_atividade,
    criadoEm: linha.criado_em,
  };
}

export async function criarParticipante(dados: {
  desafioId: string;
  nome: string;
  emoji: string;
  /** o compromisso já entra junto (entrar = se propor, num passo só) */
  metaSemanal?: number;
  foco?: string | null;
}): Promise<Participante> {
  const { data, error } = await supabase
    .from("participantes")
    .insert({
      desafio_id: dados.desafioId,
      nome: dados.nome,
      emoji: dados.emoji,
      token: crypto.randomUUID(),
      meta_semanal: dados.metaSemanal ?? null,
      foco: dados.foco ?? null,
      // Quem se propôs está pronto (o botão PRONTO saiu no modelo v2).
      pronto: dados.metaSemanal !== undefined,
    })
    .select()
    .single();

  if (error) throw new Error(`Erro ao criar participante: ${error.message}`);
  return paraParticipante(data as LinhaParticipante);
}

export async function buscarParticipantePorToken(
  desafioId: string,
  token: string,
): Promise<Participante | undefined> {
  // Token é UUID: qualquer outra coisa nem consulta o banco.
  if (!ehUuid(token)) return undefined;
  const { data, error } = await supabase
    .from("participantes")
    .select()
    .eq("desafio_id", desafioId)
    .eq("token", token)
    .maybeSingle();

  if (error) throw new Error(`Erro ao buscar participante por token: ${error.message}`);
  return data ? paraParticipante(data as LinhaParticipante) : undefined;
}

export async function listarParticipantesPorDesafio(desafioId: string): Promise<Participante[]> {
  const { data, error } = await supabase
    .from("participantes")
    .select()
    .eq("desafio_id", desafioId)
    .order("criado_em", { ascending: true });

  if (error) throw new Error(`Erro ao listar participantes: ${error.message}`);
  return (data as LinhaParticipante[]).map(paraParticipante);
}

/** Ajusta o compromisso (meta + foco). Quem chama garante que a sala
 * ainda está no lobby: o compromisso congela na largada. */
export async function atualizarCompromisso(
  participanteId: string,
  compromisso: { metaSemanal: number; foco: string | null },
): Promise<void> {
  const { error } = await supabase
    .from("participantes")
    .update({ meta_semanal: compromisso.metaSemanal, foco: compromisso.foco, pronto: true })
    .eq("id", participanteId);

  if (error) throw new Error(`Erro ao ajustar o compromisso: ${error.message}`);
}

/** Marca "vi a pessoa agora": chamado em toda visita reconhecida à
 * página da sala (ao abrir e ao focar a aba) e ao registrar/reagir.
 * Alimenta o "visto há X" e o "ativo hoje" dos cartões. */
export async function tocarUltimaAtividade(participanteId: string): Promise<void> {
  const { error } = await supabase
    .from("participantes")
    .update({ ultima_atividade: new Date().toISOString() })
    .eq("id", participanteId);

  if (error) throw new Error(`Erro ao atualizar última atividade: ${error.message}`);
}
