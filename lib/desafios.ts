// MOCK EM MEMÓRIA — sem persistência real.
// Os dados somem quando o servidor reinicia. Isso é esperado nesta fatia:
// aqui só existe pra dar vida às telas antes de trocar por Supabase.
// Só é importado por Server Actions e Server Components, então nunca
// vai pro bundle do navegador.

export type EstadoDesafio = "lobby" | "ativo" | "encerrado";

export type Desafio = {
  id: string;
  codigo: string;
  nome: string;
  duracaoDias: number;
  permiteBackfill: boolean;
  estado: EstadoDesafio;
  criadorParticipanteId: string | null;
  criadoEm: string;
};

declare global {
  var __desafiosStore: Desafio[] | undefined;
}

// Guardado em globalThis, e não numa `const` de módulo comum: em dev,
// o Turbopack reavalia os módulos do lado do servidor do zero sempre
// que algum arquivo do grafo muda (Server Actions/Route Handlers não
// têm a preservação de estado que o Fast Refresh dá a componentes
// React). Uma `const` normal perderia todos os desafios a cada
// recompilação. `globalThis` é o objeto global do processo Node, fora
// do grafo de módulos do bundler, então sobrevive a isso.
const desafios: Desafio[] = globalThis.__desafiosStore ?? (globalThis.__desafiosStore = []);

// Sem caracteres ambíguos (0/O, 1/I/L) pra ficar fácil de digitar o código.
const ALFABETO_CODIGO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function gerarCodigo(): string {
  let codigo: string;
  do {
    codigo = Array.from(
      { length: 6 },
      () => ALFABETO_CODIGO[Math.floor(Math.random() * ALFABETO_CODIGO.length)],
    ).join("");
  } while (desafios.some((d) => d.codigo === codigo));
  return codigo;
}

export function criarDesafio(dados: {
  nome: string;
  duracaoDias: number;
  permiteBackfill: boolean;
}): Desafio {
  const desafio: Desafio = {
    id: crypto.randomUUID(),
    codigo: gerarCodigo(),
    nome: dados.nome,
    duracaoDias: dados.duracaoDias,
    permiteBackfill: dados.permiteBackfill,
    estado: "lobby",
    criadorParticipanteId: null,
    criadoEm: new Date().toISOString(),
  };
  desafios.push(desafio);
  return desafio;
}

export function buscarDesafioPorCodigo(codigo: string): Desafio | undefined {
  const alvo = codigo.trim().toUpperCase();
  return desafios.find((d) => d.codigo === alvo);
}

export function buscarDesafioPorId(id: string): Desafio | undefined {
  return desafios.find((d) => d.id === id);
}

/** Marca o criador só se ainda não tiver um — o primeiro a reivindicar
 * com a "flag de criador" (ver components/MarcarCriadorDoDesafio) vence. */
export function definirCriadorSeVazio(desafioId: string, participanteId: string): void {
  const desafio = desafios.find((d) => d.id === desafioId);
  if (desafio && desafio.criadorParticipanteId === null) {
    desafio.criadorParticipanteId = participanteId;
  }
}
