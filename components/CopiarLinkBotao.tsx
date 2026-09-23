"use client";

import { useState } from "react";

export function CopiarLinkBotao({ texto }: { texto: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Sem permissão de clipboard (ex: http sem TLS), sem drama, só ignora.
    }
  }

  return (
    <button
      type="button"
      onClick={copiar}
      className="border-2 border-ink bg-cyan px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest shadow-hard transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
    >
      {copiado ? "Copiado!" : "Copiar link"}
    </button>
  );
}
