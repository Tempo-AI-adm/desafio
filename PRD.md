# desafioo - PRD (v2)

Descreve **o que** o app faz, tela a tela, a partir das regras do `CONCEITO.md` (fonte de verdade das regras) e do sentimento do `MOOD.md` (fonte de verdade do tom). Onde este documento divergir dos dois, eles vencem. Visual e copy-base em `STYLE.md`; regras de execução em `CLAUDE.md`.

## O que é
> Você combina com amigos quantas coisas boas quer realizar por semana. Quando fizer uma, registra com um toque, e o grupo comemora junto.

Alguém chama "bora um desafio?". Cada pessoa se propõe a realizar **um número de coisas boas por semana**, com um **foco opcional**. Durante o período, registra o que fez com um toque (frase opcional) e o grupo celebra junto, num feed compartilhado. No fim, todos veem o resultado e podem começar a próxima rodada. Sério no fundo, leve e gameficado na forma.

## Princípios (não violar)
- **O ritmo é só seu, mas a satisfação é compartilhada.** O compromisso é individual; a experiência é coletiva.
- **Não é competição.** Sem ranking, sem vencedor, sem comparar pessoas por quantidade. O número que aparece é do **grupo**, nunca de uma pessoa ao lado de outra.
- **Não é cobrança.** Nunca "atrasado", "devendo", "falhou". O app não persegue quem sumiu: sem lembrete, sem insistência.
- **Todo registro conta.** Qualquer coisa que fez bem à pessoa vale. Não existe "extra que não vale".
- **Explicações generosas.** Todo momento-chave tem uma frase que explica o sentimento, não só a mecânica (o teste: "minha mãe precisa conseguir usar").
- **Simplicidade.** Onboarding por link único; a única coisa que se manda no grupo é "entra nesse link".
- **Sem login.** Identidade por dispositivo.

## Vocabulário na tela
- **"desafioo"** é o nome do app (logo); **"desafio"** é a atividade ("o desafio começou").
- **"Sala"** é o que se cria e compartilha (criar sala, entrar numa sala, suas salas). Rotas e banco continuam como estão (`/d/[codigo]`, `/criar`, `/entrar`).
- **"Realização"** / **"registro"**: uma coisa boa que a pessoa fez e registrou.
- **"Meta da semana"**: quantas coisas boas a pessoa se propôs a realizar por semana.
- **"Foco"**: o que a pessoa quer priorizar nesse período (opcional).
- Não existem mais "missão", "inegociável", "vitória extra", "única/repetir" nem chips de assunto no registro.

## Identidade (sem login)
- Uma sala = **um link único** (`/d/PEGA42`).
- Na 1ª vez que um dispositivo abre o link, a pessoa escolhe **nome + emoji** e faz o seu compromisso (ver abaixo).
- O dispositivo guarda um **token secreto** no navegador; nas próximas visitas é reconhecido. Limpar dados / trocar de celular = perde a identidade (aceito).
- **Todos veem tudo** (exceto o placar privado do foco, ver "Os números"). Cada dispositivo só edita o que é seu.
- **Lista local de salas:** o navegador guarda as **3 mais recentes** (código + nome + emoji da pessoa). Sair da lista não apaga nada no banco. Sala que não existe mais no banco sai da lista sozinha.

## Home
Nesta ordem:
1. Logo **desafioo** (os olhinhos piscando).
2. A frase-âncora: **"Um incentivo pra sua melhor versão."**, com o ritual logo abaixo como explicação: "Você combina com amigos quantas coisas boas quer realizar por semana. Quando fizer uma, registra com um toque, e o grupo comemora junto."
3. Data e hora de agora, compactas ("qui, 1 out · 15:39", fuso de Brasília).
4. **Suas salas** (só se a lista local tiver alguma): cartão por sala com nome + seu emoji + estado ("esperando" / "rolando" / "encerrada"), levando pra `/d/[codigo]`.
5. Botões **"Criar sala"** e **"Entrar numa sala"** (por código).
6. Links pequenos que abrem no lugar: **"Como funciona"** (reabre o onboarding) e **"Ver um exemplo do resultado final"** (card decorativo com dados FIXOS, rótulo "exemplo", janela com fundo cinza, no modelo novo).

