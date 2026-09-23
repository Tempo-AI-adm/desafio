/**
 * Progresso de um inegociável: bolinhas (●●○) se tem alvo, com "+N
 * extra" quando estourou; check "cumpri" se não tem alvo.
 */
export function ProgressoInegociavel({ alvo, progresso }: { alvo: number | null; progresso: number }) {
  if (alvo) {
    return (
      <span className="flex shrink-0 items-center gap-1">
        <span aria-hidden className="text-amber tracking-widest">
          {Array.from({ length: alvo }, (_, idx) => (idx < Math.min(progresso, alvo) ? "●" : "○")).join("")}
        </span>
        {progresso > alvo ? <span className="text-xs text-ink/60">+{progresso - alvo} extra</span> : null}
      </span>
    );
  }
  const cumpriu = progresso > 0;
  return (
    <span className={`shrink-0 ${cumpriu ? "font-bold text-green" : "text-ink/40"}`}>
      {cumpriu ? "✓ cumpri" : "○"}
    </span>
  );
}
