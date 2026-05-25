import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { RepoForgeStateProvider } from "@/hooks/use-repo-forge-state";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "RepoForge — GitHub 项目聚合与整合平台",
  description: "Multi-repo aggregator, gap analyzer, and prompt engineering orchestrator for seamless product generation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="bg-zinc-950 text-zinc-100 font-sans">
        <RepoForgeStateProvider>{children}</RepoForgeStateProvider>
      </body>
    </html>
  );
}