**Onboarding:** na primeira visita (marcado no navegador), um modal com **3 telas curtas** e botão "pular", reabrível em "Como funciona". O sentido de cada tela (o texto final segue o MOOD):
1. O ritual (base: "Você combina com amigos quantas coisas boas quer realizar por semana. Quando fizer uma, registra com um toque, e o grupo comemora junto."), no seu ritmo.
2. Qualquer coisa que te faz bem conta, e você registra quando fizer.
3. O grupo acompanha e comemora junto. Ninguém compete.

## Criar sala
- **Nome da sala** + **período**: atalhos **1 semana**, **2 semanas**, **1 mês**, ou **até uma data**.
- **Data de início**: o criador escolhe. A tela **sugere** a próxima segunda-feira ou o próximo dia 1 (recomeços em marcos de tempo aumentam a disposição), sem obrigar.
- Não existe mais a opção de registrar em dias anteriores (backfill): o registro é sempre de hoje.
- Ao criar: tela de "sala criada" com o link pra mandar no grupo (sem "VALENDO.", que é da largada).

## Ciclo da sala
`LOBBY → ROLANDO → ENCERRADA`
- **Lobby:** as pessoas entram e se propõem. O criador vê quem chegou.
- **Largada:** automática **na data de início marcada** (sem job agendado: na primeira busca da sala a partir desse dia, a sala vira "rolando", e o início conta da meia-noite de Brasília desse dia). O criador pode **largar antes** (botão LARGAR); aí o início é o momento do toque.
- **Rolando:** dá pra registrar. Quem chega agora ainda pode entrar, se propor e participar a partir dali (as semanas anteriores não contam pra essa pessoa).
- **Encerrada:** automático ao fim do período (meia-noite de Brasília depois do último dia), na primeira busca. Daí em diante o servidor recusa registrar, desfazer e reagir. **Ninguém novo vira participante:** quem abre o link sem ser participante vê o resultado só em leitura.

## Semanas
- As semanas contam em **blocos de 7 dias a partir do início** (dia da largada).
- Se a última semana for parcial, a meta dela é **proporcional aos dias**, arredondando pra cima, mínimo 1 (ex: meta 5, semana de 3 dias = 3).
- Quem entra com a sala rolando conta a partir da semana em que entrou; a semana da entrada segue a mesma regra proporcional pelos dias que restam nela.

## O compromisso de cada pessoa
Ao entrar na sala, a pessoa:
1. Escolhe **nome e emoji**.
2. Responde **"quantas coisas boas você quer realizar por semana?"**: atalhos 3, 5 e 7, ou outro número. **Obrigatório.**
3. Responde, se quiser, **"tem algum foco nesse período?"**: texto curto (ex: "estudar pro concurso", "voltar a treinar"). **Opcional.**
4. Vê exemplos do que vale como realização: malhar, ler 20 páginas, tomar uma decisão que vinha adiando, resolver uma pendência, ligar pra família, cozinhar pra semana, organizar algo da casa, estudar.

Cada pessoa tem **um** compromisso por sala. Dá pra ajustar no lobby; **congela na largada**. Quem entra com a sala rolando se propõe na entrada e o compromisso já nasce congelado.

## Registrar uma realização
- Botão grande **"+ Registrar"** sempre visível na sala rolando.
- **Registrar é um toque** no botão. Ao lado dele, controles discretos e sempre visíveis (nada de popup, convite ou pergunta empurrando a escrever):
  - **"+ frase"**: abre ali mesmo um campo opcional (até 200 letras) pro que você fez;
  - **"+ foto"**: quando fotos existirem (bloco próprio);
  - **"no meu foco"**: só pra quem definiu foco; um toque liga (começa desligado), e o próximo registro sai marcado como no foco.
