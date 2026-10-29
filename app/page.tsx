import Link from "next/link";
import Busca from "@/components/Busca";
import Card from "@/components/Card";
import ArtigoCard from "@/components/ArtigoCard";
import Depoimentos from "@/components/Depoimentos";
import Trilho from "@/components/Trilho";
import { Seta, Whats } from "@/components/Icones";
import depoimentos from "@/data/depoimentos.json";
import { recentes } from "@/lib/artigos";
import { STATUS, destaques, foto, imoveis, linkWhats, porStatus, type Status } from "@/lib/imoveis";


// Países de clientes, na ordem da faixa da marca (Grafismos/Bandeiras)
const BANDEIRAS: [string, string][] = [
  ["br", "Brasil"], ["ar", "Argentina"], ["ca", "Canadá"], ["py", "Paraguai"], ["us", "Estados Unidos"],
  ["gb-eng", "Inglaterra"], ["cl", "Chile"], ["ie", "Irlanda"], ["gb-sct", "Escócia"], ["it", "Itália"],
  ["pt", "Portugal"], ["de", "Alemanha"], ["es", "Espanha"], ["be", "Bélgica"], ["gr", "Grécia"],
];

const PILARES = [
  { t: "Curadoria, não catálogo", p: "Mostramos os imóveis certos para o seu objetivo, não os mais divulgados." },
  { t: "Atendimento onde você estiver", p: "Visitas por vídeo, documentos digitais e corretor em português, inglês ou espanhol." },
  { t: "Segurança jurídica", p: "Análise de construtora, contrato e documentação antes de qualquer assinatura." },
  { t: "Do contrato às chaves", p: "Acompanhamos a obra, a entrega e, se quiser, a locação do seu imóvel." },
];

