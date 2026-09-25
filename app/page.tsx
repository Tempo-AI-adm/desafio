import { BotaoGrande } from "@/components/BotaoGrande";
import { ExemploResultado } from "@/components/ExemploResultado";
import { RESUMO_LINK, RESUMO_TEXTO } from "@/components/Expansivel";
import { Logo } from "@/components/Logo";
import { SeusDesafios } from "@/components/SeusDesafios";
import { HOME_COMO_FUNCIONA, HOME_COMO_FUNCIONA_TEXTO, HOME_FRASE, HOME_VER_EXEMPLO } from "@/lib/copy";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center gap-8 px-4 py-10">
      <header className="flex w-full flex-col items-center gap-4 text-center">
        <h1 className="w-full">
          <Logo className="mx-auto w-full max-w-[18rem]" />
        </h1>
        <p className="font-mono text-sm text-ink/80">{HOME_FRASE}</p>
      </header>

      <SeusDesafios />

      <div className="flex w-full flex-col gap-5">
        <BotaoGrande href="/criar" cor="amber" label="Criar sala" sub="Crie um novo desafio entre amigos" />
        <BotaoGrande href="/entrar" cor="cyan" label="Entrar em uma sala" sub="Já tenho um código" />
      </div>

      <div className="flex w-full flex-col gap-4">
        <details className="group">
          <summary className={RESUMO_LINK}>
            <span className={RESUMO_TEXTO}>{HOME_COMO_FUNCIONA}</span>
            <span aria-hidden className="inline-block transition-transform group-open:rotate-180">
              ↓
            </span>
          </summary>
          <div className="mt-3 space-y-2 text-center font-mono text-xs text-ink/70">
            {HOME_COMO_FUNCIONA_TEXTO.map((frase) => (
              <p key={frase}>{frase}</p>
            ))}
          </div>
        </details>

        <details className="group">
          <summary className={RESUMO_LINK}>
            <span className={RESUMO_TEXTO}>{HOME_VER_EXEMPLO}</span>
            <span aria-hidden className="inline-block transition-transform group-open:rotate-90">
              →
            </span>
          </summary>
          <div className="mt-3">
            <ExemploResultado />
          </div>
        </details>
      </div>
    </main>
  );
}
