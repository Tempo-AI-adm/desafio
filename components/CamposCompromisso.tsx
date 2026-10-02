"use client";

import { useState } from "react";
import { ATALHOS_META } from "@/lib/compromisso";
import {
  EXPLICA_FOCO,
  EXPLICA_META,
  META_OUTRO,
  PLACEHOLDER_FOCO,
  PLACEHOLDER_META_OUTRO,
  ROTULO_FOCO,
  ROTULO_META,
} from "@/lib/copy";
import { LIMITES } from "@/lib/validacao";

const rotuloClasses = "font-mono text-xs font-bold uppercase tracking-widest";
const explicaClasses = "font-mono text-[11px] text-ink/60";
const inputClasses =
  "w-full border-2 border-ink bg-cream px-3 py-2 font-mono text-sm text-ink placeholder:text-ink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan";

function botaoSegmento(ativo: boolean) {
  return `min-w-12 border-2 border-ink px-3 py-2 font-mono text-sm font-bold transition-transform active:translate-x-[1px] active:translate-y-[1px] ${
    ativo ? "bg-amber shadow-hard-sm" : "bg-cream"
  }`;
}

/**
 * Os campos do compromisso (CONCEITO.md "O compromisso"): quantas coisas
 * boas por semana (atalhos 3, 5, 7 ou outro número, obrigatório) e o
 * foco (opcional). Manda `meta` e `foco` no formulário; quem valida é o
 * servidor (lib/compromisso.ts). Usado ao entrar na sala e no "Ajustar"
 * do lobby.
 */
export function CamposCompromisso({
  metaInicial,
  focoInicial = "",
}: {
  metaInicial?: number | null;
  focoInicial?: string | null;
}) {
  const ehAtalho = (ATALHOS_META as readonly number[]).includes(metaInicial ?? 5);
  const [escolha, setEscolha] = useState<number | "outro">(ehAtalho ? (metaInicial ?? 5) : "outro");
  const [outro, setOutro] = useState(ehAtalho ? "" : String(metaInicial ?? ""));
  const meta = escolha === "outro" ? outro : String(escolha);

  return (
    <div className="flex flex-col gap-5">
      <input type="hidden" name="meta" value={meta} />

      <div className="flex flex-col gap-2">
        <span className={rotuloClasses}>{ROTULO_META}</span>
        <div className="flex flex-wrap gap-2">
          {ATALHOS_META.map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={escolha === n}
              onClick={() => setEscolha(n)}
              className={botaoSegmento(escolha === n)}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={escolha === "outro"}
            onClick={() => setEscolha("outro")}
            className={botaoSegmento(escolha === "outro")}
          >
            {META_OUTRO}
          </button>
        </div>
        {escolha === "outro" ? (
          <input
            type="number"
            inputMode="numeric"
            aria-label={ROTULO_META}
            required
            min={LIMITES.metaMin}
            max={LIMITES.metaMax}
            placeholder={PLACEHOLDER_META_OUTRO}
            value={outro}
            onChange={(e) => setOutro(e.target.value)}
            className={inputClasses}
          />
        ) : null}
        <p className={explicaClasses}>{EXPLICA_META}</p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="foco" className={rotuloClasses}>
          {ROTULO_FOCO}
        </label>
        <input
          id="foco"
          name="foco"
          type="text"
          maxLength={LIMITES.foco}
          defaultValue={focoInicial ?? ""}
          placeholder={PLACEHOLDER_FOCO}
          className={inputClasses}
        />
        <p className={explicaClasses}>{EXPLICA_FOCO}</p>
      </div>
    </div>
  );
}
