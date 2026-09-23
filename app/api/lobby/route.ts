import { NextResponse } from "next/server";
import { buscarDesafioPorCodigo } from "@/lib/desafios";
import { buscarParticipantePorToken, listarParticipantesPorDesafio } from "@/lib/participantes";
import { listarInegociaveisPorParticipante } from "@/lib/inegociaveis";
import {
  contarRealizacoesNoDia,
  contarRealizacoesPorInegociavel,
  hojeISO,
  listarExtrasPorParticipante,
} from "@/lib/realizacoes";

// Leitura do estado atual do desafio pra quem já tem identidade:
// participantes (quem entrou, quem tá pronto), meus inegociáveis, se
// sou o criador (calculado aqui, no servidor, nunca confia em flag
// que o cliente mandou) e o estado do desafio. Sem realtime, o
// cliente busca isso ao montar e ao focar a aba (regra do PRD).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const codigo = searchParams.get("codigo");
  const token = searchParams.get("token");

  if (!codigo || !token) {
    return NextResponse.json({ lobby: null }, { status: 400 });
  }

  const desafio = await buscarDesafioPorCodigo(codigo);
  if (!desafio) {
    return NextResponse.json({ lobby: null }, { status: 404 });
  }

  const eu = await buscarParticipantePorToken(desafio.id, token);
  if (!eu) {
    return NextResponse.json({ lobby: null }, { status: 404 });
  }

  const listaParticipantes = await listarParticipantesPorDesafio(desafio.id);
  const participantes = await Promise.all(
    listaParticipantes.map(async (p) => ({
      id: p.id,
      nome: p.nome,
      emoji: p.emoji,
      pronto: p.pronto,
      quantidadeInegociaveis: (await listarInegociaveisPorParticipante(p.id)).length,
    })),
  );

  const meusInegociaveisBrutos = await listarInegociaveisPorParticipante(eu.id);
  const meusInegociaveis = await Promise.all(
    meusInegociaveisBrutos.map(async (i) => ({
      id: i.id,
      titulo: i.titulo,
      assunto: i.assunto,
      alvo: i.alvo,
      progresso: await contarRealizacoesPorInegociavel(i.id),
    })),
  );

  const meusExtras = (await listarExtrasPorParticipante(eu.id)).map((r) => ({
    id: r.id,
    assunto: r.assunto,
    texto: r.texto,
  }));
  const minhaContagemHoje = await contarRealizacoesNoDia(eu.id, hojeISO());

  return NextResponse.json({
    lobby: {
      estado: desafio.estado,
      meuId: eu.id,
      meuNome: eu.nome,
      meuEmoji: eu.emoji,
      minhaContagemHoje,
      meusExtras,
      souCriador: desafio.criadorParticipanteId === eu.id,
      meuPronto: eu.pronto,
      meusInegociaveis,
      participantes,
    },
  });
}
