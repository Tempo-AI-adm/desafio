import { NextResponse } from "next/server";
import { buscarDesafioPorCodigo } from "@/lib/desafios";
import {
  buscarParticipantePorToken,
  listarParticipantesPorDesafio,
  tocarUltimaAtividade,
} from "@/lib/participantes";
import { listarInegociaveisPorParticipantes } from "@/lib/inegociaveis";
import { listarRealizacoesDaSala } from "@/lib/realizacoes";
import { progressoDoGrupo } from "@/lib/progresso";
import { ESCONDER_DOS_OUTROS_MS, diaDoDesafio, hojeISO, periodoDoDesafio } from "@/lib/tempo";
import type { DadosSala, InegociavelResumo, ItemFeed, ParticipanteSala } from "@/lib/tipos-sala";

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

  // Tudo é missão: as missões da pessoa + cada registro antigo de
  // "vitória extra" como uma missão única já cumprida (só na leitura, o
  // banco não muda), no fim da lista.
  function inegociaveisDe(participanteId: string): InegociavelResumo[] {
    const missoes: InegociavelResumo[] = inegociaveis
      .filter((i) => i.participanteId === participanteId)
      .map((i) => ({
        id: i.id,
        titulo: i.titulo,
        assunto: i.assunto,
        alvo: i.alvo,
        progresso: realizacoes.filter((r) => r.inegociavelId === i.id).length,
      }));
    const legadas: InegociavelResumo[] = realizacoes
      .filter((r) => r.participanteId === participanteId && r.tipo === "extra")
      .map((r) => ({ id: r.id, titulo: r.texto, assunto: r.assunto, alvo: null, progresso: 1, legado: true }));
    return [...missoes, ...legadas];
  }

  const participantes: ParticipanteSala[] = listaParticipantes.map((p) => {
    const dele = realizacoes.filter((r) => r.participanteId === p.id);
    const inegociaveisDele = inegociaveisDe(p.id);
    // Marcar além do alvo é bônus ("estourou"): celebração pessoal.
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
      bonus: estouros,
      contagemHoje: dele.filter((r) => r.dia === hoje).length,
      minutosDesdeAtividade: Math.max(0, Math.floor((agora - Date.parse(p.ultimaAtividade)) / 60000)),
      ativoHoje: hojeISO(new Date(p.ultimaAtividade)) === hoje,
    };
  });

  const euNaSala = participantes.find((p) => p.id === eu.id);

  // Feed: realizações + novidade "criou a missão" pra missões criadas
  // com a sala já rolando (as do lobby não viram novidade).
  const inicio = desafio.dataInicio ? Date.parse(desafio.dataInicio) : null;
  const feed: ItemFeed[] = [
    ...realizacoes.map((r) => ({
      id: r.id,
      tipoItem: "realizacao" as const,
      autorId: r.participanteId,
      assunto: r.assunto,
      texto: r.texto,
      dia: r.dia,
      criadoEm: r.criadoEm,
      reacoes: r.reagiram.length,
      euReagi: r.reagiram.includes(eu.id),
    })),
    ...inegociaveis
      .filter((i) => inicio !== null && Date.parse(i.criadoEm) > inicio)
      .map((i) => ({
        id: `missao-${i.id}`,
        tipoItem: "missao_criada" as const,
        autorId: i.participanteId,
        assunto: i.assunto,
        texto: i.titulo,
        dia: hojeISO(new Date(i.criadoEm)),
        criadoEm: i.criadoEm,
        reacoes: 0,
        euReagi: false,
      })),
  ].sort((a, b) => Date.parse(b.criadoEm) - Date.parse(a.criadoEm));

  const lobby: DadosSala = {
    estado: desafio.estado,
    salaNome: desafio.nome,
    duracaoDias: desafio.duracaoDias,
    diaAtual: desafio.dataInicio ? diaDoDesafio(desafio.dataInicio, desafio.duracaoDias) : null,
    periodo: desafio.dataInicio ? periodoDoDesafio(desafio.dataInicio, desafio.duracaoDias) : null,
    hoje,
    agora: new Date(agora).toISOString(),
    meuId: eu.id,
    meuNome: eu.nome,
    meuEmoji: eu.emoji,
    souCriador: desafio.criadorParticipanteId === eu.id,
    meuPronto: eu.pronto,
    minhaContagemHoje: euNaSala?.contagemHoje ?? 0,
    meusInegociaveis: euNaSala?.inegociaveis ?? [],
    // Os extras antigos já estão nas missões (legado), então aqui não
    // entram de novo.
    progressoGrupo: progressoDoGrupo(
      participantes.flatMap((p) => p.inegociaveis.map((i) => ({ alvo: i.alvo, feitos: i.progresso }))),
    ),
    participantes,
    feed,
  };

  return NextResponse.json({ lobby });
}
