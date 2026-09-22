import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarDesafioPorCodigo } from "@/lib/desafios";
import { DesafioClient } from "./DesafioClient";

export default async function DesafioPage({ params }: PageProps<"/d/[codigo]">) {
  const { codigo } = await params;
  const desafio = buscarDesafioPorCodigo(codigo);

  if (!desafio) {
    notFound();
  }

  return (
    <>
      <DesafioClient
        desafio={{
          codigo: desafio.codigo,
          nome: desafio.nome,
          duracaoDias: desafio.duracaoDias,
          permiteBackfill: desafio.permiteBackfill,
          estado: desafio.estado,
        }}
      />
      <div className="mx-auto max-w-sm px-4 pb-8">
        <Link
          href="/"
          className="block text-center font-mono text-xs font-bold uppercase tracking-widest text-ink/70"
        >
          &larr; voltar pra home
        </Link>
      </div>
    </>
  );
}
