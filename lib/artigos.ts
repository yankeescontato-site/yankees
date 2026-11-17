import dados from "@/data/artigos.json";

/** Artigo do blog escrito no Lapel; `corpo` já vem saneado (só tags de texto permitidas). */
export type Artigo = {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  corpo: string;
  subtitulo?: string | null;
  categoria?: string | null;
  /** aaaa-mm-dd */
  data?: string | null;
};

export const artigos = dados as Artigo[];

export const urlArtigo = (a: Pick<Artigo, "id" | "slug">) => `/artigo/${a.id}/${a.slug}`;

export const buscarArtigo = (id: string) => artigos.find((a) => a.id === id);

export const recentes = (n = 3, exceto?: string) => artigos.filter((a) => a.id !== exceto).slice(0, n);

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
/** "2026-10-21" -> "21 out 2026" */
export function dataArtigo(d?: string | null) {
  const m = d?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${Number(m[3])} ${MESES[Number(m[2]) - 1]} ${m[1]}` : null;
}
