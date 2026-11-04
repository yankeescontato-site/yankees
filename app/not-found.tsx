import type { Metadata } from "next";
import Link from "next/link";
import { Seta, Whats } from "@/components/Icones";
import Predio from "@/components/Predio";
import { STATUS, linkWhats } from "@/lib/base";

export const metadata: Metadata = {
  title: "Endereço não encontrado",
  description: "Esta página não existe no site da Yankees Negócios Imobiliários.",
  robots: { index: false, follow: true },
};

const ATALHOS = [
  { href: STATUS["pre-lancamento"].rota, nome: "Pré-lançamentos" },
  { href: STATUS.lancamento.rota, nome: "Lançamentos" },
  { href: STATUS.pronto.rota, nome: "Prontos para morar" },
  { href: "/blog", nome: "Blog" },
];

export default function NaoEncontrada() {
  return (
    <section className="aviso">
      <img className="aviso-mapa" src="/brand/mapa-pontilhado-azul.svg" alt="" aria-hidden="true" />
      <div className="wrap aviso-grid">
        <div className="aviso-texto">
          <span className="eyebrow sobe">Erro 404 · Endereço não encontrado</span>
          <p className="aviso-numero sobe d1" aria-hidden="true">
            <span>4</span><b>0</b><span>4</span>
          </p>
          <h1 className="aviso-titulo sobe d1">Ops! Este endereço <b>não existe.</b></h1>
          <p className="lead sobe d2">
            Parece que você chegou a um endereço que ainda não encontramos. Mas podemos ajudar você a encontrar o caminho certo.
          </p>
          <div className="aviso-acoes sobe d3">
            <Link className="btn btn-azul" href="/">Voltar para a página inicial <Seta /></Link>
            <Link className="btn btn-linha" href="/imoveis-itapema-sc">Explorar imóveis</Link>
          </div>
          <a
            className="aviso-ajuda sobe d3"
            href={linkWhats("Olá! Cheguei a uma página que não existe no site da Yankees e preciso de ajuda.")}
            target="_blank"
            rel="noopener"
          >
            <span className="aviso-ajuda-icone"><Whats /></span>
            Precisa de ajuda? <u>Fale com um corretor.</u>
          </a>
          <nav className="aviso-atalhos sobe d4" aria-label="Sugestões de páginas">
            <small>Talvez você procure</small>
            <div>
              {ATALHOS.map((a) => <Link key={a.href} href={a.href}>{a.nome}</Link>)}
            </div>
          </nav>
        </div>

        <div className="aviso-arte sobe d2">
          <div className="aviso-cena">
          <Predio modo="vazio" rotulo="Ilustração de um edifício em que o apartamento 404 está vazio" />
          <aside className="aviso-ficha" aria-label="Ficha do imóvel 404">
            <span className="aviso-ficha-ref">Ref. 404</span>
            <strong>Este endereço não está à venda.</strong>
            <dl>
              <div><dt>Status</dt><dd>Fora do mapa</dd></div>
              <div><dt>Área privativa</dt><dd className="num">0 m²</dd></div>
              <div><dt>Vista</dt><dd>Para o caminho certo</dd></div>
            </dl>
          </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
