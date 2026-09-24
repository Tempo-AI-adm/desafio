# desafio - PRD (fonte de verdade do produto)

Descreve **o que** o app é. Quando o código divergir, este documento vence. Leia junto com `STYLE.md` (visual e copy) e `CLAUDE.md` (regras de execução).

## O que é
App web mobile-first onde um grupo pequeno (3+ amigos) roda um "desafio" de constância por um número fixo de dias. Cada pessoa define seu **mínimo inegociável** (o norte) e, durante o desafio, registra **realizações** marcando suas **missões**; no meio do desafio pode criar **missões novas** (algo que surgiu e deixou a pessoa orgulhosa). Todos veem tudo, num **feed compartilhado** com um **cartão-resumo de cada pessoa no topo**. É estilo "Twitter de feitos do desafio", sem fotos. Sério no fundo, leve/gameficado na forma. Ciclo curto: começa, roda, acaba.

## Princípios (não violar)
- **Simplicidade acima de tudo.** Onboarding autoexplicativo por link único. A única coisa que se manda no grupo é "entra nesse link".
- **Determinístico:** a pessoa escolhe em menu e preenche campos. Sem IA interpretando texto livre nesta versão.
- **Tudo no próprio app.** Sem relatório enviado automaticamente.
- **Sem login.** Identidade por dispositivo.
- **Não é competição.** Todos veem tudo. O app **celebra o realizado**; nunca ranqueia, nunca mostra "atrasado/adiantado". Contagens só sobem.
- **Planejado e espontâneo valem igual.** Missão definida no lobby e missão criada no meio do desafio têm o mesmo peso e a mesma comemoração.

## Vocabulário na tela
- **"Desafio"** é o nome do app (título/logo) e da atividade em si ("o desafio começou", "durante o desafio").
- **"Sala"** é o que a pessoa cria e compartilha com o grupo (criar sala, entrar em uma sala, suas salas, link da sala). Só muda o texto visível: código, banco e rotas (`/d/[codigo]`, `/criar`, `/entrar`) continuam como estão.
- **"Missão"** é o nome na tela pra inegociável. **"Suas Missões"** é o bloco da própria pessoa na sala rolando, com todas as missões dela, sem distinção entre as do lobby e as criadas depois.

## Identidade (sem login)
- Um desafio = **um link único** (ex: `/d/PEGA42`). Esse link vai no grupo. É o único que existe.
- Na 1ª vez que um dispositivo abre o link, a pessoa reivindica identidade: **nome + emoji**.
- O dispositivo guarda um **token secreto** no navegador; nas próximas visitas é reconhecido.
- **Edição:** todos veem tudo; cada dispositivo só edita o que criou.
- **Limitação aceita:** limpar cookies / trocar de celular = perde a identidade. OK para ciclos curtos.
- **Lista local de desafios:** além do token de cada desafio, o navegador guarda uma lista dos desafios em que a pessoa entrou (código + nome do desafio + emoji dela nesse desafio), limitada aos **3 mais recentes** (o mais novo entra no topo; se passar de 3, o mais antigo sai da lista). Sair da lista ou cair fora dela **não apaga nada no banco** e não mexe no token: dá pra voltar pelo código e continuar com a mesma identidade.
- **Home (central):** sempre visível, nesta ordem: logo "desafioo" → uma frase ("Um incentivo pra sua melhor versão (ou o Twitter de aura farmada)") → **"Suas salas"** (só se a lista local tiver alguma: cartão por sala com nome + seu emoji + estado, ex: "rolando" / "esperando", levando direto pra `/d/[codigo]`) → botões **"Criar sala"** e **"Entrar em uma sala"** (código, pra salas fora da lista, ex: outro aparelho ou a 4ª sala). Embaixo, dois links pequenos que abrem no lugar (fechados por padrão, sem navegar): **"Como funciona ↓"** (o texto explicativo) e **"Ver um exemplo do resultado final →"** (card decorativo com dados FIXOS de exemplo, com rótulo "exemplo"; não usa dados reais. Mostra 3 pessoas fictícias na ordem de entrada, com o selo binário de cada uma, seguindo "Resultado final - princípio de apresentação").
- **Dentro de um desafio:** "Criar novo desafio" (ao criar, entra na lista local) e **"Sair deste desafio"** (tira só esse item da lista local e volta pra Home).

