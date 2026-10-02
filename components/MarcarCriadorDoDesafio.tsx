"use client";

import { useEffect } from "react";
import { registrarDesafioLocal } from "@/lib/identidade-local";

/**
 * Sem UI. Põe a sala recém-criada na lista local da Home (ainda sem
 * emoji). Quem é criador NÃO é decidido aqui: o servidor dá a prova num
 * cookie httpOnly ao criar a sala (ver lib/criador.ts).
 */
export function MarcarCriadorDoDesafio({ codigo, nome }: { codigo: string; nome: string }) {
  useEffect(() => {
    registrarDesafioLocal({ codigo, nome, emoji: null });
  }, [codigo, nome]);

  return null;
}
