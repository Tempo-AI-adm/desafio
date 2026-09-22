"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Janela } from "@/components/Janela";
import { criarDesafioAction, type CriarDesafioState } from "./actions";

const PRESETS = [3, 7, 14, 21] as const;

const ESTADO_INICIAL: CriarDesafioState = {};

const inputClasses =
  "w-full border-2 border-ink bg-cream px-3 py-2 font-mono text-sm text-ink placeholder:text-ink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan";

function botaoSegmento(ativo: boolean) {
  return `border-2 border-ink px-3 py-2 font-mono text-sm font-bold uppercase transition-transform active:translate-x-[1px] active:translate-y-[1px] ${
    ativo ? "bg-amber shadow-hard-sm" : "bg-cream"
  }`;
}

export default function CriarDesafioPage() {
  const [state, formAction, pending] = useActionState(
    criarDesafioAction,
    ESTADO_INICIAL,
  );

  const [duracaoSelecionada, setDuracaoSelecionada] = useState<
    (typeof PRESETS)[number] | "outro"
  >(7);
  const [duracaoCustom, setDuracaoCustom] = useState("");
  const [backfill, setBackfill] = useState<"sim" | "nao">("nao");

  const duracaoFinal =
    duracaoSelecionada === "outro" ? duracaoCustom : String(duracaoSelecionada);

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col gap-5 px-4 py-8">
      <Link
        href="/"
        className="font-mono text-xs font-bold uppercase tracking-widest text-ink/70"
      >
        &larr; voltar
      </Link>

      <Janela titulo="Criar desafio">
        <form action={formAction} className="flex flex-col gap-6">
          <input type="hidden" name="duracaoDias" value={duracaoFinal} />
          <input type="hidden" name="permiteBackfill" value={backfill} />

          <div className="flex flex-col gap-2">
            <label htmlFor="nome" className="font-mono text-xs font-bold uppercase tracking-widest">
              Nome do desafio
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              maxLength={60}
              placeholder="Ex: Setembro sem desculpa"
              className={inputClasses}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest">
              Duração (dias)
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((dias) => (
                <button
                  key={dias}
                  type="button"
                  onClick={() => setDuracaoSelecionada(dias)}
                  className={botaoSegmento(duracaoSelecionada === dias)}
                >
                  {dias}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setDuracaoSelecionada("outro")}
                className={botaoSegmento(duracaoSelecionada === "outro")}
              >
                Outro
              </button>
            </div>
            {duracaoSelecionada === "outro" ? (
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={365}
                placeholder="Quantos dias?"
                value={duracaoCustom}
                onChange={(e) => setDuracaoCustom(e.target.value)}
                className={inputClasses}
              />
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest">
              Vale registrar em dias anteriores?
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setBackfill("sim")}
                className={`flex-1 ${botaoSegmento(backfill === "sim")}`}
              >
                Sim
              </button>
              <button
                type="button"
                onClick={() => setBackfill("nao")}
                className={`flex-1 ${botaoSegmento(backfill === "nao")}`}
              >
                Não
              </button>
            </div>
          </div>

          {state.error ? (
            <p className="border-2 border-coral bg-cream px-3 py-2 font-mono text-sm text-coral">
              {state.error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="border-2 border-ink bg-amber px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest shadow-hard transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60"
          >
            {pending ? "Criando..." : "Criar desafio"}
          </button>
        </form>
      </Janela>
    </main>
  );
}
