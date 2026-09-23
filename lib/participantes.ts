// Persistência real via Supabase (tabela `participantes`, ver
// supabase/schema.sql). Mesmos nomes/formas de lib/desafios.ts, só
// assíncronas agora. Só é importado por Server Actions, Route
// Handlers e Server Components, nunca vai pro bundle do navegador.

import { supabase } from "./supabase";

export type Participante = {
  id: string;
  desafioId: string;
  nome: string;
  emoji: string;
  token: string;
  pronto: boolean;
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
    ultimaAtividade: linha.ultima_atividade,
    criadoEm: linha.criado_em,
  };
}

export async function criarParticipante(dados: {
  desafioId: string;
  nome: string;
  emoji: string;
}): Promise<Participante> {
  const { data, error } = await supabase
    .from("participantes")
    .insert({
      desafio_id: dados.desafioId,
      nome: dados.nome,
      emoji: dados.emoji,
      token: crypto.randomUUID(),
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

export async function marcarPronto(participanteId: string, pronto: boolean): Promise<void> {
  const { error } = await supabase.from("participantes").update({ pronto }).eq("id", participanteId);

  if (error) throw new Error(`Erro ao marcar pronto: ${error.message}`);
}
