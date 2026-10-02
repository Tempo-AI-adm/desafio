import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente único do banco, SÓ no servidor ("server-only" faz o build
// falhar se algum componente do navegador importar isto). Usa a chave
// secreta (SUPABASE_SECRET_KEY), que ignora o RLS: o banco fica fechado pra chave pública
// (anon) e toda regra de "quem pode o quê" mora nas Server Actions e
// rotas. Segredo só em variável de ambiente SEM o prefixo NEXT_PUBLIC
// (com o prefixo, o Next mandaria pro navegador). Nunca logar a chave.
//
// Criado só no primeiro uso (não ao carregar o arquivo): assim o build
// não depende das variáveis, e a falta delas aparece na primeira
// consulta, com mensagem clara.
let cliente: SupabaseClient | null = null;

function obterCliente(): SupabaseClient {
  if (cliente) return cliente;
  // A URL não é segredo (por isso pode ter o prefixo NEXT_PUBLIC); a
  // chave secreta nunca tem o prefixo. A chave anon não é usada aqui.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chaveSecreta = process.env.SUPABASE_SECRET_KEY;
  if (!url || !chaveSecreta) {
    throw new Error("Faltam NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY nas variáveis de ambiente.");
  }
  cliente = createClient(url, chaveSecreta, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cliente;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_alvo, propriedade) {
    const c = obterCliente();
    const valor = Reflect.get(c, propriedade, c);
    return typeof valor === "function" ? valor.bind(c) : valor;
  },
});
