import Link from "next/link";
import { notFound } from "next/navigation";
import { Janela } from "@/components/Janela";
import { CopiarLinkBotao } from "@/components/CopiarLinkBotao";
import { buscarDesafioPorCodigo } from "@/lib/desafios";

export default async function DesafioCriadoPage({
  params,
}: PageProps<"/criar/sucesso/[codigo]">) {
  const { codigo } = await params;
  const desafio = buscarDesafioPorCodigo(codigo);

  if (!desafio) {
    notFound();
  }

  const link = `/d/${desafio.codigo}`;

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-4 py-8">
      <header className="space-y-1 text-center">
        <p className="font-press text-lg leading-relaxed text-ink">VALENDO.</p>
        <p className="font-mono text-sm text-ink/70">Desafio criado. Manda esse link no grupo.</p>
      </header>

      <Janela titulo={desafio.nome}>
        <div className="flex flex-col gap-5">
          <dl className="grid grid-cols-2 gap-y-2 font-mono text-sm">
            <dt className="text-ink/60">Duração</dt>
            <dd className="text-right font-bold">{desafio.duracaoDias} dias</dd>
            <dt className="text-ink/60">Backfill</dt>
            <dd className="text-right font-bold">
              {desafio.permiteBackfill ? "Sim" : "Não"}
            </dd>
            <dt className="text-ink/60">Estado</dt>
            <dd className="text-right font-bold uppercase">{desafio.estado}</dd>
          </dl>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest">
              Link do desafio
            </span>
            <div className="border-2 border-ink bg-empty/40 px-3 py-2 font-mono text-sm break-all">
              {link}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <CopiarLinkBotao texto={link} />
            <Link
              href={link}
              className="flex-1 border-2 border-ink bg-amber px-4 py-3 text-center font-mono text-sm font-bold uppercase tracking-widest shadow-hard transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              Ir pro desafio
            </Link>
          </div>
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
