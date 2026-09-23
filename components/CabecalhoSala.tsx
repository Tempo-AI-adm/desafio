import { Fogo } from "@/components/Fogo";
import { labelDuracao, labelRealizacoesHoje } from "@/lib/copy";

/**
 * Topo da sala rolando: barra tinta com o nome da sala (fonte pixel) e
 * a duração; embaixo, a identidade da própria pessoa em destaque, com
 * o foguinho e o resumo do dia. Mesma linguagem de janela do STYLE.md.
 */
export function CabecalhoSala({
  salaNome,
  duracaoDias,
  emoji,
  nome,
  contagemHoje,
}: {
  salaNome: string;
  duracaoDias: number;
  emoji: string;
  nome: string;
  contagemHoje: number;
}) {
  return (
    <header className="border-2 border-ink bg-cream shadow-hard">
      <div className="flex items-baseline justify-between gap-3 border-b-2 border-ink bg-ink px-3 py-2.5 text-cream">
        <h1 className="min-w-0 break-words font-press text-xs leading-relaxed">{salaNome}</h1>
        <span className="shrink-0 font-mono text-xs font-bold uppercase tracking-widest text-amber">
          {labelDuracao(duracaoDias)}
        </span>
      </div>
      <div className="flex items-center gap-3 px-3 py-2.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-ink bg-amber text-2xl">
          {emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-base font-bold">{nome}</p>
          <p className="font-mono text-xs text-ink/60">{labelRealizacoesHoje(contagemHoje)}</p>
        </div>
        <Fogo contagemHoje={contagemHoje} />
      </div>
    </header>
  );
}
