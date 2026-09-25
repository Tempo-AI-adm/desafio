"use client";

import { ComLegenda } from "@/components/ComLegenda";
import {
  LEGENDA_FOGO,
  labelComemoracaoPorContagemDoDia,
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

/** Só o desenho do foguinho (sem toque), também usado no chip "dias em
 * chamas" do resultado. `respirar`: pulsação leve em loop. */
export function FogoIcone({
  nivel,
  altura,
  respirar = false,
}: {
  nivel: 1 | 2;
  altura: number;
  respirar?: boolean;
}) {
  const cores: Record<string, string> = {
    contorno: "var(--color-ink)",
    "#": nivel === 2 ? "var(--color-coral)" : "var(--color-amber)",
    o: "var(--color-amber)",
  };
  return (
    <svg
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      width={(altura * LARGURA) / ALTURA}
      height={altura}
      shapeRendering="crispEdges"
      aria-hidden
      className={`shrink-0 ${respirar ? "origin-bottom motion-safe:animate-[respirar_1.1s_ease-in-out_infinite]" : ""}`}
    >
      {PIXELS.map((p) => (
        <rect key={`${p.x}-${p.y}`} x={p.x} y={p.y} width={1} height={1} fill={cores[p.tipo]} />
      ))}
    </svg>
  );
}

/**
 * Foguinho ao lado do nome, pela contagem do dia. Tocar mostra a
 * legenda ("2 ou mais no mesmo dia = dia em chamas."), que some sozinha.
 */
export function Fogo({
  contagemHoje,
  tamanho = "normal",
}: {
  contagemHoje: number;
  tamanho?: keyof typeof ALTURAS;
}) {
  const nivel = nivelFogoPorContagemDoDia(contagemHoje);
  if (nivel === 0) return null;

  return (
    <ComLegenda legenda={LEGENDA_FOGO} rotulo={labelComemoracaoPorContagemDoDia(contagemHoje)}>
      <FogoIcone nivel={nivel} altura={ALTURAS[tamanho][nivel]} respirar />
    </ComLegenda>
  );
}
