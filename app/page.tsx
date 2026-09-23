import { BotaoGrande } from "@/components/BotaoGrande";
import { SeusDesafios } from "@/components/SeusDesafios";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center gap-10 px-4 py-10">
      <header className="space-y-4 text-center">
        <h1 className="font-press text-2xl leading-relaxed sm:text-3xl">
          DESAFIO
        </h1>
        <p className="font-mono text-sm font-bold">
          Um incentivo pra sua melhor versão
          <br />
          <span className="font-normal text-ink/70">(ou o Twitter de aura farmada)</span>
        </p>
        <div className="space-y-2 font-mono text-xs text-ink/70">
          <p>O ritmo é só seu, mas a satisfação é compartilhada.</p>
          <p>Você define suas missões e registra suas realizações.</p>
          <p>
            Seja malhar 3x, estudar 4h, ligar pra família ou só ter cozinhado
            pra semana.
          </p>
        </div>
      </header>

      <SeusDesafios />

      <div className="flex w-full flex-col gap-5">
        <BotaoGrande
          href="/criar"
          cor="amber"
          label="Criar sala"
          sub="Crie um novo desafio entre amigos"
        />
        <BotaoGrande
          href="/entrar"
          cor="cyan"
          label="Entrar em uma sala"
          sub="Já tenho um código"
        />
      </div>
    </main>
  );
}
