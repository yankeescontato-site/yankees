import dados from "@/data/imoveis.json";
import { FOTOS_NO_CARD, type Imovel, type Resumo, type Status } from "./base";

export * from "./base";

export const imoveis = (dados as unknown as Imovel[]).filter((i) => i.fotosOrigem.length);

export const resumo = ({ descricao, lazer, ...i }: Imovel): Resumo => ({ ...i, fotosOrigem: i.fotosOrigem.slice(0, FOTOS_NO_CARD), nFotos: i.fotosOrigem.length });

export const porStatus = (s: Status) => imoveis.filter((i) => i.status === s);

export function destaques(s: Status, n = 6) {
  return porStatus(s)
    .slice()
    .sort((a, b) => b.fotosOrigem.length * 1e7 + (b.preco ?? 0) - (a.fotosOrigem.length * 1e7 + (a.preco ?? 0)))
    .slice(0, n);
}

export const buscarImovel = (id: string) => imoveis.find((i) => i.id === id);

export function similares(i: Imovel, n = 3) {
  return imoveis
    .filter((o) => o.id !== i.id && o.status === i.status)
    .sort((a, b) => Math.abs((a.preco ?? 0) - (i.preco ?? 0)) - Math.abs((b.preco ?? 0) - (i.preco ?? 0)))
    .slice(0, n);
}

