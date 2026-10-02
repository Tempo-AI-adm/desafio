import { NextResponse } from "next/server";
import { buscarDesafioPorCodigo } from "@/lib/desafios";
import { CABECALHO_TOKEN } from "@/lib/identidade-local";
import {
  buscarParticipantePorToken,
  listarParticipantesPorDesafio,
  tocarUltimaAtividade,
} from "@/lib/participantes";
import { listarRealizacoesDaSala } from "@/lib/realizacoes";
import { montarDadosSala } from "@/lib/sala";

// Leitura do estado atual da sala. Sem realtime: o cliente busca ao
// montar, ao focar a aba e depois de cada ação (regra do PRD). Cada
// busca reconhecida conta como "vi a pessoa agora" (ultima_atividade).
// O que a tela recebe é montado em lib/sala.ts (só o necessário).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const codigo = searchParams.get("codigo");
  // Token no cabeçalho, nunca na URL (URLs ficam nos registros de acesso).
  const token = request.headers.get(CABECALHO_TOKEN);

  if (!codigo) {
    return NextResponse.json({ lobby: null }, { status: 400 });
  }

  const desafio = await buscarDesafioPorCodigo(codigo);
  if (!desafio) {
    return NextResponse.json({ lobby: null }, { status: 404 });
  }

  // Sem identidade só dá pra ver a sala ENCERRADA (o resultado, só
  // leitura, pra quem abre o link sem ser participante). Lobby e sala
  // rolando exigem ser participante.
  const eu = token ? await buscarParticipantePorToken(desafio.id, token) : undefined;
  if (!eu && desafio.estado !== "encerrado") {
    return NextResponse.json({ lobby: null }, { status: token ? 404 : 400 });
  }

  // Guarda a última atividade ANTES de marcar esta visita: as reações
  // novas do resumo do dia são as que chegaram desde então.
  const atividadeAnterior = eu?.ultimaAtividade ?? null;
  if (eu) await tocarUltimaAtividade(eu.id);

  const participantes = await listarParticipantesPorDesafio(desafio.id);
  const realizacoes = await listarRealizacoesDaSala(participantes.map((p) => p.id));

  const lobby = montarDadosSala({
    desafio,
    participantes,
    realizacoes,
    eu,
    atividadeAnterior,
    agora: Date.now(),
  });

  return NextResponse.json({ lobby });
}
