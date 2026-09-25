import { LinhaEncerrado } from "@/components/LinhaEncerrado";
import { ResultadoFinal } from "@/components/ResultadoFinal";
import { HOME_EXEMPLO } from "@/lib/copy";

/**
 * Card decorativo da Home ("Ver um exemplo do resultado final"): dados
 * FIXOS de exemplo (lib/copy.ts), não ligados ao banco. Mesmo layout
 * da sala encerrada de verdade (components/ResultadoFinal.tsx). Rótulo
 * "exemplo" pra ninguém achar que é real. Como a Home não tem o
 * cabeçalho "SALA", o topo do card faz esse papel (nome + linha de
 * encerrado, igual ao cabeçalho da sala real).
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
      cabecalho={
        <div className="flex flex-col gap-2 border-b-2 border-empty pb-3">
          <p className="font-press text-xs uppercase leading-[1.6]">{HOME_EXEMPLO.sala}</p>
          <LinhaEncerrado
            periodo={HOME_EXEMPLO.periodo}
            duracaoDias={HOME_EXEMPLO.duracaoDias}
            pessoas={HOME_EXEMPLO.pessoas.length}
          />
        </div>
      }
      grupo={HOME_EXEMPLO.grupo}
      pessoas={HOME_EXEMPLO.pessoas.map((p) => ({ ...p, id: p.nome }))}
      meuId={HOME_EXEMPLO.voce}
    />
  );
}
