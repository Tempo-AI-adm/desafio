// Progresso no modelo "tudo é missão": cada missão vale o mesmo peso e
// tem um progresso de 0 a 1. Funções puras (sem banco, sem tela),
// seguras pra importar no servidor e no navegador.

/** O mínimo de uma missão pra calcular o progresso: `alvo` nulo = missão
 * única (cumpri / não cumpri); com número = quantas vezes ela se repete.
 * `feitos` = quantas marcações ela já tem. */
export type MissaoParaProgresso = {
  alvo: number | null;
  feitos: number;
};

/** Progresso de uma missão, de 0 a 1, proporcional:
 * - única: 0 até a 1ª marcação, 1 depois;
 * - com alvo: feitos ÷ alvo (3x com 1 feito = 1/3).
 * Nunca passa de 1: marcar além do alvo é bônus (a estrela), comemorado
 * à parte, mas não faz a missão valer mais que as outras. */
export function progressoDaMissao(missao: MissaoParaProgresso): number {
  const feitos = Math.max(0, missao.feitos);
  if (missao.alvo === null || missao.alvo <= 0) return feitos > 0 ? 1 : 0;
  return Math.min(feitos / missao.alvo, 1);
}

/** Registro antigo de "vitória extra" (tipo `extra` no banco, do tempo
 * antes do "+ Nova missão"): na leitura, conta como uma missão única já
 * cumprida. O banco não muda. */
export const MISSAO_LEGADA_EXTRA: MissaoParaProgresso = { alvo: null, feitos: 1 };

/** O número do grupo, de 0 a 1: soma do progresso de TODAS as missões
 * de TODAS as pessoas ÷ total de missões da sala. Os extras antigos
 * entram como missões únicas cumpridas. Pode subir e descer (missão
 * nova ainda não feita entra no total). Nunca é calculado nem mostrado
 * por pessoa. Sala sem nenhuma missão: `null` (não há o que mostrar). */
export function progressoDoGrupo(
  missoes: MissaoParaProgresso[],
  extrasLegados = 0,
): number | null {
  const todas = [...missoes, ...Array.from({ length: extrasLegados }, () => MISSAO_LEGADA_EXTRA)];
  if (todas.length === 0) return null;
  const soma = todas.reduce((total, m) => total + progressoDaMissao(m), 0);
  return soma / todas.length;
}
