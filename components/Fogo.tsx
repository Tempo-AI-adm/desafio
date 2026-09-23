import { labelComemoracaoPorContagemDoDia, nivelFogoPorContagemDoDia } from "@/lib/copy";

// Foguinho pixel art (grade 7x9). "#" = chama, "o" = miolo.
// Nível 1 (2ª realização do dia): só âmbar. Nível 2 (3ª ou mais):
// maior, chama coral com miolo âmbar. Em volta ganha um contorno de
// 1 pixel cor de tinta (calculado abaixo), senão o âmbar some no creme.
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

const LARGURA = DESENHO[0].length + 2;
const ALTURA = DESENHO.length + 2;

// Grade com 1 pixel de folga em volta: chama, miolo e contorno.
const GRADE: string[][] = Array.from({ length: ALTURA }, (_, y) =>
  Array.from({ length: LARGURA }, (_, x) => DESENHO[y - 1]?.[x - 1] ?? "."),
);
const cheio = (x: number, y: number) => GRADE[y]?.[x] !== undefined && GRADE[y][x] !== ".";
const PIXELS = GRADE.flatMap((linha, y) =>
  linha.map((c, x) => {
    if (c !== ".") return { x, y, tipo: c };
    const vizinho = cheio(x - 1, y) || cheio(x + 1, y) || cheio(x, y - 1) || cheio(x, y + 1);
    return vizinho ? { x, y, tipo: "contorno" } : null;
  }),
).filter((p) => p !== null);

export function Fogo({ contagemHoje }: { contagemHoje: number }) {
  const nivel = nivelFogoPorContagemDoDia(contagemHoje);
  if (nivel === 0) return null;

  const cores: Record<string, string> = {
    contorno: "var(--color-ink)",
    "#": nivel === 2 ? "var(--color-coral)" : "var(--color-amber)",
    o: "var(--color-amber)",
  };
  const altura = nivel === 2 ? 34 : 24;
  const texto = labelComemoracaoPorContagemDoDia(contagemHoje);

  return (
    <svg
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      width={(altura * LARGURA) / ALTURA}
      height={altura}
      shapeRendering="crispEdges"
      role="img"
      aria-label={texto}
      className="inline-block shrink-0"
    >
      <title>{texto}</title>
      {PIXELS.map((p) => (
        <rect key={`${p.x}-${p.y}`} x={p.x} y={p.y} width={1} height={1} fill={cores[p.tipo]} />
      ))}
    </svg>
  );
}
