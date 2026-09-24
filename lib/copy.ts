// Tradução de valores internos (estado, flags do banco) pra copy humana.
// Regra: a tela NUNCA mostra o nome cru de um campo ou o valor cru de um
// enum, sempre passa por aqui. Ver STYLE.md pro tom.

import type { EstadoDesafio } from "./desafios";

export const ESTADO_LABEL: Record<EstadoDesafio, string> = {
  lobby: "Esperando todo mundo entrar",
  ativo: "Desafio rolando",
  encerrado: "Desafio encerrado",
};

/** Versão curta do estado, pros cartões de "Seus desafios" na Home. */
export const ESTADO_CURTO: Record<EstadoDesafio, string> = {
  lobby: "esperando",
  ativo: "rolando",
  encerrado: "encerrado",
};

export function labelBackfill(permiteBackfill: boolean): string {
  return permiteBackfill
    ? "Dá pra completar dias atrasados"
    : "Só vale o dia de hoje";
}

export function labelPronto(pronto: boolean): string {
  return pronto ? "Pronto" : "Esperando";
}

/** Selo de comemoração ao registrar uma realização, em camadas pela
 * contagem do dia (STYLE.md "Strings-base"). Não é streak entre dias,
 * a contagem é só de hoje (ver PRD.md "Contagem do dia"). */
export function labelComemoracaoPorContagemDoDia(contagemHoje: number): string {
  if (contagemHoje <= 1) return "SHOW.";
  if (contagemHoje === 2) return "TÁ ON FIRE.";
  return "AURA MÁXIMA.";
}

/** Nível do foguinho ao lado do nome, pela mesma contagem do dia que
 * decide o selo (2ª realização = em chamas, 3ª ou mais = aura máxima). */
export function nivelFogoPorContagemDoDia(contagemHoje: number): 0 | 1 | 2 {
  if (contagemHoje >= 3) return 2;
  if (contagemHoje === 2) return 1;
  return 0;
}

/** Legenda curta que aparece ao tocar no foguinho. */
export function legendaFogo(contagemHoje: number): string {
  return contagemHoje >= 3 ? "3+ realizações hoje" : "2 realizações hoje";
}

/** Rótulo da lista dos outros participantes no cabeçalho da sala. É
 * diário/aproximado (quem abriu ou registrou hoje), não presença ao vivo. */
export const LABEL_ATIVOS_HOJE = "Ativos hoje";

/** Quando não tem mais ninguém na sala além da própria pessoa. */
export const LABEL_SO_VOCE_HOJE = "Só você por aqui hoje";

/** "visto há X" do cartão, a partir de quantos minutos faz desde a
 * última atividade (STYLE.md: "ativo agora" / "visto há 2h"). */
export function labelVistoHa(minutos: number): string {
  if (minutos < 5) return "ativo agora";
  if (minutos < 60) return `visto há ${minutos}min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `visto há ${horas}h`;
  return `visto há ${Math.floor(horas / 24)}d`;
}


/** Aviso logo depois de marcar um inegociável (janela de desfazer). */
export const LABEL_AVISO_DESFAZER = "Feito. Toque de novo para desfazer.";

/** Selo quando o desfazer deu certo. */
export const LABEL_DESFEITO = "Desfeito.";

/** "7 dias" / "1 dia", no cabeçalho da sala. */
export function labelDuracao(dias: number): string {
  return dias === 1 ? "1 dia" : `${dias} dias`;
}

/** "Dia 3/7" no cabeçalho da sala, depois de largar. */
export function labelDiaDoDesafio(dia: number, duracaoDias: number): string {
  return `Dia ${dia}/${duracaoDias}`;
}

/** Mensagem pronta do botão "Compartilhar sala" (abre o WhatsApp). */
export function mensagemCompartilharSala(nomeSala: string, link: string): string {
  return `Bora pro desafio ${nomeSala}! Entra aqui: ${link}`;
}

/** Linha de novidade no feed quando alguém cria missão com a sala rolando. */
export function labelMissaoCriada(titulo: string): string {
  return `criou a missão: ${titulo}`;
}

/** Insígnia (estrelinha) de quem passou do alvo de uma missão. */
export const LABEL_BONUS = "Bateu e passou do combinado";

/** Tipo de missão no formulário. No banco: "unica" = alvo nulo
 * (cumpri/não cumpri), "repetir" = alvo com número (bolinhas). */
export type TipoMissao = "unica" | "repetir";

export const TIPO_MISSAO_LABEL: Record<TipoMissao, string> = {
  unica: "Única",
  repetir: "Repetir",
};

export const LABEL_QUANTAS_VEZES = "Quantas vezes?";

export const AJUDA_QUANTAS_VEZES =
  "Cada toque conta como 1 vez feita - não é quantidade nem duração. Ex: 'Estudar' repetir 5x conta 5 sessões de estudo, não 5 horas.";
