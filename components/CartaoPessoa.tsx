import { Fogo } from "@/components/Fogo";
import { Janela } from "@/components/Janela";
import { ProgressoInegociavel } from "@/components/ProgressoInegociavel";
import { emojiDoAssunto } from "@/lib/assuntos-constants";
import { LABEL_ATIVO_HOJE, labelAlemDoCombinado, labelVistoHa } from "@/lib/copy";
import type { ParticipanteSala } from "@/lib/tipos-sala";

/**
 * Cartão de uma pessoa na sala rolando (STYLE.md "cartão da pessoa"):
 * nome + emoji (+ foguinho) na barra, inegociáveis com progresso,
 * "+N além do combinado", "visto há X" e o selo "ativo hoje".
 */
export function CartaoPessoa({ pessoa, souEu }: { pessoa: ParticipanteSala; souEu: boolean }) {
  return (
    <Janela
      titulo={
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate">
            {pessoa.emoji} {pessoa.nome}
            {souEu ? " (você)" : ""}
          </span>
          <Fogo contagemHoje={pessoa.contagemHoje} tamanho="compacto" />
        </span>
      }
    >
      <div className="flex flex-col gap-2 font-mono text-sm">
        <ul className="flex flex-col gap-1">
          {pessoa.inegociaveis.map((i) => (
            <li key={i.id} className="flex items-center justify-between gap-2">
              <span className="min-w-0 truncate">
                {emojiDoAssunto(i.assunto)} {i.titulo}
              </span>
              <ProgressoInegociavel alvo={i.alvo} progresso={i.progresso} />
            </li>
          ))}
        </ul>

        {pessoa.extras > 0 ? (
          <p className="text-xs font-bold">{labelAlemDoCombinado(pessoa.extras)}</p>
        ) : null}

        <div className="flex items-center justify-between gap-2 border-t-2 border-empty pt-2 text-xs text-ink/60">
          <span>{labelVistoHa(pessoa.minutosDesdeAtividade)}</span>
          {pessoa.ativoHoje ? (
            <span className="flex items-center gap-1 font-bold text-green">
              <span aria-hidden className="inline-block h-2 w-2 bg-green" />
              {LABEL_ATIVO_HOJE}
            </span>
          ) : null}
        </div>
      </div>
    </Janela>
  );
}
