import { Estrela } from "@/components/Estrela";
import { Janela } from "@/components/Janela";
import { Mascote } from "@/components/Mascote";
import { HOME_EXEMPLO } from "@/lib/copy";

/**
 * Card decorativo da Home ("Ver um exemplo do resultado final"): dados
 * FIXOS de exemplo (lib/copy.ts), não ligados ao banco nem à tela de
 * encerramento (que ainda não existe). Rótulo "exemplo" pra ninguém
 * achar que é real.
 */
export function ExemploResultado() {
  return (
    <Janela
      titulo={
        <>
          <span>{HOME_EXEMPLO.titulo}</span>
          <span className="border border-cream/60 px-1.5 text-[10px] normal-case tracking-normal text-cream/80">
            {HOME_EXEMPLO.rotulo}
          </span>
        </>
      }
    >
      <div className="flex flex-col gap-3 text-left font-mono">
        <div>
          <p className="font-press text-xs uppercase leading-[1.6]">{HOME_EXEMPLO.sala}</p>
          <p className="text-xs text-ink/60">{HOME_EXEMPLO.resumo}</p>
        </div>
        <div className="border-t-2 border-empty pt-3">
          <p className="flex items-center justify-between text-sm font-bold">
            <span>{HOME_EXEMPLO.pessoa}</span>
            <span className="bg-amber px-1.5 py-0.5 text-[10px] tracking-widest">{HOME_EXEMPLO.selo}</span>
          </p>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-4 text-center font-bold text-green">✓</span>
              {HOME_EXEMPLO.missoes}
            </li>
            <li className="flex items-center gap-2">
              <Estrela tamanho={16} />
              {HOME_EXEMPLO.bonus}
            </li>
            <li className="flex items-center gap-2">
              <Mascote altura={16} />
              {HOME_EXEMPLO.reacoes}
            </li>
          </ul>
        </div>
      </div>
    </Janela>
  );
}
