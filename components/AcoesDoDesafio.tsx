"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { mensagemCompartilharSala } from "@/lib/copy";
import { removerDesafioLocal } from "@/lib/identidade-local";

// Três botões lado a lado, mesmo tamanho (flex-1 + mesma altura).
// Texto pequeno e com quebra de linha pra caber em tela de celular.
const BOTAO =
  "flex flex-1 items-center justify-center border-2 border-ink px-1.5 py-2.5 text-center font-mono text-[11px] font-bold uppercase leading-tight tracking-wide shadow-hard-sm transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none";

/**
 * Rodapé da tela de uma sala: compartilhar no WhatsApp, criar outra,
 * ou sair desta. "Compartilhar" só abre o link padrão wa.me com uma
 * mensagem pronta (sem API, sem integração). "Sair" só tira a sala da
 * lista local da Home (ver lib/identidade-local.ts), não apaga nada no
 * banco nem o token. Dá pra voltar pelo código.
 */
export function AcoesDoDesafio({ codigo, nomeSala }: { codigo: string; nomeSala: string }) {
  const router = useRouter();

  function compartilhar() {
    // O link completo só existe no navegador (depende do domínio em
    // que o app está: Vercel, localhost...), por isso é montado no clique.
    const link = `${window.location.origin}/d/${codigo}`;
    const url = `https://wa.me/?text=${encodeURIComponent(mensagemCompartilharSala(nomeSala, link))}`;
    // Nova aba; se o navegador bloquear o pop-up, abre na mesma aba.
    const aba = window.open(url, "_blank");
    if (aba) aba.opener = null;
    else window.location.href = url;
  }

  function sair() {
    removerDesafioLocal(codigo);
    router.push("/");
  }

  return (
    <div className="flex items-stretch gap-2">
      <button type="button" onClick={compartilhar} className={`${BOTAO} bg-cyan`}>
        Compartilhar sala
      </button>
      <Link href="/criar" className={`${BOTAO} bg-cream`}>
        Criar nova sala
      </Link>
      <button type="button" onClick={sair} className={`${BOTAO} bg-cream`}>
        Sair desta sala
      </button>
    </div>
  );
}
