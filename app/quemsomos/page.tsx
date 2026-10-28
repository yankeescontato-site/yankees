import type { Metadata } from "next";
import Link from "next/link";
import { Seta } from "@/components/Icones";

export const metadata: Metadata = {
  title: "A Yankees",
  description: "Yankees Negócios Imobiliários: 13 anos de curadoria imobiliária em Itapema, com clientes do Brasil e de mais de 15 países.",
};

export default function QuemSomos() {
  return (
    <>
      <section className="topo-pagina">
        <div className="wrap">
          <span className="eyebrow sobe">A Yankees</span>
          <h1 className="display sobe d1">A imobiliária <b>que resolve.</b></h1>
        </div>
      </section>
      <section className="secao">
        <div className="wrap texto-longo">
          <div className="rv">
            <div className="selo-caixa"><img src="/brand/selo-mundo.webp" alt="Selo Yankees: de Itapema para o mundo" /></div>
            <h2 className="titulo">Realizando sonhos, <b>ultrapassando fronteiras.</b></h2>
          </div>
          <div className="rv">
            <p>Há 13 anos em Meia Praia, a Yankees nasceu para atender quem quer um imóvel no litoral catarinense, esteja onde estiver. Hoje nossos clientes vêm de todo o Brasil e de mais de 15 países.</p>
            <p>Nosso trabalho é de curadoria: em vez de mostrar tudo o que existe, selecionamos os imóveis certos para cada objetivo, seja morar, passar temporadas ou investir.</p>
            <p>A coroa da nossa marca vem da Estátua da Liberdade: um lembrete de que o nosso cliente pode estar em qualquer lugar do mundo e, ainda assim, comprar com a mesma segurança de quem está aqui.</p>
            <p style={{ fontSize: 14, color: "var(--texto-2)", letterSpacing: ".1em" }}>CRECI 4977-J</p>
            <Link className="btn btn-azul" href="/contato" style={{ marginTop: 16 }}>Falar com a equipe <Seta /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
