import type { ReactNode } from "react";

// Link pequeno e discreto que abre/fecha um bloco (accordion com
// <details>: sem JS, sem navegar). A seta gira quando está aberto.
// Mesmo padrão na Home ("Como funciona") e na sala encerrada.
export const RESUMO_LINK =
  "flex cursor-pointer list-none items-center justify-center gap-1.5 font-mono text-xs font-bold text-ink/70 [&::-webkit-details-marker]:hidden";
// Sublinhado só no texto: na seta ele giraria junto.
export const RESUMO_TEXTO = "underline decoration-ink/30 underline-offset-4";

/** Bloco fechado por padrão com rótulo + "↓" (gira ao abrir). */
export function Expansivel({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <details className="group">
      <summary className={RESUMO_LINK}>
        <span className={RESUMO_TEXTO}>{rotulo}</span>
        <span aria-hidden className="inline-block transition-transform group-open:rotate-180">
          ↓
        </span>
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}
