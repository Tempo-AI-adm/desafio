import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// Prova de "eu criei essa sala", dada pelo servidor na criação num
// cookie que o navegador não lê (httpOnly). Ao entrar na sala, o
// servidor confere o cookie: só quem criou vira criador (e ganha o
// LARGAR). Antes, o navegador mandava "souCriador=1" e o servidor
// acreditava, então qualquer um podia se declarar criador.
// A prova é um HMAC do id da sala com um segredo do servidor: não
// precisa de coluna nova no banco e não dá pra fabricar sem o segredo.

function segredo(): string {
  const s = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!s) throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY nas variáveis de ambiente.");
  return s;
}

export function nomeCookieCriador(codigo: string): string {
  return `desafio-criador-${codigo}`;
}

export function provaDeCriador(desafioId: string): string {
  return createHmac("sha256", segredo()).update(`criador:${desafioId}`).digest("hex");
}

export function confereProvaDeCriador(desafioId: string, prova: string | undefined): boolean {
  if (!prova) return false;
  const esperada = Buffer.from(provaDeCriador(desafioId));
  const recebida = Buffer.from(prova);
  return esperada.length === recebida.length && timingSafeEqual(esperada, recebida);
}
