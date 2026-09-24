"use client";

import { useState } from "react";
import { ASSUNTOS } from "@/lib/assuntos-constants";
import {
  AJUDA_QUANTAS_VEZES,
  LABEL_QUANTAS_VEZES,
  TIPO_MISSAO_LABEL,
  type TipoMissao,
} from "@/lib/copy";

function assuntoBotaoClasses(ativo: boolean) {
  return `flex items-center gap-1 border-2 border-ink px-2 py-1 font-mono text-xs font-bold transition-transform active:translate-x-[1px] active:translate-y-[1px] ${
    ativo ? "bg-amber shadow-hard-sm" : "bg-cream"
  }`;
}

function tipoBotaoClasses(ativo: boolean) {
  return `flex-1 border-2 border-ink px-3 py-2 font-mono text-sm font-bold transition-transform active:translate-x-[1px] active:translate-y-[1px] ${
    ativo ? "bg-amber shadow-hard-sm" : "bg-cream"
  }`;
}

const TIPOS_MISSAO: TipoMissao[] = ["unica", "repetir"];

/**
 * Formulário de missão (inegociável): título + assunto (chip) + tipo
 * "Única" ou "Repetir". Única = alvo nulo (cumpri/não cumpri); Repetir
 * = pede "Quantas vezes?" e vira o alvo (bolinhas). No banco não muda
 * nada: só o jeito de preencher. O mesmo no lobby e no "+ Nova missão".
 */
export function FormMissao({
  codigo,
  token,
  action,
  pending,
  error,
  rotuloTitulo,
  rotuloBotao,
  className = "",
}: {
  codigo: string;
  token: string;
  action: (formData: FormData) => void;
  pending: boolean;
  error?: string;
  rotuloTitulo: string;
  rotuloBotao: string;
  className?: string;
}) {
  const [assunto, setAssunto] = useState<string>(ASSUNTOS[0].valor);
  const [tipo, setTipo] = useState<TipoMissao>("unica");

  return (
    <form action={action} className={`flex flex-col gap-3 ${className}`}>
      <input type="hidden" name="codigo" value={codigo} />
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="assunto" value={assunto} />

      <div className="flex flex-col gap-2">
        <label htmlFor="titulo" className="font-mono text-xs font-bold uppercase tracking-widest">
          {rotuloTitulo}
        </label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          required
          maxLength={60}
          placeholder="Ex: malhar, acabar o livro X"
          className="w-full border-2 border-ink bg-cream px-3 py-2 font-mono text-sm placeholder:text-ink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs font-bold uppercase tracking-widest">Assunto</span>
        <div className="flex flex-wrap gap-2">
          {ASSUNTOS.map((a) => (
            <button
              key={a.valor}
              type="button"
              onClick={() => setAssunto(a.valor)}
              className={assuntoBotaoClasses(assunto === a.valor)}
            >
              <span>{a.emoji}</span>
              <span>{a.rotulo}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs font-bold uppercase tracking-widest">Tipo</span>
        <div className="flex gap-2">
          {TIPOS_MISSAO.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tipo === t}
              onClick={() => setTipo(t)}
              className={tipoBotaoClasses(tipo === t)}
            >
              {TIPO_MISSAO_LABEL[t]}
            </button>
          ))}
        </div>
      </div>

      {/* "Única" não manda o campo alvo: o servidor grava alvo nulo. */}
      {tipo === "repetir" ? (
        <div className="flex flex-col gap-2">
          <label htmlFor="alvo" className="font-mono text-xs font-bold uppercase tracking-widest">
            {LABEL_QUANTAS_VEZES}
          </label>
          <input
            id="alvo"
            name="alvo"
            type="number"
            inputMode="numeric"
            required
            min={1}
            max={365}
            placeholder="Ex: 5"
            className="w-full border-2 border-ink bg-cream px-3 py-2 font-mono text-sm placeholder:text-ink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          />
          <p className="font-mono text-[11px] leading-snug text-ink/60">{AJUDA_QUANTAS_VEZES}</p>
        </div>
      ) : null}

      {error ? (
        <p className="border-2 border-coral bg-cream px-3 py-2 font-mono text-sm text-coral">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="border-2 border-ink bg-cyan px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest shadow-hard transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60"
      >
        {pending ? "Adicionando..." : rotuloBotao}
      </button>
    </form>
  );
}
