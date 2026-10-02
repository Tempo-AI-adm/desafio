# CLAUDE.md - regras para o Claude Code

Você é o executor técnico. O dono decide produto e testa; você escreve o código. **Leia sempre, antes de agir: `CONCEITO.md` (as regras do produto), `MOOD.md` (o sentimento, filtro de toda copy e decisão de UX), `PRD.md` (o quê, tela a tela) e `STYLE.md` (visual).** Ordem de precedência quando divergirem: CONCEITO e MOOD > PRD > STYLE. Em dúvida ou pra inventar algo fora deles, **pare e pergunte.** Se algo contradisser o MOOD, pare e pergunte antes de seguir.

## Stack (não trocar)
- **Next.js** (App Router), mobile-first.
- **Supabase** (banco + identidade anônima por dispositivo; sem login de usuário).
- Deploy no **Vercel**.
- Priorize simplicidade e clareza. Nada de abstração desnecessária.

## Modelo do produto (guarda-corpos)
- Dois conceitos, só: o **compromisso** de cada pessoa (meta de coisas boas por semana + foco opcional, um por sala) e as **realizações** (registro de uma frase; todo registro conta). NÃO inventar outros tipos (nada de missões, "única/repetir", vitória extra).
- **Sem ranking, sem "atrasado/devendo/falhou", sem comparar pessoas.** O único número percentual é o **do grupo** (média das pessoas, denominador = desafio inteiro, só sobe). Nunca mostrar % de uma pessoa, nem números de pessoas lado a lado pra comparar.
- **Todos veem tudo**, exceto o placar privado do foco ("N no seu foco", só a própria pessoa). Cada dispositivo só edita o que criou.
- Palavras banidas e tom: seguir `MOOD.md` à risca (inclui: sem travessão na copy).

## Regras duras
- **SEM login/senha/email.** Identidade por dispositivo (token no navegador).
- **SEM fotos/upload/storage** até o bloco de Fotos (aí: uma foto opcional por registro, Supabase Storage).
- **SEM realtime** na v1. Buscar dados ao carregar a página e ao focar a aba.
- **WhatsApp só no bloco próprio**, só pela **plataforma oficial da Meta** (nunca bibliotecas não oficiais), e só respondendo dentro da janela de 24h aberta pela pessoa. **Nenhum lembrete, notificação ou mensagem proativa**, em canal nenhum.
- **NÃO instalar bibliotecas novas sem perguntar antes.**
- **NÃO adicionar features fora do CONCEITO/PRD.** Se parecer útil, sugira e espere o OK.
- Sem gradiente, canto arredondado ou sombra difusa (ver `STYLE.md`).
- **Nunca exibir na UI o valor cru de um campo do banco (estado, permiteBackfill, tipo, etc.).** Toda tradução valor-interno → texto-humano passa por `lib/copy.ts`. Se um valor novo não tiver tradução lá, adicione antes de usar.

## Segurança (permanente)
O app não tem login: o token do dispositivo É a identidade. Proteger o banco é proteger as pessoas.
- **Banco só pelo servidor.** O cliente do Supabase (`lib/supabase.ts`, marcado `server-only`) usa a chave de serviço e só roda em Server Actions, Route Handlers e Server Components. Nenhum componente do navegador acessa o banco. A chave anon não lê nem escreve nada (RLS sem política pra anon).
- **Nunca montar SQL por concatenação de texto.** Só o cliente do banco com parâmetros (`.eq`, `.insert`, etc.).
- **Segredos só em variáveis de ambiente**, nunca no código versionado, e **nunca com o prefixo `NEXT_PUBLIC_`** (esse prefixo manda o valor pro navegador).
- **Nunca logar tokens nem chaves** (nem em `console.log`, nem em mensagens de erro). Token nunca vai na URL (vai no cabeçalho `x-desafio-token`), porque URLs ficam nos registros de acesso.
- **Toda resposta ao navegador com o mínimo necessário:** nunca o token de outra pessoa, nunca o placar privado do foco de outra pessoa, nunca campo que a tela não usa.
- **Toda entrada validada no servidor** (textos, números, códigos, ids) com os limites de `lib/validacao.ts`, sem confiar no formulário. Código, id ou token fora do formato nem chega ao banco.
- **Papéis decididos pelo servidor:** quem é criador vem da prova em cookie httpOnly dada na criação da sala (`lib/criador.ts`), nunca de um valor mandado pelo navegador.

## Como construir
- **Em fatias verticais:** cada fatia funciona ponta a ponta e dá pra testar. Não construir "o banco todo" antes de ter tela.
- **Uma fatia por vez.** Ao terminar, pare e diga exatamente o que dá pra testar.
- **Git:** um commit por fatia, mensagem clara.
- **Explique em português simples** o que cada parte faz.

## Nunca
- Reescrever o que já funciona sem pedir.
- "Melhorar" o escopo por conta própria.
- Deixar segredos (chaves do Supabase) no código versionado, usar variáveis de ambiente.
