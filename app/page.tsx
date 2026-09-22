import { BotaoGrande } from "@/components/BotaoGrande";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center gap-10 px-4 py-10">
      <header className="space-y-3 text-center">
        <h1 className="font-press text-2xl leading-relaxed sm:text-3xl">
          DESAFIO
        </h1>
        <p className="font-mono text-sm text-ink/70">
          Constância com os amigos. Todo mundo vê tudo, ninguém compete.
        </p>
      </header>

      <div className="flex w-full flex-col gap-5">
        <BotaoGrande
          href="/criar"
          cor="amber"
          label="Criar desafio"
          sub="Comece um novo, do zero"
        />
        <BotaoGrande
          href="/entrar"
          cor="cyan"
          label="Entrar em um desafio"
          sub="Já tenho um código"
        />
      </div>
    </main>
  );
}
