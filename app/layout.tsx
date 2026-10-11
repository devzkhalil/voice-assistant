import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { portfolioData } from "@/data/portfolioData";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: `${portfolioData.profile.name} — ${portfolioData.profile.title}`,
  description: portfolioData.profile.shortBio,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
