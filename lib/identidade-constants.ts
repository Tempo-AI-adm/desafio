// Constantes puras (sem lógica de servidor), seguras pra importar
// tanto em Server Components/Actions quanto em Client Components.

// Lista curta fixa de emojis de identidade (avatar da pessoa, não
// confundir com o chip de "assunto" do PRD, que é outra lista, fixa
// separadamente).
export const EMOJIS_IDENTIDADE = [
  "🦊",
  "🐼",
  "🐸",
  "🦁",
  "🐧",
  "🐙",
  "🦖",
  "🐝",
  "🦉",
  "🐢",
  "👽",
  "👾",
] as const;
