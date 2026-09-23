import { Janela } from "@/components/Janela";
import { labelDiaDoDesafio, labelDuracao } from "@/lib/copy";
import { diaCurto } from "@/lib/tempo";

/**
 * Cabeçalho da sala (lobby e rolando), na mesma linguagem de janela do
 * resto da tela (STYLE.md "janela"): fundo creme, barra de título
 * escura fininha. Dentro, o nome da sala em destaque (fonte pixel) e
 * "DIA X/Y" (ou só a duração antes de largar) + a data de hoje.
 */
export function CabecalhoSala({
  salaNome,
  duracaoDias,
  diaAtual,
  hoje,
}: {
  salaNome: string;
  duracaoDias: number;
  diaAtual: number | null;
  hoje: string;
}) {
  return (
    <Janela titulo="Sala">
      <h1 className="break-words font-press text-sm leading-[1.7] sm:text-base">{salaNome}</h1>
      <div className="mt-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest">
        <span className="border-2 border-ink bg-amber px-2 py-0.5">
          {diaAtual !== null ? labelDiaDoDesafio(diaAtual, duracaoDias) : labelDuracao(duracaoDias)}
        </span>
        <span className="text-ink/60">{diaCurto(hoje)}</span>
      </div>
    </Janela>
  );
}
