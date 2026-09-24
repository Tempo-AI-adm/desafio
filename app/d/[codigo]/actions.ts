"use server";

import { buscarDesafioPorCodigo, definirCriadorSeVazio, largarDesafio } from "@/lib/desafios";
import {
  buscarParticipantePorToken,
  criarParticipante,
  marcarPronto,
  listarParticipantesPorDesafio,
  tocarUltimaAtividade,
} from "@/lib/participantes";
import {
  buscarInegociavelPorId,
  contarInegociaveisPorParticipante,
  criarInegociavel,
} from "@/lib/inegociaveis";
import {
  apagarMarcacaoRecente,
  buscarRealizacaoPorId,
  contarRealizacoesNoDia,
  criarRealizacao,
  hojeISO,
} from "@/lib/realizacoes";
import { criarReacao } from "@/lib/reacoes";
import { LIMITE_DESFAZER_SERVIDOR_MS } from "@/lib/tempo";
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
    return { error: "Essa sala não existe mais." };
  }

  if (!nome) {
    return { error: "Escolhe um nome." };
  }
  if (nome.length > 30) {
    return { error: "Nome muito grande, até 30 letras." };
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
  carimbo?: number;
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
    return { error: "Essa sala não existe mais." };
  }

  const participante = await buscarParticipantePorToken(desafio.id, token);
  if (!participante) {
    return { error: "Sua identidade não foi reconhecida. Recarrega a página." };
  }

  // Missão nova vale no lobby e com a sala rolando ("+ Nova missão").
  // As que já existem não mudam; só dá pra somar novas.
  if (desafio.estado === "encerrado") {
    return { error: "O desafio dessa sala já encerrou." };
  }

  if (!titulo) {
    return { error: "Dá um título pro inegociável." };
  }
  if (titulo.length > 60) {
    return { error: "Título muito grande, até 60 letras." };
  }
  if (!VALORES_ASSUNTO.includes(assunto)) {
    return { error: "Escolhe um assunto da lista." };
  }

  let alvo: number | null = null;
  if (alvoRaw) {
    const numero = Number(alvoRaw);
    if (!Number.isInteger(numero) || numero < 1 || numero > 365) {
      return { error: "Quantas vezes precisa ser um número de 1 a 365." };
    }
    alvo = numero;
  }

  await criarInegociavel({ participanteId: participante.id, titulo, assunto, alvo });
  await tocarUltimaAtividade(participante.id);

  return { ok: true, carimbo: Date.now() };
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
    return { error: "Essa sala não existe mais." };
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
    return { error: "Essa sala não existe mais." };
  }

  const participante = await buscarParticipantePorToken(desafio.id, token);
  if (!participante) {
    return { error: "Sua identidade não foi reconhecida. Recarrega a página." };
  }

  // Autoridade vem do servidor (desafio.criadorParticipanteId), nunca
  // de uma flag que o cliente mandou, só quem o servidor registrou
  // como criador pode largar.
  if (desafio.criadorParticipanteId !== participante.id) {
    return { error: "Só quem criou a sala pode largar." };
  }

  if (desafio.estado !== "lobby") {
    return { error: "O desafio já começou." };
  }

  await largarDesafio(desafio.id);

  return { ok: true };
}

export type RegistrarInegociavelState = {
  error?: string;
  ok?: boolean;
  contagemHoje?: number;
  carimbo?: number;
  /** o que acabou de ser criado, pra janela de desfazer na tela */
  realizacaoId?: string;
  inegociavelId?: string;
};

