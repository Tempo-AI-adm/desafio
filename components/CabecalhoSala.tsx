import { labelDiaDoDesafio, labelDuracao } from "@/lib/copy";
import { diaCurto } from "@/lib/tempo";

/**
 * Cabeçalho da sala (lobby e rolando): uma janela escura (grafite), no
 * espírito das janelas escuras do typesafe.ai, separando a identidade
 * da sala do resto da tela. Nome da sala na fonte pixel + "DIA X/Y"
 * (ou só a duração antes de largar) + a data de hoje (fuso de Brasília).
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
    <header className="border-2 border-ink bg-grafite px-4 py-4 text-cream shadow-hard">
      <h1 className="break-words font-press text-sm leading-[1.7] sm:text-base">{salaNome}</h1>
      <div className="mt-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest">
        <span className="border-2 border-ink bg-amber px-2 py-0.5 text-ink">
          {diaAtual !== null ? labelDiaDoDesafio(diaAtual, duracaoDias) : labelDuracao(duracaoDias)}
        </span>
        <span className="text-cream/70">{diaCurto(hoje)}</span>
      </div>
    </header>
  );
}
