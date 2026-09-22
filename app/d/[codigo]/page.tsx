import Link from "next/link";
import { notFound } from "next/navigation";
import { Janela } from "@/components/Janela";
import { buscarDesafioPorCodigo } from "@/lib/desafios";
import { ESTADO_LABEL, labelBackfill } from "@/lib/copy";

export default async function DesafioPage({ params }: PageProps<"/d/[codigo]">) {
  const { codigo } = await params;
  const desafio = buscarDesafioPorCodigo(codigo);

  if (!desafio) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-5 px-4 py-8">
      <Janela titulo={desafio.nome}>
        <div className="flex flex-col gap-4">
          <dl className="grid grid-cols-2 gap-y-2 font-mono text-sm">
            <dt className="text-ink/60">Código</dt>
            <dd className="text-right font-bold">{desafio.codigo}</dd>
            <dt className="text-ink/60">Duração</dt>
            <dd className="text-right font-bold">{desafio.duracaoDias} dias</dd>
            <dt className="text-ink/60">Dias anteriores</dt>
            <dd className="text-right font-bold">{labelBackfill(desafio.permiteBackfill)}</dd>
            <dt className="text-ink/60">Situação</dt>
            <dd className="text-right font-bold">{ESTADO_LABEL[desafio.estado]}</dd>
          </dl>

          <p className="border-2 border-ink bg-empty/40 px-3 py-2 font-mono text-xs">
            Isso aqui é só uma prévia. Lobby, identidade (nome + emoji) e o
            registro de realizações chegam nas próximas fatias.
          </p>
        </div>
      </Janela>

      <Link
        href="/"
        className="text-center font-mono text-xs font-bold uppercase tracking-widest text-ink/70"
      >
        &larr; voltar pra home
      </Link>
    </main>
  );
}
