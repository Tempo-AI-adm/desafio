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

/** Legenda ao tocar na estrela de bônus (resultado final). */
export const LEGENDA_ESTRELA = "Você foi além do que tinha combinado nessa missão.";

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

// ---- Missões: textos com o sentimento de "se propor" ----
// Regra de tom: frase completa que explica o PORQUÊ da ação, nunca
// rótulo curto e vago. Sem infantilizar; quem nunca usou nada parecido
// tem que entender só lendo.

/** Janela do lobby onde a pessoa escolhe as missões dela. */
export const TITULO_LOBBY_MISSOES = "Suas missões";

/** Texto do lobby, na janela "Suas missões": a primeira missão é o
 * compromisso da pessoa pra frente, por isso nasce sem nada marcado. */
export const TEXTO_LOBBY_NORTE =
  "Antes da largada, escolha pelo menos uma missão: algo que você vai fazer nesses dias porque decidiu ser a sua melhor versão durante o desafio. É um compromisso seu com você mesmo, então ela começa sem nada marcado e vai se enchendo conforme você cumpre. Depois da largada, dá pra somar missões novas sempre que quiser.";

/** Rótulo do campo de título no lobby: a 1ª missão e as seguintes. */
export function rotuloTituloMissaoLobby(quantasJaTem: number): string {
  return quantasJaTem === 0 ? "A que você se propõe nesse desafio?" : "A que mais você quer se propor?";
}

export const BOTAO_ASSUMIR_MISSAO = "Assumir esta missão";

/** Apoio no lobby, depois da 1ª missão, antes do PRONTO. */
export const TEXTO_LOBBY_ANTES_DO_PRONTO =
  "Se quiser se propor a mais alguma coisa, é só preencher de novo aqui em cima. Quando sentir que a sua lista está do jeito que você quer, aperte PRONTO pra avisar o grupo que você está dentro.";

export const PLACEHOLDER_TITULO_MISSAO = "Ex: malhar, ler 20 páginas, ligar pra minha avó";

export const ROTULO_ASSUNTO_MISSAO = "Sobre o que é essa missão?";

export const ROTULO_TIPO_MISSAO = "Com que frequência?";

/** Explica cada tipo, logo abaixo da escolha. */
export const EXPLICA_TIPO_MISSAO: Record<TipoMissao, string> = {
  unica: "Uma vez só: quando você fizer, marca e ela fica cumprida.",
  repetir: "Algo pra fazer várias vezes ao longo do desafio: cada vez que você fizer, marca uma.",
};

export const EXPLICA_QUANTAS_VEZES = "Quantas vezes, somando o desafio inteiro, você quer fazer isso.";

/** Apoio fixo em "Suas Missões", com a sala rolando. */
export const TEXTO_SUAS_MISSOES =
  "Sempre que você fizer uma das suas missões, toque nela pra registrar. Cada registro aparece no feed, e o grupo inteiro comemora com você.";

/** Topo do formulário "+ Nova missão", com a sala rolando. */
export const TEXTO_NOVA_MISSAO =
  "Fez algo que te deixou orgulhoso, ou decidiu se propor a mais alguma coisa? Crie uma missão nova: ela vale o mesmo que as outras e entra na sua lista.";

export const ROTULO_TITULO_NOVA_MISSAO = "Qual é a missão nova?";

/** "+ Nova missão" pra quem entrou com a sala já rolando e ainda não tem
 * missão: essa é a primeira, o compromisso dela, então nunca nasce feita. */
export const TEXTO_PRIMEIRA_MISSAO_RODANDO =
  "Você chegou com o desafio já rolando. Pra fazer parte, escolha a sua primeira missão: algo que você vai fazer nesses dias porque decidiu ser a sua melhor versão. Ela começa sem nada marcado e vai se enchendo conforme você cumpre.";

export const BOTAO_ADICIONAR_NOVA_MISSAO = "Adicionar à minha lista";

/** "Já fiz" na missão nova (nunca na primeira missão da pessoa). */
export const ROTULO_JA_CUMPRI = "Eu já fiz isso";
export const EXPLICA_JA_CUMPRI =
  "Marque se você já fez: a missão entra cumprida e aparece no feed pro grupo comemorar com você.";
export const ROTULO_JA_FEITOS = "Você já fez isso alguma vez? Quantas?";
export const EXPLICA_JA_FEITOS =
  "Se já fez, diga quantas vezes: elas entram marcadas agora mesmo. Se ainda não fez, deixe em branco e marque depois, a cada vez.";

// ---- Erros das missões ----
export const ERRO_MISSAO_SEM_TITULO =
  "Escreva qual é a missão, pra você e o grupo saberem a que você está se propondo.";
export const ERRO_PRONTO_SEM_MISSAO =
  "Pra ficar pronto, primeiro se proponha a pelo menos uma missão: é ela que marca a sua entrada no desafio.";
export const ERRO_MISSAO_DE_OUTRA_PESSOA =
  "Essa missão é de outra pessoa. Cada um marca só as próprias missões.";
export const ERRO_JA_FEITOS =
  "Aqui dá pra registrar até o número de vezes que você definiu pra essa missão. Se fez mais, é só tocar nela depois pra somar.";

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
  // Resumo do grupo: reações trocadas = soma das reações de cada um (3+5+2).
  grupo: { realizacoes: 20, reacoes: 10 },
  voce: "Ana",
  // Ordem de entrada na sala (a tela põe "você" primeiro).
  pessoas: [
    { emoji: "🐼", nome: "Beto", fechouTudo: false, missoes: 2, definidas: 3, bonus: 0, reacoes: 3, diasEmChamas: 1 },
    { emoji: "🦊", nome: "Ana", fechouTudo: true, missoes: 3, definidas: 3, bonus: 2, reacoes: 5, diasEmChamas: 3 },
    { emoji: "🦉", nome: "Cacá", fechouTudo: true, missoes: 1, definidas: 1, bonus: 0, reacoes: 2, diasEmChamas: 0 },
  ],
};

// ---- Resultado final (exemplo da Home e sala encerrada) ----

/** Selo binário: cumpriu tudo que se propôs ou não (PRD "Resultado final"). */
export const SELO_FECHOU_TUDO = "FECHOU TUDO QUE SE PROPÔS.";
export const SELO_NO_RITMO = "SEGUIU NO PRÓPRIO RITMO.";

export const TITULO_RESULTADO_FINAL = "Resultado final";

/** Bloco expansível com o feed, na sala encerrada (a seta vem junto). */
export const LABEL_VER_TUDO_QUE_ROLOU = "Ver tudo que rolou";

/** Resumo do grupo todo, acima de "Todo mundo": "12 realizações · 8
 * reações trocadas". Estatística coletiva, nunca por pessoa. */
export function labelResumoGrupo(realizacoes: number, reacoes: number): string {
  const r = realizacoes === 1 ? "1 realização" : `${realizacoes} realizações`;
  const x = reacoes === 1 ? "1 reação trocada" : `${reacoes} reações trocadas`;
  return `${r} · ${x}`;
}

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

/** Chip do resultado: dias em que a pessoa teve 2+ realizações. */
export function labelDiasEmChamas(n: number): string {
  return n === 1 ? "1 dia em chamas" : `${n} dias em chamas`;
}

export function labelBonus(n: number): string {
  return n === 1 ? "1 bônus" : `${n} bônus`;
}

export function labelReacoes(n: number): string {
  return n === 1 ? "1 reação" : `${n} reações`;
}
