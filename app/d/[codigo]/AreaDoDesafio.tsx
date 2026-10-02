"use client";

import { useActionState, useEffect, useState } from "react";
import { AcoesDoDesafio } from "@/components/AcoesDoDesafio";
import { CabecalhoSala } from "@/components/CabecalhoSala";
import { CamposCompromisso } from "@/components/CamposCompromisso";
import { Expansivel } from "@/components/Expansivel";
import { FeedDaSala } from "@/components/FeedDaSala";
import { Janela } from "@/components/Janela";
import { ResultadoFinal } from "@/components/ResultadoFinal";
import { SeuDesafio } from "@/components/SeuDesafio";
import {
  BOTAO_LARGAR_AGORA,
  LABEL_DESFEITO,
  LABEL_VER_TUDO_QUE_ROLOU,
  LABEL_VOCE,
  LOBBY_AJUSTAR,
  LOBBY_EXPLICA_COMPROMISSO,
  LOBBY_FECHAR_AJUSTE,
  LOBBY_JANELA_COMPROMISSO,
  LOBBY_QUEM_CHEGOU,
  LOBBY_SALVAR_AJUSTE,
  LOBBY_SEM_FOCO,
  TITULO_RESULTADO_FINAL,
  labelComemoracaoRegistro,
  labelFoco,
  labelMetaCurta,
  labelMetaSemanal,
  textoLobbyCriador,
} from "@/lib/copy";
import { CABECALHO_TOKEN } from "@/lib/identidade-local";
import { JANELA_DESFAZER_MS } from "@/lib/tempo";
import type { DadosSala } from "@/lib/tipos-sala";
import {
  ajustarCompromissoAction,
  desfazerRegistroAction,
  largarAction,
  reagirAction,
  registrarAction,
  type AjustarCompromissoState,
  type DesfazerState,
  type LargarState,
  type ReagirState,
  type RegistrarState,
} from "./actions";

const ESTADO_INICIAL_AJUSTE: AjustarCompromissoState = {};
const ESTADO_INICIAL_LARGAR: LargarState = {};
const ESTADO_INICIAL_REGISTRAR: RegistrarState = {};
const ESTADO_INICIAL_REAGIR: ReagirState = {};
const ESTADO_INICIAL_DESFAZER: DesfazerState = {};

// Deriva o selo a mostrar (SHOW. / FECHOU A SEMANA. / ... ou
// "Desfeito.") sem useEffect + setState: pega a ação mais recente pelo
// carimbo de tempo. `key` no elemento reinicia a animação de sumir.
function seloMaisRecente(
  registrar: RegistrarState,
  desfazer: DesfazerState,
): { texto: string; carimbo: number } | null {
  const candidatos = [
    {
      carimbo: registrar.carimbo ?? 0,
      texto:
        registrar.contagemHoje !== undefined
          ? labelComemoracaoRegistro(registrar.contagemHoje, registrar.semana)
          : null,
    },
    { carimbo: desfazer.carimbo ?? 0, texto: desfazer.ok ? LABEL_DESFEITO : null },
  ];
  const maisRecente = candidatos.reduce((a, b) => (b.carimbo > a.carimbo ? b : a));
  if (!maisRecente.carimbo || !maisRecente.texto) return null;
  return { texto: maisRecente.texto, carimbo: maisRecente.carimbo };
}

