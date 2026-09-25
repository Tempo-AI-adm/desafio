// Tradução de valores internos (estado, flags do banco) pra copy humana.
// Regra: a tela NUNCA mostra o nome cru de um campo ou o valor cru de um
// enum, sempre passa por aqui. Ver STYLE.md pro tom.

import type { EstadoDesafio } from "./desafios";
import { diaCurto } from "./tempo";

export const ESTADO_LABEL: Record<EstadoDesafio, string> = {
  lobby: "Esperando todo mundo entrar",
  ativo: "Desafio rolando",
  encerrado: "Desafio encerrado",
};

/** Versão curta do estado, pros cartões de "Seus desafios" na Home. */
export const ESTADO_CURTO: Record<EstadoDesafio, string> = {
  lobby: "esperando",
  ativo: "rolando",
  encerrado: "encerrado",
};

export function labelBackfill(permiteBackfill: boolean): string {
  return permiteBackfill
    ? "Dá pra completar dias atrasados"
    : "Só vale o dia de hoje";
}

export function labelPronto(pronto: boolean): string {
  return pronto ? "Pronto" : "Esperando";
}

/** Selo de comemoração ao registrar uma realização, em camadas pela
 * contagem do dia (STYLE.md "Strings-base"). Não é streak entre dias,
 * a contagem é só de hoje (ver PRD.md "Contagem do dia"). */
export function labelComemoracaoPorContagemDoDia(contagemHoje: number): string {
  if (contagemHoje <= 1) return "SHOW.";
  if (contagemHoje === 2) return "TÁ ON FIRE.";
  return "AURA MÁXIMA.";
}

/** Nível do foguinho ao lado do nome, pela mesma contagem do dia que
 * decide o selo (2ª realização = em chamas, 3ª ou mais = aura máxima). */
export function nivelFogoPorContagemDoDia(contagemHoje: number): 0 | 1 | 2 {
  if (contagemHoje >= 3) return 2;
  if (contagemHoje === 2) return 1;
  return 0;
}

/** Legenda que aparece ao tocar no foguinho (os dois tamanhos): ele
 * acende a partir da 2ª realização do dia. */
export const LEGENDA_FOGO = "2 ou mais no mesmo dia = dia em chamas.";

/** Rótulo da lista dos outros participantes no cabeçalho da sala. É
 * diário/aproximado (quem abriu ou registrou hoje), não presença ao vivo. */
export const LABEL_ATIVOS_HOJE = "Ativos hoje";

/** Quando não tem mais ninguém na sala além da própria pessoa. */
export const LABEL_SO_VOCE_HOJE = "Só você por aqui hoje";

/** "visto há X" do cartão, a partir de quantos minutos faz desde a
 * última atividade (STYLE.md: "ativo agora" / "visto há 2h"). */
