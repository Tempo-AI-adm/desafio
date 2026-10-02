// Tradução de valores internos (estado, flags do banco) pra copy humana.
// Regra: a tela NUNCA mostra o nome cru de um campo ou o valor cru de um
// enum, sempre passa por aqui. Ver STYLE.md pro tom.

import type { EstadoDesafio } from "./desafios";
import type { TipoPeriodo } from "./periodo";
import { diaCurto, diaDaSemana } from "./tempo";

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

// ---- Datas por extenso curto ("seg, 5 out") ----

const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** "seg, 5 out" a partir de YYYY-MM-DD. */
export function labelDiaPorExtenso(dia: string): string {
  const [, m, d] = dia.split("-").map(Number);
  return `${DIAS_SEMANA[diaDaSemana(dia)]}, ${d} ${MESES[m - 1]}`;
}

/** "5 out" a partir de YYYY-MM-DD. */
export function labelDiaMes(dia: string): string {
  const [, m, d] = dia.split("-").map(Number);
  return `${d} ${MESES[m - 1]}`;
}

// ---- Criar sala ----

export const PERIODO_LABEL: Record<TipoPeriodo, string> = {
  "1semana": "1 semana",
  "2semanas": "2 semanas",
  "1mes": "1 mês",
  ateData: "Até uma data",
};

export const CRIAR_ROTULO_NOME = "Nome da sala";
export const CRIAR_PLACEHOLDER_NOME = "Ex: Bora outubro";
export const CRIAR_ROTULO_PERIODO = "Por quanto tempo?";
export const CRIAR_EXPLICA_PERIODO =
  "É o tempo que o grupo vai passar junto nessa. Durante ele, cada pessoa se propõe a realizar um número de coisas boas por semana, no ritmo dela.";
export const CRIAR_ROTULO_FIM = "Até quando? (esse dia conta)";
export const CRIAR_ROTULO_INICIO = "Quando começa?";
export const CRIAR_EXPLICA_INICIO =
  "Recomeçar num marco, como uma segunda-feira ou o começo do mês, dá mais gás pra todo mundo. A sala começa sozinha nesse dia, e até lá o grupo vai entrando e se propondo. Se todo mundo já estiver pronto antes, você pode largar na hora.";
export const CRIAR_OUTRA_DATA = "Outra data";
export const CRIAR_BOTAO = "Criar sala";

/** Atalho de início: "Segunda, 5 out" / "Dia 1, 1 nov" (hoje, se for o dia). */
export function labelSugestaoInicio(tipo: "segunda" | "dia1", dia: string, hoje: string): string {
  if (dia === hoje) return tipo === "segunda" ? `Hoje, segunda (${labelDiaMes(dia)})` : `Hoje, dia 1 (${labelDiaMes(dia)})`;
  return tipo === "segunda" ? `Segunda, ${labelDiaMes(dia)}` : `Dia 1, ${labelDiaMes(dia)}`;
}

export const ERRO_NOVA_SALA: Record<"nome" | "nomeGrande" | "periodo" | "inicio" | "fim" | "longo", string> = {
  nome: "Dá um nome pra sala, é ele que o grupo vai ver no convite.",
  nomeGrande: "Esse nome ficou grande demais, tenta um de até 40 letras.",
  periodo: "Escolhe por quanto tempo o desafio vai durar.",
  inicio: "Escolhe uma data de início a partir de hoje (até um ano pra frente).",
  fim: "Escolhe até quando vai o desafio, num dia igual ou depois do início.",
  longo: "Esse período ficou longo demais. Que tal até um ano?",
};

/** "1 mês, de 5 out a 4 nov" na tela de sala criada. */
export function labelPeriodoCompleto(tipo: TipoPeriodo, inicio: string, fim: string): string {
  const base = tipo === "ateData" ? "Até uma data" : PERIODO_LABEL[tipo];
  return `${base}, de ${labelDiaMes(inicio)} a ${labelDiaMes(fim)}`;
}

/** Lobby, pro criador: a sala começa sozinha no dia marcado. */
export function textoLobbyCriador(inicioMarcado: string | null, hoje: string): string {
  const quando = inicioMarcado ? (inicioMarcado === hoje ? "hoje" : labelDiaPorExtenso(inicioMarcado)) : null;
  return quando
    ? `A sala começa sozinha ${quando === "hoje" ? "hoje" : `em ${quando}`}, e até lá o grupo vai chegando e se propondo. Se todo mundo já estiver aqui e com vontade de começar, você pode largar agora.`
    : "Quando o grupo estiver aqui e com vontade de começar, é só largar.";
}

export const BOTAO_LARGAR_AGORA = "LARGAR AGORA";

// ---- Entrar na sala e se propor (o compromisso) ----

/** O ritual em uma frase (CONCEITO.md): base da Home, do onboarding e da entrada. */
export const RITUAL =
  "Você combina com amigos quantas coisas boas quer realizar por semana. Quando fizer uma, registra com um toque, e o grupo comemora junto.";

