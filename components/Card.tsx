import Link from "next/link";
import CardFotos from "./CardFotos";
import { type Imovel, type Resumo, FOTOS_NO_CARD, STATUS, preco, tituloBonito, urlImovel } from "@/lib/base";

export default function Card({ i, prioridade = false }: { i: Imovel | Resumo; prioridade?: boolean }) {
  return (
    <Link href={urlImovel(i)} className="card">
      <div className="card-foto">
        <CardFotos fotos={i.fotosOrigem.slice(0, FOTOS_NO_CARD)} alt={tituloBonito(i.titulo)} prioridade={prioridade} />
        <span className="card-tag">{STATUS[i.status].nome}</span>
        {i.referencia && <span className="card-ref">{i.referencia}</span>}
      </div>
      <div className="card-info">
        <h3>{tituloBonito(i.titulo)}</h3>
        <span className="card-local">{[i.bairro, i.cidade].filter(Boolean).join(" · ")}</span>
        <span className="card-preco num">{preco(i)}</span>
        <div className="specs num">
          {i.areaPrivativa ? <span><b>{i.areaPrivativa.toLocaleString("pt-BR")}</b> m²</span> : null}
          {i.suites ? <span><b>{i.suites}</b> {i.suites > 1 ? "suítes" : "suíte"}</span> : i.dormitorios ? <span><b>{i.dormitorios}</b> dorm.</span> : null}
          {i.vagas ? <span><b>{i.vagas}</b> {i.vagas > 1 ? "vagas" : "vaga"}</span> : null}
        </div>
      </div>
    </Link>
  );
}
