import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Listagem from "@/components/Listagem";
import { STATUS, imoveis, porStatus, resumo, type Imovel, type Status } from "@/lib/imoveis";

// Mesmas URLs do site antigo, para não perder posição no Google.
type Pagina = { titulo: string; destaque: string; eyebrow: string; frase: string; lista: () => Imovel[]; aluguel?: boolean };

const CIDADES: Record<string, string> = {
  "imoveis-itapema-sc": "Itapema",
  "imoveis-porto-belo-sc": "Porto Belo",
  "imoveis-balneario-camboriu-sc": "Camboriú",
};

function pagina(slug: string): Pagina | null {
  const status = (Object.keys(STATUS) as Status[]).find((s) => STATUS[s].rota === `/${slug}`);
  if (status) {
    const [a, ...b] = STATUS[status].plural.split(" ");
    return { titulo: a, destaque: b.join(" "), eyebrow: "Imóveis", frase: STATUS[status].frase, lista: () => porStatus(status), aluguel: status === "aluguel" };
  }
  const cidade = CIDADES[slug];
  if (cidade) {
    const nome = cidade === "Camboriú" ? "Balneário Camboriú" : cidade;
    return { titulo: "Imóveis em", destaque: nome, eyebrow: "Santa Catarina", frase: `Lançamentos, pré-lançamentos e prontos para morar em ${nome}.`, lista: () => imoveis.filter((i) => i.cidade === cidade && i.status !== "aluguel") };
  }
  return null;
}

export const dynamicParams = false;
export function generateStaticParams() {
  return [...Object.values(STATUS).map((s) => s.rota.slice(1)), ...Object.keys(CIDADES)].map((categoria) => ({ categoria }));
}

export async function generateMetadata({ params }: { params: Promise<{ categoria: string }> }): Promise<Metadata> {
  const p = pagina((await params).categoria);
  return p ? { title: `${p.titulo} ${p.destaque}`, description: p.frase } : {};
}

export default async function Categoria({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params;
  const p = pagina(categoria);
  if (!p) notFound();

  return (
    <>
      <section className="topo-pagina">
        <div className="wrap">
          <span className="eyebrow sobe">{p.eyebrow}</span>
          <h1 className="display sobe d1">{p.titulo} <b>{p.destaque}</b></h1>
          <p className="lead sobe d2">{p.frase}</p>
          <nav className="abas sobe d3" aria-label="Categorias">
            {Object.values(STATUS).map((s) => (
              <Link key={s.rota} href={s.rota} aria-current={s.rota === `/${categoria}` ? "page" : undefined}>{s.plural}</Link>
            ))}
          </nav>
        </div>
      </section>
      <Suspense>
        <Listagem lista={p.lista().map(resumo)} aluguel={p.aluguel} />
      </Suspense>
    </>
  );
}
