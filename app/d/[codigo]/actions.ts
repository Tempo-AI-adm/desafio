"use server";

import { buscarDesafioPorCodigo, definirCriadorSeVazio, largarDesafio } from "@/lib/desafios";
import { buscarParticipantePorToken, criarParticipante, marcarPronto } from "@/lib/participantes";
import { contarInegociaveisPorParticipante, criarInegociavel } from "@/lib/inegociaveis";
import { EMOJIS_IDENTIDADE } from "@/lib/identidade-constants";
import { ASSUNTOS } from "@/lib/assuntos-constants";

const VALORES_ASSUNTO: readonly string[] = ASSUNTOS.map((a) => a.valor);

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

  const desafio = await buscarDesafioPorCodigo(codigo);
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

  const participante = await criarParticipante({ desafioId: desafio.id, nome, emoji });

  if (souCriador) {
    await definirCriadorSeVazio(desafio.id, participante.id);
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

export type AdicionarInegociavelState = {
  error?: string;
  ok?: boolean;
};

export async function adicionarInegociavelAction(
  _prevState: AdicionarInegociavelState,
  formData: FormData,
): Promise<AdicionarInegociavelState> {
  const codigo = String(formData.get("codigo") ?? "");
  const token = String(formData.get("token") ?? "");
  const titulo = String(formData.get("titulo") ?? "").trim();
  const assunto = String(formData.get("assunto") ?? "");
  const alvoRaw = String(formData.get("alvo") ?? "").trim();

  const desafio = await buscarDesafioPorCodigo(codigo);
  if (!desafio) {
    return { error: "Esse desafio não existe mais." };
  }

  const participante = await buscarParticipantePorToken(desafio.id, token);
  if (!participante) {
    return { error: "Sua identidade não foi reconhecida. Recarrega a página." };
  }

  if (desafio.estado !== "lobby") {
    return { error: "O norte já travou — o desafio começou." };
  }

  if (!titulo) {
    return { error: "Dá um título pro inegociável." };
  }
  if (titulo.length > 60) {
    return { error: "Título muito grande — até 60 letras." };
  }
  if (!VALORES_ASSUNTO.includes(assunto)) {
    return { error: "Escolhe um assunto da lista." };
  }

  let alvo: number | null = null;
  if (alvoRaw) {
    const numero = Number(alvoRaw);
    if (!Number.isInteger(numero) || numero < 1 || numero > 365) {
      return { error: "Alvo precisa ser um número válido (1 a 365) ou ficar em branco." };
    }
    alvo = numero;
  }

  await criarInegociavel({ participanteId: participante.id, titulo, assunto, alvo });

  return { ok: true };
}

export type AlternarProntoState = {
  error?: string;
  ok?: boolean;
};

export async function alternarProntoAction(
  _prevState: AlternarProntoState,
  formData: FormData,
): Promise<AlternarProntoState> {
  const codigo = String(formData.get("codigo") ?? "");
  const token = String(formData.get("token") ?? "");

  const desafio = await buscarDesafioPorCodigo(codigo);
  if (!desafio) {
    return { error: "Esse desafio não existe mais." };
  }

  const participante = await buscarParticipantePorToken(desafio.id, token);
  if (!participante) {
    return { error: "Sua identidade não foi reconhecida. Recarrega a página." };
  }

  if (desafio.estado !== "lobby") {
    return { error: "O desafio já começou." };
  }

  const querFicarPronto = !participante.pronto;
  if (querFicarPronto && (await contarInegociaveisPorParticipante(participante.id)) === 0) {
    return { error: "Adiciona pelo menos 1 inegociável antes de marcar PRONTO." };
  }

  await marcarPronto(participante.id, querFicarPronto);

  return { ok: true };
}

export type LargarState = {
  error?: string;
  ok?: boolean;
};

export async function largarAction(
  _prevState: LargarState,
  formData: FormData,
): Promise<LargarState> {
  const codigo = String(formData.get("codigo") ?? "");
  const token = String(formData.get("token") ?? "");

  const desafio = await buscarDesafioPorCodigo(codigo);
  if (!desafio) {
    return { error: "Esse desafio não existe mais." };
  }

  const participante = await buscarParticipantePorToken(desafio.id, token);
  if (!participante) {
    return { error: "Sua identidade não foi reconhecida. Recarrega a página." };
  }

  // Autoridade vem do servidor (desafio.criadorParticipanteId), nunca
  // de uma flag que o cliente mandou — só quem o servidor registrou
  // como criador pode largar.
  if (desafio.criadorParticipanteId !== participante.id) {
    return { error: "Só quem criou o desafio pode largar." };
  }

  if (desafio.estado !== "lobby") {
    return { error: "O desafio já começou." };
  }

  await largarDesafio(desafio.id);

  return { ok: true };
}
