// Nomes das chaves do localStorage usadas pra identidade por
// dispositivo. Centralizado aqui pra não duplicar o prefixo em vários
// componentes client. Roda só no navegador.

export function chaveTokenLocalStorage(codigo: string): string {
  return `desafio-token:${codigo}`;
}

export function chaveCriadorLocalStorage(codigo: string): string {
  return `desafio-criador:${codigo}`;
}

// Lista local dos desafios em que a pessoa entrou (PRD "Identidade",
// "Lista local de desafios"): só os 3 mais recentes, o mais novo no
// topo. Sair da lista não mexe no token nem no banco.
const CHAVE_LISTA = "desafio-lista";
const LIMITE_LISTA = 3;

export type DesafioLocal = {
  codigo: string;
  nome: string;
  // Nulo logo depois de criar o desafio, antes da pessoa escolher a
  // identidade dela nele.
  emoji: string | null;
};

export function lerDesafiosLocais(): DesafioLocal[] {
  try {
    const bruto = JSON.parse(localStorage.getItem(CHAVE_LISTA) ?? "[]");
    return Array.isArray(bruto) ? bruto.slice(0, LIMITE_LISTA) : [];
  } catch {
    return [];
  }
}

function salvarLista(lista: DesafioLocal[]) {
  try {
    localStorage.setItem(CHAVE_LISTA, JSON.stringify(lista.slice(0, LIMITE_LISTA)));
  } catch {
    // localStorage indisponível (modo privado etc.), sem drama.
  }
}

/** Põe (ou move) o desafio no topo da lista. Se vier sem emoji, mantém
 * o que já estava salvo pra esse código. */
export function registrarDesafioLocal(item: DesafioLocal) {
  const atual = lerDesafiosLocais();
  const anterior = atual.find((d) => d.codigo === item.codigo);
  const novo = { ...item, emoji: item.emoji ?? anterior?.emoji ?? null };
  salvarLista([novo, ...atual.filter((d) => d.codigo !== item.codigo)]);
}

export function removerDesafioLocal(codigo: string) {
  salvarLista(lerDesafiosLocais().filter((d) => d.codigo !== codigo));
}
