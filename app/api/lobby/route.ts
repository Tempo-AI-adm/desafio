import { NextResponse } from "next/server";
import { buscarDesafioPorCodigo } from "@/lib/desafios";
import {
  buscarParticipantePorToken,
  listarParticipantesPorDesafio,
  tocarUltimaAtividade,
} from "@/lib/participantes";
import { listarInegociaveisPorParticipantes } from "@/lib/inegociaveis";
import { listarRealizacoesDaSala } from "@/lib/realizacoes";
import { ESCONDER_DOS_OUTROS_MS, diaDoDesafio, hojeISO } from "@/lib/tempo";
import type { DadosSala, InegociavelResumo, ParticipanteSala } from "@/lib/tipos-sala";

// Leitura do estado atual da sala pra quem já tem identidade: estado,
// participantes (lobby e cartões), minhas missões e o feed. Sem
// realtime, o cliente busca isso ao montar e ao focar a aba (regra do
// PRD). Cada busca reconhecida conta como "vi a pessoa agora"
// (ultima_atividade), pro "visto há X" / "ativo hoje" dos cartões.
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

  await tocarUltimaAtividade(eu.id);

  const listaParticipantes = await listarParticipantesPorDesafio(desafio.id);
  const ids = listaParticipantes.map((p) => p.id);
  const [inegociaveis, todasRealizacoes] = await Promise.all([
    listarInegociaveisPorParticipantes(ids),
    listarRealizacoesDaSala(ids),
  ]);

  const agora = Date.now();
  // Marcação de inegociável dos OUTROS feita há poucos segundos ainda
  // pode ser desfeita (janela de ~5s): esconde até passar, pra nunca
  // aparecer pra ninguém um registro que foi desfeito a tempo.
  const realizacoes = todasRealizacoes.filter(
    (r) =>
      r.participanteId === eu.id ||
      r.tipo !== "inegociavel" ||
      agora - Date.parse(r.criadoEm) > ESCONDER_DOS_OUTROS_MS,
  );
  const hoje = hojeISO();

  function inegociaveisDe(participanteId: string): InegociavelResumo[] {
    return inegociaveis
      .filter((i) => i.participanteId === participanteId)
      .map((i) => ({
        id: i.id,
        titulo: i.titulo,
        assunto: i.assunto,
        alvo: i.alvo,
        progresso: realizacoes.filter((r) => r.inegociavelId === i.id).length,
      }));
  }

  const participantes: ParticipanteSala[] = listaParticipantes.map((p) => {
    const dele = realizacoes.filter((r) => r.participanteId === p.id);
    const inegociaveisDele = inegociaveisDe(p.id);
    // PRD: marcar além do alvo conta como extra ("estourou").
    const estouros = inegociaveisDele.reduce(
      (soma, i) => soma + (i.alvo !== null ? Math.max(0, i.progresso - i.alvo) : 0),
      0,
    );
    return {
      id: p.id,
      nome: p.nome,
      emoji: p.emoji,
      pronto: p.pronto,
      quantidadeInegociaveis: inegociaveisDele.length,
      inegociaveis: inegociaveisDele,
      extras: dele.filter((r) => r.tipo === "extra").length + estouros,
      contagemHoje: dele.filter((r) => r.dia === hoje).length,
      minutosDesdeAtividade: Math.max(0, Math.floor((agora - Date.parse(p.ultimaAtividade)) / 60000)),
      ativoHoje: hojeISO(new Date(p.ultimaAtividade)) === hoje,
    };
  });

  const euNaSala = participantes.find((p) => p.id === eu.id);

  const lobby: DadosSala = {
    estado: desafio.estado,
    salaNome: desafio.nome,
    duracaoDias: desafio.duracaoDias,
    diaAtual: desafio.dataInicio ? diaDoDesafio(desafio.dataInicio, desafio.duracaoDias) : null,
    hoje,
    meuId: eu.id,
    meuNome: eu.nome,
    meuEmoji: eu.emoji,
    souCriador: desafio.criadorParticipanteId === eu.id,
    meuPronto: eu.pronto,
    minhaContagemHoje: euNaSala?.contagemHoje ?? 0,
    meusInegociaveis: euNaSala?.inegociaveis ?? [],
    meusExtras: realizacoes
      .filter((r) => r.participanteId === eu.id && r.tipo === "extra")
      .map((r) => ({ id: r.id, assunto: r.assunto, texto: r.texto })),
    participantes,
    feed: realizacoes.map((r) => ({
      id: r.id,
      autorId: r.participanteId,
      tipo: r.tipo,
      assunto: r.assunto,
      texto: r.texto,
      dia: r.dia,
      criadoEm: r.criadoEm,
      reacoes: r.reagiram.length,
      euReagi: r.reagiram.includes(eu.id),
    })),
  };

  return NextResponse.json({ lobby });
}
