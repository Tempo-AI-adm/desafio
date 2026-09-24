"use client";

import { useState } from "react";
import { Fogo } from "@/components/Fogo";
import { Janela } from "@/components/Janela";
import { Mascote } from "@/components/Mascote";
import { emojiDoAssunto } from "@/lib/assuntos-constants";
import { labelMissaoCriada } from "@/lib/copy";
import { diaCurto, horaCurta } from "@/lib/tempo";
import type { ItemFeed, ParticipanteSala } from "@/lib/tipos-sala";

/**
 * Feed da sala (STYLE.md "feed"): todas as realizações de todo mundo,
 * mais recente no topo, uma linha compacta por item, com reação de um
 * toque (o mascote). Sem filtro: sempre tudo; item de outro dia
 * mostra a data junto da hora ("22/09 · 15:31").
 */
export function FeedDaSala({
  feed,
  participantes,
  hoje,
  codigo,
  token,
  reagirAction,
  reagirErro,
  somenteLeitura = false,
}: {
  feed: ItemFeed[];
  participantes: ParticipanteSala[];
  hoje: string;
  codigo: string;
  token: string;
  reagirAction?: (formData: FormData) => void;
  reagirErro?: string;
  /** sala encerrada: histórico só pra ler, reações aparecem sem botão */
  somenteLeitura?: boolean;
}) {
  // Reação otimista: acende o mascote e soma +1 no toque, sem esperar
  // o servidor (que leva ~1-3s pra gravar e a sala ser buscada de novo).
  // Quando os dados novos chegam, r.euReagi já vem true e isso aqui não
  // soma de novo.
  const [reagidosAgora, setReagidosAgora] = useState<Set<string>>(new Set());
  const autores = new Map(participantes.map((p) => [p.id, p]));
  // Foguinho só na realização mais recente de hoje de cada pessoa
  // (o feed já vem do mais novo pro mais velho), pra não repetir.
  const comFogo = new Set<string>();
  const autoresVistos = new Set<string>();
  for (const r of feed) {
    if (r.tipoItem !== "realizacao" || r.dia !== hoje || autoresVistos.has(r.autorId)) continue;
    autoresVistos.add(r.autorId);
    comFogo.add(r.id);
  }

  return (
    <Janela titulo="Feed da sala">
      <div className="flex flex-col gap-3">
        {reagirErro ? (
          <p className="border-2 border-coral bg-cream px-3 py-2 font-mono text-sm text-coral">{reagirErro}</p>
        ) : null}

        {feed.length === 0 ? (
          <p className="font-mono text-xs text-ink/60">Ninguém registrou nada ainda.</p>
        ) : (
          <ul className="border-2 border-ink">
            {feed.map((r) => {
              const autor = autores.get(r.autorId);
              const reagi = r.euReagi || reagidosAgora.has(r.id);
              const contagem = r.reacoes + (reagi && !r.euReagi ? 1 : 0);
              // Hoje: só a hora. Outro dia (fuso de Brasília): "22/09 · 15:31".
              const quando = r.dia === hoje ? horaCurta(r.criadoEm) : `${diaCurto(r.dia)} · ${horaCurta(r.criadoEm)}`;
              return (
                <li
                  key={r.id}
                  className="flex items-center gap-2 border-b-2 border-ink px-2 py-2 font-mono last:border-b-0"
                >
                  <span className="shrink-0 text-lg" aria-hidden>
                    {emojiDoAssunto(r.assunto)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 text-xs text-ink/60">
                      <span className="truncate font-bold text-ink">
                        {autor ? `${autor.emoji} ${autor.nome}` : "?"}
                      </span>
                      {autor && comFogo.has(r.id) ? <Fogo contagemHoje={autor.contagemHoje} tamanho="compacto" /> : null}
                      <span className="shrink-0">· {quando}</span>
                    </div>
                    {r.tipoItem === "missao_criada" ? (
                      <p className="break-words text-sm italic leading-snug text-ink/70">{labelMissaoCriada(r.texto)}</p>
                    ) : (
                      <p className="break-words text-sm leading-snug">{r.texto}</p>
                    )}
                  </div>
                  {r.tipoItem === "missao_criada" ? null : somenteLeitura || !reagirAction ? (
                    <span
                      aria-label={`${r.reacoes} reações`}
                      className="flex shrink-0 items-center gap-1 border-2 border-ink/30 px-1.5 py-1 text-xs font-bold text-ink/60"
                    >
                      <Mascote altura={16} />
                      <span>{r.reacoes}</span>
                    </span>
                  ) : (
                    <form
                      action={reagirAction}
                      onSubmit={() => setReagidosAgora((atual) => new Set(atual).add(r.id))}
                      className="shrink-0"
                    >
                      <input type="hidden" name="codigo" value={codigo} />
                      <input type="hidden" name="token" value={token} />
                      <input type="hidden" name="realizacaoId" value={r.id} />
                      <button
                        type="submit"
                        disabled={reagi}
                        aria-pressed={reagi}
                        aria-label={reagi ? `Você reagiu. ${contagem} reações` : `Reagir. ${contagem} reações`}
                        className={`flex items-center gap-1 border-2 border-ink px-1.5 py-1 text-xs font-bold transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:cursor-default ${
                          reagi ? "bg-amber" : "bg-cream shadow-hard-sm"
                        }`}
                      >
                        <Mascote altura={16} />
                        <span>{contagem}</span>
                      </button>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Janela>
  );
}
