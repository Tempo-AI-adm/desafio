// MOCK EM MEMÓRIA — mesma lógica de lib/desafios.ts: some quando o
// servidor reinicia, sera trocado pelo Supabase numa fatia futura.
// Só é importado por Server Actions, Route Handlers e Server
// Components, então nunca vai pro bundle do navegador.

export type Participante = {
  id: string;
  desafioId: string;
  nome: string;
  emoji: string;
  token: string;
  pronto: boolean;
  ultimaAtividade: string;
  criadoEm: string;
};

const participantes: Participante[] = [];

export function criarParticipante(dados: {
  desafioId: string;
  nome: string;
  emoji: string;
}): Participante {
  const participante: Participante = {
    id: crypto.randomUUID(),
    desafioId: dados.desafioId,
    nome: dados.nome,
    emoji: dados.emoji,
    token: crypto.randomUUID(),
    pronto: false,
    ultimaAtividade: new Date().toISOString(),
    criadoEm: new Date().toISOString(),
  };
  participantes.push(participante);
  return participante;
}

export function buscarParticipantePorToken(
  desafioId: string,
  token: string,
): Participante | undefined {
  return participantes.find((p) => p.desafioId === desafioId && p.token === token);
}

export function listarParticipantesPorDesafio(desafioId: string): Participante[] {
  return participantes
    .filter((p) => p.desafioId === desafioId)
    .sort((a, b) => a.criadoEm.localeCompare(b.criadoEm));
}

export function marcarPronto(participanteId: string, pronto: boolean): void {
  const participante = participantes.find((p) => p.id === participanteId);
  if (participante) participante.pronto = pronto;
}
