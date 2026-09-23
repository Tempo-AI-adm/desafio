// Constantes puras (sem lógica de servidor), lista fixa de assuntos
// (PRD.md "Assuntos (chips)"), usada tanto em inegociáveis quanto,
// numa fatia futura, em realizações. Seguras pra importar em Server
// e Client Components.

export const ASSUNTOS = [
  { valor: "treino", emoji: "💪", rotulo: "Treino" },
  { valor: "estudo", emoji: "📚", rotulo: "Estudo" },
  { valor: "trabalho", emoji: "💼", rotulo: "Trabalho" },
  { valor: "comida", emoji: "🍳", rotulo: "Comida" },
  { valor: "tarefa", emoji: "✅", rotulo: "Tarefa" },
  { valor: "outro", emoji: "✨", rotulo: "Outro" },
] as const;

export type AssuntoValor = (typeof ASSUNTOS)[number]["valor"];

export function emojiDoAssunto(valor: string): string {
  return ASSUNTOS.find((a) => a.valor === valor)?.emoji ?? "✨";
}
