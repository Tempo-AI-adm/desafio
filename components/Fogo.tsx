"use client";

import { useState } from "react";
import {
  labelComemoracaoPorContagemDoDia,
  legendaFogo,
  nivelFogoPorContagemDoDia,
} from "@/lib/copy";
import { pixelsComContorno } from "@/lib/pixel-art";

// Foguinho pixel art (grade 7x9). "#" = chama, "o" = miolo.
// Nível 1 (2ª realização do dia): só âmbar. Nível 2 (3ª ou mais):
// maior, chama coral com miolo âmbar. Contorno de tinta em volta (ver
// lib/pixel-art.ts).
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

const { largura: LARGURA, altura: ALTURA, pixels: PIXELS } = pixelsComContorno(DESENHO);

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
          className="origin-bottom motion-safe:animate-[respirar_2.4s_ease-in-out_infinite]"
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
