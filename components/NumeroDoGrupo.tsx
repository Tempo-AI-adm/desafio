import { EXPLICA_NUMERO_GRUPO, NUMERO_GRUPO_TITULO, labelContextoNumero } from "@/lib/copy";
import { Janela } from "@/components/Janela";

/** 0,374 -> 37 (pra baixo: 100% só quando o grupo fechou tudo de verdade). */
export function emPorcentagem(fracao: number): number {
  return Math.floor(fracao * 100 + 1e-9);
}

/**
 * O número do grupo (CONCEITO.md "Os números"): o quanto o grupo já
 * realizou de tudo que se propôs pro desafio inteiro. Um número só, da
 * sala, nunca por pessoa. Só sobe. A linha de contexto é ligada ao
 * tempo ("dia 8 de 30, ..."), sempre visível: explica por que ele é
 * pequeno no começo sem soar como cobrança.
 */
export function NumeroDoGrupo({
  progresso,
  diaAtual,
  duracaoDias,
  embutido = false,
}: {
  progresso: number;
  diaAtual: number | null;
  duracaoDias: number;
  /** sem janela própria (dentro do resultado final) */
  embutido?: boolean;
}) {
  const pct = emPorcentagem(progresso);
  const corpo = (
    <div className="flex flex-col gap-1.5 font-mono">
      <div className="flex items-end justify-between gap-3">
        <span className="text-3xl font-bold leading-none">{pct}%</span>
        {diaAtual !== null ? (
          <span className="text-right text-[11px] text-ink/60">{labelContextoNumero(diaAtual, duracaoDias)}</span>
        ) : null}
      </div>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-3 w-full border-2 border-ink bg-empty"
      >
        <div className="h-full bg-amber" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[11px] text-ink/60">{EXPLICA_NUMERO_GRUPO}</p>
    </div>
  );
  return embutido ? corpo : <Janela titulo={NUMERO_GRUPO_TITULO}>{corpo}</Janela>;
}
