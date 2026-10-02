# STYLE.md - guia visual e de copy do "desafioo"

O tom e as palavras (permitidas e banidas) vêm do `MOOD.md`, que vence este arquivo. Aqui fica o visual e as strings-base.

Espírito: retrô-terminal com "janelas" de borda dura (ex: typesafe.ai). **Nada de cara de IA** (arredondado, gradiente, limpo demais). Aqui é duro, quadriculado, gameficado.

## Cores
- **Fundo (creme):** `#FAF7F0`
- **Tinta** (texto, bordas, barras de título): `#1E1E1E`
- **Marca 1 - âmbar:** `#FFB000`
- **Marca 2 - ciano:** `#00B4D8`
- **Status "cumpriu" (verde):** `#2FBF71`, só sinal, não é cor de marca
- **Bolinha/quadrado vazio:** `#E6D9C8`
- **Cinza-painel:** `#DEDEDE`, fundo do **corpo** de janelas secundárias (cabeçalho da sala e "Seu desafio"). Barra de título continua tinta, borda e sombra continuam pretas. O feed fica creme e, sendo a única janela clara, se destaca.
- **Alerta suave (coral), opcional:** `#F1665A`, com muita parcimônia

Fundo claro; **a tinta preta faz a cara** (bordas grossas, barras de título pretas). Âmbar e ciano brilham chapados sobre o creme.

## Tipografia (Google Fonts)
- **Corpo, números, UI:** JetBrains Mono.
- **Logo "desafioo":** SVG desenhado no Figma (`components/Logo.tsx`), não é texto. Cores = tinta + cinza-painel; proporção fixa 66x10.
- **Títulos grandes:** Press Start 2P (pesada, só títulos curtos). Sempre em **MAIÚSCULAS**: as minúsculas dessa fonte são baixinhas e parecem espremidas.

## Componente: "janela"
Todo bloco é uma janelinha estilo sistema antigo: **barra de título** tinta, **fina** (texto pequeno, pouco respiro vertical, pra não pesar), com texto claro; **corpo** creme com **borda dura preta** (~2px) e **sombra sólida deslocada** (`4px 4px 0 #1E1E1E`); canto reto; **zero gradiente, zero sombra difusa.**

## Componente: bloco "Seu desafio"
Uma janela (corpo cinza-painel) com "Seu desafio" na barra de título; corpo com a meta da semana em **bolinhas** (`●●●○○`, "3 de 5 essa semana"), o foco da pessoa ("foco: ...") e o botão grande **"+ Registrar"** (âmbar, borda dura, sombra sólida).

## Componente: foguinho ("em chamas")
Ícone de fogo em pixel art (poucos blocos, `shape-rendering: crispEdges`), ao lado do nome da pessoa. Segue a contagem do dia: **2ª realização** = pequeno, só âmbar; **3ª ou mais** = maior, chama coral com miolo âmbar. Some quando o dia vira. Não é streak. **Respira**: pulsação leve de escala (100% → 110% → 100%, ~1,1s, em loop) pra sinalizar que dá pra tocar; desligada pra quem pede menos movimento no sistema.

## Componente: feed
Lista vertical **compacta**, uma linha por realização, não um cartão inflado, mais recente no topo. Cada linha: autor + frase + marquinha de foco (só quando o registro foi no foco; nunca existe marca de "fora do foco") + horário + botão de reação (os olhinhos, sempre o mesmo símbolo, sem paleta de emoji) com a contagem ao lado. Sem filtro: sempre tudo; item de outro dia mostra a data junto da hora ("22/09 · 15:31"). Ao registrar, o mascote aparece pequeno comemorando.

A densidade dessa lista se inspira em feeds compactos (ex: Hugging Face), **só a compactação**, não o visual limpo/arredondado dessas referências. A linha continua na mesma linguagem dura do resto: borda preta (~2px), fundo creme, zero gradiente, zero canto arredondado.

## Insígnias tocáveis (legenda)
Toda insígnia que, ao tocar, revela uma legenda (foguinho, estrela de bônus, chip "dias em chamas") tem a mesma pista de "dá pra tocar": **cursor de mão** no desktop e **contorno tracejado** (visível no celular). Ícone sozinho = contorno tracejado fino em volta; chip = borda tracejada no lugar da cheia. **Tracejado = tocável**; borda cheia = só informação. A legenda aparece ao lado e some sozinha.

## Bolinhas / progresso
Cada unidade da meta da semana = um quadradinho/bolinha pixel. Preenchido (âmbar) = feito; vazio (`#E6D9C8`) = ainda por vir. Além da meta, continua enchendo bolinhas em **coral** (bônus; âmbar = combinado, até 5 bolinhas de bônus e depois "+N") e aparece a **estrelinha** pixel art (âmbar, contorno de tinta, mesma linguagem do foguinho) ao lado: "bateu e passou do combinado".

## Botões
Retângulo com borda dura preta + sombra sólida. No clique **afunda** (tira a sombra, desloca 2px), feedback de fliperama.

## Mascote
O par de **olhinhos** do logo "desafioo" (SVGs de olho aberto/fechado do Figma, `components/Olhinhos.tsx`; cores = tinta + cinza-painel). Como decoração, **pisca** (troca seca aberto→fechado, ~150ms, a cada ~4-6s) e **sobe e desce de leve**, CSS puro, parado pra quem pede menos movimento. Como ícone de reação (botão do feed, chip de reações do resultado) fica **parado**, olho aberto. Pequeno, discreto. **É símbolo, não personagem.** (Substitui o antigo monstrinho azul.)

## Tom de copy
Segue o `MOOD.md` (que vence aqui). Resumo: energia BR, interjeição curta + ânimo. Fala do **realizado**, nunca compara nem envergonha. Todo registro recebe a mesma comemoração. Sem emoji-spam, sem travessão. Maiúscula só em clímax (largar, estourar, encerrar). Frase completa quando o momento pede explicação, curta quando é celebração.

**Strings-base (ajustar à vontade):**
- **Registrou realização:** "SHOW." / "Boa." / "Mais um." / "Foi."
- **Registrou realização, em camadas pela contagem do dia** (decide qual selo aparece, conta zera todo dia, **não é streak entre dias**):
  - **1ª realização do dia:** "SHOW."
  - **2ª realização do dia:** "TÁ ON FIRE."
  - **3ª realização do dia (ou mais):** "AURA MÁXIMA."
- **Bateu a meta da semana:** "FECHOU A SEMANA."
- **Passou da meta da semana:** "ESTOUROU. (+1)" / "Além do combinado."
- **Entrou no lobby:** "Chegou. Bora."
- **Largada (manual ou automática na data marcada):** "VALENDO." / "COMEÇOU." (não na criação da sala)
- **Visto:** "ativo agora" / "visto há 2h"
- **Resultado (selo binário por pessoa):** "FECHOU TUDO QUE SE PROPÔS." (âmbar) / "SEGUIU NO PRÓPRIO RITMO." (neutro)
