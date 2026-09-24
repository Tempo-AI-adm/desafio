import { Estrela } from "@/components/Estrela";
import { Janela } from "@/components/Janela";
import { Mascote } from "@/components/Mascote";
import { HOME_EXEMPLO, labelBonus, labelMissoesCumpridas, labelReacoes } from "@/lib/copy";

/**
 * Card decorativo da Home ("Ver um exemplo do resultado final"): dados
 * FIXOS de exemplo (lib/copy.ts), não ligados ao banco nem à tela de
 * encerramento (que ainda não existe). Mostra o grupo inteiro, inclusive
 * quem ficou pra trás, sem ranking. Rótulo "exemplo" pra ninguém achar
 * que é real. Compacto: 2 linhas por pessoa. Os ícones (✓, estrela,
 * mascote) já separam os números; sem "·", que sobraria no começo da
 * linha quando ela quebra.
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
      <div className="flex flex-col gap-2 text-left font-mono">
        <div>
          <p className="font-press text-xs uppercase leading-[1.6]">{HOME_EXEMPLO.sala}</p>
          <p className="text-xs text-ink/60">{HOME_EXEMPLO.resumo}</p>
        </div>
        <ul>
          {HOME_EXEMPLO.pessoas.map((p) => (
            <li key={p.nome} className="border-t-2 border-empty py-2 last:pb-0">
              <p className="flex items-center justify-between gap-2 text-sm font-bold">
                <span>
                  {p.emoji} {p.nome}
                </span>
                {p.fechou ? (
                  <span className="bg-amber px-1.5 py-0.5 text-[10px] tracking-widest">{HOME_EXEMPLO.seloFechou}</span>
                ) : (
                  <span className="border border-ink/30 px-1.5 py-0.5 text-[10px] font-normal text-ink/60">
                    {HOME_EXEMPLO.seloProxima}
                  </span>
                )}
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-ink/80">
                <span className="flex items-center gap-1">
                  <span className="font-bold text-green">✓</span>
                  {labelMissoesCumpridas(p.missoes)}
                </span>
                {p.bonus > 0 ? (
                  <span className="flex items-center gap-1">
                    <Estrela tamanho={13} />
                    {labelBonus(p.bonus)}
                  </span>
                ) : null}
                {p.reacoes > 0 ? (
                  <span className="flex items-center gap-1">
                    <Mascote altura={13} />
                    {labelReacoes(p.reacoes)}
                  </span>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Janela>
  );
}
