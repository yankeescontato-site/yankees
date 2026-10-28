// Tipos, textos e utilitários sem os dados: seguro para importar em componentes do navegador.
export type Status = "pre-lancamento" | "lancamento" | "pronto" | "aluguel";

export type Imovel = {
  id: string;
  slug: string;
  status: Status;
  titulo: string;
  referencia: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string;
  preco: number | null;
  observacao: string | null;
  descricao: string;
  suites: number | null;
  dormitorios: number | null;
  banheiros: number | null;
  vagas: number | null;
  areaPrivativa: number | null;
  lazer: string[];
  lat: number | null;
  lng: number | null;
  fotosOrigem: string[];
};

/** Versão leve para listagens no navegador (sem descrição e com só a capa). */
export type Resumo = Omit<Imovel, "descricao" | "lazer"> & { nFotos: number };

/** Quantas fotos dá para passar pelas setas do card, sem abrir o imóvel. */
export const FOTOS_NO_CARD = 8;

export const STATUS: Record<Status, { nome: string; plural: string; rota: string; frase: string }> = {
  "pre-lancamento": { nome: "Pré-lançamento", plural: "Pré-lançamentos", rota: "/imoveis-pre-lancamento", frase: "Entre antes de todo mundo, na melhor condição." },
  lancamento: { nome: "Lançamento", plural: "Lançamentos", rota: "/imoveis-lancamento", frase: "Na planta, com potencial de valorização até a entrega." },
  pronto: { nome: "Pronto", plural: "Prontos para morar", rota: "/imoveis-venda", frase: "Chaves na mão. Para morar ou alugar já." },
  aluguel: { nome: "Aluguel anual", plural: "Aluguel anual", rota: "/imoveis-aluguel-anual", frase: "Morar no litoral, sem precisar comprar agora." },
};

export const FAIXAS: [string, number, number][] = [
  ["Até R$ 600 mil", 0, 6e5],
  ["R$ 600 mil a 1 mi", 6e5, 1e6],
  ["R$ 1 a 2 mi", 1e6, 2e6],
  ["R$ 2 a 4 mi", 2e6, 4e6],
  ["R$ 4 a 8 mi", 4e6, 8e6],
  ["Acima de R$ 8 mi", 8e6, Infinity],
];

export const WHATSAPP = "5547997738377";
export const TELEFONE = "(47) 3430-0636";
export const CELULAR = "(47) 99773-8377";
export const EMAIL = "yankeescontato@gmail.com";
export const ENDERECO = "Rua 204, nº 35, sala 2001, Edf. Ciprianos, Meia Praia, Itapema/SC";

/** As fotos ficam na OAWEB por enquanto; o tamanho vem na própria URL. */
export function foto(url: string, tamanho = 1600) {
  return url.replace(/\/1600\/1600\//, `/${tamanho}/${tamanho}/`);
}

export function preco(i: Pick<Imovel, "preco" | "status">) {
  if (!i.preco) return "Sob consulta";
  const v = i.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  return i.status === "aluguel" ? `${v}/mês` : v;
}

export const urlImovel = (i: Pick<Imovel, "id" | "slug">) => `/imovel/${i.id}/${i.slug}`;

/** Títulos vindos do painel antigo às vezes estão em caixa alta. */
export function tituloBonito(t: string) {
  t = t.trim();
  if (t !== t.toUpperCase()) return t.charAt(0).toUpperCase() + t.slice(1);
  const menores = new Set(["de", "da", "do", "das", "dos", "e", "no", "na", "com", "em", "a", "o"]);
  return t
    .toLowerCase()
    .split(" ")
    .map((p, n) => (n > 0 && menores.has(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join(" ")
    .trim();
}

export const linkWhats = (texto: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
