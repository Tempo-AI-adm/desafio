"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Janela } from "@/components/Janela";
import { ESTADO_CURTO } from "@/lib/copy";
import type { EstadoDesafio } from "@/lib/desafios";
import { lerDesafiosLocais, type DesafioLocal } from "@/lib/identidade-local";

/**
 * "Suas salas" da Home: lê a lista local (3 mais recentes, ver
 * lib/identidade-local.ts) e busca o estado atual de cada uma no
 * servidor. Lista vazia = não mostra nada.
 *
 * Relê não só ao montar: também ao voltar pra aba (foco/visibilidade),
 * quando o navegador restaura a página da memória (pageshow) e quando
 * outra aba mexe na lista (storage). Senão uma Home que já estava
 * aberta não mostra a sala que acabou de ser criada em outra aba.
 */
export function SeusDesafios() {
  const [lista, setLista] = useState<DesafioLocal[]>([]);
  const [estados, setEstados] = useState<Record<string, EstadoDesafio>>({});

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      const locais = lerDesafiosLocais();
      if (!cancelado) setLista(locais);
      if (locais.length === 0) return;

      try {
        const res = await fetch(
          `/api/desafios?codigos=${encodeURIComponent(locais.map((d) => d.codigo).join(","))}`,
        );
        if (!res.ok) return;
        const data: { desafios: { codigo: string; estado: EstadoDesafio }[] } = await res.json();
        if (!cancelado) {
          setEstados(Object.fromEntries(data.desafios.map((d) => [d.codigo, d.estado])));
        }
      } catch {
        // sem rede: os cartões aparecem sem o estado, sem crash
      }
    }

    void carregar();

    function recarregar() {
      void carregar();
    }
    function aoMudarVisibilidade() {
      if (document.visibilityState === "visible") void carregar();
    }
    window.addEventListener("focus", recarregar);
    window.addEventListener("pageshow", recarregar);
    window.addEventListener("storage", recarregar);
    document.addEventListener("visibilitychange", aoMudarVisibilidade);

    return () => {
      cancelado = true;
      window.removeEventListener("focus", recarregar);
      window.removeEventListener("pageshow", recarregar);
      window.removeEventListener("storage", recarregar);
      document.removeEventListener("visibilitychange", aoMudarVisibilidade);
    };
  }, []);

  if (lista.length === 0) return null;

  return (
    <Janela titulo="Suas salas" className="w-full">
      <ul className="flex flex-col gap-2">
        {lista.map((d) => {
          const estado = estados[d.codigo];
          return (
            <li key={d.codigo}>
              <Link
                href={`/d/${d.codigo}`}
                className="flex items-center justify-between gap-3 border-2 border-ink bg-cream px-3 py-3 font-mono text-sm shadow-hard-sm transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                <span className="flex min-w-0 items-center gap-2">
                  {d.emoji ? <span className="shrink-0 text-lg">{d.emoji}</span> : null}
                  <span className="truncate font-bold">{d.nome}</span>
                </span>
                <span
                  className={`shrink-0 text-xs ${estado === "ativo" ? "font-bold text-green" : "text-ink/60"}`}
                >
                  {estado ? ESTADO_CURTO[estado] : "..."}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Janela>
  );
}
