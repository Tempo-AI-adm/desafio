// Resultado final de uma sala encerrada, calculado a partir dos dados
// que a tela já recebe (/api/lobby). Função pura, sem banco: segura
// pra importar no navegador. Segue o PRD "Resultado final - princípio
// de apresentação": ordem de entrada, selo binário, números só detalhe.

import type { DadosSala, InegociavelResumo } from "./tipos-sala";

export type PessoaResultado = {
  id: string;
  emoji: string;
  nome: string;
  /** cumpriu todas as missões que se propôs (e tinha pelo menos uma) */
  fechouTudo: boolean;
  missoes: number;
  /** quantas missões a pessoa tinha (só aparece na linha dela) */
  definidas: number;
  bonus: number;
  reacoes: number;
  /** quantos DIAS diferentes a pessoa teve 2+ realizações (um dia com 4
   * ainda é 1 dia) */
  diasEmChamas: number;
};

/** Missão cumprida: sem alvo = marcou pelo menos 1 vez; com alvo =
 * chegou no alvo. Missões criadas no meio do desafio contam igual. */
export function missaoCumprida(i: InegociavelResumo): boolean {
  return i.progresso >= (i.alvo ?? 1);
}

/** Estatística do GRUPO todo (nunca por pessoa): quantas realizações
 * todo mundo somou e quantas reações foram trocadas. */
export function resumoDoGrupo(dados: DadosSala): { realizacoes: number; reacoes: number } {
  const realizacoes = dados.feed.filter((f) => f.tipoItem === "realizacao");
  return {
    realizacoes: realizacoes.length,
    reacoes: realizacoes.reduce((soma, f) => soma + f.reacoes, 0),
  };
}

/** Dias (fuso de Brasília, coluna `dia`) em que a pessoa teve 2 ou mais
 * realizações: os dias em que o foguinho acendeu. Conta dias, não toques. */
function diasEmChamasDe(dados: DadosSala, participanteId: string): number {
  const porDia = new Map<string, number>();
  for (const f of dados.feed) {
    if (f.tipoItem !== "realizacao" || f.autorId !== participanteId) continue;
    porDia.set(f.dia, (porDia.get(f.dia) ?? 0) + 1);
  }
  return [...porDia.values()].filter((n) => n >= 2).length;
}

export function resultadoDaSala(dados: DadosSala): PessoaResultado[] {
  // dados.participantes já vem na ordem de entrada (criado_em).
  return dados.participantes.map((p) => {
    const cumpridas = p.inegociaveis.filter(missaoCumprida).length;
    return {
      id: p.id,
      emoji: p.emoji,
      nome: p.nome,
      fechouTudo: p.inegociaveis.length > 0 && cumpridas === p.inegociaveis.length,
      missoes: cumpridas,
      definidas: p.inegociaveis.length,
      bonus: p.extras,
      reacoes: dados.feed
        .filter((f) => f.autorId === p.id)
        .reduce((soma, f) => soma + f.reacoes, 0),
      diasEmChamas: diasEmChamasDe(dados, p.id),
    };
  });
}
