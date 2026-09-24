import { ResultadoFinal } from "@/components/ResultadoFinal";
import { HOME_EXEMPLO } from "@/lib/copy";

/**
 * Card decorativo da Home ("Ver um exemplo do resultado final"): dados
 * FIXOS de exemplo (lib/copy.ts), não ligados ao banco. Mesmo layout
 * da sala encerrada de verdade (components/ResultadoFinal.tsx). Rótulo
 * "exemplo" pra ninguém achar que é real.
 */
export function ExemploResultado() {
  return (
    <ResultadoFinal
      titulo={
        <>
          <span>{HOME_EXEMPLO.titulo}</span>
          <span className="border border-cream/60 px-1.5 text-[10px] normal-case tracking-normal text-cream/80">
            {HOME_EXEMPLO.rotulo}
          </span>
        </>
      }
      sala={HOME_EXEMPLO.sala}
      resumo={HOME_EXEMPLO.resumo}
      pessoas={HOME_EXEMPLO.pessoas.map((p) => ({ ...p, id: p.nome }))}
    />
  );
}
