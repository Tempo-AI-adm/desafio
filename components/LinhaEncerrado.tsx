import { LABEL_SELO_ENCERRADO, labelPeriodo, labelResumoResultado } from "@/lib/copy";

/**
 * Linha de status da sala encerrada: selo neutro "ENCERRADO" (status,
 * não conquista) + "16/09 — 22/09 · 7 dias · 2 amigos". Usada no
 * cabeçalho da sala e no exemplo da Home, pra ficarem iguais.
 */
export function LinhaEncerrado({
  periodo,
  duracaoDias,
  pessoas,
}: {
  periodo: { inicio: string; fim: string };
  duracaoDias: number;
  pessoas: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs font-bold uppercase tracking-widest">
      <span className="border-2 border-ink/50 px-2 py-0.5 text-ink/70">{LABEL_SELO_ENCERRADO}</span>
      <span className="text-ink/60">
        {labelPeriodo(periodo.inicio, periodo.fim)} · {labelResumoResultado(duracaoDias, pessoas)}
      </span>
    </div>
  );
}
