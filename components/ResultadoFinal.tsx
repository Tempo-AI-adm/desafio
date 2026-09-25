import type { ReactNode } from "react";
import { ComLegenda } from "@/components/ComLegenda";
import { Estrela } from "@/components/Estrela";
import { FogoIcone } from "@/components/Fogo";
import { Janela } from "@/components/Janela";
import { Olhinhos } from "@/components/Olhinhos";
import {
  LABEL_TODO_MUNDO,
  LEGENDA_ESTRELA,
  LEGENDA_FOGO,
  LABEL_VOCE,
  SELO_FECHOU_TUDO,
  SELO_NO_RITMO,
  labelBonus,
  labelDiasEmChamas,
  labelMissoesCumpridas,
  labelMissoesDeDefinidas,
  labelReacoes,
  labelResumoGrupo,
} from "@/lib/copy";

type Pessoa = {
  id: string;
  emoji: string;
  nome: string;
  fechouTudo: boolean;
  missoes: number;
  definidas: number;
  bonus: number;
  reacoes: number;
  diasEmChamas: number;
};

/** Mesma peça dos chips de assunto do formulário de missão (borda dura,
 * ícone + texto), sem ser botão. */
function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-1 border-2 border-ink bg-cream px-2 py-1 font-mono text-xs font-bold">
      {children}
    </span>
  );
}

/**
 * Resultado final (PRD "Resultado final - princípio de apresentação"),
 * usado no exemplo da Home e na sala encerrada. Lista "Todo mundo" na
 * ordem de entrada, com a própria pessoa primeiro (só pra achar a linha
 * rápido, não é ranking). Cada linha: emoji + nome; o selo (fechou tudo
 * que se propôs ou seguiu no ritmo) numa linha própria; os números em
 * chips, só se forem maiores que zero. Chips de insígnia (dias em
 * chamas, bônus) são tocáveis e mostram a legenda (borda tracejada). A linha da própria pessoa tem um
 * realce leve e, no lugar de "N missões cumpridas", "X de Y missões"
 * (compara consigo mesma; os outros não têm essa comparação).
 */
export function ResultadoFinal({
  titulo,
  mascote = false,
  cabecalho,
  grupo,
  pessoas,
  meuId,
}: {
  titulo: ReactNode;
  /** mascote (olhinhos piscando) ao lado de "Todo mundo" (sala encerrada de verdade) */
  mascote?: boolean;
  /** topo do exemplo da Home, que não tem o cabeçalho "SALA" da sala real */
  cabecalho?: ReactNode;
  /** estatística do grupo todo, acima de "Todo mundo" */
  grupo: { realizacoes: number; reacoes: number };
  pessoas: Pessoa[];
  /** a própria pessoa: vem primeiro, com realce e "(você)" */
  meuId?: string;
}) {
  const ordenadas = [
    ...pessoas.filter((p) => p.id === meuId),
    ...pessoas.filter((p) => p.id !== meuId),
  ];

  return (
    <Janela titulo={titulo}>
      <div className="flex flex-col gap-2 text-left font-mono">
        {cabecalho}
        <p className="text-xs font-bold">{labelResumoGrupo(grupo.realizacoes, grupo.reacoes)}</p>
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ink/60">
          {mascote ? <Olhinhos altura={10} animado /> : null}
          {LABEL_TODO_MUNDO}
        </p>
        <ul className="flex flex-col gap-2">
          {ordenadas.map((p) => {
            const souEu = p.id === meuId;
            return (
              <li
                key={p.id}
                className={`flex flex-col gap-1.5 ${
                  souEu ? "border-2 border-amber bg-amber/10 p-2" : "border-t-2 border-empty pt-2"
                }`}
              >
                <p className="text-sm font-bold">
                  {p.emoji} {p.nome}
                  {souEu ? <span className="font-normal text-ink/60"> {LABEL_VOCE}</span> : null}
                </p>
                {p.fechouTudo ? (
                  <p className="bg-amber px-1.5 py-0.5 text-[10px] font-bold tracking-wide">{SELO_FECHOU_TUDO}</p>
                ) : (
                  <p className="border border-ink/30 px-1.5 py-0.5 text-[10px] tracking-wide text-ink/60">
                    {SELO_NO_RITMO}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {souEu ? (
                    <Chip>
                      <span className="text-green">✓</span>
                      {labelMissoesDeDefinidas(p.missoes, p.definidas)}
                    </Chip>
                  ) : p.missoes > 0 ? (
                    <Chip>
                      <span className="text-green">✓</span>
                      {labelMissoesCumpridas(p.missoes)}
                    </Chip>
                  ) : null}
                  {/* Chips que revelam legenda: tracejados (dá pra tocar). */}
                  {p.diasEmChamas > 0 ? (
                    <ComLegenda chip legenda={LEGENDA_FOGO}>
                      <FogoIcone nivel={1} altura={13} />
                      {labelDiasEmChamas(p.diasEmChamas)}
                    </ComLegenda>
                  ) : null}
                  {p.bonus > 0 ? (
                    <ComLegenda chip legenda={LEGENDA_ESTRELA}>
                      <Estrela tamanho={13} />
                      {labelBonus(p.bonus)}
                    </ComLegenda>
                  ) : null}
                  {p.reacoes > 0 ? (
                    <Chip>
                      <Olhinhos altura={8} />
                      {labelReacoes(p.reacoes)}
                    </Chip>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Janela>
  );
}
