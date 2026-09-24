import { Estrela } from "@/components/Estrela";

// Quantas bolinhas de bônus desenhar no máximo; passou disso, vira "+N".
const MAX_BOLINHAS_BONUS = 5;

/**
 * Progresso de um inegociável: bolinhas (●●○) se tem alvo; check
 * "cumpri" se não tem alvo. Passou do alvo: continua enchendo bolinhas
 * em coral (bônus, âmbar = combinado) + a estrelinha de bônus ao lado.
 * `sobreAmbar`: bolinhas do combinado cor de tinta, senão somem no
 * fundo âmbar (botão na janela de desfazer).
 */
export function ProgressoInegociavel({
  alvo,
  progresso,
  sobreAmbar = false,
}: {
  alvo: number | null;
  progresso: number;
  sobreAmbar?: boolean;
}) {
  if (alvo) {
    const bonus = Math.max(0, progresso - alvo);
    return (
      <span className="flex shrink-0 items-center gap-1">
        <span aria-hidden className="tracking-widest">
          <span className={sobreAmbar ? "text-ink" : "text-amber"}>
            {Array.from({ length: alvo }, (_, idx) => (idx < Math.min(progresso, alvo) ? "●" : "○")).join("")}
          </span>
          {bonus > 0 ? <span className="text-coral">{"●".repeat(Math.min(bonus, MAX_BOLINHAS_BONUS))}</span> : null}
        </span>
        {bonus > MAX_BOLINHAS_BONUS ? <span className="text-[10px] font-bold text-coral">+{bonus - MAX_BOLINHAS_BONUS}</span> : null}
        {bonus > 0 ? <Estrela tamanho={14} /> : null}
      </span>
    );
  }
  const cumpriu = progresso > 0;
  return (
    <span className={`shrink-0 ${cumpriu ? `font-bold ${sobreAmbar ? "text-ink" : "text-green"}` : "text-ink/40"}`}>
      {cumpriu ? "✓ cumpri" : "○"}
    </span>
  );
}