export default function Home() {
  const cidades = [...new Set(imoveis.map((i) => i.cidade).filter(Boolean))].sort() as string[];
  const capas: Record<Status, string> = {
    "pre-lancamento": destaques("pre-lancamento", 1)[0]?.fotosOrigem[0],
    lancamento: destaques("lancamento", 1)[0]?.fotosOrigem[0],
    pronto: destaques("pronto", 1)[0]?.fotosOrigem[0],
    aluguel: destaques("aluguel", 1)[0]?.fotosOrigem[0],
  };

  return (
    <>
      <section className="hero">
        <div className="hero-img"><img
          src="/hero-1920.webp"
          srcSet="/hero-1080.webp 1080w, /hero-1920.webp 1920w, /hero-3200.webp 3200w"
          // a foto cobre a tela inteira: em telas em pé, a largura exibida segue a altura
          sizes="(max-aspect-ratio: 3/2) 150vh, 100vw"
          alt="Vista aérea de Itapema, Santa Catarina"
          fetchPriority="high"
        /></div>
        <div className="hero-legenda sobe d4"><strong>Meia Praia</strong>Itapema · SC</div>
        <div className="wrap hero-in">
          <span className="eyebrow sobe">Yankees Negócios Imobiliários</span>
          <h1 className="display sobe d1">De Itapema <b>para o mundo.</b></h1>
          <div className="hero-rodape sobe d2">
            <p>Há 13 anos conectamos clientes do Brasil e de mais de 15 países aos melhores endereços do litoral catarinense.</p>
          </div>
          <ul className="bandeiras sobe d2" aria-label="Países de clientes Yankees">
            {BANDEIRAS.map(([cod, nome]) => (
              <li key={cod}><img src={`/brand/bandeiras/${cod}.svg`} alt={nome} title={nome} /></li>
            ))}
          </ul>
          <div className="hero-busca sobe d3"><Busca cidades={cidades} /></div>
        </div>
      </section>

      <section className="secao" id="lancamentos">
        <div className="wrap">
          <div className="secao-cab rv">
            <div>
              <span className="eyebrow">Na planta · entrega futura</span>
              <h2 className="h2">Lançamentos <b>em destaque</b></h2>
            </div>
            <Link className="link-seta" href={STATUS.lancamento.rota}><span>Ver todos os {porStatus("lancamento").length}</span><Seta /></Link>
          </div>
          <div className="rv">
            <Trilho>{destaques("lancamento", 8).map((i) => <Card key={i.id} i={i} />)}</Trilho>
          </div>
        </div>
      </section>

      <section className="wrap" id="momentos" aria-label="Escolha o momento do seu imóvel">
        <div className="categorias rv">
        {(Object.keys(STATUS) as Status[]).map((s) => (
          <Link key={s} href={STATUS[s].rota} className="categoria">
            {capas[s] && <img src={foto(capas[s], 1000)} alt="" loading="lazy" />}
            <div>
              <small>{porStatus(s).length} imóveis</small>
              <h3>{STATUS[s].plural.split(" ")[0]} <b>{STATUS[s].plural.split(" ").slice(1).join(" ")}</b></h3>
            </div>
          </Link>
        ))}
        </div>
      </section>

      <section className="secao manifesto" id="manifesto">
        <div className="wrap">
        <div className="manifesto-caixa">
        <img className="manifesto-mapa" src="/brand/mapa-pontilhado-azul.svg" alt="" />
        <div className="manifesto-grid">
          <div className="rv">
            <span className="eyebrow">A imobiliária que resolve</span>
            <h2 className="h2" style={{ marginTop: 12 }}>Realizando sonhos, <b>ultrapassando fronteiras.</b></h2>
            <p className="lead">Quem compra no litoral catarinense nem sempre mora aqui. Por isso a Yankees cuida de tudo à distância: escolha, negociação, documentação e entrega, com a mesma atenção de quem está na sala ao lado.</p>
          </div>
          <div className="numeros rv">
            <div><strong className="num">13</strong><span>anos de mercado</span></div>
            <div><strong className="num">15+</strong><span>países atendidos</span></div>
            <div><strong className="num">{imoveis.length}</strong><span>imóveis na curadoria</span></div>
            <div><strong className="num">3</strong><span>cidades no litoral</span></div>
          </div>
        </div>
        </div>
        </div>
      </section>

      <section className="secao" id="pre">
        <div className="wrap">
          <div className="secao-cab rv">
            <div>
              <span className="eyebrow">Condição de lançamento</span>
              <h2 className="h2">Pré-lançamentos: <b>entre primeiro.</b></h2>
            </div>
            <p>{STATUS["pre-lancamento"].frase} Tabela e unidades limitadas.</p>
          </div>
          <div className="grade rv">
            {destaques("pre-lancamento", 6).map((i) => <Card key={i.id} i={i} />)}
          </div>
        </div>
      </section>

      <section className="secao secao-papel" id="como">
        <div className="wrap">
          <div className="secao-cab rv">
            <div>
              <span className="eyebrow">Como trabalhamos</span>
              <h2 className="h2">Comprar à distância, <b>com segurança.</b></h2>
            </div>
          </div>
          <div className="pilares rv">
            {PILARES.map((p, n) => (
              <div key={p.t}><em>0{n + 1}</em><h3>{p.t}</h3><p>{p.p}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="secao" id="prontos">
        <div className="wrap">
          <div className="secao-cab rv">
            <div>
              <span className="eyebrow">Chaves na mão</span>
              <h2 className="h2">Prontos <b>para morar</b></h2>
            </div>
            <Link className="link-seta" href={STATUS.pronto.rota}><span>Ver todos os {porStatus("pronto").length}</span><Seta /></Link>
          </div>
          <div className="rv">
            <Trilho>{destaques("pronto", 8).map((i) => <Card key={i.id} i={i} />)}</Trilho>
          </div>
        </div>
      </section>

      <section className="secao secao-papel" id="depoimentos">
        <div className="wrap">
          <div className="secao-cab rv">
            <div>
              <span className="eyebrow">Avaliações no Google</span>
              <h2 className="h2">Do Brasil a Boston, <b>quem comprou indica.</b></h2>
            </div>
          </div>
          <div className="rv"><Depoimentos lista={depoimentos} /></div>
        </div>
      </section>

      <section className="secao" id="blog">
        <div className="wrap">
          <div className="secao-cab rv">
            <div>
              <span className="eyebrow">Blog Yankees</span>
              <h2 className="h2">Mercado imobiliário <b>de Itapema e região</b></h2>
            </div>
            <Link className="link-seta" href="/blog"><span>Todos os artigos</span><Seta /></Link>
          </div>
          <div className="grade-artigos rv">{recentes(3).map((a) => <ArtigoCard key={a.id} a={a} />)}</div>
        </div>
      </section>

      <section className="cta" id="fale">
        <img src="/cta.webp" srcSet="/cta-1200.webp 1200w, /cta.webp 2400w" sizes="(max-width: 1280px) 100vw, 1200px" alt="" loading="lazy" />
        <div className="wrap cta-in rv">
          <span className="eyebrow">Atendimento personalizado</span>
          <h2 className="display">Conte o que você procura. <b>A gente encontra.</b></h2>
          <div className="cta-acoes">
            <a className="btn btn-whats" href={linkWhats("Olá! Gostaria de ajuda para encontrar um imóvel no litoral.")} target="_blank" rel="noopener"><Whats /> Falar no WhatsApp</a>
            <Link className="btn btn-linha-claro" href="/contato">Outros contatos <Seta /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
