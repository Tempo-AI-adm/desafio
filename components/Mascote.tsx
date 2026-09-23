// Mascote pixel art (STYLE.md "Mascote"): monstrinho quadriculado,
// deadpan, ciano com olhos e boca cor de tinta. Por enquanto só no
// botão de reação do feed. "c" = corpo, "k" = olho/boca; o contorno de
// 1 pixel cor de tinta é calculado em volta, igual ao foguinho.
const DESENHO = [
  "c.....c",
  "ccccccc",
  "ckcccck",
  "ccccccc",
  "cckkkcc",
  "ccccccc",
  "c.c.c.c",
];

const LARGURA = DESENHO[0].length + 2;
const ALTURA = DESENHO.length + 2;
const GRADE: string[][] = Array.from({ length: ALTURA }, (_, y) =>
  Array.from({ length: LARGURA }, (_, x) => DESENHO[y - 1]?.[x - 1] ?? "."),
);
const cheio = (x: number, y: number) => GRADE[y]?.[x] !== undefined && GRADE[y][x] !== ".";
const PIXELS = GRADE.flatMap((linha, y) =>
  linha.map((c, x) => {
    if (c !== ".") return { x, y, cor: c === "k" ? "var(--color-ink)" : "var(--color-cyan)" };
    const vizinho = cheio(x - 1, y) || cheio(x + 1, y) || cheio(x, y - 1) || cheio(x, y + 1);
    return vizinho ? { x, y, cor: "var(--color-ink)" } : null;
  }),
).filter((p) => p !== null);

export function Mascote({ altura = 18 }: { altura?: number }) {
  return (
    <svg
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      width={(altura * LARGURA) / ALTURA}
      height={altura}
      shapeRendering="crispEdges"
      aria-hidden
      className="inline-block shrink-0"
    >
      {PIXELS.map((p) => (
        <rect key={`${p.x}-${p.y}`} x={p.x} y={p.y} width={1} height={1} fill={p.cor} />
      ))}
    </svg>
  );
}
