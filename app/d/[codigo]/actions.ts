"use server";

import { buscarDesafioPorCodigo, definirCriadorSeVazio } from "@/lib/desafios";
import { criarParticipante } from "@/lib/participantes";
import { EMOJIS_IDENTIDADE } from "@/lib/identidade-constants";

export type ReivindicarIdentidadeState = {
  error?: string;
  participante?: {
    id: string;
    nome: string;
    emoji: string;
    token: string;
  };
};

export async function reivindicarIdentidadeAction(
  _prevState: ReivindicarIdentidadeState,
  formData: FormData,
): Promise<ReivindicarIdentidadeState> {
  const codigo = String(formData.get("codigo") ?? "");
  const nome = String(formData.get("nome") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "");
  const souCriador = formData.get("souCriador") === "1";

  const desafio = buscarDesafioPorCodigo(codigo);
  if (!desafio) {
    return { error: "Esse desafio não existe mais." };
  }

  if (!nome) {
    return { error: "Escolhe um nome." };
  }
  if (nome.length > 30) {
    return { error: "Nome muito grande — até 30 letras." };
  }
  if (!(EMOJIS_IDENTIDADE as readonly string[]).includes(emoji)) {
    return { error: "Escolhe um emoji da lista." };
  }

  const participante = criarParticipante({ desafioId: desafio.id, nome, emoji });

  if (souCriador) {
    definirCriadorSeVazio(desafio.id, participante.id);
  }

  return {
    participante: {
      id: participante.id,
      nome: participante.nome,
      emoji: participante.emoji,
      token: participante.token,
    },
  };
}
