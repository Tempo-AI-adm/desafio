import { createClient } from "@supabase/supabase-js";

// Cliente único (singleton), reaproveitado em todo request do
// servidor. Só é importado por Server Actions, Route Handlers e
// Server Components — nunca vai pro bundle do navegador, mas a anon
// key é feita pra ser pública mesmo (RLS quem protege, ver
// supabase/schema.sql).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Faltam NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY — confere o .env.local.",
  );
}

export const supabase = createClient(url, anonKey);
