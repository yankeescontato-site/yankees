import Link from "next/link";
import { CELULAR, ENDERECO, TELEFONE, WHATSAPP } from "@/lib/imoveis";

// Rodapé da marca: skyline com monumentos do mundo (arte do site antigo) sobre a faixa azul.
export default function Footer() {
  return (
    <footer className="rodape">
      <img className="rodape-skyline" src="/brand/rodape-skyline.webp" alt="" loading="lazy" />
      <div className="rodape-faixa">
        <div className="wrap rodape-in">
          <div className="rodape-marca">
            <span className="rodape-creci">CRECI 4977-J</span>
            <img src="/brand/logo-branca-sem-fundo.svg" alt="Yankees Negócios Imobiliários" />
          </div>
          <p className="rodape-slogan">Realizando sonhos, ultrapassando fronteiras</p>
          <ul className="rodape-contato">
            <li><a href="tel:+554734300636">{TELEFONE}</a></li>
            <li><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener">{CELULAR} · WhatsApp</a></li>
            <li>Endereço: {ENDERECO}</li>
          </ul>
        </div>
        <nav className="wrap rodape-links" aria-label="Rodapé">
          <Link href="/imoveis-pre-lancamento">Pré-lançamentos</Link>
          <Link href="/imoveis-lancamento">Lançamentos</Link>
          <Link href="/imoveis-venda">Prontos</Link>
          <Link href="/imoveis-aluguel-anual">Aluguel</Link>
          <Link href="/imoveis-itapema-sc">Itapema</Link>
          <Link href="/imoveis-porto-belo-sc">Porto Belo</Link>
          <Link href="/imoveis-balneario-camboriu-sc">Balneário Camboriú</Link>
          <a href="https://www.instagram.com/yankeesitapema/" target="_blank" rel="noopener">Instagram</a>
        </nav>
        <div className="wrap rodape-base">
          <span>© {new Date().getFullYear()} Yankees Negócios Imobiliários · CRECI 4977-J</span>
          <span>Seg a sáb, 9h às 18h</span>
        </div>
      </div>
    </footer>
  );
}
