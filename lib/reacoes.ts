// Persistência real via Supabase (tabela `reacoes`, ver
// supabase/schema.sql). Só é importado por Server Actions, nunca vai
// pro bundle do navegador.

import { supabase } from "./supabase";

/** Reação de um toque (o mascote). Se a pessoa já reagiu nessa
 * realização, o UNIQUE do banco barra e a gente só ignora: um toque =
 * um participante por realização, não acumula. */
export async function criarReacao(realizacaoId: string, participanteId: string): Promise<void> {
  const { error } = await supabase
    .from("reacoes")
    .insert({ realizacao_id: realizacaoId, participante_id: participanteId });

  // 23505 = unique_violation no Postgres: já tinha reagido, tudo certo.
  if (error && error.code !== "23505") {
    throw new Error(`Erro ao reagir: ${error.message}`);
  }
}
