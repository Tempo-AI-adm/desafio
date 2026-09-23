import { NextResponse } from "next/server";
import { buscarDesafioPorCodigo } from "@/lib/desafios";

// Leitura pública pros cartões da Home: pra cada código da lista local
// (no máximo 3), devolve nome + estado atual. Código que não existe
// mais no banco simplesmente não volta.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const codigos = (searchParams.get("codigos") ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean)
    .slice(0, 3);

  const encontrados = await Promise.all(codigos.map((c) => buscarDesafioPorCodigo(c)));

  return NextResponse.json({
    desafios: encontrados
      .filter((d) => d !== undefined)
      .map((d) => ({ codigo: d.codigo, nome: d.nome, estado: d.estado })),
  });
}
