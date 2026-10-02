"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ERRO_NOVA_SALA } from "@/lib/copy";
import { nomeCookieCriador, provaDeCriador } from "@/lib/criador";
import { criarDesafio } from "@/lib/desafios";
import { validarNovaSala } from "@/lib/periodo";
import { hojeISO } from "@/lib/tempo";

export type CriarDesafioState = {
  error?: string;
};

export async function criarDesafioAction(
  _prevState: CriarDesafioState,
  formData: FormData,
): Promise<CriarDesafioState> {
  // Tudo validado aqui de novo (o formulário pode ser burlado).
  const validado = validarNovaSala(
    {
      nome: String(formData.get("nome") ?? ""),
      periodo: String(formData.get("periodo") ?? ""),
      inicio: String(formData.get("inicio") ?? ""),
      fim: String(formData.get("fim") ?? ""),
    },
    hojeISO(),
  );
  if ("erro" in validado) {
    return { error: ERRO_NOVA_SALA[validado.erro] };
  }

  const desafio = await criarDesafio({
    nome: validado.nome,
    duracaoDias: validado.duracaoDias,
    dataInicioMarcada: validado.inicio,
  });

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
