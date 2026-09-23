import type { ReactNode } from "react";

/**
 * "Janela", o bloco base do STYLE.md: barra de título tinta + corpo
 * creme com borda dura e sombra sólida deslocada. Zero gradiente,
 * zero canto arredondado. `compacto` = menos respiro, pra faixas fixas.
 */
export function Janela({
  titulo,
  children,
  className = "",
  compacto = false,
}: {
  titulo: ReactNode;
  children: ReactNode;
  className?: string;
  compacto?: boolean;
}) {
  return (
    <div className={`border-2 border-ink bg-cream shadow-hard ${className}`}>
      <div
        className={`flex items-center justify-between gap-2 border-b-2 border-ink bg-ink px-3 font-mono text-xs font-bold uppercase tracking-widest text-cream ${
          compacto ? "py-1.5" : "py-2"
        }`}
      >
        {titulo}
      </div>
      <div className={compacto ? "p-2" : "p-4 sm:p-5"}>{children}</div>
    </div>
  );
}
