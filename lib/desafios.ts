// Persistência real via Supabase (tabela `desafios`, ver
// supabase/schema.sql). Mesmos nomes e formas de função de quando
// isso era um mock em memória, só ficaram assíncronas, porque agora
// é uma chamada de rede de verdade. Só é importado por Server
// Actions e Server Components, então nunca vai pro bundle do
// navegador.

import { supabase } from "./supabase";
import { codigoValido, ehUuid } from "./validacao";
import { duracaoNaLargadaAntecipada } from "./periodo";
import { desafioVenceu, hojeISO, meiaNoiteDeBrasilia } from "./tempo";

export type EstadoDesafio = "lobby" | "ativo" | "encerrado";

export type Desafio = {
  id: string;
  codigo: string;
  nome: string;
  duracaoDias: number;
  /** dia em que a sala larga sozinha (YYYY-MM-DD); nulo em sala antiga */
  dataInicioMarcada: string | null;
  estado: EstadoDesafio;
  criadorParticipanteId: string | null;
  dataInicio: string | null;
  criadoEm: string;
};

type LinhaDesafio = {
  id: string;
  codigo: string;
  nome: string;
  duracao_dias: number;
  data_inicio_marcada: string | null;
  estado: EstadoDesafio;
  criador_participante_id: string | null;
  data_inicio: string | null;
  criado_em: string;
};

function paraDesafio(linha: LinhaDesafio): Desafio {
  return {
    id: linha.id,
    codigo: linha.codigo,
    nome: linha.nome,
    duracaoDias: linha.duracao_dias,
    dataInicioMarcada: linha.data_inicio_marcada,
    estado: linha.estado,
    criadorParticipanteId: linha.criador_participante_id,
    dataInicio: linha.data_inicio,
    criadoEm: linha.criado_em,
  };
}

// Sem caracteres ambíguos (0/O, 1/I/L) pra ficar fácil de digitar o código.
const ALFABETO_CODIGO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function gerarCodigoAleatorio(): string {
  return Array.from(
    { length: 6 },
    () => ALFABETO_CODIGO[Math.floor(Math.random() * ALFABETO_CODIGO.length)],
  ).join("");
}

export async function criarDesafio(dados: {
  nome: string;
  duracaoDias: number;
  /** dia em que a sala larga sozinha */
  dataInicioMarcada: string;
}): Promise<Desafio> {
  // O código tem que ser único (constraint no banco). Em vez de
  // checar antes (o que ainda deixaria uma corrida possível), tenta
  // inserir e, se colidir (código raríssimo dado o tamanho do
  // alfabeto), gera outro e tenta de novo.
  for (let tentativa = 0; tentativa < 5; tentativa++) {
    const { data, error } = await supabase
      .from("desafios")
      .insert({
        codigo: gerarCodigoAleatorio(),
        nome: dados.nome,
        duracao_dias: dados.duracaoDias,
        data_inicio_marcada: dados.dataInicioMarcada,
      })
      .select()
      .single();

    if (!error) return paraDesafio(data as LinhaDesafio);
    if (error.code !== "23505") {
      // 23505 = unique_violation no Postgres, qualquer outro erro não adianta tentar de novo.
      throw new Error(`Erro ao criar desafio: ${error.message}`);
    }
  }
  throw new Error("Não consegui gerar um código único pro desafio. Tenta de novo.");
}

/** Busca a sala pelo código. Também é aqui que o encerramento por data
 * acontece (sem job agendado): se a sala está "ativo" e já passou do
 * último dia, vira "encerrado" nesse momento. Toda leitura de sala do
 * app passa por aqui (páginas, APIs e ações), então ninguém vê nem
 * registra numa sala vencida como se ainda estivesse rolando. */
export async function buscarDesafioPorCodigo(codigo: string): Promise<Desafio | undefined> {
  // Fora do formato (6 letras do alfabeto) nem consulta o banco.
  const alvo = codigoValido(codigo);
  if (!alvo) return undefined;
  const { data, error } = await supabase.from("desafios").select().eq("codigo", alvo).maybeSingle();

  if (error) throw new Error(`Erro ao buscar desafio por código: ${error.message}`);
  if (!data) return undefined;
  return encerrarSeVenceu(await largarSeChegouODia(paraDesafio(data as LinhaDesafio)));
}

