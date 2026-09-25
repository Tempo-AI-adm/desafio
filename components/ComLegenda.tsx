"use client";

import { useState, type ReactNode } from "react";

/**
 * Insígnia tocável: tocar mostra uma legenda curta ao lado, que some
 * sozinha (mesma animação do selo de comemoração). Sem modal, sem
 * navegar. Pista de "dá pra tocar", igual em todo lugar: cursor de mão
 * no desktop e contorno TRACEJADO (visível no celular também).
 * `chip`: o chip inteiro é o botão (borda tracejada no lugar da cheia);
 * sem `chip`: só o ícone, com um contorno tracejado fino em volta.
 */
export function ComLegenda({
  legenda,
  rotulo,
  chip = false,
  children,
}: {
  legenda: string;
  /** texto pro leitor de tela, além da legenda */
  rotulo?: string;
  chip?: boolean;
  children: ReactNode;
}) {
  const [carimbo, setCarimbo] = useState<number | null>(null);

  return (
    <span className="relative inline-flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={() => setCarimbo(Date.now())}
        aria-label={rotulo ? `${rotulo}. ${legenda}` : legenda}
        className={
          chip
            ? "flex cursor-pointer items-center gap-1 border-2 border-dashed border-ink bg-cream px-2 py-1 font-mono text-xs font-bold"
            : "inline-flex shrink-0 cursor-pointer p-0.5 outline-1 outline-offset-0 outline-ink/40 outline-dashed"
        }
      >
        {children}
      </button>
      {carimbo ? (
        <span
          key={carimbo}
          onAnimationEnd={() => setCarimbo(null)}
          className="w-max max-w-[11rem] animate-[comemoracao-sumir_2.2s_ease-out_forwards] border-2 border-ink bg-amber px-1.5 py-0.5 font-mono text-[10px] font-bold normal-case tracking-normal text-ink"
        >
          {legenda}
        </span>
      ) : null}
    </span>
  );
}
