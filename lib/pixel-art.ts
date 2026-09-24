// Ícones pixel art do app (foguinho, estrela de bônus): cada
// desenho é uma grade de caracteres ("." = vazio, qualquer outro = uma
// cor). Em volta ganha um contorno de 1 pixel cor de tinta, senão o
// âmbar some no fundo creme. Função pura, segura no servidor e no navegador.

export type Pixel = { x: number; y: number; tipo: string };

export function pixelsComContorno(desenho: string[]): {
  largura: number;
  altura: number;
  pixels: Pixel[];
} {
  const largura = desenho[0].length + 2;
  const altura = desenho.length + 2;
  // Grade com 1 pixel de folga em volta, pro contorno caber.
  const grade = Array.from({ length: altura }, (_, y) =>
    Array.from({ length: largura }, (_, x) => desenho[y - 1]?.[x - 1] ?? "."),
  );
  const cheio = (x: number, y: number) => grade[y]?.[x] !== undefined && grade[y][x] !== ".";
  const pixels = grade
    .flatMap((linha, y) =>
      linha.map((c, x) => {
        if (c !== ".") return { x, y, tipo: c };
        const vizinho = cheio(x - 1, y) || cheio(x + 1, y) || cheio(x, y - 1) || cheio(x, y + 1);
        return vizinho ? { x, y, tipo: "contorno" } : null;
      }),
    )
    .filter((p) => p !== null);
  return { largura, altura, pixels };
}
