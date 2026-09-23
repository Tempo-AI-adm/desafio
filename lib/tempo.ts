// Datas e horas do app, sempre no fuso de Brasília. Funções puras
// (sem servidor), seguras pra importar em Server e Client Components.

/** Fuso que define quando o "dia" vira no app (contagem do dia, selo,
 * foguinho, "ativo hoje", coluna `dia`). O servidor do Vercel roda em
 * UTC, então não dá pra confiar no relógio local dele. */
export const FUSO_DO_APP = "America/Sao_Paulo";

/** "Hoje" no formato da coluna `dia` (date, sem hora, YYYY-MM-DD),
 * no fuso de Brasília. O locale en-CA já formata como YYYY-MM-DD. */
export function hojeISO(agora: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSO_DO_APP,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(agora);
}

/** "14:32" no fuso de Brasília, a partir de um timestamp do banco. */
export function horaCurta(timestampISO: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: FUSO_DO_APP,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestampISO));
}

/** "22/09" a partir da coluna `dia` (YYYY-MM-DD), sem mexer com fuso. */
export function diaCurto(diaISO: string): string {
  const [, mes, dia] = diaISO.split("-");
  return `${dia}/${mes}`;
}
