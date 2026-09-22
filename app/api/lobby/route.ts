import { NextResponse } from "next/server";
import { buscarDesafioPorCodigo } from "@/lib/desafios";
import { buscarParticipantePorToken, listarParticipantesPorDesafio } from "@/lib/participantes";
import { listarInegociaveisPorParticipante } from "@/lib/inegociaveis";

// Leitura do estado atual do desafio pra quem já tem identidade:
// participantes (quem entrou, quem tá pronto), meus inegociáveis, se
// sou o criador (calculado aqui, no servidor — nunca confia em flag
// que o cliente mandou) e o estado do desafio. Sem realtime — o
// cliente busca isso ao montar e ao focar a aba (regra do PRD).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const codigo = searchParams.get("codigo");
  const token = searchParams.get("token");

  if (!codigo || !token) {
    return NextResponse.json({ lobby: null }, { status: 400 });
  }

  const desafio = buscarDesafioPorCodigo(codigo);
  if (!desafio) {
    return NextResponse.json({ lobby: null }, { status: 404 });
  }

  const eu = buscarParticipantePorToken(desafio.id, token);
  if (!eu) {
    return NextResponse.json({ lobby: null }, { status: 404 });
  }

  const participantes = listarParticipantesPorDesafio(desafio.id).map((p) => ({
    id: p.id,
    nome: p.nome,
    emoji: p.emoji,
    pronto: p.pronto,
    quantidadeInegociaveis: listarInegociaveisPorParticipante(p.id).length,
  }));

  const meusInegociaveis = listarInegociaveisPorParticipante(eu.id).map((i) => ({
    id: i.id,
    titulo: i.titulo,
    assunto: i.assunto,
    alvo: i.alvo,
  }));

  return NextResponse.json({
    lobby: {
      estado: desafio.estado,
      meuId: eu.id,
      souCriador: desafio.criadorParticipanteId === eu.id,
      meuPronto: eu.pronto,
      meusInegociaveis,
      participantes,
    },
  });
}
