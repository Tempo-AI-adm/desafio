// Constantes puras (sem lógica de servidor), lista fixa de assuntos
// (PRD.md "Assuntos (chips)"), usada em missões e realizações. Seguras
// pra importar em Server e Client Components.
//
// `valor` é o que fica gravado no banco e NÃO muda (tem check no
// supabase/schema.sql). O que a tela mostra é `rotulo` + `emoji`: por
// isso "treino" aparece como Saúde, "estudo" como Aprendizado e
// "comida" como Lar, inclusive em registros antigos, sem migrar nada.

export const ASSUNTOS = [
  { valor: "treino", emoji: "💪", rotulo: "Saúde" },
  { valor: "estudo", emoji: "📚", rotulo: "Aprendizado" },
  { valor: "trabalho", emoji: "💼", rotulo: "Trabalho" },
  { valor: "comida", emoji: "🏠", rotulo: "Lar" },
  { valor: "tarefa", emoji: "✅", rotulo: "Tarefa" },
  { valor: "outro", emoji: "✨", rotulo: "Outro" },
] as const;

export type AssuntoValor = (typeof ASSUNTOS)[number]["valor"];

export function emojiDoAssunto(valor: string): string {
  return ASSUNTOS.find((a) => a.valor === valor)?.emoji ?? "✨";
}
