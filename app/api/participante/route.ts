import { NextResponse } from "next/server";
import { buscarDesafioPorCodigo } from "@/lib/desafios";
import { buscarParticipantePorToken } from "@/lib/participantes";

// Leitura simples: o cliente manda o código do desafio + o token que
// guardou no localStorage, a gente confirma se ainda existe (em
// memória) e devolve os dados públicos do participante.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const codigo = searchParams.get("codigo");
  const token = searchParams.get("token");

  if (!codigo || !token) {
    return NextResponse.json({ participante: null }, { status: 400 });
  }

  const desafio = buscarDesafioPorCodigo(codigo);
  if (!desafio) {
    return NextResponse.json({ participante: null }, { status: 404 });
  }

  const participante = buscarParticipantePorToken(desafio.id, token);
  if (!participante) {
    return NextResponse.json({ participante: null }, { status: 404 });
  }

  return NextResponse.json({
    participante: {
      id: participante.id,
      nome: participante.nome,
      emoji: participante.emoji,
      pronto: participante.pronto,
    },
  });
}
