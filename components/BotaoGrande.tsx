import Link from "next/link";

const CORES = {
  amber: "bg-amber",
  cyan: "bg-cyan",
} as const;

/**
 * Botão grande estilo fliperama: borda dura + sombra sólida, e no
 * clique "afunda" (some a sombra, desloca 2px) — feedback do STYLE.md.
 */
export function BotaoGrande({
  href,
  label,
  sub,
  cor,
}: {
  href: string;
  label: string;
  sub?: string;
  cor: keyof typeof CORES;
}) {
  return (
    <Link
      href={href}
      className={`block border-2 border-ink px-5 py-6 text-center shadow-hard transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${CORES[cor]}`}
    >
      <span className="block font-mono text-lg font-bold uppercase tracking-wide text-ink">
        {label}
      </span>
      {sub ? (
        <span className="mt-1 block font-mono text-xs text-ink/70">{sub}</span>
      ) : null}
    </Link>
  );
}
