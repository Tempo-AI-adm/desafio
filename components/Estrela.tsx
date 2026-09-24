import { LABEL_BONUS } from "@/lib/copy";
import { pixelsComContorno } from "@/lib/pixel-art";

// Insígnia de bônus pixel art: estrelinha âmbar com contorno de tinta,
// mesma linguagem do foguinho. Aparece ao lado das bolinhas quando a
// pessoa passou do alvo da missão. Não é botão (fica dentro do botão
// da missão), só símbolo.
const DESENHO = [
  "...#...",
  "...#...",
  "#######",
  ".#####.",
  "..###..",
  ".##.##.",
  "##...##",
];

const { largura, altura, pixels } = pixelsComContorno(DESENHO);

export function Estrela({ tamanho = 16 }: { tamanho?: number }) {
  return (
    <svg
      viewBox={`0 0 ${largura} ${altura}`}
      width={tamanho}
      height={(tamanho * altura) / largura}
      shapeRendering="crispEdges"
      role="img"
      aria-label={LABEL_BONUS}
      className="inline-block shrink-0"
    >
      <title>{LABEL_BONUS}</title>
      {pixels.map((p) => (
        <rect
          key={`${p.x}-${p.y}`}
          x={p.x}
          y={p.y}
          width={1}
          height={1}
          fill={p.tipo === "contorno" ? "var(--color-ink)" : "var(--color-amber)"}
        />
      ))}
    </svg>
  );
}
