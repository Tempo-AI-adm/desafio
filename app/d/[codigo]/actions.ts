"use server";

import { cookies } from "next/headers";
import { validarCompromisso, validarEntrada } from "@/lib/compromisso";
import {
  ERRO_COMPROMISSO,
  ERRO_COMPROMISSO_CONGELADO,
  ERRO_ENTRAR_SALA_ENCERRADA,
  ERRO_FRASE_GRANDE,
  ERRO_SEM_COMPROMISSO,
} from "@/lib/copy";
import { confereProvaDeCriador, nomeCookieCriador } from "@/lib/criador";
import { buscarDesafioPorCodigo, definirCriadorSeVazio, largarDesafio } from "@/lib/desafios";
import {
  atualizarCompromisso,
  buscarParticipantePorToken,
  criarParticipante,
  listarParticipantesPorDesafio,
  tocarUltimaAtividade,
} from "@/lib/participantes";
import { criarReacao } from "@/lib/reacoes";
import {
  apagarRegistroRecente,
  buscarRealizacaoPorId,
  contarRealizacoesNoDia,
  criarRegistro,
  diasDasRealizacoesDe,
  hojeISO,
} from "@/lib/realizacoes";
import { semanaDeHoje, semanasDaPessoa } from "@/lib/semanas";
import { LIMITE_DESFAZER_SERVIDOR_MS } from "@/lib/tempo";
import { LIMITES } from "@/lib/validacao";

// Só o que o navegador usa: o emoji (lista local da Home) e o token
// (a identidade do dispositivo, só pra própria pessoa).
export type ReivindicarIdentidadeState = {
  error?: string;
  participante?: {
    emoji: string;
    token: string;
  };
};

export async function reivindicarIdentidadeAction(
  _prevState: ReivindicarIdentidadeState,
  formData: FormData,
): Promise<ReivindicarIdentidadeState> {
  const codigo = String(formData.get("codigo") ?? "");

  const desafio = await buscarDesafioPorCodigo(codigo);
  if (!desafio) {
    return { error: "Essa sala não existe mais." };
  }

  // Sala encerrada: ninguém novo vira participante (quem não participa
  // vê o resultado só em leitura).
  if (desafio.estado === "encerrado") {
    return { error: ERRO_ENTRAR_SALA_ENCERRADA };
  }

  // Entrar = se propor, num passo só: nome, emoji e o compromisso.
  const entrada = validarEntrada({
    nome: String(formData.get("nome") ?? ""),
    emoji: String(formData.get("emoji") ?? ""),
    meta: String(formData.get("meta") ?? ""),
    foco: String(formData.get("foco") ?? ""),
  });
  if ("erro" in entrada) {
    return { error: ERRO_COMPROMISSO[entrada.erro] };
  }

  const participante = await criarParticipante({
    desafioId: desafio.id,
    nome: entrada.nome,
    emoji: entrada.emoji,
    metaSemanal: entrada.meta,
    foco: entrada.foco,
  });

  // Criador: só quem tem a prova que o servidor deu ao criar a sala
  // (cookie httpOnly), nunca um valor mandado pelo formulário.
  const prova = (await cookies()).get(nomeCookieCriador(desafio.codigo))?.value;
  if (confereProvaDeCriador(desafio.id, prova)) {
    await definirCriadorSeVazio(desafio.id, participante.id);
  }

  return {
    participante: {
      emoji: participante.emoji,
      token: participante.token,
    },
  };
}

export type AjustarCompromissoState = {
  error?: string;
  ok?: boolean;
  carimbo?: number;
};

// Ajustar meta e foco: só no lobby. Na largada o compromisso congela.
export async function ajustarCompromissoAction(
  _prevState: AjustarCompromissoState,
  formData: FormData,
): Promise<AjustarCompromissoState> {
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
    return { error: ERRO_COMPROMISSO_CONGELADO };
  }

  const compromisso = validarCompromisso({
    meta: String(formData.get("meta") ?? ""),
    foco: String(formData.get("foco") ?? ""),
  });
  if ("erro" in compromisso) {
    return { error: ERRO_COMPROMISSO[compromisso.erro] };
  }

  await atualizarCompromisso(participante.id, { metaSemanal: compromisso.meta, foco: compromisso.foco });
  await tocarUltimaAtividade(participante.id);

  return { ok: true, carimbo: Date.now() };
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

  await largarDesafio(desafio);

  return { ok: true };
}

export type RegistrarState = {
  error?: string;
  ok?: boolean;
  carimbo?: number;
  /** o registro que acabou de ser criado, pra janela de desfazer */
  realizacaoId?: string;
  /** pra escolher a comemoração (SHOW. / FECHOU A SEMANA. / ESTOUROU.) */
  contagemHoje?: number;
  semana?: { feitos: number; meta: number };
};

// Registrar é um toque (CONCEITO.md): frase opcional (até 200 letras) e
// "no meu foco" opcional (só vale pra quem tem foco). Sempre no dia de
// hoje. Todo registro conta.
export async function registrarAction(
  _prevState: RegistrarState,
  formData: FormData,
): Promise<RegistrarState> {
  const codigo = String(formData.get("codigo") ?? "");
  const token = String(formData.get("token") ?? "");
  const texto = String(formData.get("texto") ?? "").trim().replace(/\s+/g, " ");

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

  if (!participante.metaSemanal) {
    return { error: ERRO_SEM_COMPROMISSO };
  }

  if (texto.length > LIMITES.frase) {
    return { error: ERRO_FRASE_GRANDE };
  }

  // "No meu foco" só pra quem definiu foco (o formulário nem mostra pros outros).
  const noFoco = formData.get("noFoco") === "1" && Boolean(participante.foco);

  const dia = hojeISO();
  const registro = await criarRegistro({ participanteId: participante.id, texto, noFoco, dia });
  await tocarUltimaAtividade(participante.id);

  const contagemHoje = await contarRealizacoesNoDia(participante.id, dia);

  // A semana de hoje dela, pra comemorar quando fecha ou estoura a meta.
  let semana: RegistrarState["semana"];
  if (desafio.dataInicio) {
    const semanas = semanasDaPessoa({
      inicio: hojeISO(new Date(desafio.dataInicio)),
      duracaoDias: desafio.duracaoDias,
      entrada: hojeISO(new Date(participante.criadoEm)),
      metaSemanal: participante.metaSemanal,
      diasDasRealizacoes: await diasDasRealizacoesDe(participante.id),
    });
    const s = semanaDeHoje(semanas, dia);
    if (s) semana = { feitos: s.feitos, meta: s.meta };
  }

  return { ok: true, carimbo: Date.now(), realizacaoId: registro.id, contagemHoje, semana };
}

export type ReagirState = {
  error?: string;
  ok?: boolean;
  carimbo?: number;
};

// Reação de um toque no feed: sempre os olhinhos, sem escolher emoji.
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
  carimbo?: number;
};

// Desfazer o registro que acabou de ser feito (o aviso "Feito. Toque
// aqui pra desfazer.", ~5s). O servidor só apaga se for da própria
// pessoa e ainda estiver dentro do limite (10s); passou disso, não
// desfaz nada.
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

  const apagou = await apagarRegistroRecente({
    realizacaoId,
    participanteId: participante.id,
    criadaDepoisDe: new Date(Date.now() - LIMITE_DESFAZER_SERVIDOR_MS).toISOString(),
  });
  if (!apagou) {
    return { error: "Passou o tempo de desfazer. Esse registro ficou valendo." };
  }

  return { ok: true, desfeitoId: realizacaoId, carimbo: Date.now() };
}
