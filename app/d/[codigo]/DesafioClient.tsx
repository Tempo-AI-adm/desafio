"use client";

import { useActionState, useEffect, useState } from "react";
import { Janela } from "@/components/Janela";
import { EMOJIS_IDENTIDADE } from "@/lib/identidade-constants";
import { ESTADO_LABEL, labelBackfill } from "@/lib/copy";
import {
  chaveCriadorLocalStorage,
  chaveTokenLocalStorage,
} from "@/lib/identidade-local";
import {
  reivindicarIdentidadeAction,
  type ReivindicarIdentidadeState,
} from "./actions";

type DesafioResumo = {
  codigo: string;
  nome: string;
  duracaoDias: number;
  permiteBackfill: boolean;
  estado: "lobby" | "ativo" | "encerrado";
};

type ParticipanteLogado = {
  id: string;
  nome: string;
  emoji: string;
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
  // Participante encontrado ao checar o token salvo (fluxo de retorno).
  const [participanteCarregado, setParticipanteCarregado] =
    useState<ParticipanteLogado | null>(null);
  const [souCriador, setSouCriador] = useState(false);
  const [emojiSelecionado, setEmojiSelecionado] = useState("");

  const [state, formAction, pending] = useActionState(
    reivindicarIdentidadeAction,
    ESTADO_INICIAL,
  );

  // Participante "ativo" pra tela: ou veio da checagem de token, ou
  // acabou de ser criado agora pela action — sem duplicar em outro
  // useState (evita setState derivado dentro de efeito).
  const participanteRecemCriado = state.participante;
  const participante: ParticipanteLogado | null = participanteRecemCriado
    ? {
        id: participanteRecemCriado.id,
        nome: participanteRecemCriado.nome,
        emoji: participanteRecemCriado.emoji,
      }
    : participanteCarregado;
  const reconhecido = fase === "reconhecido" || Boolean(participanteRecemCriado);

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
              setParticipanteCarregado(data.participante);
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

  // reconhecido === true (token confirmado ou identidade recém-criada)
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-5 px-4 py-8">
      <Janela titulo={desafio.nome}>
        <div className="flex flex-col gap-4">
          {participante ? (
            <p className="border-2 border-ink bg-cream px-3 py-2 font-mono text-sm">
              Você entrou como {participante.emoji} <strong>{participante.nome}</strong>.
              {souCriador ? " Você criou esse desafio." : ""}
            </p>
          ) : null}

          <dl className="grid grid-cols-2 gap-y-2 font-mono text-sm">
            <dt className="text-ink/60">Duração</dt>
            <dd className="text-right font-bold">{desafio.duracaoDias} dias</dd>
            <dt className="text-ink/60">Dias anteriores</dt>
            <dd className="text-right font-bold">{labelBackfill(desafio.permiteBackfill)}</dd>
            <dt className="text-ink/60">Situação</dt>
            <dd className="text-right font-bold">{ESTADO_LABEL[desafio.estado]}</dd>
          </dl>

          <p className="border-2 border-ink bg-empty/40 px-3 py-2 font-mono text-xs">
            Isso aqui é só uma prévia. Lobby (definir seu norte, PRONTO,
            LARGAR) chega na próxima etapa.
          </p>
        </div>
      </Janela>
    </main>
  );
}
