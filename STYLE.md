# STYLE.md - guia visual e de copy do "desafio"

Espírito: retrô-terminal com "janelas" de borda dura (ex: typesafe.ai). **Nada de cara de IA** (arredondado, gradiente, limpo demais). Aqui é duro, quadriculado, gameficado.

## Cores
- **Fundo (creme):** `#FAF7F0`
- **Tinta** (texto, bordas, barras de título): `#1E1E1E`
- **Marca 1 - âmbar:** `#FFB000`
- **Marca 2 - ciano:** `#00B4D8`
- **Status "cumpriu" (verde):** `#2FBF71`, só sinal, não é cor de marca
- **Bolinha/quadrado vazio:** `#E6D9C8`
- **Alerta suave (coral), opcional:** `#F1665A`, com muita parcimônia

Fundo claro; **a tinta preta faz a cara** (bordas grossas, barras de título pretas). Âmbar e ciano brilham chapados sobre o creme.

## Tipografia (Google Fonts)
- **Corpo, números, UI:** JetBrains Mono.
- **Títulos grandes / logo:** Press Start 2P (pesada, só títulos curtos).

## Componente: "janela"
Todo bloco é uma janelinha estilo sistema antigo: **barra de título** tinta com texto claro; **corpo** creme com **borda dura preta** (~2px) e **sombra sólida deslocada** (`4px 4px 0 #1E1E1E`); canto reto; **zero gradiente, zero sombra difusa.**

## Componente: cartão da pessoa (topo do dash)
Uma janela por pessoa: nome + emoji na barra de título; corpo com a lista **"Meu inegociável"** (cada item = título + assunto + progresso em **bolinhas** `●●○` se tem alvo, ou um check "cumpri" se não tem); linha **"+N além do combinado"** (extras); rodapé discreto **"visto há X"**.

## Componente: feed
Lista vertical **compacta**, uma linha por realização, não um cartão inflado, mais recente no topo. Cada linha: emoji do assunto + autor + texto curto + horário + botão de reação (o mascote, sempre o mesmo símbolo, sem paleta de emoji) com a contagem ao lado. Sem foto. Filtro **Hoje / Tudo** no topo (default Hoje). Ao registrar, o mascote aparece pequeno comemorando.

A densidade dessa lista se inspira em feeds compactos (ex: Hugging Face), **só a compactação**, não o visual limpo/arredondado dessas referências. A linha continua na mesma linguagem dura do resto: borda preta (~2px), fundo creme, zero gradiente, zero canto arredondado.

## Bolinhas / progresso
Cada unidade do alvo = um quadradinho/bolinha pixel. Preenchido (âmbar) = feito; vazio (`#E6D9C8`) = falta. Além do alvo, não estoura a barra, vira contador de extra.

## Botões
Retângulo com borda dura preta + sombra sólida. No clique **afunda** (tira a sombra, desloca 2px), feedback de fliperama.

## Mascote
Monstrinho quadriculado, deadpan, 1–2 cores, mesma linguagem (borda dura + sombra sólida). Pequeno: header, lobby ("esperando os outros"), ao registrar realização (comemorando), como botão de reação no feed (ver "Reações" no PRD), e no encerramento (comemorando/derrotado). **É símbolo, não personagem.** 2–3 expressões.

## Tom de copy
Energia BR: interjeição curta + ânimo. Fala do **realizado**, nunca compara nem envergonha, nunca "atrasado". Planejado e extra recebem a mesma comemoração. Sem emoji-spam. Maiúscula só em clímax (largar, estourar, encerrar).

**Criar o norte:**
> **Defina seu mínimo inegociável para o desafio.**
> O que você não quer ter deixado de fazer quando ele acabar. Esse é seu norte, e todo mundo vê. Durante o desafio você pode marcar cada inegociável cumprido e adicionar novas realizações.

**Strings-base (ajustar à vontade):**
- **Registrou realização:** "SHOW." / "Boa." / "Mais um." / "Foi."
- **Registrou realização, em camadas pela contagem do dia** (decide qual selo aparece, conta zera todo dia, **não é streak entre dias**):
  - **1ª realização do dia:** "SHOW."
  - **2ª realização do dia:** "TÁ ON FIRE."
  - **3ª realização do dia (ou mais):** "AURA MÁXIMA."
- **Cumpriu um inegociável:** "FECHOU esse." / "Inegociável honrado."
- **Estourou o alvo:** "ESTOUROU. (+1)" / "Além do combinado."
- **Vitória extra:** "Vitória anotada." / "SHOW, isso conta também."
- **Entrou no lobby:** "Chegou. Bora."
- **Todos prontos / largar:** "VALENDO." / "COMEÇOU."
- **Visto:** "ativo agora" / "visto há 2h"
- **Encerramento (todos que se dedicaram):** "VOCÊ FOI." / "CAMPEÃO." / "Fechou o desafio."
