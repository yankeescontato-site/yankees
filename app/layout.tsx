import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Revelar from "@/components/Revelar";
import { Whats } from "@/components/Icones";
import { linkWhats } from "@/lib/imoveis";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.yankeesitapema.com.br"),
  title: { default: "Yankees Negócios Imobiliários · Imóveis em Itapema, Porto Belo e BC", template: "%s · Yankees Itapema" },
  description:
    "Curadoria de apartamentos de alto padrão, lançamentos e pré-lançamentos em Itapema, Porto Belo e Balneário Camboriú. Há 13 anos atendendo clientes do Brasil e de mais de 15 países.",
  icons: { icon: "/brand/coroa-azul.svg" },
  openGraph: { type: "website", locale: "pt_BR", siteName: "Yankees Itapema" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <a className="whats-flutuante" href={linkWhats("Olá! Vim pelo site da Yankees.")} target="_blank" rel="noopener" aria-label="Conversar no WhatsApp">
          <Whats />
        </a>
        <Revelar />
      </body>
    </html>
  );
}
