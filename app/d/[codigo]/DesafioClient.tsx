"use client";

import { useActionState, useEffect, useState } from "react";
import { Janela } from "@/components/Janela";
import { EMOJIS_IDENTIDADE } from "@/lib/identidade-constants";
import {
  chaveCriadorLocalStorage,
  chaveTokenLocalStorage,
} from "@/lib/identidade-local";
import {
  reivindicarIdentidadeAction,
  type ReivindicarIdentidadeState,
} from "./actions";
import { AreaDoDesafio } from "./AreaDoDesafio";

type DesafioResumo = {
  codigo: string;
  nome: string;
};

type Fase = "carregando" | "identidade" | "reconhecido";

const ESTADO_INICIAL: ReivindicarIdentidadeState = {};

function emojiBotaoClasses(ativo: boolean) {
  return `flex h-12 w-12 items-center justify-center border-2 border-ink text-xl transition-transform active:translate-x-[1px] active:translate-y-[1px] ${
    ativo ? "bg-amber shadow-hard-sm" : "bg-cream"
  }`;
}

export function DesafioClient({ desafio }: { desafio: DesafioResumo }) {
  const [fase, setFase] = useState<Fase>("carregando");
  // Token do participante reconhecido ao checar o localStorage (fluxo
  // de retorno) — precisamos dele pra mandar nas ações do lobby
  // (adicionar inegociável, PRONTO, LARGAR). Os dados do participante
  // em si a AreaDoDesafio busca sozinha via /api/lobby.
  const [tokenCarregado, setTokenCarregado] = useState<string | null>(null);
  const [souCriador, setSouCriador] = useState(false);
  const [emojiSelecionado, setEmojiSelecionado] = useState("");

  const [state, formAction, pending] = useActionState(
    reivindicarIdentidadeAction,
    ESTADO_INICIAL,
  );

  const participanteRecemCriado = state.participante;
  const reconhecido = fase === "reconhecido" || Boolean(participanteRecemCriado);
  const tokenAtivo = participanteRecemCriado?.token ?? tokenCarregado;

  // Ao montar: procura o token salvo neste navegador pra esse desafio e
  // confirma com o servidor. Sem token, ou token que o servidor não
  // reconhece mais (ex: reiniciou), cai pra tela de identidade — sem
  // mostrar erro nenhum, é um caso normal.
  useEffect(() => {
    let cancelado = false;

    async function verificar() {
      let token: string | null = null;
      let flagCriador = false;
      try {
        token = localStorage.getItem(chaveTokenLocalStorage(desafio.codigo));
        flagCriador = localStorage.getItem(chaveCriadorLocalStorage(desafio.codigo)) === "1";
      } catch {
        token = null;
      }
      if (!cancelado) setSouCriador(flagCriador);

      if (!token) {
        if (!cancelado) setFase("identidade");
        return;
      }

      try {
        const res = await fetch(
          `/api/participante?codigo=${encodeURIComponent(desafio.codigo)}&token=${encodeURIComponent(token)}`,
        );
        if (res.ok) {
          const data = await res.json();
          if (data.participante) {
            if (!cancelado) {
              setTokenCarregado(token);
              setFase("reconhecido");
            }
            return;
          }
        }
      } catch {
        // sem rede/servidor fora do ar — trata como sem identidade, sem crash
      }

      try {
        localStorage.removeItem(chaveTokenLocalStorage(desafio.codigo));
      } catch {
        // ignora
      }
      if (!cancelado) setFase("identidade");
    }

    verificar();
    return () => {
      cancelado = true;
    };
  }, [desafio.codigo]);

  // Quando a action de reivindicar identidade volta com sucesso, guarda
  // o token no localStorage (localStorage é o "sistema externo" aqui —
  // a tela em si já reage a state.participante direto, sem outro
  // setState no meio do caminho).
  useEffect(() => {
    if (!participanteRecemCriado) return;
    try {
      localStorage.setItem(
        chaveTokenLocalStorage(desafio.codigo),
        participanteRecemCriado.token,
      );
    } catch {
      // ignora
    }
  }, [participanteRecemCriado, desafio.codigo]);

  if (fase === "carregando") {
    return (
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center px-4 py-8">
        <p className="font-mono text-sm text-ink/60">Carregando...</p>
      </main>
    );
  }

  if (!reconhecido) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-5 px-4 py-8">
        <header className="space-y-1 text-center">
          <p className="font-press text-lg leading-relaxed">CHEGOU.</p>
          <p className="font-mono text-sm text-ink/70">{desafio.nome}</p>
        </header>

        <Janela titulo="Quem é você?">
          <form action={formAction} className="flex flex-col gap-6">
            <input type="hidden" name="codigo" value={desafio.codigo} />
            <input type="hidden" name="emoji" value={emojiSelecionado} />
            <input type="hidden" name="souCriador" value={souCriador ? "1" : "0"} />

            <div className="flex flex-col gap-2">
              <label htmlFor="nome" className="font-mono text-xs font-bold uppercase tracking-widest">
                Seu nome
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                maxLength={30}
                placeholder="Como te chamam?"
                className="w-full border-2 border-ink bg-cream px-3 py-2 font-mono text-sm text-ink placeholder:text-ink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest">
                Seu emoji
              </span>
              <div className="flex flex-wrap gap-2">
                {EMOJIS_IDENTIDADE.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setEmojiSelecionado(emoji)}
                    className={emojiBotaoClasses(emojiSelecionado === emoji)}
                    aria-label={`Escolher emoji ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {state.error ? (
              <p className="border-2 border-coral bg-cream px-3 py-2 font-mono text-sm text-coral">
                {state.error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending || !emojiSelecionado}
              className="border-2 border-ink bg-amber px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest shadow-hard transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60"
            >
              {pending ? "Entrando..." : "Entrar no desafio"}
            </button>
          </form>
        </Janela>
      </main>
    );
  }

  // reconhecido === true (token confirmado ou identidade recém-criada).
  // tokenAtivo sempre existe aqui na prática — o `null` só cobre o
  // instante entre "reconhecido virou true" e o efeito de localStorage
  // rodar, então mantemos o "Carregando..." nesse raro meio-tempo.
  if (!tokenAtivo) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center px-4 py-8">
        <p className="font-mono text-sm text-ink/60">Carregando...</p>
      </main>
    );
  }

  return <AreaDoDesafio codigo={desafio.codigo} token={tokenAtivo} nomeDesafio={desafio.nome} />;
}