export function AreaDoDesafio({
  codigo,
  token,
  nomeDesafio,
}: {
  codigo: string;
  /** nulo = quem não participa vendo a sala encerrada (só leitura) */
  token: string | null;
  nomeDesafio: string;
}) {
  const [dados, setDados] = useState<DadosSala | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregar, setErroCarregar] = useState(false);

  const [ajusteState, ajusteActionFn, ajustePending] = useActionState(
    ajustarCompromissoAction,
    ESTADO_INICIAL_AJUSTE,
  );
  // "Ajustar" do lobby: fecha sozinho depois de salvar (o carimbo muda).
  const [mostrarAjuste, setMostrarAjuste] = useState(false);
  const [carimboAoAbrirAjuste, setCarimboAoAbrirAjuste] = useState(0);
  const ajusteAberto = mostrarAjuste && (ajusteState.carimbo ?? 0) === carimboAoAbrirAjuste;
  const [largarState, largarActionFn, largarPending] = useActionState(largarAction, ESTADO_INICIAL_LARGAR);
  const [registrarState, registrarActionFn, registrarPending] = useActionState(
    registrarAction,
    ESTADO_INICIAL_REGISTRAR,
  );
  const [reagirState, reagirActionFn] = useActionState(reagirAction, ESTADO_INICIAL_REAGIR);
  const [desfazerState, desfazerActionFn, desfazerPending] = useActionState(
    desfazerRegistroAction,
    ESTADO_INICIAL_DESFAZER,
  );

  const selo = seloMaisRecente(registrarState, desfazerState);

  // Janela de desfazer: aberta por JANELA_DESFAZER_MS depois de
  // registrar. O timer só fecha a janela (setState no callback do
  // setTimeout, não no corpo do efeito).
  const [janelaFechadaCarimbo, setJanelaFechadaCarimbo] = useState<number | null>(null);
  useEffect(() => {
    const carimbo = registrarState.carimbo;
    if (!carimbo) return;
    const timer = setTimeout(() => setJanelaFechadaCarimbo(carimbo), JANELA_DESFAZER_MS);
    return () => clearTimeout(timer);
  }, [registrarState.carimbo]);

  const janelaDesfazer =
    registrarState.ok &&
    registrarState.carimbo &&
    registrarState.realizacaoId &&
    janelaFechadaCarimbo !== registrarState.carimbo &&
    desfazerState.desfeitoId !== registrarState.realizacaoId
      ? { carimbo: registrarState.carimbo, realizacaoId: registrarState.realizacaoId }
      : null;

  // Busca os dados da sala: ao montar, ao focar a aba (sem realtime,
  // regra do PRD) e de novo sempre que uma ação terminar. Tudo num
  // único efeito, com a função assíncrona definida por dentro.
  useEffect(() => {
    let cancelado = false;

    async function buscar() {
      try {
        const res = await fetch(`/api/lobby?codigo=${encodeURIComponent(codigo)}`, {
          headers: token ? { [CABECALHO_TOKEN]: token } : {},
        });
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
  }, [codigo, token, ajusteState, largarState, registrarState, reagirState, desfazerState]);

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
          Não deu pra carregar a sala agora. Recarrega a página.
        </p>
      </main>
    );
  }

  // Sala encerrada: sem registrar, sem reagir (o servidor também recusa).
  // O feed fica como histórico, só pra ler.
  if (dados.estado === "encerrado") {
    return (
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col gap-4 px-4 pb-8 pt-4">
        <CabecalhoSala
          salaNome={dados.salaNome}
          duracaoDias={dados.duracaoDias}
          diaAtual={dados.diaAtual}
          hoje={dados.hoje}
          agora={dados.agora}
          periodoEncerrado={dados.periodo}
          quantidadePessoas={dados.participantes.length}
        />
        <ResultadoFinal
          titulo={TITULO_RESULTADO_FINAL}
          mascote
          grupo={dados.totaisGrupo}
          pessoas={dados.resultado ?? []}
          meuId={dados.meuId ?? undefined}
        />
        {/* Feed escondido por padrão: a tela de resultado fica enxuta,
            o histórico continua a um toque. */}
        <Expansivel rotulo={LABEL_VER_TUDO_QUE_ROLOU}>
          <FeedDaSala
            feed={dados.feed}
            participantes={dados.participantes}
            hoje={dados.hoje}
            codigo={codigo}
            token={token ?? ""}
            somenteLeitura
          />
        </Expansivel>
        <AcoesDoDesafio codigo={codigo} nomeSala={nomeDesafio} />
      </main>
    );
  }

  if (dados.estado === "ativo") {
    // "Ativos hoje": quem teve atividade hoje, a própria pessoa primeiro
    // (abrir a sala já conta, então ela sempre está).
    const ativosHoje = [
      ...dados.participantes.filter((p) => p.id === dados.meuId),
      ...dados.participantes.filter((p) => p.id !== dados.meuId && p.ativoHoje),
    ];
    return (
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col gap-4 px-4 pb-8 pt-4">
        <CabecalhoSala
          salaNome={dados.salaNome}
          duracaoDias={dados.duracaoDias}
          diaAtual={dados.diaAtual}
          hoje={dados.hoje}
          agora={dados.agora}
          ativosHoje={ativosHoje}
        />

        {/* Seu desafio: fixo no topo ao rolar, ação rápida sempre à mão;
            o feed embaixo é o conteúdo principal. */}
        <div className="sticky top-0 z-20 -mx-4 bg-cream px-4 pb-2 pt-2">
          <SeuDesafio
            codigo={codigo}
            token={token ?? ""}
            foco={dados.meuCompromisso?.foco ?? null}
            registrarAction={registrarActionFn}
            registrarPending={registrarPending}
            registrarCarimbo={registrarState.carimbo ?? 0}
            registrarErro={registrarState.error}
            janelaDesfazer={janelaDesfazer}
            desfazerAction={desfazerActionFn}
            desfazerPending={desfazerPending}
            desfazerErro={desfazerState.error}
          />
        </div>

        <FeedDaSala
          feed={dados.feed}
          participantes={dados.participantes}
          hoje={dados.hoje}
          codigo={codigo}
          token={token ?? ""}
          reagirAction={reagirActionFn}
          reagirErro={reagirState.error}
        />

        <AcoesDoDesafio codigo={codigo} nomeSala={nomeDesafio} />

        {selo ? (
          <div
            key={selo.carimbo}
            className="pointer-events-none fixed inset-x-0 bottom-6 z-30 mx-auto w-fit animate-[comemoracao-sumir_2.8s_ease-out_forwards] border-2 border-ink bg-amber px-4 py-3 text-center font-press text-xs leading-relaxed shadow-hard"
          >
            {selo.texto}
          </div>
        ) : null}
      </main>
    );
  }

  // dados.estado === "lobby": cada um vê o próprio compromisso (dá pra
  // ajustar até a largada) e quem já chegou, com meta e foco (públicos:
  // são o que cada um se propôs).
  const meu = dados.meuCompromisso;

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col gap-5 px-4 py-8">
      <CabecalhoSala
        salaNome={dados.salaNome}
        duracaoDias={dados.duracaoDias}
        diaAtual={dados.diaAtual}
        hoje={dados.hoje}
        agora={dados.agora}
      />

      <Janela
        painel
        titulo={
          <>
            <span>{LOBBY_JANELA_COMPROMISSO}</span>
            <button
              type="button"
              onClick={() => {
                if (ajusteAberto) {
                  setMostrarAjuste(false);
                } else {
                  setCarimboAoAbrirAjuste(ajusteState.carimbo ?? 0);
                  setMostrarAjuste(true);
                }
              }}
              className="shrink-0 bg-cyan px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-ink transition-transform active:translate-x-[1px] active:translate-y-[1px]"
            >
              {ajusteAberto ? LOBBY_FECHAR_AJUSTE : LOBBY_AJUSTAR}
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-3 font-mono">
          {meu ? (
            <>
              <p className="text-sm font-bold">{labelMetaSemanal(meu.meta)}</p>
              <p className="text-xs text-ink/70">{meu.foco ? labelFoco(meu.foco) : LOBBY_SEM_FOCO}</p>
            </>
          ) : null}
          <p className="text-[11px] text-ink/60">{LOBBY_EXPLICA_COMPROMISSO}</p>
          {ajusteAberto ? (
            <form action={ajusteActionFn} className="flex flex-col gap-4 border-t-2 border-ink/15 pt-3">
              <input type="hidden" name="codigo" value={codigo} />
              <input type="hidden" name="token" value={token ?? ""} />
              <CamposCompromisso metaInicial={meu?.meta} focoInicial={meu?.foco} />
              {ajusteState.error ? (
                <p className="border-2 border-coral bg-cream px-3 py-2 text-sm text-coral">{ajusteState.error}</p>
              ) : null}
              <button
                type="submit"
                disabled={ajustePending}
                className="border-2 border-ink bg-cyan px-4 py-3 text-sm font-bold uppercase tracking-widest shadow-hard transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60"
              >
                {ajustePending ? "..." : LOBBY_SALVAR_AJUSTE}
              </button>
            </form>
          ) : null}
        </div>
      </Janela>

      <Janela titulo={LOBBY_QUEM_CHEGOU}>
        <ul className="flex flex-col gap-2">
          {dados.participantes.map((p) => (
            <li key={p.id} className="border-2 border-ink bg-cream px-3 py-2 font-mono text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="min-w-0 truncate">
                  {p.emoji} {p.nome}
                  {p.id === dados.meuId ? <span className="text-ink/60"> {LABEL_VOCE}</span> : null}
                </span>
                {p.metaSemanal ? (
                  <span className="shrink-0 text-xs font-bold">{labelMetaCurta(p.metaSemanal)}</span>
                ) : null}
              </div>
              {p.foco ? <p className="mt-0.5 break-words text-xs text-ink/60">{labelFoco(p.foco)}</p> : null}
            </li>
          ))}
        </ul>
      </Janela>

      {dados.souCriador ? (
        <Janela titulo="Você criou essa sala">
          <form action={largarActionFn} className="flex flex-col gap-3">
            <input type="hidden" name="codigo" value={codigo} />
            <input type="hidden" name="token" value={token ?? ""} />
            <p className="font-mono text-xs text-ink/60">{textoLobbyCriador(dados.inicioMarcado, dados.hoje)}</p>
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
              {largarPending ? "..." : BOTAO_LARGAR_AGORA}
            </button>
          </form>
        </Janela>
      ) : null}

      <AcoesDoDesafio codigo={codigo} nomeSala={nomeDesafio} />
    </main>
  );
}
