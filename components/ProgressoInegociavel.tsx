/**
 * Progresso de um inegociável: bolinhas (●●○) se tem alvo, com "+N
 * extra" quando estourou; check "cumpri" se não tem alvo.
 * `sobreAmbar`: bolinhas cor de tinta, senão somem no fundo âmbar.
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
    return (
      <span className="flex shrink-0 items-center gap-1">
        <span aria-hidden className={`tracking-widest ${sobreAmbar ? "text-ink" : "text-amber"}`}>
          {Array.from({ length: alvo }, (_, idx) => (idx < Math.min(progresso, alvo) ? "●" : "○")).join("")}
        </span>
        {progresso > alvo ? <span className="text-xs text-ink/60">+{progresso - alvo} extra</span> : null}
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
