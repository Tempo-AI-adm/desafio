// Formato dos dados que /api/lobby devolve pra tela da sala (modelo v2).
// Só tipos, seguro pra importar no servidor e no navegador. Regra: só o
// que a tela usa, e nada privado de outra pessoa (ver CLAUDE.md
// "Segurança").

import type { EstadoDesafio } from "./desafios";

export type ParticipanteSala = {
  id: string;
  nome: string;
  emoji: string;
  /** o compromisso (público: é o que a pessoa se propôs) */
  metaSemanal: number | null;
  foco: string | null;
  /** realizações hoje (foguinho) */
  contagemHoje: number;
  minutosDesdeAtividade: number;
  ativoHoje: boolean;
};

export type ItemFeed = {
  id: string;
  autorId: string;
  /** a frase; vazio = "[nome] registrou" */
  texto: string;
  /** registro no foco: marquinha celebrada (nunca existe "fora do foco") */
  noFoco: boolean;
  dia: string;
  criadoEm: string;
  reacoes: number;
  euReagi: boolean;
};

/** "3 de 5 essa semana" (a semana de hoje da própria pessoa). */
export type MinhaSemana = { feitos: number; meta: number };

/** Uma linha do resultado final (sala encerrada). */
export type PessoaResultado = {
  id: string;
  emoji: string;
  nome: string;
  foco: string | null;
  /** bateu a meta em todas as semanas que contam pra ela */
  fechouTudo: boolean;
  realizacoes: number;
  bonus: number;
  reacoes: number;
  diasEmChamas: number;
  /** "Y no foco": SÓ na linha da própria pessoa (privado); nulo nas outras */
  noFoco: number | null;
};

export type DadosSala = {
  estado: EstadoDesafio;
  salaNome: string;
  duracaoDias: number;
  /** dia atual do desafio (1..duração); nulo antes de largar */
  diaAtual: number | null;
  /** dia em que a sala larga sozinha (YYYY-MM-DD); nulo em sala antiga */
  inicioMarcado: string | null;
  /** primeiro e último dia (YYYY-MM-DD, Brasília); nulo antes de largar */
  periodo: { inicio: string; fim: string } | null;
  /** "hoje" (YYYY-MM-DD, fuso de Brasília) segundo o servidor */
  hoje: string;
  /** momento da busca (ISO), pra hora no cabeçalho */
  agora: string;
  /** nulo = quem não participa vendo a sala encerrada (só leitura) */
  meuId: string | null;
  souCriador: boolean;
  /** meu compromisso; nulo pra quem não participa */
  meuCompromisso: { meta: number; foco: string | null } | null;
  participantes: ParticipanteSala[];
  feed: ItemFeed[];
  /** número do grupo, 0 a 1 (média das pessoas, só sobe); nulo = ninguém se propôs */
  progressoGrupo: number | null;
  /** só pra própria pessoa, com a sala rolando */
  minhaSemana: MinhaSemana | null;
  /** "N no seu foco": privado, só pra própria pessoa que tem foco */
  meuNoFoco: number | null;
  /** resumo do dia (sala rolando): quantos já registraram hoje e as
   * reações novas nos meus registros desde a última vez que abri */
  resumoDoDia: { registraram: number; total: number; reacoesNovas: number } | null;
  /** dias sem registrar (retomada); nulo se não se aplica */
  diasSemRegistrar: number | null;
  /** só na sala encerrada */
  resultado: PessoaResultado[] | null;
  /** totais do grupo (resultado): realizações e reações trocadas */
  totaisGrupo: { realizacoes: number; reacoes: number };
};
