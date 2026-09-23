import { labelComemoracaoPorContagemDoDia, nivelFogoPorContagemDoDia } from "@/lib/copy";

// Foguinho pixel art (grade 7x9). "#" = contorno da chama, "o" = miolo.
// Nível 1 (2ª realização do dia): pequeno, só âmbar. Nível 2 (3ª ou
// mais): maior, chama coral com miolo âmbar.
const DESENHO = [
  "...#...",
  "..##...",
  "..###..",
  ".####.#",
  ".###o##",
  "###ooo#",
  "##ooo##",
  "##ooo##",
  ".#####.",
];

export function Fogo({ contagemHoje }: { contagemHoje: number }) {
  const nivel = nivelFogoPorContagemDoDia(contagemHoje);
  if (nivel === 0) return null;

  const corFora = nivel === 2 ? "var(--color-coral)" : "var(--color-amber)";
  const corMiolo = "var(--color-amber)";
  const tamanho = nivel === 2 ? 22 : 14;
  const texto = labelComemoracaoPorContagemDoDia(contagemHoje);

  return (
    <svg
      viewBox="0 0 7 9"
      width={(tamanho * 7) / 9}
      height={tamanho}
      shapeRendering="crispEdges"
      role="img"
      aria-label={texto}
      className="inline-block shrink-0"
    >
      <title>{texto}</title>
      {DESENHO.flatMap((linha, y) =>
        [...linha].map((c, x) =>
          c === "." ? null : (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={c === "o" ? corMiolo : corFora} />
          ),
        ),
      )}
    </svg>
  );
}
