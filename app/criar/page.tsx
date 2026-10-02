import Link from "next/link";
import { sugestoesDeInicio } from "@/lib/periodo";
import { hojeISO } from "@/lib/tempo";
import { FormCriarSala } from "./FormCriarSala";

// Montada a cada pedido (não no build): as sugestões de início dependem
// do "hoje" de Brasília.
export const dynamic = "force-dynamic";

export default function CriarSalaPage() {
  const hoje = hojeISO();
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col gap-5 px-4 py-8">
      <Link href="/" className="font-mono text-xs font-bold uppercase tracking-widest text-ink/70">
        &larr; voltar
      </Link>
      <FormCriarSala hoje={hoje} sugestoes={sugestoesDeInicio(hoje)} />
    </main>
  );
}
