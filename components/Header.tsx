"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Seta } from "./Icones";
import { linkWhats } from "@/lib/base";

const LINKS = [
  { href: "/imoveis-pre-lancamento", nome: "Pré-lançamentos" },
  { href: "/imoveis-lancamento", nome: "Lançamentos" },
  { href: "/imoveis-venda", nome: "Prontos" },
  { href: "/imoveis-aluguel-anual", nome: "Aluguel" },
  { href: "/quemsomos", nome: "A Yankees" },
  { href: "/blog", nome: "Blog" },
  { href: "/contato", nome: "Contato" },
];

const MSG = "Olá! Vim pelo site da Yankees e gostaria de atendimento.";

// Páginas com foto grande no topo deixam o cabeçalho transparente até rolar.
const TOPO_COM_FOTO = (p: string) => p === "/" || p.startsWith("/imovel/");

export default function Header() {
  const pathname = usePathname();
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 40);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);
  useEffect(() => setAberto(false), [pathname]);

  const classe = ["header", rolou && "solido", !TOPO_COM_FOTO(pathname) && "claro", aberto && "aberto"].filter(Boolean).join(" ");

  return (
    <header className={classe}>
      <div className="wrap header-in">
        <Link href="/" className="logo" aria-label="Yankees Negócios Imobiliários, início">
          <img className="l-branca" src="/brand/logo-branca-sem-fundo.svg" alt="" />
          <img className="l-azul" src="/brand/logo-azul-sem-fundo.svg" alt="" />
        </Link>
        <nav className="nav" aria-label="Principal">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined}>{l.nome}</Link>
          ))}
        </nav>
        <div className="header-acoes">
          <a className="btn btn-azul" href={linkWhats(MSG)} target="_blank" rel="noopener">
            Falar com corretor <Seta />
          </a>
          <button className="menu-btn" aria-label="Menu" aria-expanded={aberto} onClick={() => setAberto(!aberto)}>
            <span /><span />
          </button>
        </div>
      </div>
      <div className="gaveta">
        {LINKS.map((l) => <Link key={l.href} href={l.href}>{l.nome}</Link>)}
        <a className="btn btn-branco" href={linkWhats(MSG)} target="_blank" rel="noopener">Falar com corretor</a>
      </div>
    </header>
  );
}
