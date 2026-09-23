"use client";

import { useEffect } from "react";
import { chaveCriadorLocalStorage, registrarDesafioLocal } from "@/lib/identidade-local";

/**
 * Sem UI. Marca no localStorage deste navegador "eu criei esse
 * desafio", assim, quando essa pessoa reivindicar identidade em
 * /d/[codigo], ela vira a criadora mesmo que outros amigos entrem
 * primeiro. Ver lib/participantes.ts / definirCriadorSeVazio.
 * Também já põe o desafio na lista local da Home (ainda sem emoji).
 */
export function MarcarCriadorDoDesafio({ codigo, nome }: { codigo: string; nome: string }) {
  useEffect(() => {
    try {
      localStorage.setItem(chaveCriadorLocalStorage(codigo), "1");
    } catch {
      // localStorage indisponível (modo privado etc.), sem drama.
    }
    registrarDesafioLocal({ codigo, nome, emoji: null });
  }, [codigo, nome]);

  return null;
}
