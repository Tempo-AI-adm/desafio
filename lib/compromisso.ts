// O compromisso de cada pessoa na sala (CONCEITO.md "O compromisso"):
// meta de coisas boas por semana (obrigatória) + foco (opcional). Um por
// pessoa por sala. Validação pura, usada pelo servidor (o formulário pode
// ser burlado). Segura pra importar no servidor e no navegador.

import { EMOJIS_IDENTIDADE } from "./identidade-constants";
import { LIMITES, inteiroEntre } from "./validacao";

/** Atalhos da meta semanal na tela (ou "outro número"). */
export const ATALHOS_META = [3, 5, 7] as const;

export type ErroCompromisso = "meta" | "focoGrande";
export type ErroEntrada = ErroCompromisso | "nome" | "nomeGrande" | "emoji";

/** Meta (1 a 30) e foco (opcional, até 60 letras; vazio = sem foco). */
export function validarCompromisso(campos: {
  meta: string;
  foco: string;
}): { erro: ErroCompromisso } | { meta: number; foco: string | null } {
  const meta = inteiroEntre(campos.meta, LIMITES.metaMin, LIMITES.metaMax);
  if (meta === null) return { erro: "meta" };
  const foco = campos.foco.trim().replace(/\s+/g, " ");
  if (foco.length > LIMITES.foco) return { erro: "focoGrande" };
  return { meta, foco: foco || null };
}

/** Entrada na sala: nome + emoji + compromisso, num passo só. */
export function validarEntrada(campos: {
  nome: string;
  emoji: string;
  meta: string;
  foco: string;
}): { erro: ErroEntrada } | { nome: string; emoji: string; meta: number; foco: string | null } {
  const nome = campos.nome.trim().replace(/\s+/g, " ");
  if (!nome) return { erro: "nome" };
  if (nome.length > LIMITES.nomePessoa) return { erro: "nomeGrande" };
  if (!(EMOJIS_IDENTIDADE as readonly string[]).includes(campos.emoji)) return { erro: "emoji" };
  const compromisso = validarCompromisso(campos);
  if ("erro" in compromisso) return compromisso;
  return { nome, emoji: campos.emoji, ...compromisso };
}