## Ciclo do desafio (estados)
`LOBBY → ATIVO → ENCERRADO`
- **LOBBY:** entra pelo link, reivindica identidade, define seu norte (≥ 1 inegociável). Cada um aperta **PRONTO**. O criador vê o lobby encher e aperta **LARGAR** quando quiser (não declara quantos são).
- **ATIVO:** contagem começa (dia 1..N). As missões que já existem **não mudam** (não dá pra editar nem apagar), mas dá pra **criar missões novas** ("+ Nova missão"). A pessoa registra realizações.
- **ENCERRADO:** no fim dos N dias, tela final que **celebra todo mundo que se dedicou** (não há vencedor). Para rodar outro, cria-se um novo (link novo).

## Os dois conceitos (não inventar outros)

### 1. Inegociáveis (o norte)
O "mínimo que me propus". Cada pessoa define **pelo menos 1** no lobby. Cada inegociável tem:
- **título** (ex: "malhar", "acabar o livro X")
- **assunto** (chip, lista fixa abaixo)
- **alvo (opcional):** um número de vezes no desafio inteiro (ex: 2). No formulário a pessoa escolhe **"Única"** (sem alvo) ou **"Repetir"** (aparece "Repetir quantas vezes?"; cada toque conta 1 vez feita).
  - **Com alvo:** vira bolinhas de progresso (`●●○`). Marcar além do alvo conta como **bônus** ("estourou"): bolinhas a mais em outra cor + uma estrelinha (insígnia) ao lado.
  - **Sem alvo:** é um item de "cumpri / não cumpri" (marca uma vez).

O norte é a âncora visível do compromisso. **Não é nota, não é denominador de ranking.**

### 2. Realizações (o feed)
Durante o desafio, a pessoa registra uma realização sempre que fez algo que vale marcar: **tocar numa missão** (inegociável) marca progresso nela.

**Nova missão (substitui a antiga "vitória extra"):** fez ou quer fazer algo fora do que definiu no lobby? Cria uma **missão nova** com o mesmo formulário do lobby (título + assunto + alvo opcional). Ela entra em "Suas Missões" como uma missão normal, ainda não marcada; se já fez, cria e marca em seguida. Sem tag, sem distinção. No feed aparece uma linha de novidade ("criou a missão: Meditar"), sem reação; a realização aparece quando ela marca.

*Legado:* registros antigos do tipo `extra` (do tempo da "vitória extra") continuam no banco e na tela, só sem a tag "extra". Não há mais como criar um novo.

Toda realização tem: **assunto** (chip) + **texto curto** + dia + autor. Aparece no feed de todos; o app comemora (mascote + copy).

**Contagem do dia:** o dash/feed conta quantas realizações a pessoa já fez **nesse dia**, é só exibição sobre o dado que já existe (dia + autor na realização), não cria tabela nova. Essa contagem decide qual selo/copy de comemoração aparece ao registrar (ver `STYLE.md`). É "escalar dentro do dia": a conta zera a cada dia novo (o dia vira à **meia-noite de Brasília**, fuso `America/Sao_Paulo`, não pelo relógio do servidor) e **não é streak entre dias** (streak continua fora de escopo, ver "Fora de escopo"). A mesma contagem acende um **foguinho** pixel art ao lado do nome: pequeno na 2ª realização do dia, maior e com duas cores na 3ª ou mais.

## Assuntos (chips) - lista fixa, não configurável
💪 saúde · 📚 aprendizado · 💼 trabalho · 🏠 lar · ✅ tarefa · ✨ outro. Seleção única. Usado em missões e realizações; dá cor/organização.

*No banco* os valores gravados continuam os antigos (`treino`, `estudo`, `trabalho`, `comida`, `tarefa`, `outro`, com check no `supabase/schema.sql`); a tela traduz pra nome + emoji (`lib/assuntos-constants.ts`), então registros antigos já aparecem com os nomes novos, sem migração.

