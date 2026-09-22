"use client";

import { useEffect } from "react";
import { chaveCriadorLocalStorage } from "@/lib/identidade-local";

/**
 * Sem UI. Só marca no localStorage deste navegador "eu criei esse
 * desafio" — assim, quando essa pessoa reivindicar identidade em
 * /d/[codigo], ela vira a criadora mesmo que outros amigos entrem
 * primeiro. Ver lib/participantes.ts / definirCriadorSeVazio.
 */
export function MarcarCriadorDoDesafio({ codigo }: { codigo: string }) {
  useEffect(() => {
    try {
      localStorage.setItem(chaveCriadorLocalStorage(codigo), "1");
    } catch {
      // localStorage indisponível (modo privado etc.) — sem drama.
    }
  }, [codigo]);

  return null;
}
