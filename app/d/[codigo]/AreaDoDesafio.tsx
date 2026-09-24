"use client";

import { useActionState, useEffect, useState } from "react";
import { AcoesDoDesafio } from "@/components/AcoesDoDesafio";
import { CabecalhoSala } from "@/components/CabecalhoSala";
import { FeedDaSala } from "@/components/FeedDaSala";
import { FormMissao } from "@/components/FormMissao";
import { Janela } from "@/components/Janela";
import { ProgressoInegociavel } from "@/components/ProgressoInegociavel";
import { ResultadoFinal } from "@/components/ResultadoFinal";
import { ASSUNTOS, emojiDoAssunto } from "@/lib/assuntos-constants";
import { resultadoDaSala } from "@/lib/resultado";
import {
  TITULO_RESULTADO_FINAL,
  labelResumoResultado,
  LABEL_AVISO_DESFAZER,
  LABEL_DESFEITO,
  LABEL_REGISTRO_FEITO,
  TEXTO_LOBBY_NORTE,
  labelComemoracaoPorContagemDoDia,
  labelPronto,
} from "@/lib/copy";
import { JANELA_DESFAZER_MS } from "@/lib/tempo";
import {
  adicionarInegociavelAction,
  alternarProntoAction,
  desfazerRegistroAction,
  largarAction,
  reagirAction,
  registrarInegociavelAction,
  type AdicionarInegociavelState,
  type AlternarProntoState,
  type DesfazerState,
  type LargarState,
  type ReagirState,
  type RegistrarInegociavelState,
} from "./actions";
import type { DadosSala } from "@/lib/tipos-sala";


const ESTADO_INICIAL_INEGOCIAVEL: AdicionarInegociavelState = {};
const ESTADO_INICIAL_PRONTO: AlternarProntoState = {};
const ESTADO_INICIAL_LARGAR: LargarState = {};
const ESTADO_INICIAL_REGISTRAR_INEGOCIAVEL: RegistrarInegociavelState = {};
const ESTADO_INICIAL_REAGIR: ReagirState = {};
const ESTADO_INICIAL_DESFAZER: DesfazerState = {};

