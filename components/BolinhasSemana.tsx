import { ComLegenda } from "@/components/ComLegenda";
import { Estrela } from "@/components/Estrela";
import { LEGENDA_ESTRELA, labelSemana } from "@/lib/copy";

// Quantas bolinhas de bônus desenhar no máximo; passou disso, vira "+N".
const MAX_BOLINHAS_BONUS = 5;

/**
 * "3 de 5 essa semana" em bolinhas (STYLE.md "Bolinhas"): âmbar = feito,
 * vazio = ainda por vir. Passou da meta: bolinhas coral (bônus, até 5 e
 * depois "+N") e a estrelinha, tocável com a legenda. Bônus é festa, não
 * conta a mais em número nenhum.
 */
export function BolinhasSemana({ feitos, meta }: { feitos: number; meta: number }) {
  const bonus = Math.max(0, feitos - meta);
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono">
      <span aria-hidden className="text-lg leading-none tracking-widest">
        <span className="text-amber">{"●".repeat(Math.min(feitos, meta))}</span>
        <span className="text-empty">{"●".repeat(Math.max(0, meta - feitos))}</span>
        {bonus > 0 ? <span className="text-coral">{"●".repeat(Math.min(bonus, MAX_BOLINHAS_BONUS))}</span> : null}
      </span>
      {bonus > MAX_BOLINHAS_BONUS ? (
        <span className="text-[10px] font-bold text-coral">+{bonus - MAX_BOLINHAS_BONUS}</span>
      ) : null}
      {bonus > 0 ? (
        <ComLegenda legenda={LEGENDA_ESTRELA}>
          <Estrela tamanho={14} />
        </ComLegenda>
      ) : null}
      <span className="text-xs font-bold">{labelSemana(feitos, meta)}</span>
    </div>
  );
}
