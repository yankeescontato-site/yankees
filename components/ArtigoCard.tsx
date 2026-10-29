import Link from "next/link";
import { Seta } from "./Icones";
import { type Artigo, urlArtigo } from "@/lib/artigos";

export default function ArtigoCard({ a }: { a: Artigo }) {
  return (
    <Link href={urlArtigo(a)} className="artigo-card">
      <h3>{a.titulo}</h3>
      <p>{a.resumo}</p>
      <span className="link-texto">Ler artigo <Seta /></span>
    </Link>
  );
}
