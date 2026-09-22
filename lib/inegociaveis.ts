// Persistência real via Supabase (tabela `inegociaveis`, ver
// supabase/schema.sql). Mesmos nomes/formas de antes — só
// assíncronas agora. Só é importado por Server Actions e Route
// Handlers, nunca vai pro bundle do navegador.

import { supabase } from "./supabase";

export type Inegociavel = {
  id: string;
  participanteId: string;
  titulo: string;
  assunto: string;
  alvo: number | null;
  criadoEm: string;
};

type LinhaInegociavel = {
  id: string;
  participante_id: string;
  titulo: string;
  assunto: string;
  alvo: number | null;
  criado_em: string;
};

function paraInegociavel(linha: LinhaInegociavel): Inegociavel {
  return {
    id: linha.id,
    participanteId: linha.participante_id,
    titulo: linha.titulo,
    assunto: linha.assunto,
    alvo: linha.alvo,
    criadoEm: linha.criado_em,
  };
}

export async function criarInegociavel(dados: {
  participanteId: string;
  titulo: string;
  assunto: string;
  alvo: number | null;
}): Promise<Inegociavel> {
  const { data, error } = await supabase
    .from("inegociaveis")
    .insert({
      participante_id: dados.participanteId,
      titulo: dados.titulo,
      assunto: dados.assunto,
      alvo: dados.alvo,
    })
    .select()
    .single();

  if (error) throw new Error(`Erro ao criar inegociável: ${error.message}`);
  return paraInegociavel(data as LinhaInegociavel);
}

export async function listarInegociaveisPorParticipante(
  participanteId: string,
): Promise<Inegociavel[]> {
  const { data, error } = await supabase
    .from("inegociaveis")
    .select()
    .eq("participante_id", participanteId)
    .order("criado_em", { ascending: true });

  if (error) throw new Error(`Erro ao listar inegociáveis: ${error.message}`);
  return (data as LinhaInegociavel[]).map(paraInegociavel);
}

export async function contarInegociaveisPorParticipante(participanteId: string): Promise<number> {
  const { count, error } = await supabase
    .from("inegociaveis")
    .select("*", { count: "exact", head: true })
    .eq("participante_id", participanteId);

  if (error) throw new Error(`Erro ao contar inegociáveis: ${error.message}`);
  return count ?? 0;
}