export const ENTRAR_TITULO = "CHEGOU. BORA.";
export const ENTRAR_JANELA_QUEM = "Quem é você?";
export const ENTRAR_ROTULO_NOME = "Seu nome";
export const ENTRAR_PLACEHOLDER_NOME = "Como te chamam?";
export const ENTRAR_ROTULO_EMOJI = "Seu emoji";
export const ENTRAR_JANELA_COMPROMISSO = "A que você se propõe";
export const ROTULO_META = "Quantas coisas boas você quer realizar por semana?";
export const EXPLICA_META =
  "Pense no seu ritmo de verdade, não no ideal. Esse é o número que você está se propondo a bater em cada semana do desafio, e qualquer coisa que te faça bem conta.";
export const META_OUTRO = "Outro número";
export const PLACEHOLDER_META_OUTRO = "De 1 a 30";
export const ROTULO_FOCO = "Tem algum foco nesse período? (se quiser)";
export const PLACEHOLDER_FOCO = "Ex: voltar a treinar, estudar pro concurso";
export const EXPLICA_FOCO =
  "Se tem uma área que você quer priorizar, escreva aqui. O grupo vê o seu foco e comemora quando você avança nele. Quanto do que você fez foi no foco, só você vê.";
export const EXEMPLOS_TITULO = "Vale como coisa boa, por exemplo:";
export const EXEMPLOS_REALIZACAO = [
  "malhar",
  "ler 20 páginas",
  "tomar uma decisão que vinha adiando",
  "resolver uma pendência",
  "ligar pra família",
  "cozinhar pra semana",
  "organizar algo da casa",
  "estudar",
];
export const ENTRAR_BOTAO = "Entrar e me propor";
export const ENTRAR_RODANDO =
  "O desafio já está rolando. Você começa a contar a partir de hoje, e as semanas que já passaram não pesam pra você.";
export const ENTRAR_ENCERRADA =
  "Esse desafio já terminou, então não dá mais pra entrar nele. Aqui embaixo dá pra ver como foi pro grupo.";

export const ERRO_ENTRAR_SALA_ENCERRADA =
  "Esse desafio já terminou, então não dá mais pra entrar nele. Dá pra ver como foi pro grupo nessa mesma página.";
export const ERRO_COMPROMISSO_CONGELADO =
  "O desafio já começou, então o seu compromisso fica valendo do jeito que você se propôs, até o fim.";
export const ERRO_COMPROMISSO: Record<"meta" | "focoGrande" | "nome" | "nomeGrande" | "emoji", string> = {
  meta: "Escolhe quantas coisas boas por semana você quer realizar, de 1 a 30.",
  focoGrande: "O foco ficou grande, tenta resumir em até 60 letras.",
  nome: "Escolhe um nome, é assim que o grupo vai te ver.",
  nomeGrande: "Nome muito grande, até 30 letras.",
  emoji: "Escolhe um emoji da lista.",
};

/** "5 coisas boas por semana" (o compromisso). */
export function labelMetaSemanal(meta: number): string {
  return meta === 1 ? "1 coisa boa por semana" : `${meta} coisas boas por semana`;
}

/** "5 por semana" (lista curta de quem chegou). */
export function labelMetaCurta(meta: number): string {
  return `${meta} por semana`;
}

/** "foco: voltar a treinar" (público, é parte do que a pessoa se propôs). */
export function labelFoco(foco: string): string {
  return `foco: ${foco}`;
}

export const LOBBY_JANELA_COMPROMISSO = "Seu compromisso";
export const LOBBY_SEM_FOCO = "Sem foco definido, tudo que te fizer bem conta igual.";
export const LOBBY_EXPLICA_COMPROMISSO =
  "Até a largada dá pra ajustar. Quando o desafio começar, esse compromisso fica valendo até o fim, do jeito que você se propôs.";
export const LOBBY_AJUSTAR = "Ajustar";
export const LOBBY_FECHAR_AJUSTE = "Fechar";
export const LOBBY_SALVAR_AJUSTE = "Salvar compromisso";
export const LOBBY_QUEM_CHEGOU = "Quem já chegou";

// ---- Sala criada ----

export const SUCESSO_TITULO = "SALA CRIADA.";
export const SUCESSO_TEXTO =
  "Agora é só mandar o link no grupo. Quem abrir entra na sala e se propõe também, e no dia marcado o desafio começa sozinho.";

/** "Começa sozinha seg, 5 out" (ou "hoje"). */
export function labelComecaEm(dia: string, hoje: string): string {
  return dia === hoje ? "Hoje" : labelDiaPorExtenso(dia);
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

/** "16/09 a 22/09": período real do desafio, no cabeçalho da sala
 * encerrada (datas YYYY-MM-DD, fuso de Brasília). Sem travessão (MOOD). */
export function labelPeriodo(inicio: string, fim: string): string {
  return `${diaCurto(inicio)} a ${diaCurto(fim)}`;
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



/** Rótulo do campo de título no lobby: a 1ª missão e as seguintes. */
export function rotuloTituloMissaoLobby(quantasJaTem: number): string {
  return quantasJaTem === 0 ? "A que você se propõe nesse desafio?" : "A que mais você quer se propor?";
}

export const BOTAO_ASSUMIR_MISSAO = "Assumir esta missão";


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
