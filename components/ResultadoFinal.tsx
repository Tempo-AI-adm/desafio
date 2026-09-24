import type { ReactNode } from "react";
import { Estrela } from "@/components/Estrela";
import { Janela } from "@/components/Janela";
import { Mascote } from "@/components/Mascote";
import {
  LABEL_VOCE,
  SELO_FECHOU_TUDO,
  SELO_NO_RITMO,
  labelBonus,
  labelMissoesCumpridas,
  labelReacoes,
} from "@/lib/copy";

type Pessoa = {
  id: string;
  emoji: string;
  nome: string;
  fechouTudo: boolean;
  missoes: number;
  bonus: number;
  reacoes: number;
};

/**
 * Resultado final (PRD "Resultado final - princípio de apresentação"),
 * usado no exemplo da Home e na sala encerrada. Mostra o grupo inteiro
 * na ordem recebida (ordem de entrada); o destaque é o selo (fechou
 * tudo que se propôs ou seguiu no ritmo), os números são só detalhe,
 * em cinza. Sem ranking. Compacto: 2 linhas por pessoa. Os ícones (✓,
 * estrela, mascote) já separam os números; sem "·", que sobraria no
 * começo da linha quando ela quebra.
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
  /** marca "(você)" ao lado do nome */
  meuId?: string;
}) {
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
        <ul>
          {pessoas.map((p) => (
            <li key={p.id} className="border-t-2 border-empty py-2 last:pb-0">
              <p className="flex items-center justify-between gap-2 text-sm font-bold">
                <span>
                  {p.emoji} {p.nome}
                  {p.id === meuId ? <span className="font-normal text-ink/60"> {LABEL_VOCE}</span> : null}
                </span>
                {p.fechouTudo ? (
                  <span className="bg-amber px-1.5 py-0.5 text-right text-[10px] tracking-wide">
                    {SELO_FECHOU_TUDO}
                  </span>
                ) : (
                  <span className="border border-ink/30 px-1.5 py-0.5 text-right text-[10px] font-normal tracking-wide text-ink/60">
                    {SELO_NO_RITMO}
                  </span>
                )}
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-ink/60">
                <span className="flex items-center gap-1">
                  <span className="font-bold text-green">✓</span>
                  {labelMissoesCumpridas(p.missoes)}
                </span>
                {p.bonus > 0 ? (
                  <span className="flex items-center gap-1">
                    <Estrela tamanho={13} />
                    {labelBonus(p.bonus)}
                  </span>
                ) : null}
                {p.reacoes > 0 ? (
                  <span className="flex items-center gap-1">
                    <Mascote altura={13} />
                    {labelReacoes(p.reacoes)}
                  </span>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Janela>
  );
}
