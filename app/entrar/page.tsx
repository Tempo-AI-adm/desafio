"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Janela } from "@/components/Janela";
import { entrarAction, type EntrarState } from "./actions";

const ESTADO_INICIAL: EntrarState = {};

export default function EntrarPage() {
  const [state, formAction, pending] = useActionState(entrarAction, ESTADO_INICIAL);

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col gap-5 px-4 py-8">
      <Link
        href="/"
        className="font-mono text-xs font-bold uppercase tracking-widest text-ink/70"
      >
        &larr; voltar
      </Link>

      <Janela titulo="Entrar em uma sala">
        <form action={formAction} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="codigo"
              className="font-mono text-xs font-bold uppercase tracking-widest"
            >
              Código da sala
            </label>
            <input
              id="codigo"
              name="codigo"
              type="text"
              required
              maxLength={12}
              placeholder="Ex: PEGA42"
              autoCapitalize="characters"
              className="w-full border-2 border-ink bg-cream px-3 py-2 font-mono text-sm uppercase tracking-widest text-ink placeholder:text-ink/40 placeholder:normal-case focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
            />
            <p className="font-mono text-xs text-ink/60">
              Cola o código que veio no link (ex: /d/PEGA42) ou digita ele direto.
            </p>
          </div>

          {state.error ? (
            <p className="border-2 border-coral bg-cream px-3 py-2 font-mono text-sm text-coral">
              {state.error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="border-2 border-ink bg-cyan px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest shadow-hard transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60"
          >
            {pending ? "Procurando..." : "Entrar"}
          </button>
        </form>
      </Janela>
    </main>
  );
}
