"use client";

import { useActionState, useEffect, useState } from "react";
import { Janela } from "@/components/Janela";
import { ASSUNTOS } from "@/lib/assuntos-constants";
import { ESTADO_LABEL, labelComemoracaoPorContagemDoDia, labelPronto } from "@/lib/copy";
import {
  adicionarInegociavelAction,
  alternarProntoAction,
  largarAction,
  registrarExtraAction,
  registrarInegociavelAction,
  type AdicionarInegociavelState,
  type AlternarProntoState,
  type LargarState,
  type RegistrarExtraState,
  type RegistrarInegociavelState,
} from "./actions";

type InegociavelResumo = {
  id: string;
  titulo: string;
  assunto: string;
  alvo: number | null;
  progresso: number;
};

type ParticipanteLobby = {
  id: string;
  nome: string;
  emoji: string;
  pronto: boolean;
  quantidadeInegociaveis: number;
};

type DadosLobby = {
  estado: "lobby" | "ativo" | "encerrado";
  meuId: string;
  souCriador: boolean;
  meuPronto: boolean;
  meusInegociaveis: InegociavelResumo[];
  participantes: ParticipanteLobby[];
};

const ESTADO_INICIAL_INEGOCIAVEL: AdicionarInegociavelState = {};
const ESTADO_INICIAL_PRONTO: AlternarProntoState = {};
const ESTADO_INICIAL_LARGAR: LargarState = {};
const ESTADO_INICIAL_REGISTRAR_INEGOCIAVEL: RegistrarInegociavelState = {};
const ESTADO_INICIAL_REGISTRAR_EXTRA: RegistrarExtraState = {};

function assuntoBotaoClasses(ativo: boolean) {
  return `flex items-center gap-1 border-2 border-ink px-2 py-1 font-mono text-xs font-bold transition-transform active:translate-x-[1px] active:translate-y-[1px] ${
    ativo ? "bg-amber shadow-hard-sm" : "bg-cream"
  }`;
}

// Deriva o texto de comemoração a mostrar sem precisar de useEffect +
// setState (evita o problema de "setState dentro de efeito" — mesmo
// motivo do padrão já usado no resto do arquivo): compara o carimbo
// de tempo das duas últimas ações e usa a mais recente. `key` no
// elemento reinicia a animação CSS de sumir a cada nova realização.
function comemoracaoMaisRecente(
  a: { contagemHoje?: number; carimbo?: number },
  b: { contagemHoje?: number; carimbo?: number },
): { texto: string; carimbo: number } | null {
  const maisRecente = (a.carimbo ?? 0) >= (b.carimbo ?? 0) ? a : b;
  if (!maisRecente.carimbo || maisRecente.contagemHoje === undefined) return null;
  return {
    texto: labelComemoracaoPorContagemDoDia(maisRecente.contagemHoje),
    carimbo: maisRecente.carimbo,
  };
}

