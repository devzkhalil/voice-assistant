import type { Metadata } from "next";
import { Figtree, JetBrains_Mono } from "next/font/google";
import { Frame } from "@/components/layout/Frame";
import VoiceAssistant from "@/components/voice/VoiceAssistant";
import { portfolioData } from "@/data/portfolioData";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

const { profile } = portfolioData;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: `${profile.name} — ${profile.title}`, template: `%s — ${profile.name}` },
  description: profile.shortBio,
  authors: [{ name: "devzkhalil" }],
  keywords: ["laravel developer", "vuejs developer", "full stack developer", "tailwindcss", "bangladesh", "saas"],
  openGraph: {
    title: `Hello, I'm ${profile.name}`,
    description: profile.shortBio,
    images: [profile.ogImage],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: `Hello, I'm ${profile.name}`, description: profile.shortBio },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${figtree.variable} ${jetbrains.variable}`}>
      <body>
        <Frame>{children}</Frame>
        <VoiceAssistant />
      </body>
    </html>
  );
}
