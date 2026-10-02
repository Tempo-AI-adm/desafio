import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Só vale no `npm run dev`: libera testar pelo celular na rede local
  // (sem isso o Next bloqueia o acesso pelo IP e os botões não ligam).
  // Se o IP do PC mudar, atualizar aqui.
  allowedDevOrigins: ["192.168.0.119"],

  // Cabeçalhos de segurança básicos, em todas as páginas. Não mexem em
  // fontes nem imagens (são servidas pelo próprio app).
  // - nosniff: o navegador não "adivinha" o tipo de um arquivo.
  // - Referrer-Policy: links pra fora levam só o domínio, nunca o
  //   caminho da sala (/d/CODIGO).
  // - X-Frame-Options: ninguém embute o app num iframe de outro site.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