// Deriva o selo a mostrar (SHOW./TÁ ON FIRE./AURA MÁXIMA. ou
// "Desfeito.") sem useEffect + setState: pega a ação mais recente pelo
// carimbo de tempo. `key` no elemento reinicia a animação de sumir.
function seloMaisRecente(
  inegociavel: { contagemHoje?: number; carimbo?: number },
  desfazer: { ok?: boolean; carimbo?: number },
): { texto: string; carimbo: number } | null {
  const candidatos = [
    {
      carimbo: inegociavel.carimbo ?? 0,
      texto:
        inegociavel.contagemHoje !== undefined
          ? labelComemoracaoPorContagemDoDia(inegociavel.contagemHoje)
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
  token: string;
  nomeDesafio: string;
}) {
  const [dados, setDados] = useState<DadosSala | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregar, setErroCarregar] = useState(false);
  const [mostrarFormMissao, setMostrarFormMissao] = useState(false);

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

  const [reagirState, reagirActionFn] = useActionState(
    reagirAction,
    ESTADO_INICIAL_REAGIR,
  );

  const [desfazerState, desfazerActionFn, desfazerPending] = useActionState(
    desfazerRegistroAction,
    ESTADO_INICIAL_DESFAZER,
  );

  const selo = seloMaisRecente(registrarInegociavelState, desfazerState);

  // Janela de desfazer: aberta por JANELA_DESFAZER_MS depois de marcar
  // um inegociável. O timer só fecha a janela (setState no callback do
  // setTimeout, não no corpo do efeito). Passou o tempo, o próximo
  // toque é sempre um registro novo.
  const [janelaFechadaCarimbo, setJanelaFechadaCarimbo] = useState<number | null>(null);
  useEffect(() => {
    const carimbo = registrarInegociavelState.carimbo;
    if (!carimbo) return;
    const timer = setTimeout(() => setJanelaFechadaCarimbo(carimbo), JANELA_DESFAZER_MS);
    return () => clearTimeout(timer);
  }, [registrarInegociavelState.carimbo]);

  const janelaDesfazer =
    registrarInegociavelState.ok &&
    registrarInegociavelState.carimbo &&
    registrarInegociavelState.realizacaoId &&
    registrarInegociavelState.inegociavelId &&
    janelaFechadaCarimbo !== registrarInegociavelState.carimbo &&
    desfazerState.desfeitoId !== registrarInegociavelState.realizacaoId
      ? {
          carimbo: registrarInegociavelState.carimbo,
          realizacaoId: registrarInegociavelState.realizacaoId,
          inegociavelId: registrarInegociavelState.inegociavelId,
        }
      : null;

  // Form de "+ Nova missão": fecha sozinho depois de criar com sucesso
  // (o carimbo da action muda), sem setState em efeito.
  const [carimboAoAbrirMissao, setCarimboAoAbrirMissao] = useState(0);
  const formMissaoAberto =
    mostrarFormMissao && (inegociavelState.carimbo ?? 0) === carimboAoAbrirMissao;

  // Busca os dados do lobby: ao montar, ao focar a aba (sem realtime,
  // regra do PRD) e de novo sempre que uma ação (adicionar
  // inegociável, PRONTO, LARGAR, registrar realização) terminar. Tudo
  // num único efeito, com a função assíncrona definida por dentro,
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
    reagirState,
    desfazerState,
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
        />
        <ResultadoFinal
          titulo={TITULO_RESULTADO_FINAL}
          mascote
          resumo={labelResumoResultado(dados.duracaoDias, dados.participantes.length)}
          pessoas={resultadoDaSala(dados)}
          meuId={dados.meuId}
        />
        <FeedDaSala
          feed={dados.feed}
          participantes={dados.participantes}
          hoje={dados.hoje}
          codigo={codigo}
          token={token}
          somenteLeitura
        />
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

        {/* Suas Missões: fixo no topo ao rolar, compacto. Ação rápida
            sempre à mão; o feed embaixo é o conteúdo principal. */}
        <div className="sticky top-0 z-20 -mx-4 bg-cream px-4 pb-2 pt-2">
          <Janela
            compacto
            painel
            titulo={
              <>
                <span>Suas Missões</span>
                <button
                  type="button"
                  onClick={() => {
                    if (formMissaoAberto) {
                      setMostrarFormMissao(false);
                    } else {
                      setCarimboAoAbrirMissao(inegociavelState.carimbo ?? 0);
                      setMostrarFormMissao(true);
                    }
                  }}
                  className="shrink-0 bg-cyan px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-ink transition-transform active:translate-x-[1px] active:translate-y-[1px]"
                >
                  {formMissaoAberto ? "Fechar" : "+ Nova missão"}
                </button>
              </>
            }
          >
            <div className="flex flex-col gap-2">
              <ul className="flex flex-wrap gap-2">
                {dados.meusInegociaveis.map((i) => {
                  const naJanela = janelaDesfazer?.inegociavelId === i.id;
                  return (
                    <li key={i.id}>
                      <form action={naJanela ? desfazerActionFn : registrarInegociavelActionFn}>
                        <input type="hidden" name="codigo" value={codigo} />
                        <input type="hidden" name="token" value={token} />
                        <input type="hidden" name="inegociavelId" value={i.id} />
                        {naJanela ? (
                          <input type="hidden" name="realizacaoId" value={janelaDesfazer.realizacaoId} />
                        ) : null}
                        <button
                          type="submit"
                          disabled={registrarInegociavelPending || desfazerPending}
                          className={`flex items-center gap-1.5 border-2 border-ink px-2 py-1.5 font-mono text-xs shadow-hard-sm transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:opacity-60 ${
                            naJanela ? "bg-amber" : "bg-cream"
                          }`}
                        >
                          <span className="text-left">
                            {emojiDoAssunto(i.assunto)} {i.titulo}
                          </span>
                          <ProgressoInegociavel alvo={i.alvo} progresso={i.progresso} sobreAmbar={naJanela} />
                        </button>
                      </form>
                    </li>
                  );
                })}
                {/* Registros antigos do tempo da "vitória extra" (antes de
                    virar "+ Nova missão"): no mesmo fluxo das missões, com
                    a largura do conteúdo e "✓" (já são coisas feitas). Sem
                    sombra: não são botões, não dá pra marcar. */}
                {dados.meusExtras.map((r) => (
                  <li
                    key={r.id}
                    className="flex max-w-full items-center gap-1.5 border-2 border-ink bg-cream px-2 py-1.5 font-mono text-xs"
                  >
                    <span className="min-w-0 break-words">
                      {emojiDoAssunto(r.assunto)} {r.texto}
                    </span>
                    <span aria-label={LABEL_REGISTRO_FEITO} className="shrink-0 font-bold text-green">
                      ✓
                    </span>
                  </li>
                ))}
              </ul>

              {janelaDesfazer ? (
                <div
                  key={janelaDesfazer.carimbo}
                  className="relative overflow-hidden border-2 border-ink bg-amber px-2 py-1 font-mono text-xs font-bold"
                >
                  {LABEL_AVISO_DESFAZER}
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-0 h-1 w-full origin-left bg-ink"
                    style={{ animation: `janela-desfazer ${JANELA_DESFAZER_MS}ms linear forwards` }}
                  />
                </div>
              ) : (
                <p className="font-mono text-[11px] text-ink/60">Toca numa missão pra marcar +1.</p>
              )}

              {registrarInegociavelState.error || desfazerState.error ? (
                <p className="border-2 border-coral bg-cream px-2 py-1 font-mono text-xs text-coral">
                  {desfazerState.error ?? registrarInegociavelState.error}
                </p>
              ) : null}

              {formMissaoAberto ? (
                <FormMissao
                  codigo={codigo}
                  token={token}
                  action={inegociavelAction}
                  pending={inegociavelPending}
                  error={inegociavelState.error}
                  rotuloTitulo="Nova missão"
                  rotuloBotao="Adicionar missão"
                  className="border-t-2 border-ink/15 pt-2"
                />
              ) : null}
            </div>
          </Janela>
        </div>

        <FeedDaSala
          feed={dados.feed}
          participantes={dados.participantes}
          hoje={dados.hoje}
          codigo={codigo}
          token={token}
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

  // dados.estado === "lobby"
  const temInegociavel = dados.meusInegociaveis.length > 0;

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col gap-5 px-4 py-8">
      <CabecalhoSala
        salaNome={dados.salaNome}
        duracaoDias={dados.duracaoDias}
        diaAtual={dados.diaAtual}
        hoje={dados.hoje}
        agora={dados.agora}
      />

      <Janela titulo="Seu inegociável">
        <div className="flex flex-col gap-4">
          <p className="font-mono text-sm text-ink/70">{TEXTO_LOBBY_NORTE}</p>

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
            <FormMissao
              key={dados.meusInegociaveis.length}
              codigo={codigo}
              token={token}
              action={inegociavelAction}
              pending={inegociavelPending}
              error={inegociavelState.error}
              rotuloTitulo={`Título do inegociável ${dados.meusInegociaveis.length + 1}`}
              rotuloBotao="Adicionar inegociável"
              className="border-t-2 border-empty pt-4"
            />
          ) : null}

          {temInegociavel && !dados.meuPronto ? (
            <p className="border-2 border-ink bg-empty/40 px-3 py-2 font-mono text-xs text-ink/70">
              Quer adicionar outro inegociável? Adicione acima.
              <br />
              Pronto pra começar? Aperte <span className="font-bold text-ink">PRONTO</span>.
            </p>
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
        <Janela titulo="Você criou essa sala">
          <form action={largarActionFn} className="flex flex-col gap-3">
            <input type="hidden" name="codigo" value={codigo} />
            <input type="hidden" name="token" value={token} />
            <p className="font-mono text-xs text-ink/60">
              Você pode largar mesmo que nem todo mundo esteja pronto, a
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

      <AcoesDoDesafio codigo={codigo} nomeSala={nomeDesafio} />
    </main>
  );
}
