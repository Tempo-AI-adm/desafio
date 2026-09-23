# desafio - PRD (fonte de verdade do produto)

Descreve **o que** o app é. Quando o código divergir, este documento vence. Leia junto com `STYLE.md` (visual e copy) e `CLAUDE.md` (regras de execução).

## O que é
App web mobile-first onde um grupo pequeno (3+ amigos) roda um "desafio" de constância por um número fixo de dias. Cada pessoa define seu **mínimo inegociável** (o norte) e, durante o desafio, registra **realizações**, tanto cumprir o que prometeu quanto vitórias extras que a deixaram orgulhosa. Todos veem tudo, num **feed compartilhado** com um **cartão-resumo de cada pessoa no topo**. É estilo "Twitter de feitos do desafio", sem fotos. Sério no fundo, leve/gameficado na forma. Ciclo curto: começa, roda, acaba.

## Princípios (não violar)
- **Simplicidade acima de tudo.** Onboarding autoexplicativo por link único. A única coisa que se manda no grupo é "entra nesse link".
- **Determinístico:** a pessoa escolhe em menu e preenche campos. Sem IA interpretando texto livre nesta versão.
- **Tudo no próprio app.** Sem relatório enviado automaticamente.
- **Sem login.** Identidade por dispositivo.
- **Não é competição.** Todos veem tudo. O app **celebra o realizado**; nunca ranqueia, nunca mostra "atrasado/adiantado". Contagens só sobem.
- **Planejado e espontâneo valem igual.** Cumprir o norte e uma vitória extra têm o mesmo peso e a mesma comemoração.

## Identidade (sem login)
- Um desafio = **um link único** (ex: `/d/PEGA42`). Esse link vai no grupo. É o único que existe.
- Na 1ª vez que um dispositivo abre o link, a pessoa reivindica identidade: **nome + emoji**.
- O dispositivo guarda um **token secreto** no navegador; nas próximas visitas é reconhecido.
- **Edição:** todos veem tudo; cada dispositivo só edita o que criou.
- **Limitação aceita:** limpar cookies / trocar de celular = perde a identidade. OK para ciclos curtos.
- **Lista local de desafios:** além do token de cada desafio, o navegador guarda uma lista dos desafios em que a pessoa entrou (código + nome do desafio + emoji dela nesse desafio), limitada aos **3 mais recentes** (o mais novo entra no topo; se passar de 3, o mais antigo sai da lista). Sair da lista ou cair fora dela **não apaga nada no banco** e não mexe no token: dá pra voltar pelo código e continuar com a mesma identidade.
- **Home (central):** se a lista local tem pelo menos 1 desafio, mostra **"Seus desafios"**, um cartão clicável por item (nome do desafio + seu emoji + estado atual, ex: "rolando" / "esperando") que leva direto pra `/d/[codigo]`. Abaixo, sempre: **"Criar novo desafio"** e **"Entrar com código"** (pra desafios fora da lista, ex: outro aparelho ou o 4º desafio).
- **Dentro de um desafio:** "Criar novo desafio" (ao criar, entra na lista local) e **"Sair deste desafio"** (tira só esse item da lista local e volta pra Home).

## Ciclo do desafio (estados)
`LOBBY → ATIVO → ENCERRADO`
- **LOBBY:** entra pelo link, reivindica identidade, define seu norte (≥ 1 inegociável). Cada um aperta **PRONTO**. O criador vê o lobby encher e aperta **LARGAR** quando quiser (não declara quantos são).
- **ATIVO:** contagem começa (dia 1..N). O **norte congela** (não dá pra editar inegociáveis). A pessoa registra realizações.
- **ENCERRADO:** no fim dos N dias, tela final que **celebra todo mundo que se dedicou** (não há vencedor). Para rodar outro, cria-se um novo (link novo).

## Os dois conceitos (não inventar outros)

### 1. Inegociáveis (o norte)
O "mínimo que me propus". Cada pessoa define **pelo menos 1** no lobby. Cada inegociável tem:
- **título** (ex: "malhar", "acabar o livro X")
- **assunto** (chip, lista fixa abaixo)
- **alvo (opcional):** um número de vezes no desafio inteiro (ex: 2).
  - **Com alvo:** vira bolinhas de progresso (`●●○`). Marcar além do alvo conta como **extra** ("estourou").
  - **Sem alvo:** é um item de "cumpri / não cumpri" (marca uma vez).

