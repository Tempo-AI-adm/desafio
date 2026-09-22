import type { Metadata } from "next";
import { JetBrains_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "desafio",
  description: "Desafios de constância com os amigos. Sem ranking, sem foto, sem enrolação.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${jetbrainsMono.variable} ${pressStart2P.variable}`}>
      <body className="min-h-full bg-cream font-mono text-ink antialiased">{children}</body>
    </html>
  );
}
