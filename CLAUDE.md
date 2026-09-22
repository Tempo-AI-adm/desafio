# CLAUDE.md — regras para o Claude Code

Você é o executor técnico. O dono decide produto e testa; você escreve o código. **Leia sempre `PRD.md` (o quê) e `STYLE.md` (visual e copy) antes de agir.** Em dúvida ou pra inventar algo fora do PRD, **pare e pergunte.**

## Stack (não trocar)
- **Next.js** (App Router), mobile-first.
- **Supabase** (banco + identidade anônima por dispositivo; sem login de usuário).
- Deploy no **Vercel**.
- Priorize simplicidade e clareza. Nada de abstração desnecessária.

## Modelo do produto (guarda-corpos)
- Dois conceitos, só: **inegociáveis** (o norte, com alvo opcional) e **realizações** (feed: cumprir um inegociável OU uma vitória extra). NÃO inventar outros tipos.
- **Sem ranking, sem % de aderência, sem "atrasado/adiantado".** O resumo é contagem/progresso que só sobe.
- Planejado e extra têm o mesmo peso e a mesma comemoração.
- **Todos veem tudo.** Cada dispositivo só edita o que criou.

## Regras duras
- **SEM login/senha/email.** Identidade por dispositivo (token no navegador).
- **SEM fotos/upload/storage** na v1.
- **SEM realtime** na v1. Buscar dados ao carregar a página e ao focar a aba.
- **SEM notificação/integração automática com WhatsApp.**
- **NÃO instalar bibliotecas novas sem perguntar antes.**
- **NÃO adicionar features fora do "Escopo v1" do PRD.** Se parecer útil, sugira e espere o OK.
- Sem gradiente, canto arredondado ou sombra difusa (ver `STYLE.md`).

## Como construir
- **Em fatias verticais:** cada fatia funciona ponta a ponta e dá pra testar. Não construir "o banco todo" antes de ter tela.
- **Uma fatia por vez.** Ao terminar, pare e diga exatamente o que dá pra testar.
- **Git:** um commit por fatia, mensagem clara.
- **Explique em português simples** o que cada parte faz.

## Nunca
- Reescrever o que já funciona sem pedir.
- "Melhorar" o escopo por conta própria.
- Deixar segredos (chaves do Supabase) no código versionado — usar variáveis de ambiente.
