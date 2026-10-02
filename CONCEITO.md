# CONCEITO.md - como o desafioo funciona (v2)

Fonte de verdade das regras do produto. Onde o PRD.md antigo contradisser este documento, este vence. O sentimento por trás de cada regra está em MOOD.md.

## Em uma frase
Alguém chama "bora um desafio?". Cada pessoa se propõe a realizar um número de coisas boas por semana, com um foco opcional. Durante o período, registra o que fez (uma frase curta, foto opcional), pelo app ou pelo WhatsApp, e o grupo celebra junto. No fim, todos veem o resultado e podem começar a próxima rodada.

## A sala
- Qualquer pessoa cria: nome da sala + período.
- Períodos: atalhos **1 semana**, **2 semanas**, **1 mês**, ou **até uma data**. A tela sugere (sem obrigar) começar na próxima segunda-feira ou no dia 1, porque recomeços em marcos de tempo aumentam a disposição.
- Estados como hoje: lobby (pessoas entram e se propõem), rolando (depois do LARGAR do criador), encerrada (automático ao fim do período).
- Semanas contam em blocos de 7 dias a partir da largada. Se a última semana for parcial, a meta dela é proporcional (arredonda pra cima, mínimo 1).
- Sala encerrada: ninguém novo vira participante; quem abre o link sem ser participante vê o resultado só em leitura.
- Sala rolando: dá pra entrar, se propor e participar a partir dali; semanas anteriores não contam pra quem entrou depois.

## O compromisso de cada pessoa
Ao entrar na sala, a pessoa:
1. Escolhe nome e emoji (como hoje).
2. Responde **"quantas coisas boas você quer realizar por semana?"**, com atalhos 3, 5 e 7, ou outro número. Obrigatório.
3. Responde, se quiser, **"tem algum foco nesse período?"**, um texto curto (ex: "estudar pro concurso", "voltar a treinar"). Opcional.
4. Vê exemplos do que vale como realização: malhar, ler 20 páginas, tomar uma decisão que vinha adiando, resolver uma pendência, ligar pra família, cozinhar pra semana, organizar algo da casa, estudar.

O compromisso congela no LARGAR, como hoje. Cada pessoa tem **um** compromisso por sala; não existem mais missões múltiplas, "nova missão", "única" ou "repetir".

## Registrar uma realização
- Botão grande **"+ Registrar"** sempre visível na sala, no estilo do "+" do GymRats.
- Um registro é: uma frase curta obrigatória (o que você fez) + "isso foi no seu foco?" (só aparece pra quem definiu foco) + foto opcional (bloco próprio, depois).
- O assunto (chips) deixa de ser pedido, pra registrar rápido, inclusive pelo WhatsApp. O banco recebe um valor padrão.
- O dia do registro é sempre hoje (sem backfill). O desfazer de 5 segundos continua.
- Todo registro conta. Não existe "extra que não vale".

## Os números
- **Da pessoa, na semana:** "3 de 5 essa semana", com bolinhas. Passar da meta vira bônus (a estrela), celebrado, mas não conta a mais.
- **Da pessoa, no desafio:** soma, semana a semana, do menor valor entre realizações e meta, dividido por (meta × número de semanas).
- **Do grupo:** média do progresso das pessoas, cada pessoa pesando igual. Mostrado como um número só do grupo, nunca por pessoa lado a lado.
- **Foguinho:** 2 ou mais realizações no mesmo dia (mantém).
- **Foco:** "N no seu foco", visível pra própria pessoa e no resultado.

## A sala rolando (tela)
- Barra de título do primeiro bloco com o **nome da sala** (sai o título grande em fonte pixel). Dia X/Y, data e hora compactos. "Ativos hoje" como hoje.
- Bloco **"Seu desafio"**: sua meta da semana em bolinhas, seu foco, e o botão "+ Registrar".
- O número do grupo.
- Feed de todos: frase, marcação de foco, horário (data quando não for hoje), reação com os olhinhos, foguinho.
- **Retomada:** se a pessoa abre a sala depois de dias sem registrar, uma frase acolhedora no lugar de silêncio (ex: o desafio ainda está rolando, e ainda dá). Nunca cobrança.

## O resultado
- Mantém o que já existe (você primeiro, depois ordem de entrada, selo binário, resumo do grupo, feed escondido em "Ver tudo que rolou").
- Por pessoa: "X realizações, Y no foco", bônus, reações, dias em chamas.
- "Fechou tudo que se propôs" = bateu a meta em todas as semanas. Senão, "seguiu no próprio ritmo".
- Número final do grupo.
- **Renovação:** botão "Bora mais uma rodada?" cria uma sala nova com o mesmo nome (com "#2") e o mesmo período, e oferece compartilhar o link no grupo.

## Home e onboarding
- Ordem: logo desafioo (olhinhos piscando), "Um incentivo pra sua melhor versão.", data e hora ("qui, 1 out · 15:39"), Suas salas, Criar sala, Entrar numa sala.
- Onboarding: modal na primeira visita, 3 telas curtas com "pular", reabrível em "Como funciona". O sentido de cada tela (o texto final segue o MOOD):
  1. Você se propõe a realizar coisas boas por semana, no seu ritmo.
  2. Qualquer coisa que te faz bem conta, e você registra quando fizer.
  3. O grupo acompanha e comemora junto. Ninguém compete.
- Exemplo do resultado (janela com fundo cinza) atualizado pro modelo novo.

## WhatsApp (bloco próprio, depois do app web pronto)
- Canal opcional de registro. O app web continua sendo onde se vê o feed, reage e vê o resultado.
- Ativação: na sala, botão "Registrar pelo WhatsApp" abre a conversa com o número do desafioo e uma mensagem pronta com o código da sala. Ao enviar, o número fica ligado à pessoa. Ninguém digita telefone.
- Cada mensagem enviada é uma realização (texto, e foto quando existir). O bot responde celebrando, mostra "3 de 5 essa semana" e o andamento do grupo (sem nomes de quem não registrou), e pergunta com botões "foi no seu foco?" quando a pessoa tem foco.
- Sem IA na primeira versão.
- Custos: só mensagens dentro da janela de 24h aberta pela própria pessoa. Nenhum lembrete pago, ninguém é perseguido.
- Somente a plataforma oficial da Meta. Nunca bibliotecas não oficiais.

## Fotos (bloco próprio)
- Uma foto opcional por registro, comprimida no envio, exibida pequena no feed. Armazenamento no Supabase.

## Medição
- Registrar eventos básicos (entrou na sala, se propôs, registrou, voltou num dia diferente), pra saber depois se o app funciona.

## Fora, por enquanto
Combinado social, dinheiro em jogo, "fazendo agora", comentários, reação com qualquer emoji, IA no bot, backfill, notificação pelo navegador, múltiplos compromissos por pessoa.

## Futuro e monetização
O caminho mais realista é servir quem já organiza desafios pagos (nutricionistas, personal trainers, coaches, cursinhos). Manter a figura do criador da sala bem definida no modelo de dados facilita isso depois. Nada disso entra agora.

## Pendências da auditoria que entram junto
Entrar em sala encerrada (resolvido pela regra acima), toggle de backfill (sai), "atrasados" (sai), "VOCÊ FOI"/"CAMPEÃO" no STYLE (sai), "VALENDO." na criação da sala (corrigir), legenda da estrela (reescrever), PRD desatualizado (reescrever a partir deste documento).