// Caminho de 1 toque: marca +1 num inegociável que a pessoa já
// definiu. Assunto e texto da realização vêm do próprio inegociável,
// não pede formulário nenhum. Estourar o alvo continua funcionando
// (não trava em 100%, é só mais um +1, ver PRD "Check / registrar").
export async function registrarInegociavelAction(
  _prevState: RegistrarInegociavelState,
  formData: FormData,
): Promise<RegistrarInegociavelState> {
  const codigo = String(formData.get("codigo") ?? "");
  const token = String(formData.get("token") ?? "");
  const inegociavelId = String(formData.get("inegociavelId") ?? "");

  const desafio = await buscarDesafioPorCodigo(codigo);
  if (!desafio) {
    return { error: "Essa sala não existe mais." };
  }

  const participante = await buscarParticipantePorToken(desafio.id, token);
  if (!participante) {
    return { error: "Sua identidade não foi reconhecida. Recarrega a página." };
  }

  if (desafio.estado !== "ativo") {
    return { error: "O desafio não está rolando agora." };
  }

  const inegociavel = await buscarInegociavelPorId(inegociavelId);
  if (!inegociavel || inegociavel.participanteId !== participante.id) {
    return { error: "Esse inegociável não é seu." };
  }

  const dia = hojeISO();
  const realizacao = await criarRealizacao({
    participanteId: participante.id,
    tipo: "inegociavel",
    inegociavelId: inegociavel.id,
    assunto: inegociavel.assunto,
    texto: inegociavel.titulo,
    dia,
  });
  await tocarUltimaAtividade(participante.id);

  const contagemHoje = await contarRealizacoesNoDia(participante.id, dia);

  return {
    ok: true,
    contagemHoje,
    carimbo: Date.now(),
    realizacaoId: realizacao.id,
    inegociavelId: inegociavel.id,
  };
}

export type ReagirState = {
  error?: string;
  ok?: boolean;
  carimbo?: number;
};

// Reação de um toque no feed: sempre o mascote, sem escolher emoji.
// Vale em realização de qualquer pessoa da mesma sala (inclusive a
// própria). Tocar de novo não acumula (UNIQUE no banco).
export async function reagirAction(
  _prevState: ReagirState,
  formData: FormData,
): Promise<ReagirState> {
  const codigo = String(formData.get("codigo") ?? "");
  const token = String(formData.get("token") ?? "");
  const realizacaoId = String(formData.get("realizacaoId") ?? "");

  const desafio = await buscarDesafioPorCodigo(codigo);
  if (!desafio) {
    return { error: "Essa sala não existe mais." };
  }

  const participante = await buscarParticipantePorToken(desafio.id, token);
  if (!participante) {
    return { error: "Sua identidade não foi reconhecida. Recarrega a página." };
  }

  if (desafio.estado !== "ativo") {
    return { error: "O desafio não está rolando agora." };
  }

  // A realização tem que ser de alguém desta mesma sala.
  const realizacao = await buscarRealizacaoPorId(realizacaoId);
  const autor = realizacao
    ? (await listarParticipantesPorDesafio(desafio.id)).find((p) => p.id === realizacao.participanteId)
    : undefined;
  if (!realizacao || !autor) {
    return { error: "Essa realização não é desta sala." };
  }

  await criarReacao(realizacao.id, participante.id);
  await tocarUltimaAtividade(participante.id);

  return { ok: true, carimbo: Date.now() };
}

export type DesfazerState = {
  error?: string;
  ok?: boolean;
  desfeitoId?: string;
  contagemHoje?: number;
  carimbo?: number;
};

// Desfazer a marcação de inegociável que acabou de ser feita (tocar de
// novo dentro da janela de ~5s). O servidor só apaga se for da própria
// pessoa e ainda estiver dentro do limite; passou disso, não desfaz
// nada (a tela já trata o próximo toque como registro novo).
export async function desfazerRegistroAction(
  _prevState: DesfazerState,
  formData: FormData,
): Promise<DesfazerState> {
  const codigo = String(formData.get("codigo") ?? "");
  const token = String(formData.get("token") ?? "");
  const realizacaoId = String(formData.get("realizacaoId") ?? "");

  const desafio = await buscarDesafioPorCodigo(codigo);
  if (!desafio) {
    return { error: "Essa sala não existe mais." };
  }

  const participante = await buscarParticipantePorToken(desafio.id, token);
  if (!participante) {
    return { error: "Sua identidade não foi reconhecida. Recarrega a página." };
  }

  // Sala encerrada (ou que ainda nem largou) não aceita mais mudança
  // nos registros, nem desfazer.
  if (desafio.estado !== "ativo") {
    return { error: "O desafio não está rolando agora." };
  }

  const apagou = await apagarMarcacaoRecente({
    realizacaoId,
    participanteId: participante.id,
    criadaDepoisDe: new Date(Date.now() - LIMITE_DESFAZER_SERVIDOR_MS).toISOString(),
  });
  if (!apagou) {
    return { error: "Passou o tempo de desfazer. Esse registro ficou valendo." };
  }

  const contagemHoje = await contarRealizacoesNoDia(participante.id, hojeISO());
  return { ok: true, desfeitoId: realizacaoId, contagemHoje, carimbo: Date.now() };
}
