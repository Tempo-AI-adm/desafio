"use client";

import { useActionState, useEffect, useState } from "react";
import { CamposCompromisso } from "@/components/CamposCompromisso";
import { Janela } from "@/components/Janela";
import {
  ENTRAR_BOTAO,
  ENTRAR_ENCERRADA,
  ENTRAR_JANELA_COMPROMISSO,
  ENTRAR_JANELA_QUEM,
  ENTRAR_PLACEHOLDER_NOME,
  ENTRAR_RODANDO,
  ENTRAR_ROTULO_EMOJI,
  ENTRAR_ROTULO_NOME,
  ENTRAR_TITULO,
  EXEMPLOS_REALIZACAO,
  EXEMPLOS_TITULO,
  RITUAL,
} from "@/lib/copy";
import type { EstadoDesafio } from "@/lib/desafios";
import { LIMITES } from "@/lib/validacao";
import { EMOJIS_IDENTIDADE } from "@/lib/identidade-constants";
import {
  CABECALHO_TOKEN,
  chaveTokenLocalStorage,
  registrarDesafioLocal,
} from "@/lib/identidade-local";
import {
  reivindicarIdentidadeAction,
  type ReivindicarIdentidadeState,
} from "./actions";
import { AreaDoDesafio } from "./AreaDoDesafio";

type DesafioResumo = {
  codigo: string;
  nome: string;
  estado: EstadoDesafio;
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
  // de retorno), precisamos dele pra mandar nas ações do lobby
  // (adicionar inegociável, PRONTO, LARGAR). Os dados do participante
  // em si a AreaDoDesafio busca sozinha via /api/lobby.
  const [tokenCarregado, setTokenCarregado] = useState<string | null>(null);
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
  // reconhece mais (ex: reiniciou), cai pra tela de identidade, sem
  // mostrar erro nenhum, é um caso normal.
  useEffect(() => {
    let cancelado = false;

    async function verificar() {
      let token: string | null = null;
      try {
        token = localStorage.getItem(chaveTokenLocalStorage(desafio.codigo));
      } catch {
        token = null;
      }

      if (!token) {
        if (!cancelado) setFase("identidade");
        return;
      }

      try {
        const res = await fetch(`/api/participante?codigo=${encodeURIComponent(desafio.codigo)}`, {
          headers: { [CABECALHO_TOKEN]: token },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.participante) {
            registrarDesafioLocal({
              codigo: desafio.codigo,
              nome: desafio.nome,
              emoji: data.participante.emoji,
            });
            if (!cancelado) {
              setTokenCarregado(token);
              setFase("reconhecido");
            }
            return;
          }
        }
      } catch {
        // sem rede/servidor fora do ar, trata como sem identidade, sem crash
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
  }, [desafio.codigo, desafio.nome]);

  // Quando a action de reivindicar identidade volta com sucesso, guarda
  // o token no localStorage (localStorage é o "sistema externo" aqui,
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
    registrarDesafioLocal({
      codigo: desafio.codigo,
      nome: desafio.nome,
      emoji: participanteRecemCriado.emoji,
    });
  }, [participanteRecemCriado, desafio.codigo, desafio.nome]);

  if (fase === "carregando") {
    return (
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center px-4 py-8">
        <p className="font-mono text-sm text-ink/60">Carregando...</p>
      </main>
    );
  }

  // Sala encerrada e sem identidade aqui: ninguém novo entra (o servidor
  // também recusa); quem não participa vê o resultado só em leitura.
  if (!reconhecido && desafio.estado === "encerrado") {
    return (
      <>
        <p className="mx-auto max-w-sm px-4 pt-4 text-center font-mono text-xs text-ink/70">{ENTRAR_ENCERRADA}</p>
        <AreaDoDesafio codigo={desafio.codigo} token={null} nomeDesafio={desafio.nome} />
      </>
    );
  }

  if (!reconhecido) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-5 px-4 py-8">
        <header className="space-y-2 text-center">
          <p className="font-press text-lg leading-relaxed">{ENTRAR_TITULO}</p>
          <p className="font-mono text-sm font-bold">{desafio.nome}</p>
          <p className="font-mono text-xs text-ink/70">{RITUAL}</p>
          {desafio.estado === "ativo" ? (
            <p className="border-2 border-ink bg-empty/40 px-3 py-2 font-mono text-xs text-ink/70">{ENTRAR_RODANDO}</p>
          ) : null}
        </header>

        <form action={formAction} className="flex flex-col gap-5">
          <input type="hidden" name="codigo" value={desafio.codigo} />
          <input type="hidden" name="emoji" value={emojiSelecionado} />

          <Janela titulo={ENTRAR_JANELA_QUEM}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="nome" className="font-mono text-xs font-bold uppercase tracking-widest">
                {ENTRAR_ROTULO_NOME}
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                maxLength={LIMITES.nomePessoa}
                placeholder={ENTRAR_PLACEHOLDER_NOME}
                className="w-full border-2 border-ink bg-cream px-3 py-2 font-mono text-sm text-ink placeholder:text-ink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest">
                {ENTRAR_ROTULO_EMOJI}
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

          </div>
          </Janela>

          <Janela titulo={ENTRAR_JANELA_COMPROMISSO}>
            <div className="flex flex-col gap-5">
              <CamposCompromisso />
              <div className="border-t-2 border-ink/15 pt-3 font-mono text-[11px] text-ink/70">
                <p className="font-bold text-ink">{EXEMPLOS_TITULO}</p>
                <p className="mt-1">{EXEMPLOS_REALIZACAO.join(" · ")}</p>
              </div>
            </div>
          </Janela>

          {state.error ? (
            <p className="border-2 border-coral bg-cream px-3 py-2 font-mono text-sm text-coral">{state.error}</p>
          ) : null}

          <button
            type="submit"
            disabled={pending || !emojiSelecionado}
            className="border-2 border-ink bg-amber px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest shadow-hard transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60"
          >
            {pending ? "Entrando..." : ENTRAR_BOTAO}
          </button>
        </form>
      </main>
    );
  }

  // reconhecido === true (token confirmado ou identidade recém-criada).
  // tokenAtivo sempre existe aqui na prática, o `null` só cobre o
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
