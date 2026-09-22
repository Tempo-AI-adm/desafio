// MOCK EM MEMÓRIA — mesmo padrão de lib/desafios.ts e
// lib/participantes.ts (globalThis, sobrevive às recompilações do
// Turbopack em dev). Só é importado por Server Actions e Route
// Handlers, nunca vai pro bundle do navegador.

export type Inegociavel = {
  id: string;
  participanteId: string;
  titulo: string;
  assunto: string;
  alvo: number | null;
  criadoEm: string;
};

declare global {
  var __inegociaveisStore: Inegociavel[] | undefined;
}

const inegociaveis: Inegociavel[] =
  globalThis.__inegociaveisStore ?? (globalThis.__inegociaveisStore = []);

export function criarInegociavel(dados: {
  participanteId: string;
  titulo: string;
  assunto: string;
  alvo: number | null;
}): Inegociavel {
  const inegociavel: Inegociavel = {
    id: crypto.randomUUID(),
    participanteId: dados.participanteId,
    titulo: dados.titulo,
    assunto: dados.assunto,
    alvo: dados.alvo,
    criadoEm: new Date().toISOString(),
  };
  inegociaveis.push(inegociavel);
  return inegociavel;
}

export function listarInegociaveisPorParticipante(participanteId: string): Inegociavel[] {
  return inegociaveis
    .filter((i) => i.participanteId === participanteId)
    .sort((a, b) => a.criadoEm.localeCompare(b.criadoEm));
}

export function contarInegociaveisPorParticipante(participanteId: string): number {
  return inegociaveis.filter((i) => i.participanteId === participanteId).length;
}
