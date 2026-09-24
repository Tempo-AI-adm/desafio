import type { ReactNode } from "react";
import { Estrela } from "@/components/Estrela";
import { Janela } from "@/components/Janela";
import { Mascote } from "@/components/Mascote";
import {
  LABEL_TODO_MUNDO,
  LABEL_VOCE,
  SELO_FECHOU_TUDO,
  SELO_NO_RITMO,
  labelBonus,
  labelMissoesCumpridas,
  labelMissoesDeDefinidas,
  labelReacoes,
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
 * chips, só se forem maiores que zero. A linha da própria pessoa tem um
 * realce leve e, no lugar de "N missões cumpridas", "X de Y missões"
 * (compara consigo mesma; os outros não têm essa comparação).
 */
export function ResultadoFinal({
  titulo,
  chamada,
  sala,
  resumo,
  pessoas,
  meuId,
}: {
  titulo: ReactNode;
  /** frase de clímax no topo (sala encerrada de verdade) */
  chamada?: string;
  sala: string;
  resumo: string;
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
        {chamada ? (
          <p className="flex items-center gap-2 font-press text-xs uppercase leading-[1.6]">
            <Mascote altura={18} />
            {chamada}
          </p>
        ) : null}
        <div>
          <p className="font-press text-xs uppercase leading-[1.6]">{sala}</p>
          <p className="text-xs text-ink/60">{resumo}</p>
        </div>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-ink/60">{LABEL_TODO_MUNDO}</p>
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
                  {p.bonus > 0 ? (
                    <Chip>
                      <Estrela tamanho={13} />
                      {labelBonus(p.bonus)}
                    </Chip>
                  ) : null}
                  {p.reacoes > 0 ? (
                    <Chip>
                      <Mascote altura={13} />
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