- Registro sem frase aparece no feed como **"[nome] registrou"**, com celebração, reação e foguinho normais.
- O **dia é sempre hoje** (fuso de Brasília).
- **Desfazer (janela curta):** depois de registrar, aparece por ~5s o aviso "Feito. Toque aqui pra desfazer." (o próprio aviso é o botão; o botão grande continua sempre registrando, pra quem quiser registrar duas coisas seguidas). Passou a janela, não desfaz mais (o servidor recusa com mais de 10s). Pra ninguém ver um registro desfeito a tempo, o registro de outra pessoa só aparece pros outros depois de ~7s.
- **Comemoração por contagem do dia** (zera à meia-noite de Brasília, não é streak): 1º do dia "SHOW.", 2º "TÁ ON FIRE.", 3º ou mais "AURA MÁXIMA.".
- (Foto opcional: bloco próprio, depois. WhatsApp: bloco próprio, depois.)

## Retenção: por que a pessoa volta
- **A obrigação é semanal** (cota de coisas boas por semana), **sem sequência de dias**: sequência pune quem quebra e contraria o MOOD. "Dias em chamas" e "FECHOU A SEMANA." continuam; **nenhum contador zera**.
- **A puxada diária vem do grupo.** O **resumo do dia** é o motivo pra abrir o app: quantas pessoas já registraram hoje ("hoje 2 de 4 já registraram", sem nomes de quem não registrou), reações novas nos seus registros desde a última vez que você abriu, e o foguinho de quem está em chamas hoje. Fica no cabeçalho da sala rolando, junto de "Ativos hoje".
- O desenho assume **grupos de 3 ou mais pessoas ativas**.

## Os números
- **Da pessoa, na semana:** "3 de 5 essa semana", com bolinhas. Passar da meta vira **bônus** (estrela e bolinhas coral), celebrado, mas não conta a mais em nenhum número.
- **Da pessoa, no desafio (só pro cálculo, ninguém vê):** soma, semana a semana, de `min(realizações da semana, meta da semana)`, dividida pela soma das metas de **todas as semanas do desafio** que contam pra ela.
- **Do grupo:** média do progresso das pessoas (cada pessoa pesa igual, quem tem meta maior não pesa mais). Pessoa sem compromisso ainda não entra na média. Como o denominador é o desafio inteiro, **o número só sobe**: começa em 0% e cresce a cada registro. É o único número coletivo, mostrado como **um número só da sala**, nunca por pessoa.
- **Linha de contexto do número (sempre visível):** ligada ao tempo, não a um limiar, ex: "dia 8 de 30, o número vai enchendo até o fim do desafio". Como o número só sobe, ela explica por que ele é pequeno no começo sem nunca soar como cobrança.
- **Foguinho:** 2 ou mais realizações no mesmo dia (pequeno na 2ª, maior na 3ª+). Não é streak.
- **Foco:** o texto do foco é **público** ("foco: voltar a treinar", no bloco da pessoa e na linha dela no resultado). Registro no foco ganha uma **marquinha celebrada no feed**, visível pra todos. Nunca aparece "fora do foco". O placar **"N no seu foco" é privado**, só a própria pessoa vê.

## A sala rolando (tela)
De cima pra baixo:
1. **Cabeçalho:** janela cuja **barra de título é o nome da sala** (sai o título grande em fonte pixel). No corpo, compacto: "Dia X/Y", data e hora da última busca, e o **resumo do dia** ("hoje 2 de 4 já registraram", reações novas nos seus registros). **Ativos hoje**: quem teve atividade hoje (a própria pessoa primeiro), com o foguinho de quem tiver; "Só você por aqui hoje" se for só ela.
2. **Seu desafio:** sua meta da semana em bolinhas ("3 de 5 essa semana"), seu foco, "N no seu foco" (privado) e o botão **"+ Registrar"**.
3. **Número do grupo** (com a linha de contexto ligada ao tempo).
4. **Feed de todos:** frase (ou "[nome] registrou"), marquinha de foco (quando no foco), autor, horário (com data quando não for hoje: "22/09 · 15:31"), reação com os olhinhos e contagem, foguinho do autor na realização mais recente de hoje dele. Sempre tudo, mais recente no topo, sem filtro.
- **Retomada:** se a pessoa abre a sala depois de dias sem registrar, uma frase acolhedora no lugar do silêncio (o desafio ainda está rolando e ainda dá). Só pra ela, nunca cobrança.
- **Atualização:** busca ao abrir e ao focar a aba. Sem realtime.
- **Última atividade:** atualizada em toda visita reconhecida, ao registrar e ao reagir (alimenta "Ativos hoje").

