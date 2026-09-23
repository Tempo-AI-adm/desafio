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

/** Janela de "toque de novo pra desfazer" depois de marcar um
 * inegociável (Parte B do PRD "Check / registrar"). */
export const JANELA_DESFAZER_MS = 5000;

/** O servidor aceita o desfazer com folga (rede lenta, toque aos 4,9s).
 * Passou disso, nunca desfaz: vira um registro novo. */
export const LIMITE_DESFAZER_SERVIDOR_MS = 10000;

/** Marcação de inegociável mais nova que isso não aparece pros OUTROS
 * participantes (feed/faixa), pra quem desfez a tempo nunca ter o
 * registro visto por ninguém. */
export const ESCONDER_DOS_OUTROS_MS = JANELA_DESFAZER_MS + 2000;

/** Em que dia do desafio estamos (1 = o dia em que largou), contando
 * dias de calendário no fuso de Brasília. Limitado a 1..duração. */
export function diaDoDesafio(dataInicioISO: string, duracaoDias: number, agora: Date = new Date()): number {
  const paraUTC = (dia: string) => {
    const [a, m, d] = dia.split("-").map(Number);
    return Date.UTC(a, m - 1, d);
  };
  const inicio = paraUTC(hojeISO(new Date(dataInicioISO)));
  const hoje = paraUTC(hojeISO(agora));
  const dia = Math.floor((hoje - inicio) / 86_400_000) + 1;
  return Math.min(Math.max(dia, 1), duracaoDias);
}