## Reações
Qualquer realização no feed pode receber uma reação de **um toque** de quem também está no desafio (inclusive de si mesmo). A reação é sempre a mesma, **reagir com o monstro** (o mascote), **sem paleta de emoji pra escolher**. Mostra a contagem de reações ao lado do item no feed. Um toque = um participante por realização (não acumula clique); sem comentário associado (comentário continua fora de escopo, ver "Fora de escopo").

## O que o dash mostra
Tela da sala rolando, de cima pra baixo (ação rápida sempre à mão, feed com o espaço principal):

**1. Cabeçalho da sala (lobby e rolando):** uma janela igual às outras (fundo creme, barra de título escura fininha, ver `STYLE.md` "janela") só com a identidade da sala: nome (fonte pixel) + **"DIA X/Y"** depois de largar (dias de calendário em Brasília desde a data de início; antes de largar mostra só a duração, ex: "7 DIAS") + data e hora de hoje ("23/09 · 18:46", fuso de Brasília). A hora é a da última busca da sala (ao abrir, ao voltar pra aba, depois de cada ação), não um relógio rodando.

**2. Suas Missões (fixo no topo ao rolar, compacto):** a barra do painel tem só o título "Suas Missões" e o botão pequeno **"+ Nova missão"** (abre ali mesmo o mesmo formulário do lobby). Dentro: as missões como botões pequenos de 1 toque, com progresso (bolinhas `●●○` se tem alvo; check "cumpri" se não tem). Registros antigos de "vitória extra" aparecem listados embaixo, sem tag.

**Ativos hoje (dentro da janela do cabeçalho, sala rolando):** quem teve atividade hoje (última atividade no dia de hoje, fuso de Brasília), a própria pessoa primeiro, numa lista simples (sem caixa por pessoa, separada por espaço): emoji + nome curto + a insígnia do dia se tiver (o **foguinho**; sem insígnia, nada no lugar). Uma bolinha verde só, ao lado do rótulo "Ativos hoje". É diário/aproximado, não presença ao vivo. Se só a própria pessoa estiver ativa: "Só você por aqui hoje". Sem progresso detalhado dos outros aqui (é secundário).

**Última atividade:** atualizada em toda visita reconhecida à sala (abrir a página ou focar a aba), ao registrar e ao reagir. Quem só entrou pra acompanhar os amigos também conta como "ativo hoje".

**4. Feed (o resto da tela, conteúdo principal):**
- corrente de realizações de todos, **mais recente no topo**
- cada item: autor + emoji do assunto + texto + horário + reação (mascote) com contagem
- **sem foto**
- **sem filtro**: sempre mostra tudo, mais recente no topo. Item de hoje mostra só a hora; item de outro dia (fuso de Brasília) mostra data + hora ("22/09 · 15:31")
- o foguinho do autor aparece só na realização mais recente de hoje dele, pra não repetir em toda linha
- reação: o botão é o mascote (monstrinho pixel art); acende e soma +1 no toque, e depois do toque fica travado (não acumula)

**Sem % de aderência, sem ranking, sem "atrasado".** O resumo é sempre contagem/progresso que só sobe.

**Atualização:** busca dados ao abrir o app e ao focar a aba. Sem realtime nesta versão.

## Check / registrar / backfill
- Registrar realização = tocar numa missão (1 toque; assunto e texto vêm da missão). Algo novo = criar missão nova e marcar.
- Marcar um inegociável de novo enche a próxima bolinha; além do alvo vira extra.
- **Backfill** é opção do **desafio**, decidida pelo criador na criação ("Vale registrar em dias anteriores? Sim/Não"). Sim = qualquer dia até hoje; Não = só hoje. **Nunca** dia futuro.
- **Desfazer (janela curta):** depois de tocar num inegociável, aparece por ~5s "Feito. Toque de novo para desfazer.". Tocar de novo no mesmo inegociável dentro dessa janela apaga o registro do banco (a contagem do dia, o selo e o foguinho voltam junto). Passou a janela, qualquer toque **sempre soma** um registro novo; nunca desfaz nada depois (o servidor recusa desfazer registro com mais de 10s). Pra ninguém ver um registro desfeito a tempo, a marcação de inegociável de outra pessoa só aparece pros outros depois de ~7s.

