import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente único do banco, SÓ no servidor ("server-only" faz o build
// falhar se algum componente do navegador importar isto). Usa a chave
// de serviço, que ignora o RLS: o banco fica fechado pra chave pública
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
  const url = process.env.SUPABASE_URL;
  const chaveServico = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !chaveServico) {
    throw new Error("Faltam SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY nas variáveis de ambiente.");
  }
  cliente = createClient(url, chaveServico, {
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
