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
  criadoEm: string;
};

const desafios: Desafio[] = [];

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
    criadoEm: new Date().toISOString(),
  };
  desafios.push(desafio);
  return desafio;
}

export function buscarDesafioPorCodigo(codigo: string): Desafio | undefined {
  const alvo = codigo.trim().toUpperCase();
  return desafios.find((d) => d.codigo === alvo);
}
