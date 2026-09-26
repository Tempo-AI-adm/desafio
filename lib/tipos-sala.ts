// Formato dos dados que /api/lobby devolve pra tela da sala. Só tipos,
// seguro pra importar no servidor e no navegador.

import type { EstadoDesafio } from "./desafios";

export type InegociavelResumo = {
  id: string;
  titulo: string;
  assunto: string;
  alvo: number | null;
  /** quantas marcações a missão tem (não é fração; ver lib/progresso.ts) */
  progresso: number;
  /** registro antigo de "vitória extra": na leitura vira missão única já
   * cumprida (id = o da realização). Não dá pra marcar de novo. */
  legado?: true;
};

export type ParticipanteSala = {
  id: string;
  nome: string;
  emoji: string;
  pronto: boolean;
  quantidadeInegociaveis: number;
  /** missões da pessoa, incluindo os extras antigos (legado) */
  inegociaveis: InegociavelResumo[];
  /** marcações além do alvo (bônus): celebração pessoal, fora do número do grupo */
  bonus: number;
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
  /** minhas missões; as `legado` (extras antigos) vêm por último */
  meusInegociaveis: InegociavelResumo[];
  /** número do grupo, 0 a 1 (lib/progresso.ts); nulo = sala sem missão.
   * Só coletivo, nunca por pessoa. Ainda não aparece na tela. */
  progressoGrupo: number | null;
  participantes: ParticipanteSala[];
  feed: ItemFeed[];
};
