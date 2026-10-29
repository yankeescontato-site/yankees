import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import ArtigoCard from "@/components/ArtigoCard";
import { Seta, Whats } from "@/components/Icones";
import { artigos, buscarArtigo, recentes, urlArtigo } from "@/lib/artigos";
import { linkWhats } from "@/lib/imoveis";

type Props = { params: Promise<{ id: string; slug?: string[] }> };

// JSON dentro de <script>: escapa "<" para que um "</script>" vindo dos dados não feche o bloco.
const jsonSeguro = (v: unknown) => JSON.stringify(v).replace(/</g, "\\u003c");

// Mesmos endereços do site antigo: /artigo/560/titulo e também /artigo/560 (que redireciona).
export const dynamicParams = false;
export function generateStaticParams() {
  return artigos.flatMap((a) => [{ id: a.id, slug: [a.slug] }, { id: a.id, slug: [] }]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = buscarArtigo((await params).id);
  if (!a) return {};
  return { title: a.titulo, description: a.resumo, alternates: { canonical: urlArtigo(a) }, openGraph: { type: "article", title: a.titulo, description: a.resumo } };
}

export default async function PaginaArtigo({ params }: Props) {
  const { id, slug } = await params;
  const a = buscarArtigo(id);
  if (!a) notFound();
  if (slug?.[0] !== a.slug) permanentRedirect(urlArtigo(a));

  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.titulo,
    description: a.resumo,
    url: `https://www.yankeesitapema.com.br${urlArtigo(a)}`,
    publisher: { "@type": "RealEstateAgent", name: "Yankees Negócios Imobiliários" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonSeguro(ld) }} />
      <section className="topo-pagina topo-artigo">
        <div className="wrap">
          <Link href="/blog" className="eyebrow sobe">Blog Yankees</Link>
          <h1 className="display sobe d1">{a.titulo}</h1>
        </div>
      </section>
      <section className="secao" style={{ paddingTop: 40 }}>
        <div className="wrap artigo-grid">
          {/* corpo saneado no importador (scripts/importar-blog.mjs): só tags de texto e links */}
          <article className="artigo-corpo" dangerouslySetInnerHTML={{ __html: a.corpo }} />
          <aside className="im-lado artigo-lado">
            <span className="tag">Yankees Negócios Imobiliários</span>
            <p className="artigo-lado-titulo">Quer investir no litoral catarinense?</p>
            <p className="obs">Nossos corretores mostram as melhores oportunidades em Itapema e região, sem compromisso.</p>
            <a className="btn btn-whats" href={linkWhats(`Olá! Li o artigo "${a.titulo}" no site e quero saber mais.`)} target="_blank" rel="noopener"><Whats /> Falar com um corretor</a>
            <Link className="btn btn-linha" href="/imoveis-lancamento">Ver lançamentos <Seta /></Link>
          </aside>
        </div>
      </section>
      <section className="secao secao-papel">
        <div className="wrap">
          <div className="secao-cab">
            <div>
              <span className="eyebrow">Continue lendo</span>
              <h2 className="h2">Mais do <b>blog</b></h2>
            </div>
            <Link className="link-seta" href="/blog"><span>Todos os artigos</span><Seta /></Link>
          </div>
          <div className="grade-artigos">{recentes(3, a.id).map((r) => <ArtigoCard key={r.id} a={r} />)}</div>
        </div>
      </section>
    </>
  );
}
