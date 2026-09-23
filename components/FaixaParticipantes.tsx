import { Fogo } from "@/components/Fogo";
import { LABEL_ATIVO_HOJE, labelVistoHa } from "@/lib/copy";
import type { ParticipanteSala } from "@/lib/tipos-sala";

/**
 * Faixa fina com os OUTROS participantes da sala: só emoji + nome +
 * bolinha de "ativo hoje" + foguinho. Rola na horizontal. É
 * secundária: não compete com o feed por espaço.
 */
export function FaixaParticipantes({ outros }: { outros: ParticipanteSala[] }) {
  if (outros.length === 0) {
    return <p className="font-mono text-xs text-ink/60">Só você na sala por enquanto.</p>;
  }

  return (
    <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2" aria-label="Quem mais tá na sala">
      {outros.map((p) => (
        <li
          key={p.id}
          title={labelVistoHa(p.minutosDesdeAtividade)}
          className="flex shrink-0 items-center gap-1.5 border-2 border-ink bg-cream px-2 py-1 font-mono text-xs font-bold shadow-hard-sm"
        >
          <span>{p.emoji}</span>
          <span className="whitespace-nowrap">{p.nome}</span>
          {p.ativoHoje ? (
            <span role="img" aria-label={LABEL_ATIVO_HOJE} className="inline-block h-2 w-2 bg-green" />
          ) : null}
          <Fogo contagemHoje={p.contagemHoje} tamanho="compacto" />
        </li>
      ))}
    </ul>
  );
}
