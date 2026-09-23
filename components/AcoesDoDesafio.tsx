"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { removerDesafioLocal } from "@/lib/identidade-local";

/**
 * Rodapé da tela de um desafio: criar outro, ou sair deste. "Sair" só
 * tira o desafio da lista local da Home (ver lib/identidade-local.ts),
 * não apaga nada no banco nem o token. Dá pra voltar pelo código.
 */
export function AcoesDoDesafio({ codigo }: { codigo: string }) {
  const router = useRouter();

  function sair() {
    removerDesafioLocal(codigo);
    router.push("/");
  }

  return (
    <div className="flex gap-3">
      <Link
        href="/criar"
        className="flex-1 border-2 border-ink bg-cream px-3 py-3 text-center font-mono text-xs font-bold uppercase tracking-widest shadow-hard transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        Criar nova sala
      </Link>
      <button
        type="button"
        onClick={sair}
        className="flex-1 border-2 border-ink bg-cream px-3 py-3 font-mono text-xs font-bold uppercase tracking-widest shadow-hard transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        Sair desta sala
      </button>
    </div>
  );
}
