import Link from "next/link";
import { Seta } from "./Icones";
import { type Artigo, dataArtigo, urlArtigo } from "@/lib/artigos";

export default function ArtigoCard({ a }: { a: Artigo }) {
  const meta = [a.categoria, dataArtigo(a.data)].filter(Boolean).join(" · ");
  return (
    <Link href={urlArtigo(a)} className="artigo-card">
      {meta && <span className="artigo-meta">{meta}</span>}
      <h3>{a.titulo}</h3>
      <p>{a.resumo}</p>
      <span className="link-texto">Ler artigo <Seta /></span>
    </Link>
  );
}
