"use server";

import { redirect } from "next/navigation";
import { buscarDesafioPorCodigo } from "@/lib/desafios";

export type EntrarState = {
  error?: string;
};

export async function entrarAction(
  _prevState: EntrarState,
  formData: FormData,
): Promise<EntrarState> {
  const codigo = String(formData.get("codigo") ?? "").trim();

  if (!codigo) {
    return { error: "Digita o código do desafio." };
  }

  const desafio = buscarDesafioPorCodigo(codigo);
  if (!desafio) {
    return { error: "Não achamos esse desafio. Confere o código." };
  }

  redirect(`/d/${desafio.codigo}`);
}
