import { NextResponse } from "next/server";
import { buscarDesafioPorCodigo } from "@/lib/desafios";
import { CABECALHO_TOKEN } from "@/lib/identidade-local";
import { buscarParticipantePorToken } from "@/lib/participantes";

// Leitura simples: o cliente manda o código da sala (na URL) + o token
// que guardou no localStorage (no cabeçalho, nunca na URL), a gente
// confirma se ainda existe e devolve só o que a tela usa (o emoji).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const codigo = searchParams.get("codigo");
  const token = request.headers.get(CABECALHO_TOKEN);

  if (!codigo || !token) {
    return NextResponse.json({ participante: null }, { status: 400 });
  }

  const desafio = await buscarDesafioPorCodigo(codigo);
  if (!desafio) {
    return NextResponse.json({ participante: null }, { status: 404 });
  }

  const participante = await buscarParticipantePorToken(desafio.id, token);
  if (!participante) {
    return NextResponse.json({ participante: null }, { status: 404 });
  }

  return NextResponse.json({ participante: { emoji: participante.emoji } });
}
