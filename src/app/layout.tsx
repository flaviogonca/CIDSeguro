import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CIDSeguro - Plataforma de Cibersegurança para Angola",
  description: "Plataforma inteligente de protecção, consciencialização e assistência em cibersegurança para Angola. Maior resiliência digital da sociedade angolana.",
  keywords: ["cibersegurança", "Angola", "protecção digital", "phishing", "segurança online", "CIDSeguro"],
  authors: [{ name: "CIDSeguro Team" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛡️</text></svg>",
  },
  openGraph: {
    title: "CIDSeguro - Cibersegurança para Angola",
    description: "Plataforma inteligente de protecção e consciencialização em cibersegurança",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#121212] text-white`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}