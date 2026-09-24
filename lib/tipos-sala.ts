// Formato dos dados que /api/lobby devolve pra tela da sala. Só tipos,
// seguro pra importar no servidor e no navegador.

import type { EstadoDesafio } from "./desafios";

export type InegociavelResumo = {
  id: string;
  titulo: string;
  assunto: string;
  alvo: number | null;
  progresso: number;
};

export type ExtraResumo = {
  id: string;
  assunto: string;
  texto: string;
};

export type ParticipanteSala = {
  id: string;
  nome: string;
  emoji: string;
  pronto: boolean;
  quantidadeInegociaveis: number;
  inegociaveis: InegociavelResumo[];
  /** vitórias extras + marcações além do alvo */
  extras: number;
  contagemHoje: number;
  minutosDesdeAtividade: number;
  ativoHoje: boolean;
};

export type ItemFeed = {
  id: string;
  /** realização (marcou algo) ou novidade "criou a missão: X" */
  tipoItem: "realizacao" | "missao_criada";
  autorId: string;
  assunto: string;
  texto: string;
  dia: string;
  criadoEm: string;
  reacoes: number;
  euReagi: boolean;
};

export type DadosSala = {
  estado: EstadoDesafio;
  salaNome: string;
  duracaoDias: number;
  /** dia atual do desafio (1..duração); nulo antes de largar */
  diaAtual: number | null;
  /** primeiro e último dia (YYYY-MM-DD, Brasília); nulo antes de largar */
  periodo: { inicio: string; fim: string } | null;
  /** "hoje" (YYYY-MM-DD, fuso de Brasília) segundo o servidor */
  hoje: string;
  /** momento da busca (ISO), pra hora no cabeçalho; atualiza a cada busca */
  agora: string;
  meuId: string;
  meuNome: string;
  meuEmoji: string;
  souCriador: boolean;
  meuPronto: boolean;
  minhaContagemHoje: number;
  meusInegociaveis: InegociavelResumo[];
  meusExtras: ExtraResumo[];
  participantes: ParticipanteSala[];
  feed: ItemFeed[];
};
