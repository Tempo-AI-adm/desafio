"use client";

import { useActionState, useState } from "react";
import { Janela } from "@/components/Janela";
import {
  CRIAR_BOTAO,
  CRIAR_EXPLICA_INICIO,
  CRIAR_EXPLICA_PERIODO,
  CRIAR_OUTRA_DATA,
  CRIAR_PLACEHOLDER_NOME,
  CRIAR_ROTULO_FIM,
  CRIAR_ROTULO_INICIO,
  CRIAR_ROTULO_NOME,
  CRIAR_ROTULO_PERIODO,
  PERIODO_LABEL,
  labelSugestaoInicio,
} from "@/lib/copy";
import { TIPOS_PERIODO, type TipoPeriodo } from "@/lib/periodo";
import { LIMITES } from "@/lib/validacao";
import { criarDesafioAction, type CriarDesafioState } from "./actions";

const ESTADO_INICIAL: CriarDesafioState = {};

const inputClasses =
  "w-full border-2 border-ink bg-cream px-3 py-2 font-mono text-sm text-ink placeholder:text-ink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan";

const rotuloClasses = "font-mono text-xs font-bold uppercase tracking-widest";
const explicaClasses = "font-mono text-[11px] text-ink/60";

function botaoSegmento(ativo: boolean) {
  return `border-2 border-ink px-3 py-2 font-mono text-sm font-bold transition-transform active:translate-x-[1px] active:translate-y-[1px] ${
    ativo ? "bg-amber shadow-hard-sm" : "bg-cream"
  }`;
}

type EscolhaInicio = "segunda" | "dia1" | "outra";

/**
 * Criar sala (CONCEITO.md "A sala"): nome + período (1 semana, 2
 * semanas, 1 mês ou até uma data) + data de início, com a próxima
 * segunda e o próximo dia 1 como sugestão. O servidor valida tudo de
 * novo (lib/periodo.ts validarNovaSala).
 */
export function FormCriarSala({
  hoje,
  sugestoes,
}: {
  hoje: string;
  sugestoes: { segunda: string; dia1: string };
}) {
  const [state, formAction, pending] = useActionState(criarDesafioAction, ESTADO_INICIAL);
  const [periodo, setPeriodo] = useState<TipoPeriodo>("1semana");
  const [escolhaInicio, setEscolhaInicio] = useState<EscolhaInicio>("segunda");
  const [inicioOutro, setInicioOutro] = useState("");

  const inicio =
    escolhaInicio === "segunda" ? sugestoes.segunda : escolhaInicio === "dia1" ? sugestoes.dia1 : inicioOutro;
  // Se a segunda e o dia 1 caem no mesmo dia, mostra um atalho só.
  const atalhos: ("segunda" | "dia1")[] =
    sugestoes.segunda === sugestoes.dia1 ? ["segunda"] : ["segunda", "dia1"];

  return (
    <Janela titulo="Criar sala">
      <form action={formAction} className="flex flex-col gap-6">
        <input type="hidden" name="periodo" value={periodo} />
        <input type="hidden" name="inicio" value={inicio} />

        <div className="flex flex-col gap-2">
          <label htmlFor="nome" className={rotuloClasses}>
            {CRIAR_ROTULO_NOME}
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            maxLength={LIMITES.nomeSala}
            placeholder={CRIAR_PLACEHOLDER_NOME}
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className={rotuloClasses}>{CRIAR_ROTULO_PERIODO}</span>
          <div className="flex flex-wrap gap-2">
            {TIPOS_PERIODO.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={periodo === t}
                onClick={() => setPeriodo(t)}
                className={botaoSegmento(periodo === t)}
              >
                {PERIODO_LABEL[t]}
              </button>
            ))}
          </div>
          {periodo === "ateData" ? (
            <div className="flex flex-col gap-1">
              <label htmlFor="fim" className={explicaClasses}>
                {CRIAR_ROTULO_FIM}
              </label>
              <input id="fim" name="fim" type="date" required min={inicio || hoje} className={inputClasses} />
            </div>
          ) : null}
          <p className={explicaClasses}>{CRIAR_EXPLICA_PERIODO}</p>
        </div>

        <div className="flex flex-col gap-2">
          <span className={rotuloClasses}>{CRIAR_ROTULO_INICIO}</span>
          <div className="flex flex-wrap gap-2">
            {atalhos.map((a) => (
              <button
                key={a}
                type="button"
                aria-pressed={escolhaInicio === a}
                onClick={() => setEscolhaInicio(a)}
                className={botaoSegmento(escolhaInicio === a)}
              >
                {labelSugestaoInicio(a, sugestoes[a], hoje)}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={escolhaInicio === "outra"}
              onClick={() => setEscolhaInicio("outra")}
              className={botaoSegmento(escolhaInicio === "outra")}
            >
              {CRIAR_OUTRA_DATA}
            </button>
          </div>
          {escolhaInicio === "outra" ? (
            <input
              type="date"
              aria-label={CRIAR_ROTULO_INICIO}
              required
              min={hoje}
              value={inicioOutro}
              onChange={(e) => setInicioOutro(e.target.value)}
              className={inputClasses}
            />
          ) : null}
          <p className={explicaClasses}>{CRIAR_EXPLICA_INICIO}</p>
        </div>

        {state.error ? (
          <p className="border-2 border-coral bg-cream px-3 py-2 font-mono text-sm text-coral">{state.error}</p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="border-2 border-ink bg-amber px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest shadow-hard transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60"
        >
          {pending ? "Criando..." : CRIAR_BOTAO}
        </button>
      </form>
    </Janela>
  );
}
