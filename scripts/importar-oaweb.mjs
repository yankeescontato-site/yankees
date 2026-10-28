// Importa os imóveis publicados no site da OAWEB para data/imoveis.json.
// A Yankees continua cadastrando no painel da OAWEB; este script roda sozinho (ver .github/workflows)
// e o site novo é publicado de novo quando algo muda. Uso: node scripts/importar-oaweb.mjs
// OAWEB_URL: endereço onde o site da OAWEB continua no ar (muda quando o domínio for para o site novo).
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE = (process.env.OAWEB_URL || "https://www.yankeesitapema.com.br").replace(/\/$/, "");
// As fotos também ficam no servidor da própria OAWEB, independente do domínio da Yankees.
const FOTOS = "https://www.buscaimoveisbrasil.com.br/websites";
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARQUIVO = path.join(RAIZ, "data", "imoveis.json");
// Trava de segurança: se vier muito menos que a última importação, algo deu errado na OAWEB.
const MINIMO_RELATIVO = 0.6;

const CATEGORIAS = {
  "imoveis-pre-lancamento": "pre-lancamento",
  "imoveis-lancamento": "lancamento",
  "imoveis-venda": "venda",
  "imoveis-aluguel-anual": "aluguel",
};

async function baixarHtml(url) {
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return new TextDecoder("latin1").decode(await r.arrayBuffer());
}

const limpar = (s) =>
  s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim();

const numero = (s) => (s == null ? null : Number(String(s).replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "")) || null);

