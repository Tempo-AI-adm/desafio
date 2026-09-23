import { BotaoGrande } from "@/components/BotaoGrande";
import { SeusDesafios } from "@/components/SeusDesafios";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center gap-10 px-4 py-10">
      <header className="space-y-3 text-center">
        <h1 className="font-press text-2xl leading-relaxed sm:text-3xl">
          DESAFIO
        </h1>
        <p className="font-mono text-sm text-ink/70">
          Um incentivo pra sua melhor versão.
        </p>
      </header>

      <SeusDesafios />

      <div className="flex w-full flex-col gap-5">
        <BotaoGrande
          href="/criar"
          cor="amber"
          label="Criar novo desafio"
          sub="Comece um novo, do zero"
        />
        <BotaoGrande
          href="/entrar"
          cor="cyan"
          label="Entrar com código"
          sub="Recebeu um código ou link? Entra aqui"
        />
      </div>
    </main>
  );
}
