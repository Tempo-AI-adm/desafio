// Período da sala (CONCEITO.md "A sala"): atalhos 1 semana, 2 semanas,
// 1 mês, ou até uma data, e a data de início marcada. Funções puras,
// seguras pra importar no servidor e no navegador. Dias em YYYY-MM-DD,
// fuso de Brasília.

import { diaDaSemana, diasEntre, mesmoDiaDoMesSeguinte, somarDias } from "./tempo";
import { LIMITES } from "./validacao";

export type TipoPeriodo = "1semana" | "2semanas" | "1mes" | "ateData";

export const TIPOS_PERIODO: TipoPeriodo[] = ["1semana", "2semanas", "1mes", "ateData"];

/** Quantos dias o desafio dura, a partir do início. "Até uma data" conta
 * o próprio dia final (inclusive). */
export function duracaoDoPeriodo(tipo: TipoPeriodo, inicio: string, fim?: string): number | null {
  if (tipo === "1semana") return 7;
  if (tipo === "2semanas") return 14;
  if (tipo === "1mes") return diasEntre(inicio, mesmoDiaDoMesSeguinte(inicio));
  if (!fim) return null;
  return diasEntre(inicio, fim) + 1;
}

/** Último dia do desafio (inclusive). */
export function ultimoDia(inicio: string, duracaoDias: number): string {
  return somarDias(inicio, duracaoDias - 1);
}

/** O tipo de período a partir do que o banco guarda (início + duração),
 * sem coluna nova: 7 = 1 semana, 14 = 2 semanas, até o mesmo dia do mês
 * seguinte = 1 mês, qualquer outro = até uma data. Se alguém escolher
 * "até uma data" que caia exatamente num desses, vira o atalho
 * equivalente (mesmo período, sem diferença pra ninguém). */
export function inferirPeriodo(inicio: string, duracaoDias: number): TipoPeriodo {
  if (duracaoDias === 7) return "1semana";
  if (duracaoDias === 14) return "2semanas";
  if (duracaoDias === diasEntre(inicio, mesmoDiaDoMesSeguinte(inicio))) return "1mes";
  return "ateData";
}

/** Sugestões de início (recomeços em marcos de tempo dão mais gás): a
 * próxima segunda (hoje, se hoje for segunda) e o próximo dia 1 (hoje,
 * se hoje for dia 1). */
export function sugestoesDeInicio(hoje: string): { segunda: string; dia1: string } {
  const dow = diaDaSemana(hoje);
  const segunda = somarDias(hoje, (8 - dow) % 7);
  const [a, m, d] = hoje.split("-").map(Number);
  const dia1 =
    d === 1 ? hoje : new Date(Date.UTC(a, m, 1)).toISOString().slice(0, 10);
  return { segunda, dia1 };
}

/** Largada antes da data marcada: com duração fixa (1 semana, 2 semanas,
 * 1 mês) a duração se mantém e o fim vem antes; com "até uma data" o fim
 * continua na data escolhida, então a duração cresce. Devolve a duração
 * que vale a partir de `hojeDaLargada`. */
export function duracaoNaLargadaAntecipada(dados: {
  inicioMarcado: string;
  duracaoDias: number;
  hojeDaLargada: string;
}): number {
  const tipo = inferirPeriodo(dados.inicioMarcado, dados.duracaoDias);
  if (tipo !== "ateData") return dados.duracaoDias;
  const fim = ultimoDia(dados.inicioMarcado, dados.duracaoDias);
  return Math.max(1, diasEntre(dados.hojeDaLargada, fim) + 1);
}

const FORMATO_DIA = /^\d{4}-\d{2}-\d{2}$/;

function diaValido(valor: string): boolean {
  if (!FORMATO_DIA.test(valor)) return false;
  const [a, m, d] = valor.split("-").map(Number);
  const data = new Date(Date.UTC(a, m - 1, d));
  return data.getUTCFullYear() === a && data.getUTCMonth() === m - 1 && data.getUTCDate() === d;
}

export type ErroNovaSala = "nome" | "nomeGrande" | "periodo" | "inicio" | "fim" | "longo";

/** Valida o formulário de criar sala (no servidor). Início entre hoje e
 * um ano pra frente; "até uma data" com fim a partir do início. */
export function validarNovaSala(
  campos: { nome: string; periodo: string; inicio: string; fim: string },
  hoje: string,
): { erro: ErroNovaSala } | { nome: string; duracaoDias: number; inicio: string } {
  const nome = campos.nome.trim();
  if (!nome) return { erro: "nome" };
  if (nome.length > LIMITES.nomeSala) return { erro: "nomeGrande" };
  if (!(TIPOS_PERIODO as string[]).includes(campos.periodo)) return { erro: "periodo" };
  const tipo = campos.periodo as TipoPeriodo;
  if (!diaValido(campos.inicio) || campos.inicio < hoje || diasEntre(hoje, campos.inicio) > 365) {
    return { erro: "inicio" };
  }
  if (tipo === "ateData" && (!diaValido(campos.fim) || campos.fim < campos.inicio)) {
    return { erro: "fim" };
  }
  const duracaoDias = duracaoDoPeriodo(tipo, campos.inicio, campos.fim);
  if (duracaoDias === null) return { erro: "fim" };
  if (duracaoDias > LIMITES.duracaoMaxDias) return { erro: "longo" };
  return { nome, duracaoDias, inicio: campos.inicio };
}