export function AreaDoDesafio({
  codigo,
  token,
  nomeDesafio,
}: {
  codigo: string;
  token: string;
  nomeDesafio: string;
}) {
  const [dados, setDados] = useState<DadosLobby | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregar, setErroCarregar] = useState(false);
  const [assuntoSelecionado, setAssuntoSelecionado] = useState<string>(ASSUNTOS[0].valor);
  const [assuntoExtraSelecionado, setAssuntoExtraSelecionado] = useState<string>(ASSUNTOS[0].valor);
  const [mostrarFormExtra, setMostrarFormExtra] = useState(false);

  const [inegociavelState, inegociavelAction, inegociavelPending] = useActionState(
    adicionarInegociavelAction,
    ESTADO_INICIAL_INEGOCIAVEL,
  );
  const [prontoState, prontoAction, prontoPending] = useActionState(
    alternarProntoAction,
    ESTADO_INICIAL_PRONTO,
  );
  const [largarState, largarActionFn, largarPending] = useActionState(
    largarAction,
    ESTADO_INICIAL_LARGAR,
  );
  const [registrarInegociavelState, registrarInegociavelActionFn, registrarInegociavelPending] =
    useActionState(registrarInegociavelAction, ESTADO_INICIAL_REGISTRAR_INEGOCIAVEL);
  const [registrarExtraState, registrarExtraActionFn, registrarExtraPending] = useActionState(
    registrarExtraAction,
    ESTADO_INICIAL_REGISTRAR_EXTRA,
  );

  const comemoracao = comemoracaoMaisRecente(registrarInegociavelState, registrarExtraState);

  // Busca os dados do lobby: ao montar, ao focar a aba (sem realtime —
  // regra do PRD) e de novo sempre que uma ação (adicionar
  // inegociável, PRONTO, LARGAR, registrar realização) terminar. Tudo
  // num único efeito, com a função assíncrona definida por dentro —
  // evita o problema de "setState dentro de efeito" que dá quando
  // essa função é compartilhada entre vários efeitos via referência
  // externa.
  useEffect(() => {
    let cancelado = false;

    async function buscar() {
      try {
        const res = await fetch(
          `/api/lobby?codigo=${encodeURIComponent(codigo)}&token=${encodeURIComponent(token)}`,
        );
        if (res.ok) {
          const data = await res.json();
          if (data.lobby) {
            if (!cancelado) {
              setDados(data.lobby);
              setErroCarregar(false);
              setCarregando(false);
            }
            return;
          }
        }
        if (!cancelado) {
          setErroCarregar(true);
          setCarregando(false);
        }
      } catch {
        if (!cancelado) {
          setErroCarregar(true);
          setCarregando(false);
        }
      }
    }

    void buscar();

    function aoFocar() {
      void buscar();
    }
    window.addEventListener("focus", aoFocar);

    return () => {
      cancelado = true;
      window.removeEventListener("focus", aoFocar);
    };
  }, [
    codigo,
    token,
    inegociavelState,
    prontoState,
    largarState,
    registrarInegociavelState,
    registrarExtraState,
  ]);

  if (carregando) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center px-4 py-8">
        <p className="font-mono text-sm text-ink/60">Carregando...</p>
      </main>
    );
  }

  if (erroCarregar || !dados) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center gap-3 px-4 py-8">
        <p className="border-2 border-coral bg-cream px-3 py-2 font-mono text-sm text-coral">
          Não deu pra carregar o desafio agora. Recarrega a página.
        </p>
      </main>
    );
  }

  if (dados.estado === "encerrado") {
    return (
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center gap-3 px-4 py-8">
        <Janela titulo={nomeDesafio}>
          <p className="font-mono text-sm">Esse desafio já encerrou.</p>
        </Janela>
      </main>
    );
  }

  if (dados.estado === "ativo") {
    return (
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col gap-5 px-4 py-8">
        <header className="space-y-1 text-center">
          <p className="font-press text-base leading-relaxed">COMEÇOU.</p>
          <p className="font-mono text-xs text-ink/60">{ESTADO_LABEL[dados.estado]}</p>
        </header>

        {comemoracao ? (
          <div
            key={comemoracao.carimbo}
            className="animate-[comemoracao-sumir_2.8s_ease-out_forwards] border-2 border-ink bg-amber px-4 py-3 text-center font-press text-xs leading-relaxed shadow-hard"
          >
            {comemoracao.texto}
          </div>
        ) : null}

        <Janela titulo="Seus inegociáveis">
          <div className="flex flex-col gap-3">
            <p className="font-mono text-xs text-ink/60">Toca num inegociável pra marcar +1.</p>

            <ul className="flex flex-col gap-2">
              {dados.meusInegociaveis.map((i) => {
                const assunto = ASSUNTOS.find((a) => a.valor === i.assunto);
                const cumpriu = i.progresso > 0;
                const estourou = i.alvo !== null && i.progresso > i.alvo;
                return (
                  <li key={i.id}>
                    <form action={registrarInegociavelActionFn}>
                      <input type="hidden" name="codigo" value={codigo} />
                      <input type="hidden" name="token" value={token} />
                      <input type="hidden" name="inegociavelId" value={i.id} />
                      <button
                        type="submit"
                        disabled={registrarInegociavelPending}
                        className="flex w-full items-center justify-between gap-2 border-2 border-ink bg-cream px-3 py-2 font-mono text-sm shadow-hard-sm transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:opacity-60"
                      >
                        <span className="text-left">
                          {assunto?.emoji ?? "✨"} {i.titulo}
                        </span>
                        {i.alvo ? (
                          <span className="flex shrink-0 items-center gap-1">
                            <span aria-hidden className="text-amber tracking-widest">
                              {Array.from({ length: i.alvo }, (_, idx) =>
                                idx < Math.min(i.progresso, i.alvo as number) ? "●" : "○",
                              ).join("")}
                            </span>
                            {estourou ? (
                              <span className="text-xs text-ink/60">
                                +{i.progresso - i.alvo} extra
                              </span>
                            ) : null}
                          </span>
                        ) : (
                          <span
                            className={`shrink-0 ${cumpriu ? "font-bold text-green" : "text-ink/40"}`}
                          >
                            {cumpriu ? "✓ cumpri" : "○"}
                          </span>
                        )}
                      </button>
                    </form>
                  </li>
                );
              })}
            </ul>

            {registrarInegociavelState.error ? (
              <p className="border-2 border-coral bg-cream px-3 py-2 font-mono text-sm text-coral">
                {registrarInegociavelState.error}
              </p>
            ) : null}
          </div>
        </Janela>

        <Janela titulo="Vitória extra">
          <div className="flex flex-col gap-3">
            {!mostrarFormExtra ? (
              <button
                type="button"
                onClick={() => setMostrarFormExtra(true)}
                className="border-2 border-ink bg-cyan px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest shadow-hard transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                Registrar vitória extra
              </button>
            ) : (
              <form
                key={registrarExtraState.carimbo ?? "novo"}
                action={registrarExtraActionFn}
                className="flex flex-col gap-3"
              >
                <input type="hidden" name="codigo" value={codigo} />
                <input type="hidden" name="token" value={token} />
                <input type="hidden" name="assunto" value={assuntoExtraSelecionado} />

                <div className="flex flex-col gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest">
                    Assunto
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {ASSUNTOS.map((a) => (
                      <button
                        key={a.valor}
                        type="button"
                        onClick={() => setAssuntoExtraSelecionado(a.valor)}
                        className={assuntoBotaoClasses(assuntoExtraSelecionado === a.valor)}
                      >
                        <span>{a.emoji}</span>
                        <span>{a.rotulo}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="texto"
                    className="font-mono text-xs font-bold uppercase tracking-widest"
                  >
                    O que você fez?
                  </label>
                  <input
                    id="texto"
                    name="texto"
                    type="text"
                    required
                    maxLength={140}
                    placeholder="Ex: voltei pro jiu-jitsu"
                    className="w-full border-2 border-ink bg-cream px-3 py-2 font-mono text-sm placeholder:text-ink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                  />
                </div>

                {registrarExtraState.error ? (
                  <p className="border-2 border-coral bg-cream px-3 py-2 font-mono text-sm text-coral">
                    {registrarExtraState.error}
                  </p>
                ) : null}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setMostrarFormExtra(false)}
                    className="flex-1 border-2 border-ink bg-cream px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest shadow-hard transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={registrarExtraPending}
                    className="flex-1 border-2 border-ink bg-cyan px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest shadow-hard transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60"
                  >
                    {registrarExtraPending ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Janela>
      </main>
    );
  }

  // dados.estado === "lobby"
  const temInegociavel = dados.meusInegociaveis.length > 0;

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col gap-5 px-4 py-8">
      <header className="space-y-1 text-center">
        <p className="font-mono text-sm text-ink/70">{nomeDesafio}</p>
      </header>

      <Janela titulo="Seu inegociável">
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-mono text-sm font-bold">
              Defina seu mínimo inegociável para o desafio.
            </p>
            <p className="font-mono text-sm text-ink/70">
              O que você não quer ter deixado de fazer quando ele acabar. Esse
              é seu norte — e todo mundo vê. Durante o desafio você pode
              marcar cada inegociável cumprido e adicionar novas realizações.
            </p>
          </div>

          {temInegociavel ? (
            <ul className="flex flex-col gap-2">
              {dados.meusInegociaveis.map((i) => {
                const assunto = ASSUNTOS.find((a) => a.valor === i.assunto);
                return (
                  <li
                    key={i.id}
                    className="flex items-center justify-between border-2 border-ink bg-cream px-3 py-2 font-mono text-sm"
                  >
                    <span>
                      {assunto?.emoji ?? "✨"} {i.titulo}
                    </span>
                    {i.alvo ? (
                      <span className="text-ink/60">alvo: {i.alvo}x</span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : null}

          {!dados.meuPronto ? (
            <form
              key={dados.meusInegociaveis.length}
              action={inegociavelAction}
              className="flex flex-col gap-3 border-t-2 border-empty pt-4"
            >
              <input type="hidden" name="codigo" value={codigo} />
              <input type="hidden" name="token" value={token} />
              <input type="hidden" name="assunto" value={assuntoSelecionado} />

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="titulo"
                  className="font-mono text-xs font-bold uppercase tracking-widest"
                >
                  Título do inegociável {dados.meusInegociaveis.length + 1}
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
                <span className="font-mono text-xs font-bold uppercase tracking-widest">
                  Assunto
                </span>
                <div className="flex flex-wrap gap-2">
                  {ASSUNTOS.map((a) => (
                    <button
                      key={a.valor}
                      type="button"
                      onClick={() => setAssuntoSelecionado(a.valor)}
                      className={assuntoBotaoClasses(assuntoSelecionado === a.valor)}
                    >
                      <span>{a.emoji}</span>
                      <span>{a.rotulo}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="alvo"
                  className="font-mono text-xs font-bold uppercase tracking-widest"
                >
                  Alvo (opcional)
                </label>
                <input
                  id="alvo"
                  name="alvo"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={365}
                  placeholder="Nº de vezes no desafio — em branco = cumpri/não cumpri"
                  className="w-full border-2 border-ink bg-cream px-3 py-2 font-mono text-sm placeholder:text-ink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                />
              </div>

              {inegociavelState.error ? (
                <p className="border-2 border-coral bg-cream px-3 py-2 font-mono text-sm text-coral">
                  {inegociavelState.error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={inegociavelPending}
                className="border-2 border-ink bg-cyan px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest shadow-hard transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60"
              >
                {inegociavelPending ? "Adicionando..." : "Adicionar inegociável"}
              </button>
            </form>
          ) : null}

          <form action={prontoAction}>
            <input type="hidden" name="codigo" value={codigo} />
            <input type="hidden" name="token" value={token} />
            {prontoState.error ? (
              <p className="mb-3 border-2 border-coral bg-cream px-3 py-2 font-mono text-sm text-coral">
                {prontoState.error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={prontoPending || (!dados.meuPronto && !temInegociavel)}
              className={`w-full border-2 border-ink px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest shadow-hard transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60 ${
                dados.meuPronto ? "bg-green" : "bg-amber"
              }`}
            >
              {prontoPending
                ? "..."
                : dados.meuPronto
                  ? "PRONTO ✓ (toque pra desmarcar)"
                  : "PRONTO"}
            </button>
          </form>
        </div>
      </Janela>

      <Janela titulo="Quem já chegou">
        <ul className="flex flex-col gap-2">
          {dados.participantes.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between border-2 border-ink bg-cream px-3 py-2 font-mono text-sm"
            >
              <span>
                {p.emoji} {p.nome}
                {p.id === dados.meuId ? " (você)" : ""}
              </span>
              <span className={p.pronto ? "font-bold text-green" : "text-ink/50"}>
                {labelPronto(p.pronto)}
              </span>
            </li>
          ))}
        </ul>
      </Janela>

      {dados.souCriador ? (
        <Janela titulo="Você criou esse desafio">
          <form action={largarActionFn} className="flex flex-col gap-3">
            <input type="hidden" name="codigo" value={codigo} />
            <input type="hidden" name="token" value={token} />
            <p className="font-mono text-xs text-ink/60">
              Você pode largar mesmo que nem todo mundo esteja pronto — a
              decisão é sua.
            </p>
            {largarState.error ? (
              <p className="border-2 border-coral bg-cream px-3 py-2 font-mono text-sm text-coral">
                {largarState.error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={largarPending}
              className="border-2 border-ink bg-amber px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest shadow-hard transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60"
            >
              {largarPending ? "..." : "LARGAR"}
            </button>
          </form>
        </Janela>
      ) : null}
    </main>
  );
}
