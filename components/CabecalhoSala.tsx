import { Fogo } from "@/components/Fogo";
import { Janela } from "@/components/Janela";
import {
  LABEL_ATIVOS_HOJE,
  LABEL_SO_VOCE_HOJE,
  labelDiaDoDesafio,
  labelDuracao,
  labelVistoHa,
} from "@/lib/copy";
import { diaCurto, horaCurta } from "@/lib/tempo";
import type { ParticipanteSala } from "@/lib/tipos-sala";

/**
 * Cabeçalho da sala (lobby e rolando), na mesma linguagem de janela do
 * resto da tela (STYLE.md "janela"): fundo creme, barra de título
 * escura fininha. Dentro, o nome da sala em destaque (fonte pixel) e
 * "DIA X/Y" (ou só a duração antes de largar) + data e hora de hoje
 * (fuso de Brasília, hora da última busca; sem relógio rodando).
 * Com a sala rolando, também "Ativos hoje": quem teve atividade hoje
 * (a própria pessoa primeiro), cada um com a insígnia do dia se tiver
 * (o foguinho). Uma bolinha verde só, ao lado do rótulo.
 */
export function CabecalhoSala({
  salaNome,
  duracaoDias,
  diaAtual,
  hoje,
  agora,
  ativosHoje,
}: {
  salaNome: string;
  duracaoDias: number;
  diaAtual: number | null;
  hoje: string;
  /** momento da última busca da sala (não é relógio ao vivo: atualiza ao
   * abrir, ao voltar pra aba e depois de cada ação) */
  agora: string;
  /** só na sala rolando; no lobby quem já chegou aparece em outra janela */
  ativosHoje?: ParticipanteSala[];
}) {
  return (
    <Janela titulo="Sala" painel>
      {/* Em maiúsculas (só no CSS; o nome salvo não muda): as minúsculas
          da Press Start 2P são baixinhas e o nome parecia "espremido". */}
      <h1 className="break-words font-press text-sm uppercase leading-[1.6] sm:text-base">{salaNome}</h1>
      <div className="mt-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest">
        <span className="border-2 border-ink bg-amber px-2 py-0.5">
          {diaAtual !== null ? labelDiaDoDesafio(diaAtual, duracaoDias) : labelDuracao(duracaoDias)}
        </span>
        <span className="text-ink/60">
          {diaCurto(hoje)} · {horaCurta(agora)}
        </span>
      </div>

      {ativosHoje ? (
        <div className="mt-3 flex flex-col gap-1.5 border-t-2 border-ink/15 pt-2">
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-ink/60">
            <span aria-hidden className="inline-block h-2 w-2 bg-green" />
            {LABEL_ATIVOS_HOJE}
          </span>
          {/* Lista simples, sem caixa por pessoa (não parece botão),
              separada só por espaço: um "·" começaria a linha quando a
              lista quebra. */}
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs font-bold">
            {ativosHoje.map((p) => (
              <li key={p.id} title={labelVistoHa(p.minutosDesdeAtividade)} className="flex items-center gap-1">
                <span>{p.emoji}</span>
                <span className="max-w-[7rem] truncate">{p.nome}</span>
                <Fogo contagemHoje={p.contagemHoje} tamanho="compacto" />
              </li>
            ))}
          </ul>
          {ativosHoje.length <= 1 ? (
            <p className="font-mono text-[11px] text-ink/60">{LABEL_SO_VOCE_HOJE}</p>
          ) : null}
        </div>
      ) : null}
    </Janela>
  );
}
