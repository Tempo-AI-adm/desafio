// Nomes das chaves do localStorage usadas pra identidade por
// dispositivo. Centralizado aqui pra não duplicar o prefixo em vários
// componentes client. Roda só no navegador.

export function chaveTokenLocalStorage(codigo: string): string {
  return `desafio-token:${codigo}`;
}

export function chaveCriadorLocalStorage(codigo: string): string {
  return `desafio-criador:${codigo}`;
}
