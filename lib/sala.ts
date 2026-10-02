// Monta o que a tela da sala recebe (DadosSala), a partir do que veio do
// banco. Função pura (sem banco): /api/lobby busca e chama isto. Cada
// campo é escolhido um a um, então o token de ninguém sai daqui, e o que
// é privado ("N no seu foco") só vai pra própria pessoa.

import type { Desafio } from "./desafios";
import type { Participante } from "./participantes";
import type { RealizacaoComReacoes } from "./realizacoes";
import {
  bonusDaPessoa,
  fechouTudo,
  progressoDaPessoa,
  progressoDoGrupo,
  semanaDeHoje,
  semanasDaPessoa,
  type SemanaDaPessoa,
} from "./semanas";
import {
  ESCONDER_DOS_OUTROS_MS,
  diaDoDesafio,
  diasEntre,
  hojeISO,
  periodoDoDesafio,
} from "./tempo";
import type { DadosSala, PessoaResultado } from "./tipos-sala";

export function montarDadosSala(dados: {
  desafio: Desafio;
  participantes: Participante[];
  realizacoes: RealizacaoComReacoes[];
  /** quem está vendo; ausente = sala encerrada vista por quem não participa */
  eu?: Participante;
  /** a última atividade de `eu` ANTES desta visita (pras reações novas) */
  atividadeAnterior?: string | null;
  agora: number;
}): DadosSala {
  const { desafio, eu, agora } = dados;
  const hoje = hojeISO(new Date(agora));

  // Registro dos OUTROS feito há poucos segundos ainda pode ser desfeito
  // (~5s): esconde até passar, pra ninguém ver o que foi desfeito a tempo.
  // Vale pra tudo que a tela mostra, inclusive os números.
  const realizacoes = dados.realizacoes.filter(
    (r) => r.participanteId === eu?.id || agora - Date.parse(r.criadoEm) > ESCONDER_DOS_OUTROS_MS,
  );
  const dela = (id: string) => realizacoes.filter((r) => r.participanteId === id);

  const inicio = desafio.dataInicio ? hojeISO(new Date(desafio.dataInicio)) : null;
  const semanasDe = (p: Participante): SemanaDaPessoa[] | null =>
    inicio && p.metaSemanal
      ? semanasDaPessoa({
          inicio,
          duracaoDias: desafio.duracaoDias,
          entrada: hojeISO(new Date(p.criadoEm)),
          metaSemanal: p.metaSemanal,
          diasDasRealizacoes: dela(p.id).map((r) => r.dia),
        })
      : null;
  const semanas = new Map(dados.participantes.map((p) => [p.id, semanasDe(p)]));

  const comCompromisso = dados.participantes.filter((p) => semanas.get(p.id));
  const progressoGrupo = inicio
    ? progressoDoGrupo(comCompromisso.map((p) => progressoDaPessoa(semanas.get(p.id)!)))
    : null;

  const rolando = desafio.estado === "ativo";
  const minhasSemanas = eu ? semanas.get(eu.id) : null;
  const semanaAgora = rolando && minhasSemanas ? semanaDeHoje(minhasSemanas, hoje) : null;
  const minhas = eu ? dela(eu.id) : [];

  // Retomada: dias desde o último registro (ou desde que a pessoa começou
  // a contar, se ainda não registrou).
  let diasSemRegistrar: number | null = null;
  if (rolando && eu && inicio) {
    const entrada = hojeISO(new Date(eu.criadoEm));
    const comecou = entrada > inicio ? entrada : inicio;
    const ultimo = minhas.reduce<string | null>((max, r) => (max === null || r.dia > max ? r.dia : max), null);
    diasSemRegistrar = Math.max(0, diasEntre(ultimo ?? comecou, hoje));
  }

  const reacoesNovas =
    eu && dados.atividadeAnterior
      ? minhas.reduce(
          (soma, r) =>
            soma +
            r.reacoes.filter((x) => x.participanteId !== eu.id && x.criadoEm > dados.atividadeAnterior!).length,
          0,
        )
      : 0;

  const resultado: PessoaResultado[] | null =
    desafio.estado === "encerrado"
      ? comCompromisso.map((p) => {
          const s = semanas.get(p.id)!;
          const delas = dela(p.id);
          const porDia = new Map<string, number>();
          for (const r of delas) porDia.set(r.dia, (porDia.get(r.dia) ?? 0) + 1);
          return {
            id: p.id,
            emoji: p.emoji,
            nome: p.nome,
            foco: p.foco,
            fechouTudo: fechouTudo(s),
            realizacoes: delas.length,
            bonus: bonusDaPessoa(s),
            reacoes: delas.reduce((soma, r) => soma + r.reacoes.length, 0),
            diasEmChamas: [...porDia.values()].filter((n) => n >= 2).length,
            // Privado: só na linha da própria pessoa, e só se ela tem foco.
            noFoco: p.id === eu?.id && p.foco ? delas.filter((r) => r.noFoco).length : null,
          };
        })
      : null;

  return {
    estado: desafio.estado,
    salaNome: desafio.nome,
    duracaoDias: desafio.duracaoDias,
    diaAtual: desafio.dataInicio ? diaDoDesafio(desafio.dataInicio, desafio.duracaoDias, new Date(agora)) : null,
    inicioMarcado: desafio.dataInicioMarcada,
    periodo: desafio.dataInicio ? periodoDoDesafio(desafio.dataInicio, desafio.duracaoDias) : null,
    hoje,
    agora: new Date(agora).toISOString(),
    meuId: eu?.id ?? null,
    souCriador: eu ? desafio.criadorParticipanteId === eu.id : false,
    meuCompromisso: eu?.metaSemanal ? { meta: eu.metaSemanal, foco: eu.foco } : null,
    participantes: dados.participantes.map((p) => ({
      id: p.id,
      nome: p.nome,
      emoji: p.emoji,
      metaSemanal: p.metaSemanal,
      foco: p.foco,
      contagemHoje: dela(p.id).filter((r) => r.dia === hoje).length,
      minutosDesdeAtividade: Math.max(0, Math.floor((agora - Date.parse(p.ultimaAtividade)) / 60000)),
      ativoHoje: hojeISO(new Date(p.ultimaAtividade)) === hoje,
    })),
    feed: realizacoes.map((r) => ({
      id: r.id,
      autorId: r.participanteId,
      texto: r.texto,
      noFoco: r.noFoco,
      dia: r.dia,
      criadoEm: r.criadoEm,
      reacoes: r.reacoes.length,
      euReagi: eu ? r.reacoes.some((x) => x.participanteId === eu.id) : false,
    })),
    progressoGrupo,
    minhaSemana: semanaAgora ? { feitos: semanaAgora.feitos, meta: semanaAgora.meta } : null,
    meuNoFoco: eu?.foco ? minhas.filter((r) => r.noFoco).length : null,
    resumoDoDia: rolando
      ? {
          registraram: comCompromisso.filter((p) => dela(p.id).some((r) => r.dia === hoje)).length,
          total: comCompromisso.length,
          reacoesNovas,
        }
      : null,
    diasSemRegistrar,
    resultado,
    totaisGrupo: {
      realizacoes: realizacoes.length,
      reacoes: realizacoes.reduce((soma, r) => soma + r.reacoes.length, 0),
    },
  };
}
