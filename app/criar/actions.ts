"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { nomeCookieCriador, provaDeCriador } from "@/lib/criador";
import { criarDesafio } from "@/lib/desafios";
import { LIMITES, inteiroEntre } from "@/lib/validacao";

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
    return { error: "Dá um nome pra sala." };
  }
  if (nome.length > LIMITES.nomeSala) {
    return { error: `Nome muito grande, até ${LIMITES.nomeSala} letras.` };
  }

  const duracaoDias = inteiroEntre(duracaoRaw, 1, LIMITES.duracaoMaxDias);
  if (duracaoDias === null) {
    return { error: `Duração precisa ser um número de dias válido (1 a ${LIMITES.duracaoMaxDias}).` };
  }

  const desafio = await criarDesafio({ nome, duracaoDias, permiteBackfill });

  // Prova de criador pra este navegador (ver lib/criador.ts): quando
  // quem criou entrar na sala, o servidor reconhece e dá o LARGAR.
  (await cookies()).set(nomeCookieCriador(desafio.codigo), provaDeCriador(desafio.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });

  redirect(`/criar/sucesso/${desafio.codigo}`);
}
