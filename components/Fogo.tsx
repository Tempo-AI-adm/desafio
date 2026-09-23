"use client";

import { useState } from "react";
import {
  labelComemoracaoPorContagemDoDia,
  legendaFogo,
  nivelFogoPorContagemDoDia,
} from "@/lib/copy";

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

// Alturas em px. "compacto" é pra linha do feed, onde o normal pesa.
const ALTURAS = {
  normal: { 1: 24, 2: 34 },
  compacto: { 1: 18, 2: 24 },
} as const;

/**
 * Tocar no foguinho mostra uma legenda curta ("3+ realizações hoje")
 * ao lado, que some sozinha (mesma animação do selo de comemoração).
 * Sem modal, sem navegar.
 */
export function Fogo({
  contagemHoje,
  tamanho = "normal",
}: {
  contagemHoje: number;
  tamanho?: keyof typeof ALTURAS;
}) {
  const [legendaCarimbo, setLegendaCarimbo] = useState<number | null>(null);
  const nivel = nivelFogoPorContagemDoDia(contagemHoje);
  if (nivel === 0) return null;

  const cores: Record<string, string> = {
    contorno: "var(--color-ink)",
    "#": nivel === 2 ? "var(--color-coral)" : "var(--color-amber)",
    o: "var(--color-amber)",
  };
  const altura = ALTURAS[tamanho][nivel];
  const texto = labelComemoracaoPorContagemDoDia(contagemHoje);

  return (
    <span className="relative inline-flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={() => setLegendaCarimbo(Date.now())}
        aria-label={`${texto} ${legendaFogo(contagemHoje)}`}
        className="inline-flex shrink-0 p-0.5"
      >
        <svg
          viewBox={`0 0 ${LARGURA} ${ALTURA}`}
          width={(altura * LARGURA) / ALTURA}
          height={altura}
          shapeRendering="crispEdges"
          aria-hidden
        >
          {PIXELS.map((p) => (
            <rect key={`${p.x}-${p.y}`} x={p.x} y={p.y} width={1} height={1} fill={cores[p.tipo]} />
          ))}
        </svg>
      </button>
      {legendaCarimbo ? (
        <span
          key={legendaCarimbo}
          onAnimationEnd={() => setLegendaCarimbo(null)}
          className="animate-[comemoracao-sumir_2.2s_ease-out_forwards] whitespace-nowrap border-2 border-ink bg-amber px-1.5 py-0.5 font-mono text-[10px] font-bold normal-case tracking-normal text-ink"
        >
          {legendaFogo(contagemHoje)}
        </span>
      ) : null}
    </span>
  );
}
