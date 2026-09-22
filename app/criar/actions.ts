"use server";

import { redirect } from "next/navigation";
import { criarDesafio } from "@/lib/desafios";

export type CriarDesafioState = {
  error?: string;
};

export async function criarDesafioAction(
  _prevState: CriarDesafioState,
  formData: FormData,
): Promise<CriarDesafioState> {
  const nome = String(formData.get("nome") ?? "").trim();
  const duracaoRaw = String(formData.get("duracaoDias") ?? "").trim();
  const permiteBackfill = formData.get("permiteBackfill") === "sim";

  if (!nome) {
    return { error: "Dá um nome pro desafio." };
  }

  const duracaoDias = Number(duracaoRaw);
  if (!Number.isInteger(duracaoDias) || duracaoDias < 1 || duracaoDias > 365) {
    return { error: "Duração precisa ser um número de dias válido (1 a 365)." };
  }

  const desafio = criarDesafio({ nome, duracaoDias, permiteBackfill });

  redirect(`/criar/sucesso/${desafio.codigo}`);
}
