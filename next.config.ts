import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Só vale no `npm run dev`: libera testar pelo celular na rede local
  // (sem isso o Next bloqueia o acesso pelo IP e os botões não ligam).
  // Se o IP do PC mudar, atualizar aqui.
  allowedDevOrigins: ["192.168.0.119"],
};

export default nextConfig;
