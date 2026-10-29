import type { Metadata } from "next";
import ArtigoCard from "@/components/ArtigoCard";
import { artigos } from "@/lib/artigos";

export const metadata: Metadata = {
  title: "Blog",
  description: "Mercado imobiliário de Itapema, Porto Belo e Balneário Camboriú: valorização, lançamentos e dicas para comprar e investir no litoral catarinense.",
  alternates: { canonical: "/blog" },
};

export default function Blog() {
  return (
    <>
      <section className="topo-pagina">
        <div className="wrap">
          <span className="eyebrow sobe">Blog Yankees</span>
          <h1 className="display sobe d1">Mercado <b>imobiliário</b></h1>
          <p className="lead sobe d2">Valorização, lançamentos e o que acontece em Itapema e região, para quem quer comprar ou investir no litoral.</p>
        </div>
      </section>
      <section className="secao" style={{ paddingTop: 48 }}>
        <div className="wrap grade-artigos">
          {artigos.map((a) => <ArtigoCard key={a.id} a={a} />)}
        </div>
      </section>
    </>
  );
}
