"use server";

import { redirect } from "next/navigation";
import { buscarDesafioPorCodigo } from "@/lib/desafios";

export type EntrarState = {
  error?: string;
};

// A pessoa pode colar o código puro (ex: "PEGA42") ou o link inteiro
// que o botão "Copiar link" copia (ex: "/d/PEGA42", ou uma URL
// completa tipo "https://site.com/d/PEGA42"), o texto de ajuda da
// tela promete que os dois funcionam, então normalizamos aqui.
function normalizarCodigoDigitado(valor: string): string {
  const bruto = valor.trim();
  // Casa "d/CODIGO" no fim (com ou sem barra antes, com ou sem barra
  // depois) em qualquer lugar da string, pega tanto "/d/PEGA42"
  // quanto uma URL completa "https://site.com/d/PEGA42".
  const match = bruto.match(/(?:^|\/)d\/([^/?#\s]+)\/?$/i);
  if (match) return match[1];
  return bruto.replace(/^\/+|\/+$/g, "").trim();
}

export async function entrarAction(
  _prevState: EntrarState,
  formData: FormData,
): Promise<EntrarState> {
  const codigo = normalizarCodigoDigitado(String(formData.get("codigo") ?? ""));

  if (!codigo) {
    return { error: "Digita o código da sala." };
  }

  const desafio = await buscarDesafioPorCodigo(codigo);
  if (!desafio) {
    return { error: "Não achamos essa sala. Confere o código." };
  }

  redirect(`/d/${desafio.codigo}`);
}