// 1. Descobre os imóveis de cada categoria (só pelos cards da listagem, não pela barra lateral)
async function mapearCategorias() {
  const mapa = new Map();
  for (const [rota, cat] of Object.entries(CATEGORIAS)) {
    for (let p = 1; p <= 20; p++) {
      const html = await baixarHtml(p === 1 ? `${BASE}/${rota}` : `${BASE}/${rota}/pagina-${p}`);
      const ids = [...html.matchAll(/property-box-6"\s+onclick="window\.location = '[^']*\/imovel\/(\d+)\/([a-z0-9-]*)'/g)];
      if (!ids.length) break;
      for (const [, id, slug] of ids) {
        const item = mapa.get(id) ?? { id, slug, categorias: new Set() };
        item.categorias.add(cat);
        mapa.set(id, item);
      }
      if (!html.includes(`pagina-${p + 1}`)) break;
    }
  }
  return mapa;
}

// 2. Lê a página de cada imóvel
function lerImovel(html, base) {
  const pega = (re) => html.match(re)?.[1];
  const ld = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
    .map((m) => { try { return JSON.parse(m[1]); } catch { return null; } })
    .find((j) => j?.["@type"] === "RealEstateListing");

  const local = limpar(pega(/flaticon-pin"><\/i>([^<]*)</) ?? "").split(" - ").map((s) => s.trim());
  const precoTxt = limpar(pega(/heading-properties-3[\s\S]*?<h4><span>([\s\S]*?)<\/span>/) ?? "");

  const descBloco = pega(/properties-description[^>]*>[\s\S]*?<\/h3>([\s\S]*?)<\/div>/) ?? "";
  const [descricao, ...resto] = descBloco.split(/<h4>/);
  const observacao = limpar(resto.join("").replace(/^[\s\S]*?<\/h4>/, ""));

  const blocos = {};
  for (const m of html.matchAll(/properties-amenities[^>]*>\s*<h3 class="heading-2">\s*([^<]*?)\s*<\/h3>([\s\S]*?)<\/ul>/g)) {
    blocos[m[1].replace(/:$/, "").trim()] = [...m[2].matchAll(/amenities-item">\s*<i[^>]*><\/i>\s*([^<]*?)\s*(?:<span>\[([^\]]*)\]<\/span>)?\s*<\/li>/g)]
      .map(([, nome, valor]) => ({ nome: nome.replace(/\s*\*?:\s*$/, "").replace(/^\+\s*/, "").trim(), valor: valor ?? null }));
  }
  const detalhes = blocos["Detalhes do imóvel"] ?? [];
  const det = (re) => detalhes.find((d) => re.test(d.nome))?.valor ?? null;

  const fotos = [...new Set([...html.matchAll(/slider-nav[\s\S]*?<\/div>\s*<\/div>/g)].flatMap((m) =>
    [...m[0].matchAll(/\/corte\/yankeesitapema\/(\d+)\/\d+\/\d+\/\d+\/([\w.]+)/g)].map(([, pasta, arq]) => `/miniatura/yankeesitapema/1/${pasta}/1600/1600/90/${arq}`)
  ))];
  if (!fotos.length) fotos.push(...new Set([...html.matchAll(/\/miniatura\/yankeesitapema\/1\/\d+\/1600\/1600\/90\/[\w.]+/g)].map((m) => m[0])));

  return {
    ...base,
    titulo: limpar(pega(/<h1>([\s\S]*?)<\/h1>/) ?? ""),
    referencia: pega(/Refer[^:]*:\s*([A-Z0-9-]+)/),
    bairro: local[0] ?? null,
    cidade: local[1] ?? null,
    uf: local[2] ?? "SC",
    preco: ld?.offers?.price ? ld.offers.price / 100 : numero(precoTxt),
    precoTexto: precoTxt || null,
    descricao: limpar(descricao),
    observacao: observacao || null,
    suites: numero(det(/Su[ií]tes/i)),
    dormitorios: numero(det(/Dormit/i)),
    banheiros: numero(det(/Banheiro/i)),
    vagas: numero(det(/garage/i)),
    areaPrivativa: numero(det(/Privativa|[ÁA]rea [ÚU]til/i)),
    detalhes,
    lazer: (blocos["Condomínio e Área de Lazer"] ?? []).map((d) => (d.valor ? `${d.nome}: ${d.valor}` : d.nome)),
    outros: Object.fromEntries(Object.entries(blocos).filter(([k]) => !/Detalhes do im|Condom/.test(k))),
    lat: ld?.mainEntity?.geo?.latitude ?? null,
    lng: ld?.mainEntity?.geo?.longitude ?? null,
    cep: ld?.mainEntity?.address?.postalCode ?? null,
    fotosOrigem: fotos.map((f) => FOTOS + f),
  };
}

async function emLotes(itens, n, fn) {
  const saida = [];
  for (let i = 0; i < itens.length; i += n) saida.push(...(await Promise.all(itens.slice(i, i + n).map(fn))));
  return saida;
}

const anteriores = JSON.parse(await fs.readFile(ARQUIVO, "utf8").catch(() => "[]"));
const mapa = await mapearCategorias();
console.log(`${mapa.size} imóveis encontrados em ${BASE}`);

let falhas = 0;
const imoveis = (await emLotes([...mapa.values()], 6, async (item) => {
  try {
    const html = await baixarHtml(`${BASE}/imovel/${item.id}/${item.slug}`);
    const cats = item.categorias;
    const status = cats.has("aluguel") ? "aluguel" : cats.has("pre-lancamento") ? "pre-lancamento" : cats.has("lancamento") ? "lancamento" : "pronto";
    return lerImovel(html, { id: item.id, slug: item.slug, status, categoriasOrigem: [...cats] });
  } catch (e) {
    falhas++;
    console.warn(`✗ ${item.id} ${item.slug}: ${e.message}`);
    return null;
  }
})).filter(Boolean);

if (falhas > 0 || imoveis.length < anteriores.length * MINIMO_RELATIVO) {
  console.error(`Importação abortada: ${imoveis.length} imóveis lidos, ${falhas} falhas (antes eram ${anteriores.length}). Nada foi alterado.`);
  process.exit(1);
}

const porId = new Map(anteriores.map((i) => [i.id, i]));
const novos = imoveis.filter((i) => !porId.has(i.id));
const removidos = anteriores.filter((i) => !mapa.has(i.id));
const alterados = imoveis.filter((i) => porId.has(i.id) && JSON.stringify(porId.get(i.id)) !== JSON.stringify(i));
for (const i of novos) console.log(`+ novo: ${i.referencia} ${i.titulo}`);
for (const i of removidos) console.log(`- saiu: ${i.referencia} ${i.titulo}`);
for (const i of alterados) console.log(`~ alterado: ${i.referencia} ${i.titulo}`);

await fs.mkdir(path.dirname(ARQUIVO), { recursive: true });
await fs.writeFile(ARQUIVO, JSON.stringify(imoveis, null, 2) + "\n");
console.log(`data/imoveis.json: ${imoveis.length} imóveis (${novos.length} novos, ${removidos.length} saíram, ${alterados.length} alterados)`);
