// Tradução de valores internos (estado, flags do banco) pra copy humana.
// Regra: a tela NUNCA mostra o nome cru de um campo ou o valor cru de um
// enum — sempre passa por aqui. Ver STYLE.md pro tom.

import type { EstadoDesafio } from "./desafios";

export const ESTADO_LABEL: Record<EstadoDesafio, string> = {
  lobby: "Esperando todo mundo entrar",
  ativo: "Desafio rolando",
  encerrado: "Desafio encerrado",
};

export function labelBackfill(permiteBackfill: boolean): string {
  return permiteBackfill
    ? "Dá pra completar dias atrasados"
    : "Só vale o dia de hoje";
}
