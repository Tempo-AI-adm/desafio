"use server";

import { cookies } from "next/headers";
import { confereProvaDeCriador, nomeCookieCriador } from "@/lib/criador";
import { validarCompromisso, validarEntrada } from "@/lib/compromisso";

import { buscarDesafioPorCodigo, definirCriadorSeVazio, largarDesafio } from "@/lib/desafios";
import {
  buscarParticipantePorToken,
  atualizarCompromisso,
  criarParticipante,
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
  criarMarcacoesDaMissao,
  criarRealizacao,
  hojeISO,
} from "@/lib/realizacoes";
import { criarReacao } from "@/lib/reacoes";
import { LIMITE_DESFAZER_SERVIDOR_MS } from "@/lib/tempo";
import { ASSUNTOS } from "@/lib/assuntos-constants";
import {
  ERRO_JA_FEITOS,
  ERRO_MISSAO_DE_OUTRA_PESSOA,
  ERRO_MISSAO_SEM_TITULO,
  ERRO_COMPROMISSO,
  ERRO_COMPROMISSO_CONGELADO,
  ERRO_ENTRAR_SALA_ENCERRADA,
} from "@/lib/copy";

const VALORES_ASSUNTO: readonly string[] = ASSUNTOS.map((a) => a.valor);

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

export type AdicionarInegociavelState = {
  error?: string;
  ok?: boolean;
  carimbo?: number;
  /** só quando a missão nova já nasceu feita: contagem do dia, pro selo */
  contagemHoje?: number;
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
  // "Já fiz isso X vezes" / "Já cumpri": só na missão nova, com a sala
  // rolando e depois da primeira missão da pessoa (ver abaixo).
  const jaFeitosRaw = String(formData.get("jaFeitos") ?? "").trim();

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
    return { error: ERRO_MISSAO_SEM_TITULO };
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

  // A primeira missão de cada pessoa é o compromisso dela pra frente:
  // nunca nasce feita (no lobby, nem pra quem entra depois da largada).
  // Missões seguintes, com a sala rolando, podem nascer já marcadas:
  // é a pessoa reconhecendo algo que já fez e deixou ela orgulhosa.
  let jaFeitos = 0;
  if (jaFeitosRaw && desafio.estado === "ativo") {
    const jaTemMissao = (await contarInegociaveisPorParticipante(participante.id)) > 0;
    if (jaTemMissao) {
      const numero = Number(jaFeitosRaw);
      const maximo = alvo ?? 1;
      if (!Number.isInteger(numero) || numero < 0 || numero > maximo) {
        return { error: ERRO_JA_FEITOS };
      }
      jaFeitos = numero;
    }
  }

  const missao = await criarInegociavel({ participanteId: participante.id, titulo, assunto, alvo });
  await tocarUltimaAtividade(participante.id);

  if (jaFeitos === 0) return { ok: true, carimbo: Date.now() };

  const dia = hojeISO();
  await criarMarcacoesDaMissao({
    participanteId: participante.id,
    inegociavelId: missao.id,
    assunto,
    texto: titulo,
    dia,
    quantidade: jaFeitos,
  });
  const contagemHoje = await contarRealizacoesNoDia(participante.id, dia);
  return { ok: true, carimbo: Date.now(), contagemHoje };
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
    return { error: ERRO_MISSAO_DE_OUTRA_PESSOA };
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
