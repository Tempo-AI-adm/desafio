// Semanas, metas e progresso no modelo v2 (CONCEITO.md "Os números"):
// cada pessoa se propõe a N coisas boas por semana. Funções puras (sem
// banco, sem tela), seguras pra importar no servidor e no navegador.
// Todos os dias são YYYY-MM-DD no fuso de Brasília.

import { diasEntre, somarDias } from "./tempo";

export type Semana = {
  /** 0 = primeira semana do desafio */
  indice: number;
  /** primeiro e último dia da semana (inclusive) */
  inicio: string;
  fim: string;
  /** quantos dias dessa semana contam (7, ou menos na última parcial) */
  dias: number;
};

/** Semanas do desafio: blocos de 7 dias a partir do início; a última
 * pode ser parcial. */
export function semanasDoDesafio(inicio: string, duracaoDias: number): Semana[] {
  const semanas: Semana[] = [];
  for (let i = 0; i * 7 < duracaoDias; i++) {
    const dias = Math.min(7, duracaoDias - i * 7);
    const s = somarDias(inicio, i * 7);
    semanas.push({ indice: i, inicio: s, fim: somarDias(s, dias - 1), dias });
  }
  return semanas;
}

/** Meta de uma semana com `dias` dias que contam: a cheia se forem 7;
 * senão proporcional, arredondando pra cima, mínimo 1 (meta 5, 3 dias = 3). */
export function metaProporcional(metaSemanal: number, dias: number): number {
  if (dias >= 7) return metaSemanal;
  return Math.max(1, Math.ceil((metaSemanal * dias) / 7));
}

export type SemanaDaPessoa = Semana & {
  /** a meta dessa semana pra essa pessoa (proporcional se parcial) */
  meta: number;
  /** quantas realizações ela teve nessa semana */
  feitos: number;
};

/** As semanas que contam pra uma pessoa: as anteriores à entrada dela
 * não contam; na semana em que entrou, contam só os dias a partir da
 * entrada (meta proporcional, mesma regra da última semana parcial).
 * Quem entrou antes da largada conta desde a primeira semana. */
export function semanasDaPessoa(dados: {
  inicio: string;
  duracaoDias: number;
  /** dia em que a pessoa entrou na sala */
  entrada: string;
  metaSemanal: number;
  /** dia de cada realização dela */
  diasDasRealizacoes: string[];
}): SemanaDaPessoa[] {
  return semanasDoDesafio(dados.inicio, dados.duracaoDias)
    .filter((s) => s.fim >= dados.entrada)
    .map((s) => {
      const primeiroDia = dados.entrada > s.inicio ? dados.entrada : s.inicio;
      const dias = diasEntre(primeiroDia, s.fim) + 1;
      const feitos = dados.diasDasRealizacoes.filter((d) => d >= primeiroDia && d <= s.fim).length;
      return { ...s, inicio: primeiroDia, dias, meta: metaProporcional(dados.metaSemanal, dias), feitos };
    });
}

/** Progresso da pessoa no desafio, de 0 a 1 (só pro cálculo do grupo;
 * ninguém vê): soma, semana a semana, de min(feitos, meta), dividida
 * pela soma das metas de TODAS as semanas que contam pra ela (inclusive
 * as que ainda não chegaram). Por isso só sobe: começa em 0 e cresce a
 * cada realização. Bônus (passar da meta) não conta a mais. */
export function progressoDaPessoa(semanas: SemanaDaPessoa[]): number {
  const total = semanas.reduce((soma, s) => soma + s.meta, 0);
  if (total === 0) return 0;
  const feito = semanas.reduce((soma, s) => soma + Math.min(s.feitos, s.meta), 0);
  return feito / total;
}

/** Número do grupo, de 0 a 1: média do progresso das pessoas, cada uma
 * pesando igual (meta maior não pesa mais). Só entra quem já se propôs.
 * Nunca é calculado nem mostrado por pessoa. Ninguém com compromisso:
 * null (não há o que mostrar). */
export function progressoDoGrupo(progressosDasPessoas: number[]): number | null {
  if (progressosDasPessoas.length === 0) return null;
  return progressosDasPessoas.reduce((a, b) => a + b, 0) / progressosDasPessoas.length;
}

/** Bônus da pessoa: soma, semana a semana, do que passou da meta.
 * Celebrado (estrela), mas fora de qualquer número. */
export function bonusDaPessoa(semanas: SemanaDaPessoa[]): number {
  return semanas.reduce((soma, s) => soma + Math.max(0, s.feitos - s.meta), 0);
}

/** "Fechou tudo que se propôs": bateu a meta em todas as semanas que
 * contam pra ela (só faz sentido com o desafio encerrado). */
export function fechouTudo(semanas: SemanaDaPessoa[]): boolean {
  return semanas.length > 0 && semanas.every((s) => s.feitos >= s.meta);
}

/** A semana que contém `hoje` ("3 de 5 essa semana"), ou null se hoje
 * está fora das semanas da pessoa (antes de começar ou depois do fim). */
export function semanaDeHoje(semanas: SemanaDaPessoa[], hoje: string): SemanaDaPessoa | null {
  return semanas.find((s) => hoje >= s.inicio && hoje <= s.fim) ?? null;
}