/** lobby -> ativo quando chega a data de início marcada (sem job
 * agendado, igual ao encerramento: na primeira busca a partir desse
 * dia). O início conta da meia-noite de Brasília do dia marcado, pras
 * semanas começarem nele. Idempotente pelo `.eq("estado", "lobby")`. */
async function largarSeChegouODia(desafio: Desafio): Promise<Desafio> {
  if (desafio.estado !== "lobby" || !desafio.dataInicioMarcada) return desafio;
  if (hojeISO() < desafio.dataInicioMarcada) return desafio;

  const dataInicio = meiaNoiteDeBrasilia(desafio.dataInicioMarcada);
  const { data, error } = await supabase
    .from("desafios")
    .update({ estado: "ativo", data_inicio: dataInicio })
    .eq("id", desafio.id)
    .eq("estado", "lobby")
    .select()
    .maybeSingle();

  if (error) throw new Error(`Erro ao largar na data marcada: ${error.message}`);
  // Outra busca ao mesmo tempo já largou: relê como está.
  if (!data) return (await buscarDesafioPorId(desafio.id)) ?? desafio;
  return paraDesafio(data as LinhaDesafio);
}

/** ativo -> encerrado quando a data passou. O `.eq("estado", "ativo")`
 * no UPDATE deixa isso idempotente (duas buscas ao mesmo tempo não
 * brigam). Devolve a sala já com o estado certo. */
async function encerrarSeVenceu(desafio: Desafio): Promise<Desafio> {
  if (desafio.estado !== "ativo" || !desafio.dataInicio) return desafio;
  if (!desafioVenceu(desafio.dataInicio, desafio.duracaoDias)) return desafio;

  const { error } = await supabase
    .from("desafios")
    .update({ estado: "encerrado" })
    .eq("id", desafio.id)
    .eq("estado", "ativo");

  if (error) throw new Error(`Erro ao encerrar desafio: ${error.message}`);
  return { ...desafio, estado: "encerrado" };
}

export async function buscarDesafioPorId(id: string): Promise<Desafio | undefined> {
  if (!ehUuid(id)) return undefined;
  const { data, error } = await supabase.from("desafios").select().eq("id", id).maybeSingle();

  if (error) throw new Error(`Erro ao buscar desafio por id: ${error.message}`);
  return data ? paraDesafio(data as LinhaDesafio) : undefined;
}

/** Marca o criador só se ainda não tiver um, o primeiro a reivindicar
 * com a "flag de criador" (ver components/MarcarCriadorDoDesafio) vence.
 * O `.is(..., null)` na cláusula garante isso direto no UPDATE, sem
 * corrida entre ler e escrever. */
export async function definirCriadorSeVazio(
  desafioId: string,
  participanteId: string,
): Promise<void> {
  const { error } = await supabase
    .from("desafios")
    .update({ criador_participante_id: participanteId })
    .eq("id", desafioId)
    .is("criador_participante_id", null);

  if (error) throw new Error(`Erro ao definir criador: ${error.message}`);
}

/** LARGAR: lobby -> ativo, registra data de início. Idempotente, se
 * já não estiver em lobby (ex: dois cliques em corrida), o UPDATE não
 * casa linha nenhuma e só devolvemos o desafio como já está. */
export async function largarDesafio(desafio: Desafio): Promise<Desafio | undefined> {
  // Largada antes da data marcada: "até uma data" mantém o fim na data
  // escolhida (a duração cresce); os atalhos mantêm a duração.
  const duracaoDias = desafio.dataInicioMarcada
    ? duracaoNaLargadaAntecipada({
        inicioMarcado: desafio.dataInicioMarcada,
        duracaoDias: desafio.duracaoDias,
        hojeDaLargada: hojeISO(),
      })
    : desafio.duracaoDias;
  const desafioId = desafio.id;
  const { data, error } = await supabase
    .from("desafios")
    .update({ estado: "ativo", data_inicio: new Date().toISOString(), duracao_dias: duracaoDias })
    .eq("id", desafioId)
    .eq("estado", "lobby")
    .select()
    .maybeSingle();

  if (error) throw new Error(`Erro ao largar desafio: ${error.message}`);
  if (data) return paraDesafio(data as LinhaDesafio);
  return buscarDesafioPorId(desafioId);
}
