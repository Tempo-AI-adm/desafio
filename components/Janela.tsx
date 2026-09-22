import type { ReactNode } from "react";

/**
 * "Janela" — o bloco base do STYLE.md: barra de título tinta + corpo
 * creme com borda dura e sombra sólida deslocada. Zero gradiente,
 * zero canto arredondado.
 */
export function Janela({
  titulo,
  children,
  className = "",
}: {
  titulo: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-2 border-ink bg-cream shadow-hard ${className}`}>
      <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-3 py-2 font-mono text-xs font-bold uppercase tracking-widest text-cream">
        {titulo}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}
