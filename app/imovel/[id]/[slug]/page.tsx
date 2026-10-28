import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import Card from "@/components/Card";
import Galeria, { BotaoGaleria } from "@/components/Galeria";
import { Seta, Whats } from "@/components/Icones";
import { STATUS, buscarImovel, foto, imoveis, linkWhats, preco, similares, tituloBonito, urlImovel } from "@/lib/imoveis";

type Props = { params: Promise<{ id: string; slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return imoveis.map((i) => ({ id: i.id, slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const i = buscarImovel((await params).id);
  if (!i) return {};
  const titulo = `${tituloBonito(i.titulo)}, ${i.bairro}, ${i.cidade}`;
  return {
    title: titulo,
    description: i.descricao.slice(0, 160),
    alternates: { canonical: urlImovel(i) },
    openGraph: { title: titulo, images: [foto(i.fotosOrigem[0], 1200)] },
  };
}

export default async function PaginaImovel({ params }: Props) {
  const { id, slug } = await params;
  const i = buscarImovel(id);
  if (!i) notFound();
  if (i.slug !== slug) permanentRedirect(urlImovel(i));

  const nome = tituloBonito(i.titulo);
  const st = STATUS[i.status];
  const msg = `Olá! Tenho interesse no ${nome}${i.referencia ? ` (ref. ${i.referencia})` : ""}. Pode me passar mais informações?`;
  const paragrafos = i.descricao.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const fatos = [
    i.areaPrivativa && { v: i.areaPrivativa.toLocaleString("pt-BR"), r: "m² privativos" },
    i.suites && { v: i.suites, r: i.suites > 1 ? "suítes" : "suíte" },
    i.dormitorios && { v: i.dormitorios, r: "dormitórios" },
    i.banheiros && { v: i.banheiros, r: "banheiros" },
    i.vagas && { v: i.vagas, r: i.vagas > 1 ? "vagas" : "vaga" },
  ].filter(Boolean) as { v: string | number; r: string }[];

  const ld = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: nome,
    url: `https://www.yankeesitapema.com.br${urlImovel(i)}`,
    image: i.fotosOrigem.slice(0, 5),
    description: i.descricao.slice(0, 500),
    ...(i.preco && { offers: { "@type": "Offer", price: i.preco, priceCurrency: "BRL" } }),
    ...(i.lat && { contentLocation: { "@type": "Place", geo: { "@type": "GeoCoordinates", latitude: i.lat, longitude: i.lng } } }),
  };

  return (
    <div className="com-barra">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="im-hero">
        <img src={foto(i.fotosOrigem[0])} alt={nome} fetchPriority="high" />
        <div className="wrap im-hero-in">
          <Link href={st.rota} className="eyebrow sobe">{st.nome}</Link>
          <h1 className="sobe d1">{nome}</h1>
          <p className="local sobe d2">{[i.bairro, i.cidade, i.uf].filter(Boolean).join(" · ")}</p>
        </div>
        <BotaoGaleria total={i.fotosOrigem.length} />
      </section>

      <div className="wrap im-corpo">
        <div>
          {fatos.length > 0 && (
            <div className="im-fatos num">
              {fatos.map((f) => <div key={f.r}><strong>{f.v}</strong><span>{f.r}</span></div>)}
            </div>
          )}

          <section className="im-bloco im-desc">
            <h2>Sobre o imóvel</h2>
            {paragrafos.map((p, n) => <p key={n}>{p}</p>)}
          </section>

          <section className="im-bloco">
            <h2>Fotos</h2>
            <Galeria fotos={i.fotosOrigem} titulo={nome} />
          </section>

          {i.lazer.length > 0 && (
            <section className="im-bloco">
              <h2>Lazer e condomínio</h2>
              <ul className="lazer">{i.lazer.map((l) => <li key={l}>{l}</li>)}</ul>
            </section>
          )}

          {i.lat && i.lng && (
            <section className="im-bloco">
              <h2>Localização</h2>
              <iframe className="mapa" loading="lazy" title={`Mapa de ${nome}`} src={`https://maps.google.com/maps?q=${i.lat},${i.lng}&hl=pt&z=15&output=embed`} />
            </section>
          )}
        </div>

        <aside className="im-lado">
          <span className="tag">{st.nome}</span>
          <p className="valor num">{preco(i)}</p>
          {i.observacao && <p className="obs">{i.observacao}</p>}
          <a className="btn btn-whats" href={linkWhats(msg)} target="_blank" rel="noopener"><Whats /> Quero saber mais</a>
          <a className="btn btn-linha" href={linkWhats(`Olá! Gostaria de agendar uma visita (presencial ou por vídeo) ao ${nome}.`)} target="_blank" rel="noopener">Agendar visita <Seta /></a>
          <hr />
          <div className="ref"><span>Referência</span><b>{i.referencia}</b></div>
        </aside>
      </div>

      {similares(i).length > 0 && (
        <section className="secao secao-papel">
          <div className="wrap">
            <div className="secao-cab rv">
              <div>
                <span className="eyebrow">Na mesma faixa</span>
                <h2 className="h2">Você também <b>pode gostar</b></h2>
              </div>
              <Link className="link-seta" href={st.rota}><span>Ver {st.plural.toLowerCase()}</span><Seta /></Link>
            </div>
            <div className="grade rv">{similares(i).map((s) => <Card key={s.id} i={s} />)}</div>
          </div>
        </section>
      )}

      <div className="barra-whats">
        <div><strong className="num">{preco(i)}</strong><small>{i.referencia}</small></div>
        <a className="btn btn-whats" href={linkWhats(msg)} target="_blank" rel="noopener"><Whats /> WhatsApp</a>
      </div>
    </div>
  );
}
