import dados from "@/data/artigos.json";

/** Artigo do blog importado da OAWEB; `corpo` já vem saneado (só tags de texto permitidas). */
export type Artigo = { id: string; slug: string; titulo: string; resumo: string; corpo: string };

export const artigos = dados as Artigo[];

export const urlArtigo = (a: Pick<Artigo, "id" | "slug">) => `/artigo/${a.id}/${a.slug}`;

export const buscarArtigo = (id: string) => artigos.find((a) => a.id === id);

export const recentes = (n = 3, exceto?: string) => artigos.filter((a) => a.id !== exceto).slice(0, n);
