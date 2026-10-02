"use client";

import { useState, type ReactNode } from "react";
import { Janela } from "@/components/Janela";
import {
  BOTAO_REGISTRAR,
  CONTROLE_FOCO,
  CONTROLE_FRASE,
  CONTROLE_FRASE_FECHAR,
  EXPLICA_CONTROLE_FOCO,
  LABEL_AVISO_DESFAZER,
  PLACEHOLDER_FRASE,
  SEU_DESAFIO_TITULO,
  TEXTO_REGISTRAR,
  labelFoco,
} from "@/lib/copy";
import { JANELA_DESFAZER_MS } from "@/lib/tempo";
import { LIMITES } from "@/lib/validacao";

/** Controle discreto ao lado do botão (borda fina, sem cor de destaque;
 * âmbar quando ligado). */
function controleClasses(ligado: boolean) {
  return `border border-ink px-2 py-1 font-mono text-[11px] font-bold transition-transform active:translate-x-[1px] active:translate-y-[1px] ${
    ligado ? "bg-amber" : "bg-cream text-ink/70"
  }`;
}

/**
 * "Seu desafio" (PRD "A sala rolando"): registrar é UM toque no botão
 * grande. Ao lado, controles discretos e sempre visíveis, sem popup:
 * "+ frase" (abre ali mesmo um campo opcional) e, pra quem tem foco,
 * "no meu foco" (liga só pro próximo registro). Depois de registrar, o
 * próprio aviso "Feito. Toque aqui pra desfazer." é o botão de desfazer
 * por ~5s; o botão grande continua sempre registrando.
 */
export function SeuDesafio({
  codigo,
  token,
  foco,
  registrarAction,
  registrarPending,
  registrarCarimbo,
  registrarErro,
  janelaDesfazer,
  desfazerAction,
  desfazerPending,
  desfazerErro,
  children,
}: {
  codigo: string;
  token: string;
  foco: string | null;
  registrarAction: (formData: FormData) => void;
  registrarPending: boolean;
  /** muda a cada registro feito: zera frase e "no meu foco" */
  registrarCarimbo: number;
  registrarErro?: string;
  /** o registro que ainda dá pra desfazer (null = janela fechada) */
  janelaDesfazer: { carimbo: number; realizacaoId: string } | null;
  desfazerAction: (formData: FormData) => void;
  desfazerPending: boolean;
  desfazerErro?: string;
  /** o que vem antes do botão (bolinhas da semana etc.) */
  children?: ReactNode;
}) {
  // Frase e foco valem só pro próximo registro: guardam o carimbo de
  // quando foram ligados; registrou (carimbo mudou), voltam ao normal.
  const [fraseAbertaEm, setFraseAbertaEm] = useState<number | null>(null);
  const [focoLigadoEm, setFocoLigadoEm] = useState<number | null>(null);
  const fraseAberta = fraseAbertaEm === registrarCarimbo;
  const focoLigado = Boolean(foco) && focoLigadoEm === registrarCarimbo;

  return (
    <Janela painel compacto titulo={SEU_DESAFIO_TITULO}>
      <div className="flex flex-col gap-2 font-mono">
        {children}
        {foco ? <p className="text-xs text-ink/70">{labelFoco(foco)}</p> : null}

        <form action={registrarAction} className="flex flex-col gap-2">
          <input type="hidden" name="codigo" value={codigo} />
          <input type="hidden" name="token" value={token} />
          {focoLigado ? <input type="hidden" name="noFoco" value="1" /> : null}

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={registrarPending}
              className="border-2 border-ink bg-amber px-5 py-3 text-sm font-bold uppercase tracking-widest shadow-hard transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60"
            >
              {registrarPending ? "..." : BOTAO_REGISTRAR}
            </button>
            <button
              type="button"
              aria-pressed={fraseAberta}
              onClick={() => setFraseAbertaEm(fraseAberta ? null : registrarCarimbo)}
              className={controleClasses(false)}
            >
              {fraseAberta ? CONTROLE_FRASE_FECHAR : CONTROLE_FRASE}
            </button>
            {foco ? (
              <button
                type="button"
                aria-pressed={focoLigado}
                title={EXPLICA_CONTROLE_FOCO}
                onClick={() => setFocoLigadoEm(focoLigado ? null : registrarCarimbo)}
                className={controleClasses(focoLigado)}
              >
                {focoLigado ? `✓ ${CONTROLE_FOCO}` : CONTROLE_FOCO}
              </button>
            ) : null}
          </div>

          {fraseAberta ? (
            <input
              name="texto"
              type="text"
              maxLength={LIMITES.frase}
              autoFocus
              placeholder={PLACEHOLDER_FRASE}
              className="w-full border-2 border-ink bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
            />
          ) : null}
        </form>

        {janelaDesfazer ? (
          <form action={desfazerAction}>
            <input type="hidden" name="codigo" value={codigo} />
            <input type="hidden" name="token" value={token} />
            <input type="hidden" name="realizacaoId" value={janelaDesfazer.realizacaoId} />
            <button
              key={janelaDesfazer.carimbo}
              type="submit"
              disabled={desfazerPending}
              className="relative w-full overflow-hidden border-2 border-ink bg-amber px-2 py-1 text-left text-xs font-bold"
            >
              {LABEL_AVISO_DESFAZER}
              <span
                aria-hidden
                className="absolute bottom-0 left-0 h-1 w-full origin-left bg-ink"
                style={{ animation: `janela-desfazer ${JANELA_DESFAZER_MS}ms linear forwards` }}
              />
            </button>
          </form>
        ) : (
          <p className="text-[11px] text-ink/60">{TEXTO_REGISTRAR}</p>
        )}

        {registrarErro || desfazerErro ? (
          <p className="border-2 border-coral bg-cream px-2 py-1 text-xs text-coral">{desfazerErro ?? registrarErro}</p>
        ) : null}
      </div>
    </Janela>
  );
}
