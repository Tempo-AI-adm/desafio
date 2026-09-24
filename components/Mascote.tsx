import { pixelsComContorno } from "@/lib/pixel-art";

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

const { largura: LARGURA, altura: ALTURA, pixels } = pixelsComContorno(DESENHO);
const PIXELS = pixels.map((p) => ({ ...p, cor: p.tipo === "c" ? "var(--color-cyan)" : "var(--color-ink)" }));

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
