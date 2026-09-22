// Persistência real via Supabase (tabela `desafios`, ver
// supabase/schema.sql). Mesmos nomes e formas de função de quando
// isso era um mock em memória — só ficaram assíncronas, porque agora
// é uma chamada de rede de verdade. Só é importado por Server
// Actions e Server Components, então nunca vai pro bundle do
// navegador.

import { supabase } from "./supabase";

export type EstadoDesafio = "lobby" | "ativo" | "encerrado";

export type Desafio = {
  id: string;
  codigo: string;
  nome: string;
  duracaoDias: number;
  permiteBackfill: boolean;
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
  permite_backfill: boolean;
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
    permiteBackfill: linha.permite_backfill,
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
  permiteBackfill: boolean;
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
        permite_backfill: dados.permiteBackfill,
      })
      .select()
      .single();

    if (!error) return paraDesafio(data as LinhaDesafio);
    if (error.code !== "23505") {
      // 23505 = unique_violation no Postgres — qualquer outro erro não adianta tentar de novo.
      throw new Error(`Erro ao criar desafio: ${error.message}`);
    }
  }
  throw new Error("Não consegui gerar um código único pro desafio. Tenta de novo.");
}

export async function buscarDesafioPorCodigo(codigo: string): Promise<Desafio | undefined> {
  const alvo = codigo.trim().toUpperCase();
  const { data, error } = await supabase.from("desafios").select().eq("codigo", alvo).maybeSingle();

  if (error) throw new Error(`Erro ao buscar desafio por código: ${error.message}`);
  return data ? paraDesafio(data as LinhaDesafio) : undefined;
}

export async function buscarDesafioPorId(id: string): Promise<Desafio | undefined> {
  const { data, error } = await supabase.from("desafios").select().eq("id", id).maybeSingle();

  if (error) throw new Error(`Erro ao buscar desafio por id: ${error.message}`);
  return data ? paraDesafio(data as LinhaDesafio) : undefined;
}

/** Marca o criador só se ainda não tiver um — o primeiro a reivindicar
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

/** LARGAR: lobby -> ativo, registra data de início. Idempotente — se
 * já não estiver em lobby (ex: dois cliques em corrida), o UPDATE não
 * casa linha nenhuma e só devolvemos o desafio como já está. */
export async function largarDesafio(desafioId: string): Promise<Desafio | undefined> {
  const { data, error } = await supabase
    .from("desafios")
    .update({ estado: "ativo", data_inicio: new Date().toISOString() })
    .eq("id", desafioId)
    .eq("estado", "lobby")
    .select()
    .maybeSingle();

  if (error) throw new Error(`Erro ao largar desafio: ${error.message}`);
  if (data) return paraDesafio(data as LinhaDesafio);
  return buscarDesafioPorId(desafioId);
}