## Tela de encerramento
Resumo de cada um: inegociáveis cumpridos + extras + total de realizações. Tom celebra **todos que se dedicaram**. Estilo "GAME OVER / FECHOU".


## Resultado final - princípio de apresentação
Participantes nunca são ordenados nem destacados por quantidade de missões cumpridas. A ordem de exibição é neutra (ordem de entrada na sala). O status de cada pessoa reflete se ela completou tudo que se propôs para si mesma (binário), não a contagem absoluta - isso vale tanto para o card de exemplo quanto para a futura tela de encerramento real.
- Completou tudo que se propôs: selo âmbar **"FECHOU TUDO QUE SE PROPÔS."**
- Não completou tudo: selo neutro e gentil **"SEGUIU NO PRÓPRIO RITMO."** (sem cor de alerta).
- Números (missões cumpridas, bônus, reações) aparecem só como detalhe, sem definir ordem nem destaque. Quem se propôs 1 missão e cumpriu fez 100% do que prometeu, igual a quem se propôs 7 e cumpriu 7.
## Modelo de dados (linguagem simples, ~5 tabelas)
- **desafios:** id, código do link, nome, duração em dias, permite_backfill (sim/não), estado (lobby/ativo/encerrado), data de início (quando largou), criado em.
- **participantes:** id, desafio_id, nome, emoji, token do dispositivo (secreto), pronto (sim/não), última_atividade, criado em.
- **inegociaveis:** id, participante_id, título, assunto, alvo (número ou nulo), criado em.
- **realizacoes:** id, participante_id, tipo (inegociavel/extra), inegociavel_id (nulo se extra), assunto, texto, dia (data), criado em.
- **reacoes:** id, realizacao_id, participante_id, criado em.

## Fora de escopo (de propósito - NÃO construir na v1)
- Login / senha / email.
- Fotos / upload / storage (prova social via WhatsApp por enquanto). **Revisitado ao adicionar reações, mantido fora do v1.**
- Notificações / push / mensagem automática no WhatsApp. **Revisitado ao adicionar reações, mantido fora do v1.** *(Um botão "compartilhar meu feito" via link `wa.me` com texto pronto é fácil e fica pra v1.1.)*
- Realtime (v1.1).
- Comentários no feed (v1.1). *(Reação de um toque com o mascote agora é v1, ver seção "Reações". Isso não inclui comentário nem paleta de emoji.)*
- Ranking, % de aderência, "atrasado/adiantado".
- Tela "meus desafios" completa (histórico, busca etc.). A v1 tem só a lista local dos 3 mais recentes na Home (ver "Identidade").
- Editar ou apagar missões depois do LARGAR (criar novas pode).
- IA de texto livre · streaks / badges **entre dias** (a contagem de realizações **dentro do mesmo dia**, usada pro selo/copy, não é streak, ver seção "Realizações").

## Escopo v1 (o mínimo pra rodar com os amigos)
Home (lista local dos 3 desafios mais recentes + criar/entrar com código) · sair de um desafio (só da lista local) · criar desafio (nome + duração em dias, presets 3/7/14/21 + toggle backfill) · link único · claim de identidade por dispositivo · lobby: definir ≥1 inegociável (título + assunto + alvo opcional) + PRONTO + LARGAR (criador) · missões existentes não mudam ao largar, mas dá pra criar novas · registrar realizações (tocar numa missão), backfill se permitido, com desfazer · reação de um toque (mascote) por realização, com contagem · dash: cartões por pessoa (inegociáveis + bolinhas/alvo + extras + visto há X) + feed cronológico (sempre tudo, data nos itens de outros dias) + selo/copy por contagem do dia · celebração (mascote + copy) · tela de encerramento · busca ao abrir/focar · copy e visual do `STYLE.md`.