export function labelVistoHa(minutos: number): string {
  if (minutos < 5) return "ativo agora";
  if (minutos < 60) return `visto há ${minutos}min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `visto há ${horas}h`;
  return `visto há ${Math.floor(horas / 24)}d`;
}


/** Aviso logo depois de marcar um inegociável (janela de desfazer). */
export const LABEL_AVISO_DESFAZER = "Feito. Toque de novo para desfazer.";

/** Selo quando o desfazer deu certo. */
export const LABEL_DESFEITO = "Desfeito.";

/** "7 dias" / "1 dia", no cabeçalho da sala. */
export function labelDuracao(dias: number): string {
  return dias === 1 ? "1 dia" : `${dias} dias`;
}

/** "Dia 3/7" no cabeçalho da sala, depois de largar. */
export function labelDiaDoDesafio(dia: number, duracaoDias: number): string {
  return `Dia ${dia}/${duracaoDias}`;
}

/** Selo do cabeçalho da sala encerrada, no lugar de "Dia X/Y". Neutro:
 * é status, não conquista. */
export const LABEL_SELO_ENCERRADO = "Encerrado";

/** "16/09 — 22/09": período real do desafio, no cabeçalho da sala
 * encerrada (datas YYYY-MM-DD, fuso de Brasília). */
export function labelPeriodo(inicio: string, fim: string): string {
  return `${diaCurto(inicio)} — ${diaCurto(fim)}`;
}

/** Mensagem pronta do botão "Compartilhar sala" (abre o WhatsApp). */
export function mensagemCompartilharSala(nomeSala: string, link: string): string {
  return `Bora pro desafio ${nomeSala}! Entra aqui: ${link}`;
}

/** Linha de novidade no feed quando alguém cria missão com a sala rolando. */
export function labelMissaoCriada(titulo: string): string {
  return `criou a missão: ${titulo}`;
}

/** Insígnia (estrelinha) de quem passou do alvo de uma missão. */
export const LABEL_BONUS = "Bateu e passou do combinado";

/** Tipo de missão no formulário. No banco: "unica" = alvo nulo
 * (cumpri/não cumpri), "repetir" = alvo com número (bolinhas). */
export type TipoMissao = "unica" | "repetir";

export const TIPO_MISSAO_LABEL: Record<TipoMissao, string> = {
  unica: "Única",
  repetir: "Repetir",
};

export const LABEL_QUANTAS_VEZES = "Repetir quantas vezes?";

/** Texto do lobby, na janela "Seu inegociável" (STYLE.md "Criar o norte"). */
export const TEXTO_LOBBY_NORTE =
  "Para começar, defina uma ou mais missões que você queira realizar no período do desafio. Depois você poderá adicionar novas missões.";

/** Leitor de tela do "✓" nos registros antigos de "vitória extra". */
export const LABEL_REGISTRO_FEITO = "feito";

// ---- Home ----

export const HOME_FRASE = "Um incentivo pra sua melhor versão (ou o Twitter de aura farmada)";

export const HOME_COMO_FUNCIONA = "Como funciona";

export const HOME_COMO_FUNCIONA_TEXTO = [
  "O ritmo é só seu, mas a satisfação é compartilhada.",
  "Você define suas missões e registra suas realizações.",
  "Seja malhar 3x, estudar 4h, ligar pra família ou só ter cozinhado pra semana.",
];

export const HOME_VER_EXEMPLO = "Ver um exemplo do resultado final";

/** Card decorativo da Home: dados FIXOS de exemplo, não vêm do banco.
 * Segue o princípio do PRD "Resultado final - princípio de apresentação":
 * ordem = ordem de entrada na sala (nunca por quantidade) e o destaque é
 * binário (completou tudo que se propôs ou não), números são só detalhe.
 * Os dados foram escolhidos pra mostrar isso: Cacá se propôs 1 e fez 1
 * (fechou tudo, igual a Ana), Beto fez mais que a Cacá e seguiu no próprio ritmo.
 * Ana faz o papel de "você" (vem primeiro, com realce e "3 de 3 missões"). */
export const HOME_EXEMPLO = {
  rotulo: "exemplo",
  titulo: "Resultado final",
  sala: "Desafio maromba",
  duracaoDias: 7,
  periodo: { inicio: "2026-09-01", fim: "2026-09-07" },
  voce: "Ana",
  // Ordem de entrada na sala (a tela põe "você" primeiro).
  pessoas: [
    { emoji: "🐼", nome: "Beto", fechouTudo: false, missoes: 2, definidas: 3, bonus: 0, reacoes: 3 },
    { emoji: "🦊", nome: "Ana", fechouTudo: true, missoes: 3, definidas: 3, bonus: 2, reacoes: 5 },
    { emoji: "🦉", nome: "Cacá", fechouTudo: true, missoes: 1, definidas: 1, bonus: 0, reacoes: 2 },
  ],
};

// ---- Resultado final (exemplo da Home e sala encerrada) ----

/** Selo binário: cumpriu tudo que se propôs ou não (PRD "Resultado final"). */
export const SELO_FECHOU_TUDO = "FECHOU TUDO QUE SE PROPÔS.";
export const SELO_NO_RITMO = "SEGUIU NO PRÓPRIO RITMO.";

export const TITULO_RESULTADO_FINAL = "Resultado final";

/** Bloco expansível com o feed, na sala encerrada (a seta vem junto). */
export const LABEL_VER_TUDO_QUE_ROLOU = "Ver tudo que rolou";

/** Rótulo em cima da lista de participantes do resultado. */
export const LABEL_TODO_MUNDO = "Todo mundo";

/** Só na linha da própria pessoa: "2 de 3 missões" (definiu vs. cumpriu,
 * comparação consigo mesma, nunca com os outros). */
export function labelMissoesDeDefinidas(cumpridas: number, definidas: number): string {
  return `${cumpridas} de ${definidas} ${definidas === 1 ? "missão" : "missões"}`;
}

/** Marca a própria pessoa em listas de participantes. */
export const LABEL_VOCE = "(você)";

/** "7 dias · 3 amigos", no cabeçalho da sala encerrada (e no exemplo). */
export function labelResumoResultado(duracaoDias: number, pessoas: number): string {
  return `${labelDuracao(duracaoDias)} · ${pessoas === 1 ? "1 amigo" : `${pessoas} amigos`}`;
}

export function labelMissoesCumpridas(n: number): string {
  return n === 1 ? "1 missão cumprida" : `${n} missões cumpridas`;
}

export function labelBonus(n: number): string {
  return n === 1 ? "1 bônus" : `${n} bônus`;
}

export function labelReacoes(n: number): string {
  return n === 1 ? "1 reação" : `${n} reações`;
}
