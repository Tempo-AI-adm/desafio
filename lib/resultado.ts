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
    };
  });
}
