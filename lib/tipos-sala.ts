// Formato dos dados que /api/lobby devolve pra tela da sala. Só tipos,
// seguro pra importar no servidor e no navegador.

import type { EstadoDesafio } from "./desafios";
import type { TipoRealizacao } from "./realizacoes";

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
  autorId: string;
  tipo: TipoRealizacao;
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
  /** "hoje" (YYYY-MM-DD, fuso de Brasília) segundo o servidor */
  hoje: string;
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