## Reações
Um toque, sempre o mesmo símbolo (**os olhinhos**), sem paleta de emoji. Qualquer participante reage a qualquer realização, inclusive a própria. Um toque = um participante por realização (não acumula). Mostra a contagem.

## O resultado (sala encerrada)
- Cabeçalho: nome da sala, selo neutro "ENCERRADO", período real, duração e número de pessoas.
- Janela **"Resultado final"**: o **número final do grupo**, o resumo do grupo (total de realizações e de reações trocadas) e a lista **"Todo mundo"**.
- Lista: **você primeiro** (com realce leve), depois **ordem de entrada**. Nunca ordenada por quantidade.
- Por pessoa: emoji + nome, foco (se tiver), **selo binário** e chips: realizações, bônus, reações recebidas, dias em chamas. **"Y no foco" só na sua própria linha.**
- **Selo:** "FECHOU TUDO QUE SE PROPÔS." (âmbar) = bateu a meta em todas as semanas que contam pra ela. Senão, "SEGUIU NO PRÓPRIO RITMO." (neutro, sem cor de alerta).
- Feed escondido em **"Ver tudo que rolou ↓"** (fechado por padrão), só leitura.
- **Renovação:** botão **"Bora mais uma rodada?"** cria uma sala nova com o mesmo nome + "#2" (ou o próximo número) e o mesmo tipo de período, e oferece compartilhar o link no grupo.

## Medição
Registrar eventos básicos pra saber depois se o app funciona: **entrou na sala**, **se propôs**, **registrou**, **voltou num dia diferente**. Por pessoa, dá pra responder **"voltou no dia 3 e no dia 5 depois de entrar?"** (dias contados da entrada, fuso de Brasília). Sem dado pessoal além do que o app já guarda.

## WhatsApp (bloco próprio, depois do app web pronto)
- Canal **opcional** de registro. O app web continua sendo onde se vê o feed, reage e vê o resultado.
- Ativação: botão "Registrar pelo WhatsApp" abre a conversa com o número do desafioo e uma mensagem pronta com o código da sala. Ao enviar, o número fica ligado à pessoa. Ninguém digita telefone.
- **Primeira função do bot:** entregar o resumo do dia do grupo ("hoje 2 de 4 já registraram", reações novas), só dentro da janela de 24h aberta pela própria pessoa. Sem mensagens pagas, sem lembrete pra quem sumiu.
- Cada mensagem é uma realização. O bot responde celebrando, mostra "3 de 5 essa semana" e o andamento do grupo (sem nomes de quem não registrou), e pergunta com botões "foi no seu foco?" quando a pessoa tem foco.
- Sem IA. Só mensagens dentro da janela de 24h aberta pela própria pessoa; nenhum lembrete pago, ninguém é perseguido. **Só a plataforma oficial da Meta**, nunca bibliotecas não oficiais.

## Fotos (bloco próprio)
Uma foto opcional por registro, comprimida no envio, exibida pequena no feed. Armazenamento no Supabase.

## Modelo de dados (linguagem simples)
- **desafios:** código do link, nome, duração em dias, data de início marcada, estado (lobby/ativo/encerrado), data de início real (quando largou), criador, criado em.
- **participantes:** sala, nome, emoji, token secreto, meta semanal, foco (opcional), pronto, última atividade, criado em (= quando entrou).
- **realizacoes:** participante, frase (opcional; sem frase = texto vazio), se foi no foco, dia (data), criado em. (Colunas antigas de tipo/assunto ficam com valor padrão.)
- **reacoes:** realização, participante, criado em.
- **eventos** (medição): sala, participante, tipo do evento, criado em.

## Fora, por enquanto
Combinado social, dinheiro em jogo, "fazendo agora", comentários, reação com qualquer emoji, IA no bot, backfill, notificação pelo navegador, múltiplos compromissos por pessoa, ranking, realtime.

## Futuro
O caminho mais realista é servir quem já organiza desafios pagos (nutricionistas, personal trainers, coaches, cursinhos). Manter a figura do **criador da sala** bem definida no modelo de dados facilita isso depois. Nada disso entra agora.
