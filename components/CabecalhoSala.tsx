import { Fogo } from "@/components/Fogo";
import { Janela } from "@/components/Janela";
import { LinhaEncerrado } from "@/components/LinhaEncerrado";
import {
  LABEL_ATIVOS_HOJE,
  LABEL_SO_VOCE_HOJE,
  labelDiaDoDesafio,
  labelDuracao,
  labelReacoesNovas,
  labelResumoDoDia,
  labelVistoHa,
} from "@/lib/copy";
import { diaCurto, horaCurta } from "@/lib/tempo";
import type { ParticipanteSala } from "@/lib/tipos-sala";

/**
 * Cabeçalho da sala (lobby, rolando e encerrada), na mesma linguagem de
 * janela do resto da tela (STYLE.md "janela"). O NOME DA SALA é a barra
 * de título (sem título grande em fonte pixel dentro do balão). No
 * corpo, compacto: "DIA X/Y" (ou só a duração antes de largar) + data e
 * hora da última busca (fuso de Brasília; sem relógio rodando).
 * Encerrada: selo neutro "ENCERRADO" + "16/09 a 22/09 · 7 dias · 2 amigos".
 * Com a sala rolando, o resumo do dia (o motivo pra abrir o app: quantos
 * já registraram hoje, reações novas nos seus registros) junto de
 * "Ativos hoje" (a própria pessoa primeiro, com o foguinho de quem tiver).
 */
export function CabecalhoSala({
  salaNome,
  duracaoDias,
  diaAtual,
  hoje,
  agora,
  ativosHoje,
  periodoEncerrado,
  quantidadePessoas,
  resumoDoDia,
}: {
  salaNome: string;
  duracaoDias: number;
  diaAtual: number | null;
  hoje: string;
  /** momento da última busca da sala (não é relógio ao vivo: atualiza ao
   * abrir, ao voltar pra aba e depois de cada ação) */
  agora: string;
  /** só na sala rolando; no lobby quem já chegou aparece em outra janela */
  ativosHoje?: ParticipanteSala[];
  /** só na sala encerrada: troca "Dia X/Y" + hoje por "Encerrado" + período */
  periodoEncerrado?: { inicio: string; fim: string } | null;
  /** só na sala encerrada, pro "· 2 amigos" */
  quantidadePessoas?: number;
  /** só na sala rolando: "hoje 2 de 4 já registraram" + reações novas */
  resumoDoDia?: { registraram: number; total: number; reacoesNovas: number } | null;
}) {
  return (
    <Janela titulo={<h1 className="min-w-0 break-words">{salaNome}</h1>} painel compacto>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {periodoEncerrado ? (
          // Encerrada: selo neutro (status, não conquista) + período real
          // do desafio; a hora de agora não importa mais.
          <LinhaEncerrado
            periodo={periodoEncerrado}
            duracaoDias={duracaoDias}
            pessoas={quantidadePessoas ?? 0}
          />
        ) : (
          <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest">
            <span className="border-2 border-ink bg-amber px-1.5">
              {diaAtual !== null ? labelDiaDoDesafio(diaAtual, duracaoDias) : labelDuracao(duracaoDias)}
            </span>
            <span className="text-ink/60">
              {diaCurto(hoje)} · {horaCurta(agora)}
            </span>
          </div>
        )}
      </div>

      {resumoDoDia ? (
        <div className="mt-2 flex flex-col gap-0.5 border-t-2 border-ink/15 pt-1.5 font-mono text-xs">
          <p className="font-bold">{labelResumoDoDia(resumoDoDia.registraram, resumoDoDia.total)}</p>
          {resumoDoDia.reacoesNovas > 0 ? (
            <p className="text-ink/70">{labelReacoesNovas(resumoDoDia.reacoesNovas)}</p>
          ) : null}
        </div>
      ) : null}

      {ativosHoje ? (
        <div className="mt-2 flex flex-col gap-1 border-t-2 border-ink/15 pt-1.5">
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-ink/60">
            <span aria-hidden className="inline-block h-2 w-2 bg-green" />
            {LABEL_ATIVOS_HOJE}
          </span>
          {/* Lista simples, sem caixa por pessoa (não parece botão),
              separada só por espaço: um "·" começaria a linha quando a
              lista quebra. */}
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs font-bold">
            {ativosHoje.map((p) => (
              <li key={p.id} title={labelVistoHa(p.minutosDesdeAtividade)} className="flex items-center gap-1">
                <span>{p.emoji}</span>
                <span className="max-w-[7rem] truncate">{p.nome}</span>
                <Fogo contagemHoje={p.contagemHoje} tamanho="compacto" />
              </li>
            ))}
          </ul>
          {ativosHoje.length <= 1 ? (
            <p className="font-mono text-[11px] text-ink/60">{LABEL_SO_VOCE_HOJE}</p>
          ) : null}
        </div>
      ) : null}
    </Janela>
  );
}