O norte é a âncora visível do compromisso. **Não é nota, não é denominador de ranking.**

### 2. Realizações (o feed)
Durante o desafio, a pessoa registra uma realização sempre que fez algo que vale marcar. Uma realização é de um de dois tipos, **com o mesmo peso e a mesma comemoração**:
- **cumprir um inegociável** (marca progresso no item do norte), ou
- **extra / vitória** (algo fora do norte, ex: "trabalhei 5h", "voltei pro jiu-jitsu").

Toda realização tem: **assunto** (chip) + **texto curto** + dia + autor. Aparece no feed de todos; o app comemora (mascote + copy).

**Contagem do dia:** o dash/feed conta quantas realizações a pessoa já fez **nesse dia**, é só exibição sobre o dado que já existe (dia + autor na realização), não cria tabela nova. Essa contagem decide qual selo/copy de comemoração aparece ao registrar (ver `STYLE.md`). É "escalar dentro do dia": a conta zera a cada dia novo e **não é streak entre dias** (streak continua fora de escopo, ver "Fora de escopo").

## Assuntos (chips) - lista fixa, não configurável
💪 treino · 📚 estudo · 💼 trabalho · 🍳 comida · ✅ tarefa · ✨ outro. Usado em inegociáveis e realizações; dá cor/organização.

## Reações
Qualquer realização no feed pode receber uma reação de **um toque** de quem também está no desafio (inclusive de si mesmo). A reação é sempre a mesma, **reagir com o monstro** (o mascote), **sem paleta de emoji pra escolher**. Mostra a contagem de reações ao lado do item no feed. Um toque = um participante por realização (não acumula clique); sem comentário associado (comentário continua fora de escopo, ver "Fora de escopo").

## O que o dash mostra
**Cartão por pessoa (topo):**
- nome + emoji
- **Meu inegociável:** a lista de inegociáveis, cada um com seu progresso (bolinhas `●●○` se tem alvo; check "cumpri" se não tem)
- **extras:** contador ("+3 além do combinado")
- **visto há X** (última atividade)

**Feed (abaixo dos cartões):**
- corrente de realizações de todos, **mais recente no topo**
- cada item: autor + emoji do assunto + texto + horário + reação (mascote) com contagem
- **sem foto**
- filtro no topo: **Hoje / Tudo** (default = Hoje)

**Sem % de aderência, sem ranking, sem "atrasado".** O resumo é sempre contagem/progresso que só sobe.

**Atualização:** busca dados ao abrir o app e ao focar a aba. Sem realtime nesta versão.

## Check / registrar / backfill
- Registrar realização = escolher tipo (cumprir um inegociável ou extra) + assunto + texto curto.
- Marcar um inegociável de novo enche a próxima bolinha; além do alvo vira extra.
- **Backfill** é opção do **desafio**, decidida pelo criador na criação ("Vale registrar em dias anteriores? Sim/Não"). Sim = qualquer dia até hoje; Não = só hoje. **Nunca** dia futuro.
- Desfazer um registro é possível (gente erra).

## Tela de encerramento
Resumo de cada um: inegociáveis cumpridos + extras + total de realizações. Tom celebra **todos que se dedicaram**. Estilo "GAME OVER / FECHOU".

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
- Editar o norte depois do LARGAR.
- IA de texto livre · streaks / badges **entre dias** (a contagem de realizações **dentro do mesmo dia**, usada pro selo/copy, não é streak, ver seção "Realizações").

## Escopo v1 (o mínimo pra rodar com os amigos)
Home (lista local dos 3 desafios mais recentes + criar/entrar com código) · sair de um desafio (só da lista local) · criar desafio (nome + duração em dias, presets 3/7/14/21 + toggle backfill) · link único · claim de identidade por dispositivo · lobby: definir ≥1 inegociável (título + assunto + alvo opcional) + PRONTO + LARGAR (criador) · norte congela ao largar · registrar realizações (cumprir inegociável ou extra) com assunto + texto, backfill se permitido, com desfazer · reação de um toque (mascote) por realização, com contagem · dash: cartões por pessoa (inegociáveis + bolinhas/alvo + extras + visto há X) + feed cronológico com filtro Hoje/Tudo + selo/copy por contagem do dia · celebração (mascote + copy) · tela de encerramento · busca ao abrir/focar · copy e visual do `STYLE.md`.
