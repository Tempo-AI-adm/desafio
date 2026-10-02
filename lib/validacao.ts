// Limites e formatos de toda entrada que chega do navegador. O servidor
// valida sempre (o formulário pode ser burlado). Funções puras, seguras
// pra importar no servidor e no navegador (o formulário pode usar os
// mesmos limites pra ajudar, mas quem decide é o servidor).

/** Limites do CONCEITO.md / PRD.md. */
export const LIMITES = {
  nomeSala: 40,
  nomePessoa: 30,
  frase: 200,
  foco: 60,
  metaMin: 1,
  metaMax: 30,
  duracaoMaxDias: 366,
} as const;

// Mesmo alfabeto de lib/desafios.ts (ALFABETO_CODIGO: sem 0, O, 1, I), 6 letras.
const FORMATO_CODIGO = /^[A-HJ-NP-Z2-9]{6}$/;
const FORMATO_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Código de sala no formato certo (já em maiúsculas), ou null. */
export function codigoValido(valor: string): string | null {
  const codigo = valor.trim().toUpperCase();
  return FORMATO_CODIGO.test(codigo) ? codigo : null;
}

/** Ids e tokens do banco são UUID: qualquer outra coisa nem chega no banco. */
export function ehUuid(valor: string): boolean {
  return FORMATO_UUID.test(valor);
}

/** Inteiro dentro de [min, max], ou null. */
export function inteiroEntre(valor: string, min: number, max: number): number | null {
  if (!/^\d+$/.test(valor.trim())) return null;
  const n = Number(valor);
  return Number.isInteger(n) && n >= min && n <= max ? n : null;
}
